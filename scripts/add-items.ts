#!/usr/bin/env tsx
/**
 * Add new items (characters, light cones, relic sets, planar sets) to the data set
 *
 * Usage: npm run add-items -- [--no-regen] ["Item One" "Item Two" ...]
 *
 * With no names, the items to update are discovered from the manifest's `hsr.new` list —
 * whatever the current data version changed. Otherwise the given names are used.
 *
 * For each item the script:
 *   1. resolves what kind of item it is + fetches its raw source data
 *   2. transforms that payload into the right JSON schema
 *   3. writes the entry into the matching src/data/json/*.json file
 *   4. downloads + resizes the icon into the matching assets subfolder
 *
 * Light cone superimposition stats and relic/planar set bonuses aren't in the source data,
 * so they're inferred from their descriptions (scripts/lib/inference.ts). By default every
 * named item is re-inferred; --no-regen leaves entries that already have stats untouched.
 *
 * The pieces live in scripts/lib/ so they can be imported and exercised on their own — this
 * file is only the CLI.
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs"
import { execSync } from "node:child_process"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

import { discoverNew, fetchItem, fetchLatestVersion, locateByName, type ItemRef } from "./lib/nanoka"
import { HANDLERS } from "./lib/transforms"
import type { TransformOptions } from "./lib/types"

// Local dev: load GOOGLE_AI_API_KEY (and any other secrets) from .env if present.
// In CI these are injected directly as env vars by the workflow, so no .env exists there.
try {
  process.loadEnvFile()
} catch {
  // no .env file — fine, env vars may already be set (e.g. in GitHub Actions)
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const JSON_DIR = join(root, "src", "data", "json")
const ICONS_DIR = join(root, "src", "assets", "icons")
const VERSION_FILE = join(root, "src", "data", "version.ts")

// Must match the sanitize() function in src/data/icons.ts
function sanitize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

// -------------------------------- side effects ------------------------------

function loadJson(jsonFile: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(JSON_DIR, jsonFile), "utf8")) as Record<string, unknown>
}

function writeEntry(jsonFile: string, data: Record<string, unknown>, name: string, entry: object): boolean {
  const existed = name in data
  // update preserves position, add places new entries at top
  const updated = existed ? { ...data, [name]: entry } : { [name]: entry, ...data }
  writeFileSync(join(JSON_DIR, jsonFile), JSON.stringify(updated, null, 2) + "\n")
  return existed
}

async function downloadIcon(url: string, name: string, subfolder: string, size: "sm" | "lg" = "sm"): Promise<void> {
  const outDir = join(ICONS_DIR, subfolder)
  const ICON_SIZE = size === "sm" ? 64 : 80
  if (!existsSync(outDir)) throw new Error(`Icon directory missing: ${outDir}`)
  const outFile = join(outDir, `${sanitize(name)}.webp`)

  const res = await fetch(url, { headers: { "User-Agent": "substat-calculator add-items script" } })
  if (!res.ok) throw new Error(`Icon download failed: HTTP ${res.status} ${res.statusText}`)
  const input = Buffer.from(await res.arrayBuffer())

  await sharp(input)
    .resize(ICON_SIZE, ICON_SIZE, { fit: "fill", kernel: "lanczos3" })
    .webp()
    .toFile(outFile)
}

// `npm run build` to verify the app compiles properly after an update
function typeCheck(): boolean {
  console.log("\nType-checking with `npm run build`...")
  try {
    execSync("npm run build", { cwd: root, stdio: "inherit" })
    return true
  } catch {
    return false
  }
}

function writeVersionFile(version: string): void {
  const contents =
    "// Latest data version, sourced from nanoka's manifest.\n" +
    "// Updated automatically by scripts/add-items.ts — do not edit by hand.\n" +
    `export const VERSION = "${version}"\n`
  writeFileSync(VERSION_FILE, contents)
}

// Expose a value to later GitHub Actions steps. Uses the heredoc form so multi-line
// values (e.g. the missing-icons list) work; no-op when not running in Actions.
function exportOutput(name: string, value: string): void {
  const out = process.env.GITHUB_OUTPUT
  if (!out) return
  const delim = `EOF_${Math.random().toString(36).slice(2)}`
  appendFileSync(out, `${name}<<${delim}\n${value}\n${delim}\n`)
}

// ----------------------------------- main -----------------------------------

interface ItemResult {
  /** False if no icon was saved (non-fatal — icon can be added later). */
  iconSaved: boolean
  /** Markdown describing inferred stats, for the PR body. */
  report?: string
}

async function processItem(ref: ItemRef, version: string, opts: TransformOptions): Promise<ItemResult> {
  const { kind, name } = ref
  const raw = await fetchItem(version, kind, ref.id)
  const handler = HANDLERS[kind]

  const data = loadJson(handler.jsonFile)
  const { entry, iconUrl, report } = await handler.transform(raw, data[name] as object | undefined, opts)
  const updated = writeEntry(handler.jsonFile, data, name, entry)
  console.log(`  [${kind}] ${updated ? "updated" : "added"} entry -> ${handler.jsonFile}`)

  if (iconUrl) {
    try {
      await downloadIcon(iconUrl, name, handler.iconSubfolder, kind === "lightcone" ? "lg" : "sm")
      console.log(`  [${kind}] saved icon  -> icons/${handler.iconSubfolder}/${sanitize(name)}.webp`)
      return { iconSaved: true, report }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`  [${kind}] icon download failed (add manually): ${message}`)
      return { iconSaved: false, report }
    }
  }
  console.warn(`  [${kind}] no iconUrl — add icon manually`)
  return { iconSaved: false, report }
}

async function main(): Promise<void> {
  // Accept both `-- "Name A" "Name B"` and a single semicolon-separated `-- "Name A; Name B"`
  // (the latter is how the GitHub Actions workflow passes its input).
  const argv = process.argv.slice(2)
  const opts: TransformOptions = { keepExisting: argv.includes("--no-regen") }
  const names = argv
    .filter(a => !a.startsWith("--"))
    .flatMap(a => a.split(";"))
    .map(s => s.trim())
    .filter(Boolean)

  // Sync the data version and hand it to the workflow before processing items,
  // so the PR can be named even if some items later fail.
  const version = await fetchLatestVersion()
  writeVersionFile(version)
  exportOutput("version", version)
  console.log(`Data version: ${version}`)

  // No names means "whatever this version changed". Each target is resolved lazily so one
  // bad name fails only itself.
  let targets: { label: string; resolve: () => Promise<ItemRef> }[]
  if (names.length > 0) {
    targets = names.map(name => ({ label: name, resolve: () => locateByName(name, version) }))
  } else {
    console.log("\nNo names given — discovering items changed in this version...")
    const discovered = await discoverNew(version)
    targets = discovered.map(ref => ({ label: ref.name, resolve: async () => ref }))
    if (targets.length === 0) {
      console.log("Nothing new in the manifest — no changes to make.")
      exportOutput("missing-icons", "_None._")
      exportOutput("stat-changes", "_None — the manifest listed no new items._")
      exportOutput("item-names", "_None — the manifest listed no new items._")
      return
    }
    console.log(`Found ${targets.length}: ${discovered.map(r => `${r.name} (${r.kind})`).join(", ")}`)
  }
  exportOutput("item-names", targets.map(t => `- ${t.label}`).join("\n"))

  const failures: { name: string; error: string }[] = []
  const missingIcons: string[] = []
  const reports: string[] = []

  for (const target of targets) {
    console.log(`\n"${target.label}"`)
    try {
      const { iconSaved, report } = await processItem(await target.resolve(), version, opts)
      if (!iconSaved) missingIcons.push(target.label)
      if (report) reports.push(report)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`  FAILED: ${message}`)
      failures.push({ name: target.label, error: message })
    }
  }

  const ok = targets.length - failures.length
  console.log(`\n${ok}/${targets.length} item(s) added or updated.`)
  if (failures.length > 0) {
    console.log("Failed:")
    for (const f of failures) console.log(`  - ${f.name}: ${f.error}`)
  }
  // Non-fatal: a missing icon never fails the run, so it can't block PR creation.
  if (missingIcons.length > 0) {
    console.warn("\nIcons to add manually (download failed or unavailable):")
    for (const n of missingIcons) console.warn(`  - ${n}`)
  }
  // Surface the missing-icon list in the PR body via the workflow.
  exportOutput("missing-icons", missingIcons.length > 0
    ? missingIcons.map(n => `- ${n}`).join("\n")
    : "_None — all icons downloaded._")

  // Inferred stats are the one part of the PR a human has to check, so the body shows
  // the description the model read next to the values derived from its answer.
  exportOutput("stat-changes", reports.length > 0
    ? reports.join("\n\n")
    : "_None — no stats were inferred._")

  // Type-check the new/updated entries and that the app compiles with no errors
  let buildOk = true
  if (ok > 0) {
    buildOk = typeCheck()
    if (!buildOk) console.error("\nType-check FAILED — new/updated entries need fixing.")
  }

  if (failures.length > 0 || !buildOk) process.exit(1)
}

main().catch((err) => {
  console.error(`\nFatal: ${err instanceof Error ? err.message : err}`)
  process.exit(1)
})
