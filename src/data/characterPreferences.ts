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
  "Cyrene": {
    lightCones: ["This Love, Forever", "Memory's Curtain Never Falls", "Long May Rainbows Adorn the Sky"],
    relicSets: ["World-Remaking Deliverer", "Eagle of Twilight Line", "Messenger Traversing Hackerspace"],
    planarSets: ["Amphoreus, The Eternal Land", "Lushaka, the Sunken Seas", "Sprightly Vonwacq"],
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
  "Dan Heng PT": {
    lightCones: ["Though Worlds Apart", "Moment of Victory", "Day One of My New Life"],
    relicSets: ["Self-Enshrouded Recluse"],
    planarSets: ["Lushaka, the Sunken Seas", "City of Converging Stars"]
  },
  "Cerydra": {
    lightCones: ["Epoch Etched in Golden Blood", "Dance! Dance! Dance!"],
    relicSets: ["Eagle of Twilight Line", "Sacerdos' Relived Ordeal"],
    planarSets: ["Lushaka, the Sunken Seas", "Sprightly Vonwacq", "City of Converging Stars"]
  },
  "Hysilens": {
    lightCones: ["Why Does the Ocean Sing"],
    relicSets: ["Prisoner in Deep Confinement"],
    planarSets: ["Revelry by the Sea"],
  },
  "Saber": {
    lightCones: ["A Thankless Coronation", "On the Fall of an Aeon"],
    relicSets: ["Wavestrider Captain"],
  },
  "Phainon": {
    lightCones: ["Thus Burns the Dawn", "On the Fall of an Aeon"],
    relicSets: ["Wavestrider Captain", "Genius of Brilliant Stars"],
    planarSets: ["Arcadia of Woven Dreams", "Rutilant Arena"],
  },
  "Cipher": {
    lightCones: ["Lies Dance on the Breeze", "Resolution Shines As Pearls of Sweat"],
    relicSets: ["Divine-Querying Master Smith"],
    planarSets: ["City of Converging Stars", "Lushaka, the Sunken Seas"],
  },
  "Hyacine": {
    lightCones: ["Long May Rainbows Adorn the Sky", "Memory's Curtain Never Falls", "The Story's Next Page"],
    relicSets: ["Warrior Goddess of Sun and Thunder", "World-Remaking Deliverer"],
    planarSets: ["Amphoreus, The Eternal Land", "Giant Tree of Rapt Brooding", "City of Converging Stars"]
  },
  "Castorice": {
    lightCones: ["Make Farewells More Beautiful", "The Flower Remembers"],
    relicSets: ["Poet of Mourning Collapse", "World-Remaking Deliverer"],
    planarSets: ["Bone Collection's Serene Demesne"],
  },
  "Mydei": {
    lightCones: ["Flame of Blood, Blaze My Path", "Ninja Record: Sound Hunt", "Flames Afar"],
  },
  "Tribbie": {
    lightCones: ["If Time Were a Flower", "Dance! Dance! Dance!"],
    relicSets: ["Eagle of Twilight Line", "Poet of Mourning Collapse", "Genius of Brilliant Stars"],
    planarSets: ["Sprightly Vonwacq", "Bone Collection's Serene Demesne"]
  },
  "The Herta": {
    lightCones: ["Into the Unreachable Veil", "Night on the Milky Way", "Today Is Another Peaceful Day"],
    relicSets: ["Scholar Lost in Erudition", "Poet of Mourning Collapse"],
    planarSets: ["Izumo Gensei and Takama Divine Realm", "Rutilant Arena"],
  },
  "Fugue": {
    lightCones: ["Long Road Leads Home", "Resolution Shines As Pearls of Sweat", "Never Forget Her Flame"],
    relicSets: ["Eagle of Twilight Line", "Iron Cavalry Against the Scourge"],
    planarSets: ["Lushaka, the Sunken Seas", "Sprightly Vonwacq", "Forge of the Kalpagni Lantern"]
  },
  "Sunday": {
    lightCones: ["A Grounded Ascent", "But the Battle Isn't Over", "Dance! Dance! Dance!"],
    relicSets: ["Sacerdos' Relived Ordeal", "Eagle of Twilight Line"],
    planarSets: ["Lushaka, the Sunken Seas", "Sprightly Vonwacq"],
  },
  "Rappa": {
    lightCones: ["Ninjutsu Inscription: Dazzling Evilbreaker", "After the Charmony Fall"],
    relicSets: ["Iron Cavalry Against the Scourge"],
    planarSets: ["Talia: Kingdom of Banditry", "Forge of the Kalpagni Lantern"],
  },
  "Lingsha": {
    lightCones: ["Scent Alone Stays True", "Echoes of the Coffin", "Dream's Montage"],
    relicSets: ["Eagle of Twilight Line", "Iron Cavalry Against the Scourge"],
    planarSets: ["Lushaka, the Sunken Seas", "Sprightly Vonwacq", "Forge of the Kalpagni Lantern"],
  },
  "Feixiao": {
    lightCones: ["I Venture Forth to Hunt", "Cruising in the Stellar Sea"],
    relicSets: ["Eagle of Twilight Line", "The Wind-Soaring Valorous"],
    planarSets: ["Duran, Dynasty of Running Wolves"],
  },
  "Firefly": {
    lightCones: ["Whereabouts Should Dreams Rest", "On the Fall of an Aeon", "Thus Burns the Dawn"],
    relicSets: ["Iron Cavalry Against the Scourge"],
    planarSets: ["Forge of the Kalpagni Lantern"],
  },
  "Harmony MC": {
    lightCones: ["In Pursuit of the Wind", "Dance! Dance! Dance!"],
    relicSets: ["Watchmaker, Master of Dream Machinations", "Eagle of Twilight Line", "Messenger Traversing Hackerspace"],
    planarSets: ["Sprightly Vonwacq", "Lushaka, the Sunken Seas", "Forge of the Kalpagni Lantern"],
  },
  "Robin": {
    lightCones: ["Flowing Nightglow", "But the Battle Isn't Over", "For Tomorrow's Journey"],
    planarSets: ["Sprightly Vonwacq", "Lushaka, the Sunken Seas"],
  },
  "Sparkle": {
    lightCones: ["Earthly Escapade", "Dance! Dance! Dance!", "But the Battle Isn't Over"],
    relicSets: ["Eagle of Twilight Line", "Sacerdos' Relived Ordeal"],
    planarSets: ["Lushaka, the Sunken Seas", "Sprightly Vonwacq"]
  },
  "Ruan Mei": {
    lightCones: ["In Pursuit of the Wind", "Dance! Dance! Dance!", "Meshing Cogs"],
    relicSets: ["Watchmaker, Master of Dream Machinations", "Eagle of Twilight Line"],
    planarSets: ["Lushaka, the Sunken Seas", "Sprightly Vonwacq"],
  },
}
