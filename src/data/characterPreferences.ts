import type { Character } from './characters'
import type { LightCone } from './lightcones'
import type { PlanarSet, RelicSet } from './relics'

export interface CharacterPreferences {
  lightCones?: readonly LightCone[]
  relicSets?: readonly RelicSet[]
  planarSets?: readonly PlanarSet[]
}

export const CHARACTER_PREFERENCES: Partial<Record<Character, CharacterPreferences>> = {
  "Mortenax Blade": {
    lightCones: ["Reforged in Hellfire", "Resolution Shines As Pearls of Sweat"],
    relicSets: ["Divine-Querying Master Smith", "Eagle of Twilight Line"],
    planarSets: ["City of Converging Stars", "Lushaka, the Sunken Seas", "Sprightly Vonwacq"],
  },
  "Evanescia": {
    lightCones: ["Until the Flowers Bloom Again", "Mushy Shroomy's Adventures", "Today's Good Luck"],
    relicSets: ["Ever-Glorious Magical Girl"],
    planarSets: ["Punklorde Stage Zero"],
  },
  "Silver Wolf Lv.999": {
    lightCones: ["Welcome to the Cosmic City", "Mushy Shroomy's Adventures", "Today's Good Luck"],
    relicSets: ["Ever-Glorious Magical Girl"],
    planarSets: ["Punklorde Stage Zero"],
  },
  "Ashveil": {
    lightCones: ["The Finale of a Lie", "Cruising in the Stellar Sea"],
    relicSets: ["The Ashblazing Grand Duke", "Pioneer Diver of Dead Waters"],
    planarSets: ["City of Converging Stars", "Duran, Dynasty of Running Wolves"],
  },
  "Sparxie": {
    lightCones: ["Dazzled by a Flowery World", "Mushy Shroomy's Adventures", "Today's Good Luck"],
    relicSets: ["Ever-Glorious Magical Girl"],
    planarSets: ["Punklorde Stage Zero", "Tengoku@Livestream"],
  },
  "Yao Guang": {
    lightCones: ["When She Decided to See", "Mushy Shroomy's Adventures", "Tomorrow, Together"],
    relicSets: ["Diviner of Distant Reach"],
    planarSets: ["Lushaka, the Sunken Seas", "Sprightly Vonwacq"],
  },
  "The Dahlia": {
    lightCones: ["Never Forget Her Flame", "Resolution Shines As Pearls of Sweat", "Before the Tutorial Mission Starts"],
    relicSets: ["Iron Cavalry Against the Scourge", "Eagle of Twilight Line"],
    planarSets: ["Sprightly Vonwacq", "Lushaka, the Sunken Seas", "Forge of the Kalpagni Lantern"],
  },
  "Acheron": {
    lightCones: ["Along the Passing Shore", "Good Night and Sleep Well", "Boundless Choreo"],
    relicSets: ["Pioneer Diver of Dead Waters", "Poet of Mourning Collapse", "As Navigator Isee Sees it"],
    planarSets: ["Izumo Gensei and Takama Divine Realm"],
  },
  "Aglaea": {
    lightCones: ["Time Woven Into Gold", "Victory In a Blink", "Sweat Now, Cry Less"],
    relicSets: ["Hero of Triumphant Song"],
    planarSets: [],
  },
  "Anaxa": {
    lightCones: ["Life Should Be Cast to Flames", "The Great Cosmic Enterprise"],
    relicSets: ["Genius of Brilliant Stars", "Eagle of Twilight Line"],
    planarSets: ["Rutilant Arena"],
  },
  "Archer": {
    lightCones: ["The Hell Where Ideals Burn", "Cruising in the Stellar Sea"],
    relicSets: ["Genius of Brilliant Stars", "Wavestrider Captain"],
    planarSets: ["Tengoku@Livestream", "Rutilant Arena"],
  },
  "Evernight": {
    lightCones: ["To Evernight's Stars", "The Flower Remembers", "The Story's Next Page"],
    relicSets: ["World-Remaking Deliverer"],
    planarSets: ["Bone Collection's Serene Demesne"],
  },
}
