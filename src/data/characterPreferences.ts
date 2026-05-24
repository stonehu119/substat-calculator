import type { Character } from './characters'
import type { LightCone } from './lightcones'
import type { PlanarSet, RelicSet } from './relics'

export interface CharacterPreferences {
  lightCones?: readonly LightCone[]
  relicSets?: readonly RelicSet[]
  planarSets?: readonly PlanarSet[]
}

export const CHARACTER_PREFERENCES: Partial<Record<Character, CharacterPreferences>> = {
  "Cyrene": {
    lightCones: ["This Love, Forever", "Memory's Curtain Never Falls", "Long May Rainbows Adorn the Sky"],
    relicSets: ["World-Remaking Deliverer", "Messenger Traversing Hackerspace"],
    planarSets: ["Amphoreus, The Eternal Land", "Lushaka, the Sunken Seas", "Penacony, Land of the Dreams"],
  },
}
