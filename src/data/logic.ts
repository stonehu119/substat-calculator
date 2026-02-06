import type { FormState } from "../types/formState";
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

// collect all stat modifiers
export function createStatModList(formState: FormState): Array<StatModifier> {
  const out: Array<StatModifier> = []
  const baseCrit: StatModifier = { flat: new StatSet({"Crit Rate": 5, "Crit DMG": 50}) }
  try {
    out.push(baseCrit)
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
export function combineStatModifiers(modList: Array<StatModifier>): StatSet {
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
    percentsAdjusted.multiply(mod.default)
    percent.add(percentsAdjusted)
    percent.addCommonStat(defaultsAdjusted)
  }
  base.multiply(percent)
  base.add(flat)
  return base
}
