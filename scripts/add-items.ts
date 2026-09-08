#!/usr/bin/env tsx
/**
 * Add new items (characters, light cones, relic sets, planar sets) to the data set
 *
 * Usage: npm run add-items -- [--no-regen] "Item One" "Item Two" "Item Three" ...
 *
 * For each name the script:
 *   1. resolves what kind of item it is + fetches its raw source data
 *   2. transforms that payload into the right JSON schema
 *   3. writes the entry into the matching src/data/json/*.json file
 *   4. downloads + resizes the icon into the matching assets subfolder
 *
 * Light cone superimposition stats aren't in the source data, so they are inferred from
 * the passive's description (see "stat inference"). Pass --no-regen to leave light cones
 * that already have stats untouched.
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs"
import { execSync } from "node:child_process"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

import type { Path } from "../src/data/data"
import { STAT_NAMES, type Substat } from "../src/data/substats"

// Local dev: load GOOGLE_AI_API_KEY (and any other secrets) from .env if present.
// In CI these are injected directly as env vars by the workflow, so no .env exists there.
try {
  process.loadEnvFile()
} catch {
  // no .env file — fine, env vars may already be set (e.g. in GitHub Actions)
}

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
  /** Markdown for the PR body, when stats were inferred rather than copied over. */
  report?: string
}

// --------------------------------- paths ------------------------------------

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const JSON_DIR = join(root, "src", "data", "json")
const ICONS_DIR = join(root, "src", "assets", "icons")
const VERSION_FILE = join(root, "src", "data", "version.ts")
const EXAMPLES_FILE = join(root, "scripts", "lightcone-examples.json")

// Stat inference re-runs for every item named on the command line, so entries track the
// source as it changes. `--no-regen` skips items that already have stats, preserving
// hand-corrected values.
const KEEP_EXISTING = process.argv.includes("--no-regen")

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

// --------------------------- description rendering --------------------------
// nanoka descriptions carry Unity rich-text markup (<color=...>, <unbreak>, ...) plus
// #N[fmt] placeholders indexing into a param_list — `#1[i]` is param_list[0]. A `%`
// directly after a placeholder means the stored value is a ratio needing a x100 scale
// (0.48 -> "48%"); without one the value is used as-is (3 -> "3" turns).
//
// Each placeholder renders as `[#N: v1/v2/v3/v4/v5]` — the values across superimposition
// levels, keyed by the index the model cites back to us in `paramIndex`.

interface ParsedDescription {
  /** Markup-free text with every placeholder replaced by its `[#N: ...]` tag. */
  text: string
  /** 1-based indices of params whose placeholder carried a `%` (i.e. stored as ratios). */
  percentParams: Set<number>
}

/** The [i]/[f1] format tags are deliberately ignored — rounding 0.275 to "28%" would
 *  corrupt a real 27.5% value. toFixed guards float artifacts (0.275 * 100 = 27.500000000000004). */
function formatParam(value: number, percent: string): string {
  return `${Number((percent ? value * 100 : value).toFixed(4))}${percent}`
}

function parseDescription(desc: string, paramsByLevel: number[][]): ParsedDescription {
  const percentParams = new Set<number>()
  const text = desc
    .replace(/\\n/g, "\n") // source stores line breaks as a literal backslash-n, not a real newline
    .replace(/<[^>]*>/g, "")
    .replace(/#(\d+)\[[^\]]*\](%?)/g, (placeholder, index: string, percent: string) => {
      const values = paramsByLevel.map(params => params[Number(index) - 1])
      if (values.some(v => v === undefined)) return placeholder // leave unresolved refs visible
      if (percent) percentParams.add(Number(index))
      const rendered = values.map(v => formatParam(v, percent))
      // collapse when every level shares a value (turn counts, Energy, stack caps)
      const distinct = [...new Set(rendered)]
      return `[#${index}: ${(distinct.length === 1 ? distinct : rendered).join("/")}]`
    })
    .replace(/[ \t]+/g, " ")
    .trim()
  return { text, percentParams }
}

/** A light cone's passive, plus the per-level params its `[#N: ...]` tags refer to. */
interface EffectSource extends ParsedDescription {
  effectName: string
  paramsByLevel: number[][]
}

function lightconeEffectSource(raw: unknown): EffectSource {
  // NB: refinements.name is the *passive* name ("Ink Splash"), not the light cone's.
  const { name, desc, level } = (raw as any).refinements
  const paramsByLevel: number[][] = Object.keys(level)
    .sort((a, b) => Number(a) - Number(b))
    .map(key => level[key].param_list)
  return { effectName: name, paramsByLevel, ...parseDescription(desc, paramsByLevel) }
}

/** The exact text handed to the model — shared with the few-shot examples so both match. */
function inferencePrompt(name: string, source: EffectSource): string {
  return `Light cone: ${name}\nPassive "${source.effectName}": ${source.text}`
}

// ------------------------------ stat inference ------------------------------
// The model never sees or emits numbers: it only says which `[#N: ...]` tag is an
// always-on stat buff and which stat it is. Values and buckets are derived here, which
// makes the numeric half of the pipeline exact and consistent across all 5 levels.

// Google retires pinned models, which surfaces here as a 404 and empty pathStats in the PR.
// Override with GEMINI_MODEL to move on without a code change.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const MAX_ATTEMPTS = 3

/** Stats stored as additive percentage points rather than a ratio of the base value. */
const FLAT_STATS = new Set<Substat>(["Crit Rate", "Crit DMG", "Break Effect", "Effect Hit Rate", "Effect RES"])

interface InferredEffect {
  sourceText: string
  stat: Substat
  paramIndex: number
  multiplier: number
}

interface InferenceResult {
  effects: InferredEffect[]
  excluded: { text: string; reason: string }[]
}

interface FewShotExample {
  description: string
  result: InferenceResult
}

// sourceText is ordered first so the model quotes its evidence before committing to a
// stat and index — cheap grounding that structured output otherwise skips.
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    effects: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          sourceText: { type: "STRING" },
          stat: { type: "STRING", enum: [...STAT_NAMES] },
          paramIndex: { type: "INTEGER" },
          multiplier: { type: "NUMBER" },
        },
        required: ["sourceText", "stat", "paramIndex", "multiplier"],
        propertyOrdering: ["sourceText", "stat", "paramIndex", "multiplier"],
      },
    },
    excluded: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          text: { type: "STRING" },
          reason: { type: "STRING" },
        },
        required: ["text", "reason"],
        propertyOrdering: ["text", "reason"],
      },
    },
  },
  required: ["effects", "excluded"],
  propertyOrdering: ["effects", "excluded"],
}

const SYSTEM_INSTRUCTION = `You extract permanent stat bonuses from Honkai: Star Rail light cone passive descriptions.

Every number in the description is replaced by a tag of the form [#N: v1/v2/v3/v4/v5], where
N is the parameter's index and the values are its superimposition levels S1-S5. A single value
means the parameter is the same at every level.

Report each effect that unconditionally modifies one of these nine stats ON THE WEARER, for as
long as the light cone is equipped:
${STAT_NAMES.join(", ")}

Cite the tag number in paramIndex. NEVER report the value itself — only which tag it came from.

EXCLUDE anything that is:
- conditional or temporary: gated on "when"/"after"/"while"/"if", dependent on stacks or on a
  buff the wearer must first gain, or "lasting for N turn(s)"
- applied to anyone other than the wearer: allies, enemies, or the wearer's memosprite
- not one of the nine stats: DMG bonuses, elemental or Path DMG (e.g. "increases the wearer's
  Elation"), Energy, Energy Regeneration Rate, healing, shields, DEF ignore, RES PEN,
  Weakness Break efficiency, or aggro
List every excluded phrase in "excluded" with a short reason.

Stat naming: "Max HP" is HP, "CRIT Rate" is Crit Rate, "CRIT DMG" is Crit DMG.
Set multiplier to 1 unless the description states the bonus applies a fixed number of times
(e.g. a stack count that is always maxed), in which case use that count.
If nothing qualifies, return an empty effects array.`

/** Quota (429) and overload (503) are routine on the free tier, so back off rather than
 *  lose the item — a dropped call would silently leave pathStats empty. */
async function postWithRetry(apiKey: string, body: object): Promise<any> {
  let lastError = ""
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    })
    if (res.ok) return res.json()

    const text = await res.text()
    lastError = `HTTP ${res.status}: ${text.slice(0, 200)}`
    if (![429, 500, 503].includes(res.status) || attempt === MAX_ATTEMPTS) break

    // Quota errors carry a RetryInfo hint; otherwise back off exponentially.
    const hinted = Number(text.match(/"retryDelay":\s*"(\d+)s"/)?.[1])
    const waitMs = Math.min(hinted > 0 ? hinted * 1000 : 2000 * 2 ** (attempt - 1), 60_000)
    console.warn(`  [lightcone] Gemini ${res.status} — retrying in ${waitMs / 1000}s (${attempt}/${MAX_ATTEMPTS})`)
    await new Promise(resolve => setTimeout(resolve, waitMs))
  }
  throw new Error(`Gemini ${lastError}`)
}

async function callGemini(apiKey: string, prompt: string): Promise<InferenceResult> {
  const examples = JSON.parse(readFileSync(EXAMPLES_FILE, "utf8")) as FewShotExample[]
  const body = await postWithRetry(apiKey, {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [
      // few-shot as real turns rather than pasted into the system prompt
      ...examples.flatMap(example => [
        { role: "user", parts: [{ text: example.description }] },
        { role: "model", parts: [{ text: JSON.stringify(example.result) }] },
      ]),
      { role: "user", parts: [{ text: prompt }] },
    ],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  })
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error(`Gemini returned no content: ${JSON.stringify(body).slice(0, 300)}`)
  return JSON.parse(text) as InferenceResult
}

/** Drops effects that are wrong in ways we can check without knowing the right answer. */
function validateEffects(source: EffectSource, effects: InferredEffect[]): InferredEffect[] {
  const paramCount = source.paramsByLevel[0]?.length ?? 0
  const kept: InferredEffect[] = []
  for (const effect of effects) {
    const { stat, paramIndex, multiplier } = effect
    const drop = (why: string) => console.warn(`  [lightcone] dropped inferred effect (${why}): ${JSON.stringify(effect)}`)

    if (!(STAT_NAMES as readonly string[]).includes(stat)) { drop(`unknown stat "${stat}"`); continue }
    if (!Number.isInteger(paramIndex) || paramIndex < 1 || paramIndex > paramCount) {
      drop(`paramIndex ${paramIndex} outside 1..${paramCount}`); continue
    }
    if (!Number.isFinite(multiplier) || multiplier <= 0) { drop(`bad multiplier ${multiplier}`); continue }
    if (kept.some(k => k.stat === stat)) { drop(`duplicate stat "${stat}"`); continue }

    if (multiplier !== 1) console.warn(`  [lightcone] ${stat} uses multiplier ${multiplier} — verify manually`)
    kept.push(effect)
  }
  return kept
}

function toPathStats(source: EffectSource, effects: InferredEffect[]): StatMod[] {
  return source.paramsByLevel.map(params => {
    const mod: StatMod = {}
    for (const { stat, paramIndex, multiplier } of effects) {
      const isPercent = source.percentParams.has(paramIndex)
      // HP/ATK/DEF/SPD scale the base stat when written as a %, and are otherwise a raw
      // addition to it (e.g. Thus Burns the Dawn's flat +12 SPD).
      const bucket = FLAT_STATS.has(stat) ? "flat" : isPercent ? "percent" : "base"
      const value = params[paramIndex - 1] * (isPercent ? 100 : 1) * multiplier
      ;(mod[bucket] ??= {})[stat] = Number(value.toFixed(4))
    }
    return mod
  })
}

/** Renders what the model produced, for a reviewer to check against the description. */
function formatApplied(pathStats: StatMod[]): string {
  const keys = new Set<string>()
  for (const mod of pathStats) {
    for (const [bucket, stats] of Object.entries(mod)) {
      for (const stat of Object.keys(stats)) keys.add(`${bucket}.${stat}`)
    }
  }
  if (keys.size === 0) return "_no always-on stat bonus found_"

  return [...keys].map(key => {
    const [bucket, stat] = key.split(".")
    const values = pathStats.map(mod => (mod as Record<string, StatMap>)[bucket]?.[stat as Substat] ?? 0)
    return `- \`${key}\` → ${values.join(" / ")}`
  }).join("\n")
}

/** The description exactly as the model saw it, plus the stats derived from its answer. */
function formatReport(name: string, source: EffectSource, pathStats: StatMod[]): string {
  const quoted = source.text.split("\n").map(line => `> ${line}`).join("\n")
  return `### ${name} — "${source.effectName}"\n\n${quoted}\n\n**Applied:**\n${formatApplied(pathStats)}`
}

interface InferredPathStats {
  pathStats: StatMod[]
  report: string
}

/** Returns null when inference is unavailable or failed, so the caller can fall back. */
async function inferPathStats(name: string, raw: unknown): Promise<InferredPathStats | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    console.warn("  [lightcone] GOOGLE_AI_API_KEY not set — leaving pathStats empty")
    return null
  }
  const source = lightconeEffectSource(raw)
  try {
    const result = await callGemini(apiKey, inferencePrompt(name, source))
    const effects = validateEffects(source, result.effects)
    for (const e of effects) console.log(`  [lightcone] ${e.stat} <- #${e.paramIndex} "${e.sourceText}"`)
    if (effects.length === 0) console.log("  [lightcone] no always-on stat bonus found")
    const pathStats = toPathStats(source, effects)
    return { pathStats, report: formatReport(name, source, pathStats) }
  } catch (err) {
    console.warn(`  [lightcone] stat inference failed: ${err instanceof Error ? err.message : err}`)
    return null
  }
}

async function transformLightcone(raw: unknown, existing?: object): Promise<TransformResult> {
  const data = raw as any
  const stats = data.stats[6]
  const prev = existing as LightconeEntry | undefined

  // nanoka has no superimposition stats, only the passive's description — so they get
  // inferred from that text, unless --no-regen preserves what is already there.
  const alreadyFilled = prev?.pathStats?.some(mod => Object.keys(mod).length > 0)
  const inferred = alreadyFilled && KEEP_EXISTING ? null : await inferPathStats(data.name, raw)

  const entry: LightconeEntry = {
    path: pathMap[data.base_type],
    baseStats: {
      HP: stats.base_hp + stats.base_hp_add * 79,
      ATK: stats.base_attack + stats.base_attack_add * 79,
      DEF: stats.base_defence + stats.base_defence_add * 79,
    },
    pathStats: inferred?.pathStats ?? prev?.pathStats ?? [{}, {}, {}, {}, {}],
  }
  return {
    entry,
    iconUrl: `https://starrail.honeyhunterworld.com/img/item/${data.name.toLowerCase().replaceAll(" ", "-")}-item_icon.webp`,
    report: inferred?.report,
  }
}

async function transformRelic(raw: unknown, existing?: object): Promise<TransformResult> {
  const data = raw as any
  const fileName = data.icon.split('/').pop()
  const iconId = fileName.split('.')[0]
  // Relic/Planar set stats aren't in nanoka either........
  const prev = existing as RelicEntry | undefined
  const entry: RelicEntry = {
    "2pc": prev?.["2pc"] ?? {},
    "4pc": prev?.["4pc"] ?? {},
  }
  return { entry, iconUrl: `https://static.nanoka.cc/assets/hsr/itemfigures/${iconId}.webp` }
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

async function processItem(name: string): Promise<ItemResult> {
  const { kind, raw } = await resolveItem(name)
  const handler = HANDLERS[kind]

  const data = loadJson(handler.jsonFile)
  const { entry, iconUrl, report } = await handler.transform(raw, data[name] as object | undefined)
  const updated = writeEntry(handler.jsonFile, data, name, entry)
  console.log(`  [${kind}] ${updated ? "updated" : "added"} entry -> ${handler.jsonFile}`)

  if (iconUrl) {
    try {
      await downloadIcon(iconUrl, name, handler.iconSubfolder, kind === 'lightcone' ? "lg" : "sm")
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
  const names = process.argv.slice(2)
    .filter(a => a !== "--no-regen")
    .flatMap(a => a.split(";"))
    .map(s => s.trim())
    .filter(Boolean)
  if (names.length === 0) {
    console.error('Usage: npm run add-items -- [--no-regen] "Item One" "Item Two" ...')
    process.exit(1)
  }

  // Sync the data version and hand it to the workflow before processing items,
  // so the PR can be named even if some items later fail.
  const version = await fetchLatestVersion()
  writeVersionFile(version)
  exportOutput("version", version)
  console.log(`Data version: ${version}`)

  const failures: { name: string; error: string }[] = []
  const missingIcons: string[] = []
  const reports: string[] = []

  for (const name of names) {
    console.log(`\n"${name}"`)
    try {
      const { iconSaved, report } = await processItem(name)
      if (!iconSaved) missingIcons.push(name)
      if (report) reports.push(report)
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
