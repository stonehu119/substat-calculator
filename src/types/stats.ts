export const statNames = [
  'HP',
  'ATK',
  'DEF',
  'SPD',
  'Crit Rate',
  'Crit DMG',
  'Break Effect',
  'Effect Hit Rate',
  'Effect Res',
] as const

export type Substat = typeof statNames[number]

export const statIds: Record<Substat, number> = {
  'HP' : 0,
  'ATK' : 1,
  'DEF' : 2,
  'SPD' : 3,
  'Crit Rate' : 4,
  'Crit DMG' : 5,
  'Break Effect' : 6,
  'Effect Hit Rate' : 7,
  'Effect Res' : 8,
} as const

export class StatSet {
  stats: Record<Substat, number> = Object.fromEntries(
    statNames.map(k => [k, 0] as const)
  ) as Record<Substat, number>

  add(other?: StatSet): void {
    if (!other) return
    for (const stat in this.stats) {
      this.stats[stat as Substat] += other.stats[stat as Substat]
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
}
