#!/usr/bin/env tsx
/**
 * Add new items (characters, light cones, relic sets, planar sets) to the data set
 *
 * Usage: npm run add-items -- "Item One" "Item Two" "Item Three" ...
 *
 * For each name the script:
 *   1. resolves what kind of item it is + fetches its raw source data
 *   2. transforms that payload into the right JSON schema
 *   3. writes the entry into the matching src/data/json/*.json file
 *   4. downloads + resizes the icon into the matching assets subfolder
 *
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs"
import { execSync } from "node:child_process"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

import type { Path } from "../src/data/data"
import type { Substat } from "../src/data/substats"

// ------------------------------- schema types -------------------------------
// Follows the interfaces in src/data/data.ts

type StatMap = Partial<Record<Substat, number>>

interface StatMod {
  base?: StatMap
  flat?: StatMap
  percent?: StatMap
}

interface CharacterEntry {
  path: Path
  stats: StatMod
}

interface LightconeEntry {
  path: Path
  baseStats: StatMap
  pathStats: StatMod[] // one StatMod per superimpose level
}

interface RelicEntry {
  "2pc": StatMod
  "4pc": StatMod
}

interface PlanarEntry {
  "2pc": StatMod
}

type ItemKind = "character" | "lightcone" | "relic" | "planar"

interface TransformResult {
  entry: object
  iconUrl: string
}

// --------------------------------- paths ------------------------------------

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const JSON_DIR = join(root, "src", "data", "json")
const ICONS_DIR = join(root, "src", "assets", "icons")
const VERSION_FILE = join(root, "src", "data", "version.ts")

// Must match the sanitize() function in src/data/icons.ts
function sanitize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

// ------------------------------ source adapter ------------------------------

interface ResolvedItem {
  kind: ItemKind
  raw: unknown
}

async function resolveItem(name: string): Promise<ResolvedItem> {
  const manifest = await fetch(`https://static.nanoka.cc/manifest.json`)
  const version = (await manifest.json()).hsr.latest

  const charPromise = fetch(`https://static.nanoka.cc/hsr/${version}/character.json`)
  const lcPromise = fetch(`https://static.nanoka.cc/hsr/${version}/lightcone.json`)
  const relicPromise = fetch(`https://static.nanoka.cc/hsr/${version}/relicset.json`)

  const [charResponse, lcResponse, relicResponse] = await Promise.all([charPromise, lcPromise, relicPromise])

  const chars = await charResponse.json()
  for (const [charId, charData] of Object.entries(chars)) {
    if ((charData as any).en === name) {
      const res = await (await fetch(`https://static.nanoka.cc/hsr/${version}/en/character/${charId}.json`)).json()
      return { kind: 'character', raw: res }
    }
  }

  const lcs = await lcResponse.json()
  for (const [lcId, lcData] of Object.entries(lcs)) {
    if ((lcData as any).en === name) {
      const res = await (await fetch(`https://static.nanoka.cc/hsr/${version}/en/lightcone/${lcId}.json`)).json()
      return { kind: 'lightcone', raw: res }
    }
  }

  const relics = await relicResponse.json()
  for (const [relicId, relicData] of Object.entries(relics)) {
    if ((relicData as any).en === name) {
      const res = await (await fetch(`https://static.nanoka.cc/hsr/${version}/en/relicset/${relicId}.json`)).json()
      return { 
        kind: (relicData as any).set["4"] ? 'relic' : 'planar',
        raw: res
      }
    }
  }

  throw new Error(`"${name}" did not match any character, lightcone, or relic/planar set`)
}

// -------------------------------- transforms --------------------------------

const pathMap: Record<string, Path> = {
  "Memory": "Remembrance",
  "Elation": "Elation",
  "Mage": "Erudition",
  "Warrior": "Destruction",
  "Knight": "Preservation",
  "Priest": "Abundance",
  "Rogue": "Hunt",
  "Shaman": "Harmony",
  "Warlock": "Nihility",
}

async function fandomCharacterIconUrl(name: string): Promise<string> {
  const filename = `Character_${name.replaceAll(" ", "_")}_Icon.png`
  const params = new URLSearchParams({
    action: "query",
    titles: `File:${filename}`,
    prop: "imageinfo",
    iiprop: "url",
    format: "json",
  })
  const res = await fetch(`https://honkai-star-rail.fandom.com/api.php?${params}`)
  if (!res.ok) throw new Error(`Fandom API HTTP ${res.status} for "${filename}"`)
  const pages = (await res.json() as any).query.pages
  const url = pages[Object.keys(pages)[0]]?.imageinfo?.[0]?.url
  if (!url) throw new Error(`No Fandom icon found for "${filename}"`)
  return url
}

async function transformCharacter(raw: unknown): Promise<TransformResult> {
  const data = raw as any

  const stats = data.stats["6"]
  const skillTree = data.skill_trees

  let modList: any[] = []
  for (const trace of Object.values(skillTree)) {
    for (const level of Object.values(trace as any)) {
      modList = [...modList, ...(level as any).status_add_list]
    }
  }

  let [percent, flat]: any[] = [{}, {}]

  modList.forEach(entry => {
    switch (entry.property_type) {
      case "HPAddedRatio":
        percent.HP = percent.HP ?? 0
        percent.HP += entry.value * 100
        break
      case "AttackAddedRatio":
        percent.ATK = percent.ATK ?? 0
        percent.ATK += entry.value * 100
        break
      case "DefenceAddedRatio":
        percent.DEF = percent.DEF ?? 0
        percent.DEF += entry.value * 100
        break
      case "SpeedDelta":
        flat.SPD = flat.SPD ?? 0
        flat.SPD += entry.value
        break
      case "CriticalChanceBase":
        flat["Crit Rate"] = flat["Crit Rate"] ?? 0
        flat["Crit Rate"] += entry.value * 100
        break
      case "CriticalDamageBase":
        flat["Crit DMG"] = flat["Crit DMG"] ?? 0
        flat["Crit DMG"] += entry.value * 100
        break
      case "BreakDamageAddedRatioBase":
        flat["Break Effect"] = flat["Break Effect"] ?? 0
        flat["Break Effect"] += entry.value * 100
        break
      case "StatusProbabilityBase":
        flat["Effect Hit Rate"] = flat["Effect Hit Rate"] ?? 0
        flat["Effect Hit Rate"] += entry.value * 100
        break
      case "StatusResistanceBase":
        flat["Effect RES"] = flat["Effect RES"] ?? 0
        flat["Effect RES"] += entry.value * 100
        break
      default:
        break
    }
  })

  const entry: CharacterEntry = {
    path: pathMap[data.base_type],
    stats: {
      base: {
        HP: stats.hp_base + stats.hp_add * 79,
        ATK: stats.attack_base + stats.attack_add * 79,
        DEF: stats.defence_base + stats.defence_add * 79,
        SPD: stats.speed_base,
      },
      percent: Object.keys(percent).length ? percent : undefined,
      flat: Object.keys(flat).length ? flat : undefined,
    },
  }
  return { entry, iconUrl: await fandomCharacterIconUrl(data.name).catch(() => "") }
}

async function transformLightcone(raw: unknown, existing?: object): Promise<TransformResult> {
  const data = raw as any
  const stats = data.stats[6]
  const prev = existing as LightconeEntry | undefined
  const entry: LightconeEntry = {
    path: pathMap[data.base_type],
    baseStats: {
      HP: stats.base_hp + stats.base_hp_add * 79,
      ATK: stats.base_attack + stats.base_attack_add * 79,
      DEF: stats.base_defence + stats.base_defence_add * 79,
    },
    // Superimposition stats aren't in nanoka....
    pathStats: prev?.pathStats ?? [{}, {}, {}, {}, {}],
  }
  return { entry, iconUrl: `https://starrail.honeyhunterworld.com/img/item/${data.name.toLowerCase().replaceAll(" ", "-")}-item_icon.webp` }
}

async function transformRelic(raw: unknown, existing?: object): Promise<TransformResult> {
  void raw
  // Relic/Planar set stats aren't in nanoka either........
  const prev = existing as RelicEntry | undefined
  const entry: RelicEntry = {
    "2pc": prev?.["2pc"] ?? {},
    "4pc": prev?.["4pc"] ?? {},
  }
  return { entry, iconUrl: "" }
}

async function transformPlanar(raw: unknown, existing?: object): Promise<TransformResult> {
  void raw
  const prev = existing as PlanarEntry | undefined
  const entry: PlanarEntry = {
    "2pc": prev?.["2pc"] ?? {},
  }
  return { entry, iconUrl: "" }
}

// ------------------------------- kind registry ------------------------------

const HANDLERS: Record<ItemKind, {
  jsonFile: string
  iconSubfolder: string
  transform: (raw: unknown, existing?: object) => Promise<TransformResult>
}> = {
  character: { jsonFile: "characterData.json", iconSubfolder: "characters",  transform: transformCharacter },
  lightcone: { jsonFile: "lightconeData.json", iconSubfolder: "light-cones", transform: transformLightcone },
  relic:     { jsonFile: "relicData.json",     iconSubfolder: "relic-sets",  transform: transformRelic },
  planar:    { jsonFile: "planarData.json",    iconSubfolder: "planar-sets", transform: transformPlanar },
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

// --------------------------------- version ----------------------------------

async function fetchLatestVersion(): Promise<string> {
  const res = await fetch("https://static.nanoka.cc/manifest.json")
  if (!res.ok) throw new Error(`Manifest fetch failed: HTTP ${res.status}`)
  return (await res.json() as any).hsr.latest
}

function writeVersionFile(version: string): void {
  const contents =
    "// Latest data version, sourced from nanoka's manifest.\n" +
    "// Updated automatically by scripts/add-items.ts — do not edit by hand.\n" +
    `export const VERSION = "${version}"\n`
  writeFileSync(VERSION_FILE, contents)
}

// write version num for later GitHub Actions steps
function exportVersionOutput(version: string): void {
  const out = process.env.GITHUB_OUTPUT
  if (out) appendFileSync(out, `version=${version}\n`)
}

// ----------------------------------- main -----------------------------------

async function processItem(name: string): Promise<void> {
  const { kind, raw } = await resolveItem(name)
  const handler = HANDLERS[kind]

  const data = loadJson(handler.jsonFile)
  const { entry, iconUrl } = await handler.transform(raw, data[name] as object | undefined)
  const updated = writeEntry(handler.jsonFile, data, name, entry)
  console.log(`  [${kind}] ${updated ? "updated" : "added"} entry -> ${handler.jsonFile}`)

  if (iconUrl) {
    await downloadIcon(iconUrl, name, handler.iconSubfolder, kind === 'lightcone' ? "lg" : "sm")
    console.log(`  [${kind}] saved icon  -> icons/${handler.iconSubfolder}/${sanitize(name)}.webp`)
  } else {
    console.warn(`  [${kind}] no iconUrl — skipping icon download`)
  }
}

async function main(): Promise<void> {
  // Accept both `-- "Name A" "Name B"` and a single comma-separated `-- "Name A, Name B"`
  // (the latter is how the GitHub Actions workflow passes its input).
  const names = process.argv.slice(2)
    .flatMap(a => a.split(","))
    .map(s => s.trim())
    .filter(Boolean)
  if (names.length === 0) {
    console.error('Usage: npm run add-items -- "Item One" "Item Two" ...')
    process.exit(1)
  }

  // Sync the data version and hand it to the workflow before processing items,
  // so the PR can be named even if some items later fail.
  const version = await fetchLatestVersion()
  writeVersionFile(version)
  exportVersionOutput(version)
  console.log(`Data version: ${version}`)

  const failures: { name: string; error: string }[] = []

  for (const name of names) {
    console.log(`\n"${name}"`)
    try {
      await processItem(name)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`  FAILED: ${message}`)
      failures.push({ name, error: message })
    }
  }

  const ok = names.length - failures.length
  console.log(`\n${ok}/${names.length} item(s) added or updated.`)
  if (failures.length > 0) {
    console.log("Failed:")
    for (const f of failures) console.log(`  - ${f.name}: ${f.error}`)
  }

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
