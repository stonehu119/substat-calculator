/**
 * Shared schema types, mirroring the interfaces in src/data/data.ts.
 *
 * These live on their own because both inference.ts and transforms.ts need them, and
 * transforms.ts imports inference.ts — putting them in either would create a cycle.
 */

import type { Path } from "../../src/data/data"
import type { Substat } from "../../src/data/substats"

export type StatMap = Partial<Record<Substat, number>>

export interface StatMod {
  base?: StatMap
  flat?: StatMap
  percent?: StatMap
}

export interface CharacterEntry {
  path: Path
  stats: StatMod
}

export interface LightconeEntry {
  path: Path
  baseStats: StatMap
  pathStats: StatMod[] // one StatMod per superimpose level
}

export interface RelicEntry {
  "2pc": StatMod
  "4pc": StatMod
}

export interface PlanarEntry {
  "2pc": StatMod
}

export type ItemKind = "character" | "lightcone" | "relic" | "planar"

export interface TransformResult {
  entry: object
  iconUrl: string
  /** Markdown for the PR body, when stats were inferred rather than copied over. */
  report?: string
}

export interface TransformOptions {
  /** Leave stats that are already filled in alone instead of re-inferring them. */
  keepExisting: boolean
}
