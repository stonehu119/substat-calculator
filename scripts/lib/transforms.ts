/**
 * Turns a raw nanoka payload into the entry shape stored in src/data/json/*.json.
 *
 * Base stats come straight from the source. Light cone superimposition stats and relic set
 * bonuses are not in the source at all — only their descriptions are — so those are inferred
 * (see inference.ts) unless the caller asks to keep what is already stored.
 */

import type { Path } from "../../src/data/data"
import type {
  CharacterEntry, ItemKind, LightconeEntry, PlanarEntry, RelicEntry,
  StatMod, TransformOptions, TransformResult,
} from "./types"
import { lightconeEffectSource, relicEffectSources, type SetPiece } from "./descriptions"
import { inferStats, LIGHTCONE_PROFILE, RELIC_PROFILE } from "./inference"
import { relicIconUrl } from "./nanoka"

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

// Base stats are a base plus 79 level-up increments, so binary float error lands in the low
// digits (1203.0479999999998). No real value carries more than 3dp, making this lossless.
function round3(value: number): number {
  return Number(value.toFixed(3))
}

function isFilled(mod?: StatMod): boolean {
  return !!mod && Object.keys(mod).length > 0
}

// -------------------------------- character ----------------------------------

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

export async function transformCharacter(raw: unknown): Promise<TransformResult> {
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
        HP: round3(stats.hp_base + stats.hp_add * 79),
        ATK: round3(stats.attack_base + stats.attack_add * 79),
        DEF: round3(stats.defence_base + stats.defence_add * 79),
        SPD: stats.speed_base,
      },
      percent: Object.keys(percent).length ? percent : undefined,
      flat: Object.keys(flat).length ? flat : undefined,
    },
  }
  return { entry, iconUrl: await fandomCharacterIconUrl(data.name).catch(() => "") }
}

// -------------------------------- light cone ---------------------------------

export async function transformLightcone(raw: unknown, existing: object | undefined, opts: TransformOptions): Promise<TransformResult> {
  const data = raw as any
  const stats = data.stats[6]
  const prev = existing as LightconeEntry | undefined

  // nanoka has no superimposition stats, only the passive's description — so they get
  // inferred from that text, unless the caller preserves what is already there.
  const alreadyFilled = prev?.pathStats?.some(isFilled)
  const inferred = alreadyFilled && opts.keepExisting
    ? null
    : await inferStats(LIGHTCONE_PROFILE, data.name, lightconeEffectSource(raw))

  const entry: LightconeEntry = {
    path: pathMap[data.base_type],
    baseStats: {
      HP: round3(stats.base_hp + stats.base_hp_add * 79),
      ATK: round3(stats.base_attack + stats.base_attack_add * 79),
      DEF: round3(stats.base_defence + stats.base_defence_add * 79),
    },
    pathStats: inferred?.mods ?? prev?.pathStats ?? [{}, {}, {}, {}, {}],
  }
  return {
    entry,
    iconUrl: `https://starrail.honeyhunterworld.com/img/item/${data.name.toLowerCase().replaceAll(" ", "-")}-item_icon.webp`,
    report: inferred?.report,
  }
}

// ----------------------------- relic / planar sets ---------------------------

/**
 * Infers the bonus for each piece count the set defines. Relic sets have 2pc and 4pc; planar
 * sets only 2pc. Each piece is its own description, so each is its own inference call.
 */
async function inferSetPieces(
  name: string,
  raw: unknown,
  pieces: readonly SetPiece[],
  previous: Partial<Record<SetPiece, StatMod>>,
  opts: TransformOptions,
): Promise<{ mods: Partial<Record<SetPiece, StatMod>>; reports: string[] }> {
  const sources = relicEffectSources(raw)
  const mods: Partial<Record<SetPiece, StatMod>> = {}
  const reports: string[] = []

  for (const piece of pieces) {
    const source = sources[piece]
    if (!source) continue
    if (isFilled(previous[piece]) && opts.keepExisting) continue

    const inferred = await inferStats(RELIC_PROFILE, name, source, `relic ${piece}`)
    if (!inferred) continue
    mods[piece] = inferred.mods[0] ?? {}
    reports.push(inferred.report)
  }
  return { mods, reports }
}

export async function transformRelic(raw: unknown, existing: object | undefined, opts: TransformOptions): Promise<TransformResult> {
  const data = raw as any
  const prev = existing as RelicEntry | undefined
  const previous = { "2pc": prev?.["2pc"], "4pc": prev?.["4pc"] }
  const { mods, reports } = await inferSetPieces(data.name, raw, ["2pc", "4pc"], previous, opts)

  const entry: RelicEntry = {
    "2pc": mods["2pc"] ?? prev?.["2pc"] ?? {},
    "4pc": mods["4pc"] ?? prev?.["4pc"] ?? {},
  }
  return {
    entry,
    iconUrl: relicIconUrl(data.icon),
    report: reports.length ? reports.join("\n\n") : undefined,
  }
}

export async function transformPlanar(raw: unknown, existing: object | undefined, opts: TransformOptions): Promise<TransformResult> {
  const data = raw as any
  const prev = existing as PlanarEntry | undefined
  const { mods, reports } = await inferSetPieces(data.name, raw, ["2pc"], { "2pc": prev?.["2pc"] }, opts)

  const entry: PlanarEntry = { "2pc": mods["2pc"] ?? prev?.["2pc"] ?? {} }
  return {
    entry,
    // planar icons aren't on the same CDN path as relics, so they stay manual
    iconUrl: "",
    report: reports.length ? reports.join("\n\n") : undefined,
  }
}

// ------------------------------- kind registry -------------------------------

export const HANDLERS: Record<ItemKind, {
  jsonFile: string
  iconSubfolder: string
  transform: (raw: unknown, existing: object | undefined, opts: TransformOptions) => Promise<TransformResult>
}> = {
  character: { jsonFile: "characterData.json", iconSubfolder: "characters",  transform: transformCharacter },
  lightcone: { jsonFile: "lightconeData.json", iconSubfolder: "light-cones", transform: transformLightcone },
  relic:     { jsonFile: "relicData.json",     iconSubfolder: "relic-sets",  transform: transformRelic },
  planar:    { jsonFile: "planarData.json",    iconSubfolder: "planar-sets", transform: transformPlanar },
}
