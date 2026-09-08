/**
 * Infers stat bonuses from effect descriptions using Gemini.
 *
 * The model never sees or emits a computed number: it only reports which `[#N: ...]` tag is
 * an always-on stat bonus and which stat it is. Values and buckets are derived here, which
 * keeps the numeric half exact and consistent across every superimposition level.
 *
 * Light cones and relic sets differ only in wording, so they share everything below and vary
 * through an InferenceProfile.
 */

import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { STAT_NAMES, type Substat } from "../../src/data/substats"
import type { StatMap, StatMod } from "./types"
import type { EffectSource } from "./descriptions"

const scriptsDir = join(dirname(fileURLToPath(import.meta.url)), "..")

// Google retires pinned models, which surfaces here as a 404 and empty stats in the PR.
// Override with GEMINI_MODEL to move on without a code change.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const MAX_ATTEMPTS = 3

/** Stats stored as additive percentage points rather than a ratio of the base value. */
const FLAT_STATS = new Set<Substat>(["Crit Rate", "Crit DMG", "Break Effect", "Effect Hit Rate", "Effect RES"])

export interface InferredEffect {
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

export interface InferredStats {
  /** One StatMod per level — light cones have five, relic set bonuses exactly one. */
  mods: StatMod[]
  report: string
}

export interface InferenceProfile {
  /** Prefix for log lines. */
  label: string
  systemInstruction: string
  examplesFile: string
  /** The text handed to the model — must match the shape of the few-shot examples. */
  prompt(name: string, source: EffectSource): string
  /** Markdown heading for the PR body report. */
  heading(name: string, source: EffectSource): string
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

// ------------------------------- profiles ------------------------------------

export const LIGHTCONE_PROFILE: InferenceProfile = {
  label: "lightcone",
  examplesFile: join(scriptsDir, "lightcone-examples.json"),
  prompt: (name, source) => `Light cone: ${name}\nPassive "${source.effectName}": ${source.text}`,
  heading: (name, source) => `${name} — "${source.effectName}"`,
  systemInstruction: `You extract permanent stat bonuses from Honkai: Star Rail light cone passive descriptions.

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
If nothing qualifies, return an empty effects array.`,
}

export const RELIC_PROFILE: InferenceProfile = {
  label: "relic",
  examplesFile: join(scriptsDir, "relic-examples.json"),
  prompt: (name, source) => `Relic set: ${name}\n${source.effectName} bonus: ${source.text}`,
  heading: (name, source) => `${name} — ${source.effectName}`,
  systemInstruction: `You extract permanent stat bonuses from Honkai: Star Rail relic and planar set bonus descriptions.

Every number in the description is replaced by a tag of the form [#N: value]. Set bonuses have
no superimposition levels, so each tag carries a single value.

Report each effect that unconditionally modifies one of these nine stats for the character
wearing the set, for as long as the set is equipped:
${STAT_NAMES.join(", ")}

Cite the tag number in paramIndex. NEVER report the value itself — only which tag it came from.

IMPORTANT: set bonuses usually describe the wearer without naming them. "Increases ATK by
[#1: 12%]" and "Increases CRIT Rate by [#1: 4%]" both apply to the wearer and MUST be reported.
Only treat an effect as someone else's when the text explicitly says so (allies, enemies, or the
wearer's memosprite).

DIRECTION: if the description DECREASES or lowers a stat ("Decreases the wearer's SPD by
[#6: 8%]"), the tag's value is still positive — set multiplier to -1 to record the drop.
Use multiplier 1 for an increase.

EXCLUDE anything that is:
- conditional or temporary: gated on "when"/"after"/"while"/"if", dependent on stacks, on a
  threshold the wearer must reach, or "lasting for N turn(s)"
- applied to anyone other than the wearer
- not one of the nine stats: DMG bonuses (including elemental DMG such as "Quantum DMG" and
  DMG dealt to particular enemies), Energy, Energy Regeneration Rate, Outgoing Healing, shields,
  DEF ignore, RES PEN, Weakness Break efficiency, or aggro
List every excluded phrase in "excluded" with a short reason.

Stat naming: "Max HP" is HP, "CRIT Rate" is Crit Rate, "CRIT DMG" is Crit DMG.
Otherwise set multiplier to 1, unless the description states the bonus applies a fixed number
of times, in which case use that count.
If nothing qualifies, return an empty effects array.`,
}

// ------------------------------- gemini client -------------------------------

/** Quota (429) and overload (503) are routine on the free tier, so back off rather than
 *  lose the item — a dropped call would silently leave stats empty. */
async function postWithRetry(apiKey: string, body: object, label: string): Promise<any> {
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
    console.warn(`  [${label}] Gemini ${res.status} — retrying in ${waitMs / 1000}s (${attempt}/${MAX_ATTEMPTS})`)
    await new Promise(resolve => setTimeout(resolve, waitMs))
  }
  throw new Error(`Gemini ${lastError}`)
}

async function callGemini(apiKey: string, profile: InferenceProfile, prompt: string, label: string): Promise<InferenceResult> {
  const examples = JSON.parse(readFileSync(profile.examplesFile, "utf8")) as FewShotExample[]
  const body = await postWithRetry(apiKey, {
    systemInstruction: { parts: [{ text: profile.systemInstruction }] },
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
  }, label)
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error(`Gemini returned no content: ${JSON.stringify(body).slice(0, 300)}`)
  return JSON.parse(text) as InferenceResult
}

// ------------------------------ derive + report ------------------------------

/** Drops effects that are wrong in ways we can check without knowing the right answer. */
export function validateEffects(source: EffectSource, effects: InferredEffect[], label: string): InferredEffect[] {
  const paramCount = source.paramsByLevel[0]?.length ?? 0
  const kept: InferredEffect[] = []
  for (const effect of effects) {
    const { stat, paramIndex, multiplier } = effect
    const drop = (why: string) => console.warn(`  [${label}] dropped inferred effect (${why}): ${JSON.stringify(effect)}`)

    if (!(STAT_NAMES as readonly string[]).includes(stat)) { drop(`unknown stat "${stat}"`); continue }
    if (!Number.isInteger(paramIndex) || paramIndex < 1 || paramIndex > paramCount) {
      drop(`paramIndex ${paramIndex} outside 1..${paramCount}`); continue
    }
    // negative is legitimate: a set that lowers a stat reports multiplier -1
    if (!Number.isFinite(multiplier) || multiplier === 0) { drop(`bad multiplier ${multiplier}`); continue }
    if (kept.some(k => k.stat === stat)) { drop(`duplicate stat "${stat}"`); continue }

    if (multiplier !== 1) console.warn(`  [${label}] ${stat} uses multiplier ${multiplier} — verify manually`)
    kept.push(effect)
  }
  return kept
}

export function toStatMods(source: EffectSource, effects: InferredEffect[]): StatMod[] {
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
function formatApplied(mods: StatMod[]): string {
  const keys = new Set<string>()
  for (const mod of mods) {
    for (const [bucket, stats] of Object.entries(mod)) {
      for (const stat of Object.keys(stats)) keys.add(`${bucket}.${stat}`)
    }
  }
  if (keys.size === 0) return "_no always-on stat bonus found_"

  return [...keys].map(key => {
    const [bucket, stat] = key.split(".")
    const values = mods.map(mod => (mod as Record<string, StatMap>)[bucket]?.[stat as Substat] ?? 0)
    return `- \`${key}\` → ${values.join(" / ")}`
  }).join("\n")
}

/** The description exactly as the model saw it, plus the stats derived from its answer. */
function formatReport(heading: string, source: EffectSource, mods: StatMod[]): string {
  const quoted = source.text.split("\n").map(line => `> ${line}`).join("\n")
  return `### ${heading}\n\n${quoted}\n\n**Applied:**\n${formatApplied(mods)}`
}

/** Returns null when inference is unavailable or failed, so the caller can fall back. */
export async function inferStats(
  profile: InferenceProfile,
  name: string,
  source: EffectSource,
  label = profile.label,
): Promise<InferredStats | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    console.warn(`  [${label}] GOOGLE_AI_API_KEY not set — leaving stats empty`)
    return null
  }
  try {
    const result = await callGemini(apiKey, profile, profile.prompt(name, source), label)
    const effects = validateEffects(source, result.effects, label)
    for (const e of effects) console.log(`  [${label}] ${e.stat} <- #${e.paramIndex} "${e.sourceText}"`)
    if (effects.length === 0) console.log(`  [${label}] no always-on stat bonus found`)
    const mods = toStatMods(source, effects)
    return { mods, report: formatReport(profile.heading(name, source), source, mods) }
  } catch (err) {
    console.warn(`  [${label}] stat inference failed: ${err instanceof Error ? err.message : err}`)
    return null
  }
}
