import { StatSet, type StatModifier } from "../types/stats"
import characterData from "./characterData.json"
import type { Substat } from "./substats"

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
