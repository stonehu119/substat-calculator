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

export const SUBSTAT_VALUES: Record<Substat, number> = {
  "HP" : 0.03888,
  "ATK" : 0.03888,
  "DEF" : 0.0486,
  "SPD" : 2.3,
  "Crit Rate" : 2.916,
  "Crit DMG" : 5.832,
  "Break Effect" : 5.832,
  "Effect Hit Rate" : 3.888,
  "Effect RES" : 3.888,
}
