import { StatSet, type StatModifier } from "../types/stats"
import type { Substat } from "./substats"

import characterData from "./characterData.json"
import lightconeData from "./lightconeData.json"


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
  stats: {
    base: Partial<Record<Substat, number>>,
    percent?: Partial<Record<Substat, number>>,
    flat?: Partial<Record<Substat, number>>,
  }
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
  Object.entries(characterData).map(([name, data]) => [name, data.path])
) as Record<Character, Path>

// --------------------------------- LC DATA ----------------------------------

export const SUPERIMPOSITION_LEVELS = ['S1', 'S2', 'S3', 'S4', 'S5']

export const LIGHT_CONES = Object.keys(lightconeData)
export type LightCone = keyof typeof lightconeData

export const LIGHT_CONE_BASE_STATS: Record<LightCone, StatModifier> = Object.fromEntries(
  Object.entries(lightconeData).map(([name, data]) => [name, {
    base: new StatSet(data.baseStats)
  }])
) as Record<LightCone, StatModifier>

interface PathStatMod {
  base?: Partial<Record<Substat, number>>,
  flat?: Partial<Record<Substat, number>>,
  percent?: Partial<Record<Substat, number>>,
}

interface LCData {
  path: string,
  baseStats: Partial<Record<Substat, number>>,
  pathStats: PathStatMod[],
}

const lcData = lightconeData satisfies Record<LightCone, LCData> as Record<LightCone, LCData>

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
  Object.entries(lightconeData).map(([name, data]) => [name, data.path])
) as Record<LightCone, Path>
