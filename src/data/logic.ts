import type { FormState, StatState } from "../types/formState";
import { StatSet, type StatModifier, } from "../types/stats";
import { CHARACTER_DATA, type Character } from "./characters";
import { LIGHT_CONE_BASE_STATS, type LightCone } from "./lightcones";
import { 
  MAIN_STAT_VALUES,
  PLANAR_SET_DATA,
  RELIC_SET_DATA,
  type BodyMainStat,
  type FeetMainStat,
  type OrbMainStat,
  type PlanarSet,
  type RelicSet,
  type RopeMainStat
} from "./relics";
import { STAT_NAMES, SUBSTAT_VALUES } from "./substats";

// collect all stat modifiers
function createStatModList(formState: FormState): Array<StatModifier> {
  const out: Array<StatModifier> = []
  const defaultStats: StatModifier = { flat: new StatSet({"HP": 705.6, "ATK": 352.8, "Crit Rate": 5, "Crit DMG": 50}) }
  try {
    out.push(defaultStats)
    out.push(CHARACTER_DATA[formState.character as Character])
    out.push(LIGHT_CONE_BASE_STATS[formState.lightCone as LightCone])
    // Light cone path stats need to be added here
    out.push(RELIC_SET_DATA[formState.relicSet as RelicSet])
    out.push(PLANAR_SET_DATA[formState.planarSet as PlanarSet])
    out.push(MAIN_STAT_VALUES[formState.relicBody as BodyMainStat])
    out.push(MAIN_STAT_VALUES[formState.relicFeet as FeetMainStat])
    out.push(MAIN_STAT_VALUES[formState.relicOrb as OrbMainStat])
    out.push(MAIN_STAT_VALUES[formState.relicRope as RopeMainStat])
  } catch {
    console.error("Form inputs are invalid")
  }
  return out
}

// Given an array of stat modifiers, combine them
// to output the final stat values
function combineStatModifiers(modList: Array<StatModifier>): StatModifier {
  const base = new StatSet
  const flat = new StatSet
  const percent = new StatSet({}, 1)
  for (const mod of modList) {
    base.add(mod.base)
    flat.add(mod.flat)
    flat.addSpecialStat(mod.default)
    const percentsAdjusted = new StatSet({}, 0.01) // adjust to represent percentage values
    const defaultsAdjusted = new StatSet({}, 0.01)
    percentsAdjusted.multiply(mod.percent)
    defaultsAdjusted.multiply(mod.default)
    percent.add(percentsAdjusted)
    percent.addCommonStat(defaultsAdjusted)
  }
  return { base: base, flat: flat, percent: percent }
}

function calculateStatsNoSubs(statData: StatModifier): StatSet {
  const out = new StatSet
  out.add(statData.base)
  out.multiply(statData.percent)
  out.add(statData.flat)
  return out
}

function calculateRollCount(statData: StatModifier, inputStats: Record<number, StatState>): StatSet {
  const baseStats = statData.base
  const statsNoSubs = calculateStatsNoSubs(statData)
  const finalStats = new StatSet
  for (const statId in inputStats) {
    const statName = STAT_NAMES[statId]
    finalStats.stats[statName] = inputStats[statId].checked ? +inputStats[statId].value : statsNoSubs.stats[statName]
  }
  finalStats.subtract(statsNoSubs)
  finalStats.divide(new StatSet(SUBSTAT_VALUES))
  finalStats.divideCommonStat(baseStats)
  return finalStats
}

export function inputFormToRollCount(formState: FormState): StatSet {
  const modList = createStatModList(formState)
  const combinedStats = combineStatModifiers(modList)
  return calculateRollCount(combinedStats, formState.stats)
}

export function countTotalRolls(rollCounts: StatSet) {
  const mid = rollCounts.sum()
  let low = rollCounts.sum("SPD")
  let high = rollCounts.sum("SPD")

  low = low * 9 / 8
  high = high * 9 / 10

  low += rollCounts.stats["SPD"] / 0.86956521739
  high += rollCounts.stats["SPD"] / 1.13043478261
  return [low, mid, high]
}
