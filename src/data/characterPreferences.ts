import type { Character } from './characters'
import type { LightCone } from './lightcones'
import type { PlanarSet, RelicSet } from './relics'

export interface CharacterPreferences {
  lightCones?: readonly LightCone[]
  relicSets?: readonly RelicSet[]
  planarSets?: readonly PlanarSet[]
}

export const CHARACTER_PREFERENCES: Partial<Record<Character, CharacterPreferences>> = {
  // Populate entries here, e.g.:
  // "Feixiao": {
  //   lightCones: ["The Hunt Begins"],
  //   relicSets: ["The Wind-Soaring Valorous"],
  //   planarSets: ["Space Sealing Station"],
  // },
}
