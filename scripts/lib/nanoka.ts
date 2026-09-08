/**
 * Access to nanoka's static data: version discovery, the per-kind indexes, locating an item
 * by display name, and discovering what changed in the current version.
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

/** The index files, which are also the keys used under the manifest's `new` object. */
export type IndexKind = "character" | "lightcone" | "relicset"
const INDEX_KINDS: readonly IndexKind[] = ["character", "lightcone", "relicset"]

/** One row of a kind's index file: the display name plus enough to classify it. */
export interface IndexEntry {
  en: string
  icon?: string
  set?: Record<string, unknown>
}

/** An item located in the source, ready to fetch. */
export interface ItemRef {
  kind: ItemKind
  id: string
  /** The `en` name, which is also the key used in our JSON data files. */
  name: string
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status} for ${url}`)
  return res.json()
}

// The manifest and indexes are hit repeatedly (once per name, plus discovery), so cache them
// for the life of the process. A failed fetch is evicted so a retry can still succeed.
function memo<T>(cache: Map<string, Promise<T>>, key: string, load: () => Promise<T>): Promise<T> {
  let pending = cache.get(key)
  if (!pending) {
    pending = load().catch(err => { cache.delete(key); throw err })
    cache.set(key, pending)
  }
  return pending
}

const manifestCache = new Map<string, Promise<any>>()
const indexCache = new Map<string, Promise<Record<string, IndexEntry>>>()

export function fetchManifest(): Promise<any> {
  return memo(manifestCache, "manifest", () => fetchJson(`${SOURCE_ROOT}/manifest.json`))
}

export async function fetchLatestVersion(): Promise<string> {
  return (await fetchManifest()).hsr.latest
}

export function fetchIndex(version: string, kind: IndexKind): Promise<Record<string, IndexEntry>> {
  return memo(indexCache, `${version}/${kind}`, () => fetchJson(`${SOURCE_ROOT}/hsr/${version}/${kind}.json`))
}

export function fetchItem(version: string, kind: ItemKind, id: string): Promise<unknown> {
  return fetchJson(`${SOURCE_ROOT}/hsr/${version}/en/${SOURCE_FOLDER[kind]}/${id}.json`)
}

export function relicIconUrl(icon: string): string {
  const iconId = icon.split("/").pop()!.split(".")[0]
  return `${SOURCE_ROOT}/assets/hsr/itemfigures/${iconId}.webp`
}

/** Relic sets define a 4-piece bonus; planar ornaments only a 2-piece one. */
function setKind(entry: IndexEntry): ItemKind {
  return entry.set?.["4"] ? "relic" : "planar"
}

/**
 * A few source names can't be used as data keys: the Trailblazer variants are all the
 * placeholder "{NICKNAME}", and some carry leftover markup ("Silver Wolf LV.<unbreak>999</unbreak>").
 * Rather than guess a key, we skip them and say so.
 */
function isUsableName(name: string): boolean {
  return !!name && !/[<>{}]/.test(name)
}

/**
 * Finds the item whose `en` name matches, searching characters, then light cones, then
 * relic/planar sets.
 *
 * Note this returns the FIRST match. A handful of names are ambiguous in the source — both
 * March 7ths are literally named "March 7th" — so those resolve to whichever the index
 * lists first.
 */
export async function locateByName(name: string, version: string): Promise<ItemRef> {
  const [chars, lightcones, relics] = await Promise.all(INDEX_KINDS.map(k => fetchIndex(version, k)))

  for (const [id, entry] of Object.entries(chars)) {
    if (entry.en === name) return { kind: "character", id, name }
  }
  for (const [id, entry] of Object.entries(lightcones)) {
    if (entry.en === name) return { kind: "lightcone", id, name }
  }
  for (const [id, entry] of Object.entries(relics)) {
    if (entry.en === name) return { kind: setKind(entry), id, name }
  }

  throw new Error(`"${name}" did not match any character, lightcone, or relic/planar set`)
}

/**
 * The items the manifest flags as new or changed in the current version.
 *
 * `hsr.new` lists source ids per kind; monsters and items are in there too but aren't part of
 * this data set. Ids are resolved through the indexes to get the names our JSON files key on.
 */
export async function discoverNew(version: string): Promise<ItemRef[]> {
  const changed = (await fetchManifest()).hsr?.new ?? {}
  const refs: ItemRef[] = []

  for (const indexKind of INDEX_KINDS) {
    const ids: unknown[] = changed[indexKind] ?? []
    if (ids.length === 0) continue
    const index = await fetchIndex(version, indexKind)

    for (const rawId of ids) {
      const id = String(rawId)
      const entry = index[id]
      if (!entry) {
        console.warn(`  skipping ${indexKind} ${id}: listed as new but missing from the index`)
        continue
      }
      if (!isUsableName(entry.en)) {
        console.warn(`  skipping ${indexKind} ${id}: name ${JSON.stringify(entry.en)} can't be used as a data key — add it by hand`)
        continue
      }
      refs.push({ kind: indexKind === "relicset" ? setKind(entry) : indexKind, id, name: entry.en })
    }
  }
  return refs
}
