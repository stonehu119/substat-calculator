import { StatSet, type StatModifier } from "../types/stats"
import relicData from "./relicData.json"
import type { Substat } from "./substats"

interface StatMod {
  base?: Partial<Record<Substat, number>>,
  flat?: Partial<Record<Substat, number>>,
  percent?: Partial<Record<Substat, number>>,
}

export const NONE = "(None)"

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

export const PLANAR_SETS = [
  NONE,
  "Cosmic Life Sciences Institute",
  "Fallen Star Anchorage",
  "Punklorde Stage Zero",
  "City of Converging Stars",
  "Tengoku@Livestream",
  "Amphoreus, The Eternal Land",
  "Revelry by the Sea",
  "Arcadia of Woven Dreams",
  "Giant Tree of Rapt Brooding",
  "Bone Collection's Serene Demesne",
  "The Wondrous BananAmusement Park",
  "Lushaka, the Sunken Seas",
  "Forge of the Kalpagni Lantern",
  "Duran, Dynasty of Running Wolves",
  "Izumo Gensei and Takama Divine Realm",
  "Sigonia, the Unclaimed Desolation",
  "Penacony, Land of the Dreams",
  "Firmament Frontline: Glamoth",
  "Broken Keel",
  "Rutilant Arena",
  "Sprightly Vonwacq",
  "Talia: Kingdom of Banditry",
  "Inert Salsotto",
  "Celestial Differentiator",
  "Belobog of the Architects",
  "Pan-Cosmic Commercial Enterprise",
  "Fleet of the Ageless",
  "Space Sealing Station",
] as const

export type PlanarSet = typeof PLANAR_SETS[number]

export const PLANAR_SET_DATA: Record<PlanarSet, StatModifier> = {
  "Cosmic Life Sciences Institute": {},
  "Fallen Star Anchorage": { flat: new StatSet({"Crit Rate": 8}) },
  "Punklorde Stage Zero" : {},
  "City of Converging Stars" : {},
  "Tengoku@Livestream" : { flat: new StatSet({"Crit DMG": 16}) },
  "Amphoreus, The Eternal Land" : { flat: new StatSet({"Crit Rate": 8}) },
  "Revelry by the Sea" : { percent: new StatSet({"ATK": 12}) },
  "Arcadia of Woven Dreams" : {},
  "Giant Tree of Rapt Brooding" : { percent: new StatSet({"SPD": 6}) },
  "Bone Collection's Serene Demesne" : { percent: new StatSet({"HP": 12}) },
  "The Wondrous BananAmusement Park" : { flat: new StatSet({"Crit DMG": 16}) },
  "Lushaka, the Sunken Seas" : {},
  "Forge of the Kalpagni Lantern" : { percent: new StatSet({"SPD": 6}) },
  "Duran, Dynasty of Running Wolves" : {},
  "Izumo Gensei and Takama Divine Realm" : { percent: new StatSet({"ATK": 12}) },
  "Sigonia, the Unclaimed Desolation" : { flat: new StatSet({"Crit Rate": 4}) },
  "Penacony, Land of the Dreams" : {},
  "Firmament Frontline: Glamoth" : { percent: new StatSet({"ATK": 12}) },
  "Broken Keel" : { flat: new StatSet({"Effect RES": 10}) },
  "Rutilant Arena" : { flat: new StatSet({"Crit Rate": 8}) },
  "Sprightly Vonwacq" : {},
  "Talia: Kingdom of Banditry" : { flat: new StatSet({"Break Effect": 16}) },
  "Inert Salsotto" : { flat: new StatSet({"Crit Rate": 8}) },
  "Celestial Differentiator" : { flat: new StatSet({"Crit DMG": 16}) },
  "Belobog of the Architects" : { percent: new StatSet({"DEF": 15}) },
  "Pan-Cosmic Commercial Enterprise" : { flat: new StatSet({"Effect Hit Rate": 10}) },
  "Fleet of the Ageless" : { percent: new StatSet({"HP": 12}) },
  "Space Sealing Station" : { percent: new StatSet({"ATK": 12}) },
  "(None)" : {},
} as const

const appendText = (set: string, text: string) => set + (set == NONE ? "" : text )

export const RELIC_SETS_2PC = RELIC_SETS.map(set => appendText(set, " (2pc)"))
export const RELIC_SETS_4PC = RELIC_SETS.map(set => appendText(set, " (4pc)"))

export function getRelicStatMod(displayString: string): StatModifier {
  if (displayString == NONE) return RELIC_SET_DATA[NONE]
  if (displayString.slice(-4, -3) == '2') return RELIC_SET_DATA[displayString.slice(0, -6) as RelicSet]
  if (displayString.slice(-4, -3) == '4') return RELIC_SET_4PC_DATA[displayString.slice(0, -6) as RelicSet]
  throw new Error("Could not resolve relic set input value")
}

export const BODY_MAIN_STATS = [
  'Crit Rate',
  'Crit DMG',
  'EHR',
  'Outgoing Healing',
  'HP%',
  'ATK%',
  'DEF%',
] as const

export const FEET_MAIN_STATS = [
  'SPD',
  'HP%',
  'ATK%',
  'DEF%',
] as const

export const ORB_MAIN_STATS = [
  'DMG Bonus',
  'HP%',
  'ATK%',
  'DEF%',
] as const

export const ROPE_MAIN_STATS = [
  'HP%',
  'ATK%',
  'DEF%',
  'Break Effect',
  'Energy Regeneration Rate',
] as const

export type BodyMainStat = typeof BODY_MAIN_STATS[number]
export type FeetMainStat = typeof FEET_MAIN_STATS[number]
export type OrbMainStat = typeof ORB_MAIN_STATS[number]
export type RopeMainStat = typeof ROPE_MAIN_STATS[number]

export type MainStat = BodyMainStat | FeetMainStat | OrbMainStat | RopeMainStat

export const MAIN_STAT_VALUES: Record<MainStat, StatModifier> = {
  'HP%' : { percent: new StatSet({"HP" : 43.2}) },
  'ATK%' : { percent: new StatSet({"ATK" : 43.2}) },
  'DEF%' : { percent: new StatSet({"DEF" : 54}) },
  'SPD' : { flat: new StatSet({"SPD" : 25.0}) },
  'Crit Rate' : { flat: new StatSet({"Crit Rate" : 32.4}) },
  'Crit DMG' : { flat: new StatSet({"Crit DMG" : 64.8}) },
  'EHR' : { flat: new StatSet({"Effect Hit Rate" : 43.2}) },
  'Outgoing Healing' : {},
  'DMG Bonus' : {},
  'Break Effect' : { flat: new StatSet({"Break Effect" : 64.8}) },
  'Energy Regeneration Rate' : {},
} as const
