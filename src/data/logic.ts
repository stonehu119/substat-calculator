import { StatSet, type StatModifier, } from "../types/stats";



// Given an array of stat modifiers, combine them
// to output the final stat values 
export function combineStatModifiers(modList: Array<StatModifier>): StatSet {
  const base = new StatSet
  const flat = new StatSet
  const percent = new StatSet
  for (const mod of modList) {
    base.add(mod.base)
    flat.add(mod.flat)
    percent.add(mod.percent)
  }
  base.multiply(percent)
  base.add(flat)
  return base
}
