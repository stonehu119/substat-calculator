/**
 * Access to nanoka's static data: version discovery, the per-kind indexes, and resolving
 * a display name to the raw payload for one item.
 */

import type { ItemKind } from "./types"

const SOURCE_ROOT = "https://static.nanoka.cc"

/** Folder each kind's per-item JSON lives under, relative to the version root. */
const SOURCE_FOLDER: Record<ItemKind, string> = {
  character: "character",
  lightcone: "lightcone",
  relic: "relicset",
  planar: "relicset",
}

/** One row of a kind's index file: the display name plus enough to classify it. */
export interface IndexEntry {
  en: string
  icon?: string
  set?: Record<string, unknown>
}

export async function fetchLatestVersion(): Promise<string> {
  const res = await fetch(`${SOURCE_ROOT}/manifest.json`)
  if (!res.ok) throw new Error(`Manifest fetch failed: HTTP ${res.status}`)
  return (await res.json() as any).hsr.latest
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status} for ${url}`)
  return res.json()
}

/** The index for one kind, keyed by the source's own id. */
export function fetchIndex(version: string, kind: "character" | "lightcone" | "relicset"): Promise<Record<string, IndexEntry>> {
  return fetchJson(`${SOURCE_ROOT}/hsr/${version}/${kind}.json`)
}

export function fetchItem(version: string, kind: ItemKind, id: string): Promise<unknown> {
  return fetchJson(`${SOURCE_ROOT}/hsr/${version}/en/${SOURCE_FOLDER[kind]}/${id}.json`)
}

export function relicIconUrl(icon: string): string {
  const iconId = icon.split("/").pop()!.split(".")[0]
  return `${SOURCE_ROOT}/assets/hsr/itemfigures/${iconId}.webp`
}

export interface ResolvedItem {
  kind: ItemKind
  raw: unknown
}

/**
 * Finds the item whose `en` name matches, searching characters, then light cones, then
 * relic/planar sets.
 *
 * Note this returns the FIRST match. A handful of names are ambiguous in the source — both
 * March 7ths are literally named "March 7th" — so those resolve to whichever the index
 * lists first. Relic/planar is decided by whether the set defines a 4-piece bonus.
 */
export async function resolveItem(name: string, version: string): Promise<ResolvedItem> {
  const [chars, lightcones, relics] = await Promise.all([
    fetchIndex(version, "character"),
    fetchIndex(version, "lightcone"),
    fetchIndex(version, "relicset"),
  ])

  for (const [id, entry] of Object.entries(chars)) {
    if (entry.en === name) return { kind: "character", raw: await fetchItem(version, "character", id) }
  }
  for (const [id, entry] of Object.entries(lightcones)) {
    if (entry.en === name) return { kind: "lightcone", raw: await fetchItem(version, "lightcone", id) }
  }
  for (const [id, entry] of Object.entries(relics)) {
    if (entry.en === name) {
      const kind: ItemKind = entry.set?.["4"] ? "relic" : "planar"
      return { kind, raw: await fetchItem(version, kind, id) }
    }
  }

  throw new Error(`"${name}" did not match any character, lightcone, or relic/planar set`)
}