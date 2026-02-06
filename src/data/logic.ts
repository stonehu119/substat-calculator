import { StatSet, type StatModifier, } from "../types/stats";

const PERCENT_MULITPLIER = new StatSet({}, 0.01)

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
    mod.percent?.multiply(PERCENT_MULITPLIER) // adjust percents
    mod.default?.multiply(PERCENT_MULITPLIER) // adjust percents
    percent.add(mod.percent)
    percent.addCommonStat(mod.default)
  }
  base.multiply(percent)
  base.add(flat)
  return base
}
