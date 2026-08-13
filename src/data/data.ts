import { StatSet, type StatModifier } from "../types/stats"
import type { Substat } from "./substats"

import characterData from "./characterData.json"
import lightconeData from "./lightconeData.json"
import relicData from "./relicData.json"

interface StatMod {
  base?: Partial<Record<Substat, number>>,
  flat?: Partial<Record<Substat, number>>,
  percent?: Partial<Record<Substat, number>>,
}

// -------------------------------- PATH DATA ---------------------------------

export const PATHS = [
  "Preservation",
  "Hunt",
  "Erudition",
  "Nihility",
  "Harmony",
  "Destruction",
  "Abundance",
  "Remembrance",
  "Elation",
] as const

export type Path = typeof PATHS[number]

// ------------------------------ CHARACTER DATA ------------------------------

export const CHARACTERS = Object.keys(characterData)
export type Character = keyof typeof characterData

interface CharData {
  path: string,
  stats: StatMod
}

const charData = characterData satisfies Record<Character, CharData> as Record<Character, CharData>

export const CHARACTER_DATA: Record<Character, StatModifier> = Object.fromEntries(
  Object.entries(charData).map(([name, data]) => [name, {
    base: new StatSet(data.stats.base),
    percent: data.stats.percent && new StatSet(data.stats.percent),
    flat: data.stats.flat && new StatSet(data.stats.flat),
  }])
) as Record<Character, StatModifier>

export const CHARACTER_PATH: Record<Character, Path> = Object.fromEntries(
  Object.entries(charData).map(([name, data]) => [name, data.path])
) as Record<Character, Path>

// --------------------------------- LC DATA ----------------------------------

export const SUPERIMPOSITION_LEVELS = ['S1', 'S2', 'S3', 'S4', 'S5']

export const LIGHT_CONES = Object.keys(lightconeData)
export type LightCone = keyof typeof lightconeData

interface LCData {
  path: string,
  baseStats: Partial<Record<Substat, number>>,
  pathStats: StatMod[],
}

const lcData = lightconeData satisfies Record<LightCone, LCData> as Record<LightCone, LCData>

export const LIGHT_CONE_BASE_STATS: Record<LightCone, StatModifier> = Object.fromEntries(
  Object.entries(lcData).map(([name, data]) => [name, {
    base: new StatSet(data.baseStats)
  }])
) as Record<LightCone, StatModifier>

export const LIGHT_CONE_PATH_STATS: Record<LightCone, Array<StatModifier>> = Object.fromEntries(
  Object.entries(lcData).map(([name, data]) => [name, data.pathStats.map((statmod) => {
    return {
      base: statmod.base && new StatSet(statmod.base),
      percent: statmod.percent && new StatSet(statmod.percent),
      flat: statmod.flat && new StatSet(statmod.flat),
    }
  })])
) as Record<LightCone, Array<StatModifier>>

export const LIGHT_CONE_PATH: Record<LightCone, Path> = Object.fromEntries(
  Object.entries(lcData).map(([name, data]) => [name, data.path])
) as Record<LightCone, Path>

// -------------------------------- RELIC DATA --------------------------------

export const RELIC_SETS = Object.keys(relicData)
export type RelicSet = keyof typeof relicData

interface RelicData {
  "2pc": StatMod,
  "4pc": StatMod,
}

const setData = relicData satisfies Record<RelicSet, RelicData> as Record<RelicSet, RelicData>

export const RELIC_SET_DATA: Record<RelicSet, StatModifier> = Object.fromEntries(
  Object.entries(setData).map(([name, data]) => [name, {
    base: data["2pc"].base && new StatSet(data["2pc"].base),
    percent: data["2pc"].percent && new StatSet(data["2pc"].percent),
    flat: data["2pc"].flat && new StatSet(data["2pc"].flat),
  }])
) as Record<RelicSet, StatModifier>

export const RELIC_SET_4PC_DATA: Record<RelicSet, StatModifier> = Object.fromEntries(
  Object.entries(setData).map(([name, data]) => [name, {
    base: data["4pc"].base && new StatSet(data["4pc"].base),
    percent: data["4pc"].percent && new StatSet(data["4pc"].percent),
    flat: data["4pc"].flat && new StatSet(data["4pc"].flat),
  }])
) as Record<RelicSet, StatModifier>
