export const STAT_NAMES = [
  'HP',
  'ATK',
  'DEF',
  'SPD',
  'Crit Rate',
  'Crit DMG',
  'Break Effect',
  'Effect Hit Rate',
  'Effect RES',
] as const

export type Substat = typeof STAT_NAMES[number]

export const statIds: Record<Substat, number> = {
  'HP' : 0,
  'ATK' : 1,
  'DEF' : 2,
  'SPD' : 3,
  'Crit Rate' : 4,
  'Crit DMG' : 5,
  'Break Effect' : 6,
  'Effect Hit Rate' : 7,
  'Effect RES' : 8,
} as const

const COMMON_STATS = [
  'HP',
  'ATK',
  'DEF',
]
const SPECIAL_STATS = [
  'SPD',
  'Crit Rate',
  'Crit DMG',
  'Break Effect',
  'Effect Hit Rate',
  'Effect RES',
]

export class StatSet {
  stats: Record<Substat, number>

  constructor(initialValues?: Partial<Record<Substat, number>>, fillValue?: number) {
    fillValue = fillValue ?? 0
    this.stats = Object.fromEntries(
      STAT_NAMES.map(k => [k, fillValue] as const)
    ) as Record<Substat, number>
    for (const stat in initialValues) {
      this.stats[stat as Substat] = initialValues[stat as Substat] ?? this.stats[stat as Substat]
    }
  }

  add(other?: StatSet): void {
    if (!other) return
    for (const stat in this.stats) {
      this.stats[stat as Substat] += other.stats[stat as Substat]
    }
  }

  // special case for convenience. Try not to use
  addCommonStat(other?: StatSet): void {
    if (!other) return
    for (const stat in this.stats) {
      if (COMMON_STATS.includes(stat)) this.stats[stat as Substat] += other.stats[stat as Substat]
    }
  }

  // special case for convenience. Try not to use
  addSpecialStat(other?: StatSet): void {
    if (!other) return
    for (const stat in this.stats) {
      if (SPECIAL_STATS.includes(stat)) this.stats[stat as Substat] += other.stats[stat as Substat]
    }
  }

  multiply(other?: StatSet): void {
    if (!other) return
    for (const stat in this.stats) {
      this.stats[stat as Substat] *= other.stats[stat as Substat]
    }
  }

  convertFormat(): Record<number, number> {
    const out: Record<number, number> = {}
    for (const stat in this.stats) {
      const key = statIds[stat as Substat]
      out[key] = this.stats[stat as Substat]
    }
    return out
  }
}

export interface StatModifier {
  base?: StatSet,
  percent?: StatSet,
  flat?: StatSet,
  default?: StatSet, // assumes HP, ATK, and DEF are % stats, others are flat stats. Try not to use
}
