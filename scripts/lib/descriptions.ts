/**
 * Turns nanoka's raw effect descriptions into the annotated text the model reads.
 *
 * Descriptions carry Unity rich-text markup (<color=...>, <unbreak>, ...) plus #N[fmt]
 * placeholders indexing into a param_list — `#1[i]` is param_list[0]. A `%` directly after a
 * placeholder means the stored value is a ratio needing a x100 scale (0.48 -> "48%"); without
 * one the value is used as-is (3 -> "3" turns).
 *
 * Each placeholder renders as `[#N: v1/v2/...]`, keyed by the index the model cites back in
 * `paramIndex`. Light cones have five values per tag (one per superimposition level); relic
 * sets have no superimpositions, which is simply the one-level case.
 */

export interface ParsedDescription {
  /** Markup-free text with every placeholder replaced by its `[#N: ...]` tag. */
  text: string
  /** 1-based indices of params whose placeholder carried a `%` (i.e. stored as ratios). */
  percentParams: Set<number>
}

/** The [i]/[f1] format tags are deliberately ignored — rounding 0.275 to "28%" would
 *  corrupt a real 27.5% value. toFixed guards float artifacts (0.275 * 100 = 27.500000000000004). */
function formatParam(value: number, percent: string): string {
  return `${Number((percent ? value * 100 : value).toFixed(4))}${percent}`
}

export function parseDescription(desc: string, paramsByLevel: number[][]): ParsedDescription {
  const percentParams = new Set<number>()
  const text = desc
    .replace(/\\n/g, "\n") // source stores line breaks as a literal backslash-n, not a real newline
    .replace(/<[^>]*>/g, "")
    .replace(/#(\d+)\[[^\]]*\](%?)/g, (placeholder, index: string, percent: string) => {
      const values = paramsByLevel.map(params => params[Number(index) - 1])
      if (values.some(v => v === undefined)) return placeholder // leave unresolved refs visible
      if (percent) percentParams.add(Number(index))
      const rendered = values.map(v => formatParam(v, percent))
      // collapse when every level shares a value (turn counts, Energy, stack caps)
      const distinct = [...new Set(rendered)]
      return `[#${index}: ${(distinct.length === 1 ? distinct : rendered).join("/")}]`
    })
    .replace(/[ \t]+/g, " ")
    .trim()
  return { text, percentParams }
}

/** One effect description, plus the per-level params its `[#N: ...]` tags refer to. */
export interface EffectSource extends ParsedDescription {
  /** How this effect is labelled in output — a passive name, or "2pc"/"4pc". */
  effectName: string
  paramsByLevel: number[][]
}

export function lightconeEffectSource(raw: unknown): EffectSource {
  // NB: refinements.name is the *passive* name ("Ink Splash"), not the light cone's.
  const { name, desc, level } = (raw as any).refinements
  const paramsByLevel: number[][] = Object.keys(level)
    .sort((a, b) => Number(a) - Number(b))
    .map(key => level[key].param_list)
  return { effectName: name, paramsByLevel, ...parseDescription(desc, paramsByLevel) }
}

export type SetPiece = "2pc" | "4pc"

/**
 * The 2-piece and (for relics) 4-piece bonuses. A set bonus has one param_list rather than
 * one per level, so it goes in as a single "level".
 */
export function relicEffectSources(raw: unknown): Partial<Record<SetPiece, EffectSource>> {
  const requirements = (raw as any).require_num ?? {}
  const sources: Partial<Record<SetPiece, EffectSource>> = {}
  for (const [count, piece] of [["2", "2pc"], ["4", "4pc"]] as const) {
    const effect = requirements[count]
    if (!effect?.desc) continue
    const paramsByLevel = [effect.param_list ?? []]
    sources[piece] = { effectName: piece, paramsByLevel, ...parseDescription(effect.desc, paramsByLevel) }
  }
  return sources
}
