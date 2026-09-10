import type { FormState, StatState } from "../types/formState";
import { StatSet, type StatModifier, } from "../types/stats";
import {
  CHARACTER_DATA,
  CHARACTER_PATH,
  LIGHT_CONE_BASE_STATS,
  LIGHT_CONE_PATH,
  LIGHT_CONE_PATH_STATS,
  getRelicStatMod,
  MAIN_STAT_VALUES,
  NONE,
  PLANAR_SET_DATA,
  type LightCone,
  type Character,
  type BodyMainStat,
  type FeetMainStat,
  type OrbMainStat,
  type PlanarSet,
  type RopeMainStat
} from "./data";
import { STAT_NAMES, SUBSTAT_VALUES, type Substat } from "./substats";

export function characterPathMatchesLC(formState: FormState): boolean {
  try {
    const characterPath = CHARACTER_PATH[formState.character as Character]
    const lightConePath = LIGHT_CONE_PATH[formState.lightCone as LightCone]
    return characterPath == lightConePath
  } catch {
    return false
  }
}

// Stats every character shares. The game counts these as part of the character's
// base stats, so that is where the breakdown shows them.
const SHARED_CHARACTER_BASE: StatModifier = { flat: new StatSet({ "Crit Rate": 5, "Crit DMG": 50 }) }

// The head and hands relic mains are not selectable — they are always flat HP and
// flat ATK, so every build gets them.
const FIXED_RELIC_MAINS: StatModifier = { flat: new StatSet({ "HP": 705.6, "ATK": 352.8 }) }

// collect all stat modifiers
function createStatModList(formState: FormState): Array<StatModifier> {
  try {
    return buildSections(formState).mods
  } catch {
    console.error("Form inputs are invalid")
    localStorage.clear()
    return []
  }
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
  try {
    const combinedStats = combineStatModifiers(modList)
    return calculateRollCount(combinedStats, formState.stats)
  } catch {
    return new StatSet()
  }
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

// ------------------------- BREAKDOWN FOR THE DETAILS DIALOG -------------------------
// Everything below shapes the same modifiers createStatModList() feeds the maths into
// something displayable. Both go through buildSections(), so the dialog cannot drift
// from the numbers it is meant to explain.

// Stats the game shows as percentages even when they arrive as a flat modifier.
const PERCENT_STATS: readonly Substat[] = [
  'Crit Rate',
  'Crit DMG',
  'Break Effect',
  'Effect Hit Rate',
  'Effect RES',
]

export type StatUnit = 'raw' | 'pct'

export interface StatLine {
  stat: Substat
  value: number
  unit: StatUnit
}

export interface BreakdownRow {
  label: string
  lines: StatLine[]
  /** Absolute values (a base stat) render without a leading sign. */
  signed?: boolean
  /** Listed for reference but not applied to the totals. */
  inactive?: boolean
}

export type SectionKind = 'character' | 'lightCone' | 'relic' | 'planar' | 'mains'

export interface BreakdownSection {
  id: string
  kind: SectionKind
  title: string
  subtitle?: string
  /** Name to resolve an icon from, when the section has one. */
  iconKey?: string
  kicker?: string
  badge?: { text: string, tone: 'ok' | 'warn' }
  rows: BreakdownRow[]
  note?: string
  /** Nothing selected for this slot. */
  empty?: boolean
}

export interface TotalRow {
  stat: Substat
  unit: StatUnit
  /** Null when the stat has no base value to scale. */
  base: number | null
  percent: number | null
  flat: number
  /** What the stat sits at with no substat rolls at all. */
  defaultValue: number
  /** Null when the stat is unchecked in the form. */
  entered: number | null
  rolls: number | null
}

export interface Breakdown {
  sections: BreakdownSection[]
  totals: TotalRow[]
  /** Null when any roll count came out negative. */
  rolls: { low: number, mid: number, high: number } | null
  hasNegativeRoll: boolean
}

function linesFrom(set: StatSet | undefined, unit: StatUnit | 'auto'): StatLine[] {
  if (!set) return []
  return STAT_NAMES
    .filter((stat) => set.stats[stat] !== 0)
    .map((stat) => ({
      stat,
      value: set.stats[stat],
      unit: unit === 'auto' ? (PERCENT_STATS.includes(stat) ? 'pct' : 'raw') : unit,
    }))
}

function effectLines(mod: StatModifier): StatLine[] {
  return [
    ...linesFrom(mod.base, 'auto'),
    ...linesFrom(mod.percent, 'pct'),
    ...linesFrom(mod.flat, 'auto'),
  ]
}

const RELIC_SLOT_LABELS = ['Body', 'Feet', 'Sphere', 'Rope'] as const

function buildSections(formState: FormState): { sections: BreakdownSection[], mods: StatModifier[] } {
  const sections: BreakdownSection[] = []
  const mods: StatModifier[] = []

  // --- Character -----------------------------------------------------------
  const character = formState.character as Character
  const characterMod = CHARACTER_DATA[character]
  const traceLines = [
    ...linesFrom(characterMod.percent, 'pct'),
    ...linesFrom(characterMod.flat, 'auto'),
  ]
  sections.push({
    id: 'character',
    kind: 'character',
    title: character,
    subtitle: `${CHARACTER_PATH[character]} · Lv 80`,
    iconKey: character,
    kicker: 'Character',
    rows: [
      {
        label: 'Base',
        lines: [
          ...linesFrom(characterMod.base, 'auto'),
          ...linesFrom(SHARED_CHARACTER_BASE.flat, 'auto'),
        ],
      },
      ...(traceLines.length ? [{ label: 'Traces', lines: traceLines, signed: true }] : []),
    ],
  })
  mods.push(characterMod, SHARED_CHARACTER_BASE)

  // --- Light cone ----------------------------------------------------------
  const lightCone = formState.lightCone as LightCone
  const lightConeBase = LIGHT_CONE_BASE_STATS[lightCone]
  const superimposeIndex = +formState.superimposition[1] - 1
  const pathStats = LIGHT_CONE_PATH_STATS[lightCone][superimposeIndex]
  const pathMatches = characterPathMatchesLC(formState)
  const passiveLines = effectLines(pathStats)
  // Plenty of light cones have no substat-altering passive at all. Whether the
  // path matches is then beside the point, so the badge and the mismatch note
  // both drop away and the row just says there is no effect, like a relic set.
  const hasPassive = passiveLines.length > 0
  const passiveSkipped = hasPassive && !pathMatches
  sections.push({
    id: 'lightCone',
    kind: 'lightCone',
    title: lightCone,
    subtitle: `${LIGHT_CONE_PATH[lightCone]} · ${formState.superimposition}`,
    iconKey: lightCone,
    kicker: 'Light cone',
    badge: !hasPassive
      ? undefined
      : pathMatches
        ? { text: 'Path matches', tone: 'ok' }
        : { text: 'Passive skipped', tone: 'warn' },
    rows: [
      { label: 'Base', lines: linesFrom(lightConeBase.base, 'auto') },
      { label: 'Passive', lines: passiveLines, signed: true, inactive: passiveSkipped },
    ],
    note: passiveSkipped
      ? "The light cone's path does not match the character's, so its passive is not counted. Base HP, ATK and DEF still apply."
      : undefined,
  })
  mods.push(lightConeBase)
  if (pathMatches) mods.push(pathStats)

  // --- Relic sets ----------------------------------------------------------
  for (const [index, display] of [formState.relicSet1, formState.relicSet2].entries()) {
    const mod = getRelicStatMod(display)
    const isNone = display === NONE
    const pieces = display.slice(-4, -3)
    sections.push({
      id: `relicSet${index + 1}`,
      kind: 'relic',
      title: isNone ? 'No relic set' : display.slice(0, -6),
      subtitle: isNone ? `Relic set ${index + 1} is empty` : `${pieces}-piece bonus`,
      iconKey: isNone ? undefined : display.slice(0, -6),
      kicker: 'Relic set',
      rows: [{ label: 'Effect', lines: effectLines(mod), signed: true }],
      empty: isNone,
    })
    mods.push(mod)
  }

  // --- Planar set ----------------------------------------------------------
  const planarSet = formState.planarSet as PlanarSet
  const planarMod = PLANAR_SET_DATA[planarSet]
  const planarIsNone = planarSet === NONE
  sections.push({
    id: 'planarSet',
    kind: 'planar',
    title: planarIsNone ? 'No planar set' : planarSet,
    subtitle: planarIsNone ? 'Planar set is empty' : '2-piece bonus',
    iconKey: planarIsNone ? undefined : planarSet,
    kicker: 'Planar set',
    rows: [{ label: 'Effect', lines: effectLines(planarMod), signed: true }],
    empty: planarIsNone,
  })
  mods.push(planarMod)

  // --- Relic main stats ----------------------------------------------------
  const selectedMains = [
    MAIN_STAT_VALUES[formState.relicBody as BodyMainStat],
    MAIN_STAT_VALUES[formState.relicFeet as FeetMainStat],
    MAIN_STAT_VALUES[formState.relicOrb as OrbMainStat],
    MAIN_STAT_VALUES[formState.relicRope as RopeMainStat],
  ]
  sections.push({
    id: 'mains',
    kind: 'mains',
    title: 'Relic main stats',
    subtitle: 'Head, Hands, Body, Feet, Planar Sphere, Link Rope',
    kicker: 'Main stats',
    rows: [
      { label: 'Head', lines: [{ stat: 'HP' as Substat, value: 705.6, unit: 'raw' as StatUnit }], signed: true },
      { label: 'Hands', lines: [{ stat: 'ATK' as Substat, value: 352.8, unit: 'raw' as StatUnit }], signed: true },
      ...selectedMains.map((mod, i) => ({
        label: RELIC_SLOT_LABELS[i],
        lines: effectLines(mod),
        signed: true,
      })),
    ],
  })
  mods.push(FIXED_RELIC_MAINS, ...selectedMains)

  return { sections, mods }
}

export function buildBreakdown(formState: FormState): Breakdown | null {
  try {
    const { sections, mods } = buildSections(formState)
    const combined = combineStatModifiers(mods)
    const defaultStats = calculateStatsNoSubs(combined)
    const rollCounts = calculateRollCount(combined, formState.stats)

    const totals: TotalRow[] = STAT_NAMES.map((stat, id) => {
      const input = formState.stats[id]
      const checked = !!input?.checked
      const base = combined.base?.stats[stat] ?? 0
      const scales = base !== 0
      return {
        stat,
        unit: PERCENT_STATS.includes(stat) ? 'pct' as StatUnit : 'raw' as StatUnit,
        base: scales ? base : null,
        percent: scales ? (combined.percent?.stats[stat] ?? 1) : null,
        flat: combined.flat?.stats[stat] ?? 0,
        defaultValue: defaultStats.stats[stat],
        entered: checked ? +input.value : null,
        rolls: checked ? rollCounts.stats[stat] : null,
      }
    })

    const hasNegativeRoll = totals.some((row) => row.rolls !== null && row.rolls < 0)
    const [low, mid, high] = countTotalRolls(rollCounts)

    return {
      sections,
      totals,
      rolls: hasNegativeRoll ? null : { low, mid, high },
      hasNegativeRoll,
    }
  } catch {
    console.error("Form inputs are invalid")
    return null
  }
}
