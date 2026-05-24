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
    lightCones: ["Reforged in Hellfire", "Good Night and Sleep Well"],
    relicSets: ["Divine-Querying Master Smith", "Prisoner in Deep Confinement"],
    planarSets: ["Inert Salsotto", "Bone Collection's Serene Demesne"],
  },
  "Evanescia": {
    lightCones: ["Until the Flowers Bloom Again", "Today's Good Luck"],
    relicSets: ["Ever-Glorious Magical Girl"],
    planarSets: ["Punklorde Stage Zero"],
  },
  "Silver Wolf Lv.999": {
    lightCones: ["Welcome to the Cosmic City", "Mushy Shroomy's Adventures"],
    relicSets: ["Ever-Glorious Magical Girl"],
    planarSets: ["Punklorde Stage Zero"],
  },
  "Ashveil": {
    lightCones: ["The Finale of a Lie", "Worrisome, Blissful"],
    relicSets: ["The Ashblazing Grand Duke"],
    planarSets: ["City of Converging Stars", "Duran, Dynasty of Running Wolves"],
  },
  "Sparxie": {
    lightCones: ["Dazzled by a Flowery World", "Mushy Shroomy's Adventures"],
    relicSets: ["Ever-Glorious Magical Girl"],
    planarSets: ["Tengoku@Livestream", "Punklorde Stage Zero"],
  },
  "Yao Guang": {
    lightCones: ["When She Decided to See", "Mushy Shroomy's Adventures"],
    relicSets: ["Diviner of Distant Reach"],
    planarSets: ["Lushaka, the Sunken Seas"],
  },
  "The Dahlia": {
    lightCones: ["Never Forget Her Flame", "Fermata"],
    relicSets: ["Iron Cavalry Against the Scourge"],
    planarSets: ["Talia: Kingdom of Banditry", "Forge of the Kalpagni Lantern"],
  },
  "Acheron": {
    lightCones: ["Along the Passing Shore", "Good Night and Sleep Well"],
    relicSets: ["Pioneer Diver of Dead Waters"],
    planarSets: ["Izumo Gensei and Takama Divine Realm", "Firmament Frontline: Glamoth"],
  },
  "Aglaea": {
    lightCones: ["Time Woven Into Gold", "Sweat Now, Cry Less"],
    relicSets: ["Hero of Triumphant Song"],
    planarSets: ["The Wondrous BananAmusement Park", "Lushaka, the Sunken Seas"],
  },
  "Anaxa": {
    lightCones: ["Life Should Be Cast to Flames", "The Great Cosmic Enterprise"],
    relicSets: ["Eagle of Twilight Line", "Genius of Brilliant Stars"],
    planarSets: ["Rutilant Arena"],
  },
  "Archer": {
    lightCones: ["The Hell Where Ideals Burn", "Cruising in the Stellar Sea"],
    relicSets: ["Genius of Brilliant Stars", "Scholar Lost in Erudition"],
    planarSets: ["Tengoku@Livestream", "Rutilant Arena"],
  },
  "Argenti": {
    lightCones: ["An Instant Before A Gaze", "The Seriousness of Breakfast"],
    relicSets: ["Scholar Lost in Erudition", "Champion of Streetwise Boxing"],
    planarSets: ["Inert Salsotto"],
  },
  "Arlan": {
    lightCones: ["Something Irreplaceable", "Under the Blue Sky"],
    relicSets: ["Band of Sizzling Thunder", "Scholar Lost in Erudition"],
    planarSets: ["Space Sealing Station", "Rutilant Arena"],
  },
  "Asta": {
    lightCones: ["But the Battle Isn't Over", "Memories of the Past"],
    relicSets: ["Messenger Traversing Hackerspace"],
    planarSets: ["Sprightly Vonwacq", "Fleet of the Ageless"],
  },
  "Aventurine": {
    lightCones: ["Inherently Unjust Destiny", "Trend of the Universal Market"],
    relicSets: ["Knight of Purity Palace"],
    planarSets: ["Broken Keel"],
  },
  "Bailu": {
    lightCones: ["Time Waits for No One", "Quid Pro Quo"],
    relicSets: ["Longevous Disciple"],
    planarSets: ["Fleet of the Ageless", "Broken Keel"],
  },
  "Black Swan": {
    lightCones: ["Reforged Remembrance", "Eyes of the Prey"],
    relicSets: ["Prisoner in Deep Confinement", "Pioneer Diver of Dead Waters"],
    planarSets: ["Pan-Cosmic Commercial Enterprise", "Firmament Frontline: Glamoth"],
  },
  "Blade": {
    lightCones: ["The Unreachable Side", "Brighter Than the Sun"],
    relicSets: ["Longevous Disciple"],
    planarSets: ["Bone Collection's Serene Demesne", "Rutilant Arena"],
  },
  "Boothill": {
    lightCones: ["Sailing Towards a Second Life", "Swordplay"],
    relicSets: ["Iron Cavalry Against the Scourge"],
    planarSets: ["Talia: Kingdom of Banditry", "Forge of the Kalpagni Lantern"],
  },
  "Bronya": {
    lightCones: ["But the Battle Isn't Over", "Carve the Moon, Weave the Clouds"],
    relicSets: ["Sacerdos' Relived Ordeal", "Messenger Traversing Hackerspace"],
    planarSets: ["Broken Keel", "Lushaka, the Sunken Seas"],
  },
  "Castorice": {
    lightCones: ["Make Farewells More Beautiful", "Memory's Curtain Never Falls"],
    relicSets: ["Poet of Mourning Collapse"],
    planarSets: ["Bone Collection's Serene Demesne"],
  },
  "Cyrene": {
    lightCones: ["This Love, Forever", "Memory's Curtain Never Falls", "Long May Rainbows Adorn the Sky"],
    relicSets: ["World-Remaking Deliverer", "Messenger Traversing Hackerspace"],
    planarSets: ["Amphoreus, The Eternal Land", "Lushaka, the Sunken Seas", "Penacony, Land of the Dreams"],
  },
  "Cerydra": {
    lightCones: ["Epoch Etched in Golden Blood", "The Forever Victual"],
    relicSets: ["Sacerdos' Relived Ordeal"],
    planarSets: ["Lushaka, the Sunken Seas"],
  },
  "Cipher": {
    lightCones: ["Lies Dance on the Breeze", "Resolution Shines As Pearls of Sweat"],
    relicSets: ["Pioneer Diver of Dead Waters"],
    planarSets: ["Firmament Frontline: Glamoth"],
  },
  "Clara": {
    lightCones: ["Something Irreplaceable", "A Secret Vow"],
    relicSets: ["The Ashblazing Grand Duke", "Champion of Streetwise Boxing"],
    planarSets: ["Duran, Dynasty of Running Wolves", "Inert Salsotto"],
  },
  "Dan Heng": {
    lightCones: ["In the Night", "Cruising in the Stellar Sea"],
    relicSets: ["Pioneer Diver of Dead Waters", "Scholar Lost in Erudition"],
    planarSets: ["Space Sealing Station", "Rutilant Arena"],
  },
  "Dan Heng IL": {
    lightCones: ["Brighter Than the Sun", "Nowhere to Run"],
    relicSets: ["Wastelander of Banditry Desert"],
    planarSets: ["Rutilant Arena", "Space Sealing Station"],
  },
  "Dan Heng PT": {
    lightCones: ["Though Worlds Apart", "Moment of Victory"],
    relicSets: ["Self-Enshrouded Recluse"],
    planarSets: ["Lushaka, the Sunken Seas"],
  },
  "Destruction MC": {
    lightCones: ["Something Irreplaceable", "Under the Blue Sky"],
    relicSets: ["Champion of Streetwise Boxing", "Scholar Lost in Erudition"],
    planarSets: ["Space Sealing Station", "Rutilant Arena"],
  },
  "Dr. Ratio": {
    lightCones: ["Baptism of Pure Thought", "Only Silence Remains"],
    relicSets: ["The Ashblazing Grand Duke", "Pioneer Diver of Dead Waters"],
    planarSets: ["Duran, Dynasty of Running Wolves", "Inert Salsotto"],
  },
  "Evernight": {
    lightCones: ["To Evernight's Stars", "The Flower Remembers"],
    relicSets: ["World-Remaking Deliverer"],
    planarSets: ["Bone Collection's Serene Demesne"],
  },
  "Feixiao": {
    lightCones: ["I Venture Forth to Hunt", "Worrisome, Blissful"],
    relicSets: ["The Wind-Soaring Valorous"],
    planarSets: ["Duran, Dynasty of Running Wolves", "Rutilant Arena"],
  },
  "Firefly": {
    lightCones: ["Whereabouts Should Dreams Rest", "On the Fall of an Aeon"],
    relicSets: ["Iron Cavalry Against the Scourge"],
    planarSets: ["Forge of the Kalpagni Lantern", "Talia: Kingdom of Banditry"],
  },
  "Fu Xuan": {
    lightCones: ["She Already Shut Her Eyes", "Day One of My New Life"],
    relicSets: ["Longevous Disciple", "Guard of Wuthering Snow"],
    planarSets: ["Broken Keel"],
  },
  "Fugue": {
    lightCones: ["Solitary Healing", "Long Road Leads Home"],
    relicSets: ["Iron Cavalry Against the Scourge", "Thief of Shooting Meteor"],
    planarSets: ["Forge of the Kalpagni Lantern", "Talia: Kingdom of Banditry"],
  },
  "Gallagher": {
    lightCones: ["What Is Real?", "Multiplication"],
    relicSets: ["Thief of Shooting Meteor"],
    planarSets: ["Forge of the Kalpagni Lantern", "Talia: Kingdom of Banditry"],
  },
  "Gepard": {
    lightCones: ["Moment of Victory", "Landau's Choice"],
    relicSets: ["Knight of Purity Palace"],
    planarSets: ["Belobog of the Architects"],
  },
  "Guinaifen": {
    lightCones: ["Patience Is All You Need", "Resolution Shines As Pearls of Sweat"],
    relicSets: ["Prisoner in Deep Confinement"],
    planarSets: ["Firmament Frontline: Glamoth", "Pan-Cosmic Commercial Enterprise"],
  },
  "Hanya": {
    lightCones: ["But the Battle Isn't Over", "Past and Future"],
    relicSets: ["Messenger Traversing Hackerspace"],
    planarSets: ["Broken Keel", "Fleet of the Ageless"],
  },
  "Herta": {
    lightCones: ["Before Dawn", "Geniuses' Repose"],
    relicSets: ["Scholar Lost in Erudition"],
    planarSets: ["Izumo Gensei and Takama Divine Realm", "Rutilant Arena"],
  },
  "Himeko": {
    lightCones: ["Night on the Milky Way", "The Seriousness of Breakfast"],
    relicSets: ["Firesmith of Lava-Forging"],
    planarSets: ["Inert Salsotto", "Firmament Frontline: Glamoth"],
  },
  "Hook": {
    lightCones: ["Something Irreplaceable", "Nowhere to Run"],
    relicSets: ["Firesmith of Lava-Forging", "Pioneer Diver of Dead Waters"],
    planarSets: ["Rutilant Arena", "Space Sealing Station"],
  },
  "Huohuo": {
    lightCones: ["Night of Fright", "Multiplication"],
    relicSets: ["Warrior Goddess of Sun and Thunder", "Longevous Disciple"],
    planarSets: ["Fleet of the Ageless"],
  },
  "Hyacine": {
    lightCones: ["Long May Rainbows Adorn the Sky", "Memory's Curtain Never Falls"],
    relicSets: ["Warrior Goddess of Sun and Thunder"],
    planarSets: ["Giant Tree of Rapt Brooding"],
  },
  "Hysilens": {
    lightCones: ["Why Does the Ocean Sing", "Eyes of the Prey"],
    relicSets: ["Prisoner in Deep Confinement"],
    planarSets: ["Revelry by the Sea", "Pan-Cosmic Commercial Enterprise"],
  },
  "Jade": {
    lightCones: ["Eternal Calculus", "Today Is Another Peaceful Day"],
    relicSets: ["The Ashblazing Grand Duke", "Genius of Brilliant Stars"],
    planarSets: ["Inert Salsotto", "Rutilant Arena"],
  },
  "Jiaoqiu": {
    lightCones: ["Those Many Springs", "Eyes of the Prey"],
    relicSets: ["Pioneer Diver of Dead Waters", "Messenger Traversing Hackerspace"],
    planarSets: ["Sprightly Vonwacq", "Pan-Cosmic Commercial Enterprise"],
  },
  "Jing Yuan": {
    lightCones: ["Before Dawn", "The Seriousness of Breakfast"],
    relicSets: ["The Ashblazing Grand Duke"],
    planarSets: ["The Wondrous BananAmusement Park", "Inert Salsotto"],
  },
  "Jingliu": {
    lightCones: ["I Shall Be My Own Sword", "On the Fall of an Aeon"],
    relicSets: ["Hunter of Glacial Forest"],
    planarSets: ["Bone Collection's Serene Demesne", "Rutilant Arena"],
  },
  "Kafka": {
    lightCones: ["Patience Is All You Need", "Good Night and Sleep Well"],
    relicSets: ["Prisoner in Deep Confinement"],
    planarSets: ["Firmament Frontline: Glamoth", "Pan-Cosmic Commercial Enterprise"],
  },
  "Lingsha": {
    lightCones: ["Scent Alone Stays True", "Multiplication"],
    relicSets: ["Iron Cavalry Against the Scourge"],
    planarSets: ["Forge of the Kalpagni Lantern", "Talia: Kingdom of Banditry"],
  },
  "Luka": {
    lightCones: ["Solitary Healing", "Resolution Shines As Pearls of Sweat"],
    relicSets: ["Prisoner in Deep Confinement"],
    planarSets: ["Revelry by the Sea", "Firmament Frontline: Glamoth"],
  },
  "Luocha": {
    lightCones: ["Echoes of the Coffin", "Multiplication"],
    relicSets: ["Passerby of Wandering Cloud"],
    planarSets: ["Fleet of the Ageless"],
  },
  "Lynx": {
    lightCones: ["Time Waits for No One", "Shared Feeling"],
    relicSets: ["Messenger Traversing Hackerspace", "Longevous Disciple"],
    planarSets: ["Fleet of the Ageless", "Broken Keel"],
  },
  "March 7th (Hunt)": {
    lightCones: ["I Venture Forth to Hunt", "Swordplay"],
    relicSets: ["Iron Cavalry Against the Scourge", "The Wind-Soaring Valorous"],
    planarSets: ["Duran, Dynasty of Running Wolves", "Rutilant Arena"],
  },
  "March 7th": {
    lightCones: ["Moment of Victory", "Landau's Choice"],
    relicSets: ["Knight of Purity Palace"],
    planarSets: ["Belobog of the Architects"],
  },
  "Misha": {
    lightCones: ["On the Fall of an Aeon", "Indelible Promise"],
    relicSets: ["Hunter of Glacial Forest"],
    planarSets: ["Inert Salsotto", "Rutilant Arena"],
  },
  "Moze": {
    lightCones: ["Baptism of Pure Thought", "Swordplay"],
    relicSets: ["Pioneer Diver of Dead Waters"],
    planarSets: ["Duran, Dynasty of Running Wolves"],
  },
  "Mydei": {
    lightCones: ["Flame of Blood, Blaze My Path", "Flames Afar"],
    relicSets: ["Scholar Lost in Erudition"],
    planarSets: ["Bone Collection's Serene Demesne"],
  },
  "Natasha": {
    lightCones: ["Time Waits for No One", "Hey, Over Here"],
    relicSets: ["Passerby of Wandering Cloud", "Longevous Disciple"],
    planarSets: ["Fleet of the Ageless", "Broken Keel"],
  },
  "Pela": {
    lightCones: ["In the Name of the World", "Before the Tutorial Mission Starts"],
    relicSets: ["Eagle of Twilight Line"],
    planarSets: ["Pan-Cosmic Commercial Enterprise", "Penacony, Land of the Dreams"],
  },
  "Phainon": {
    lightCones: ["Thus Burns the Dawn", "On the Fall of an Aeon"],
    relicSets: ["Wavestrider Captain", "Scholar Lost in Erudition"],
    planarSets: ["Arcadia of Woven Dreams"],
  },
  "Qingque": {
    lightCones: ["Yet Hope Is Priceless", "Geniuses' Repose"],
    relicSets: ["Genius of Brilliant Stars", "Poet of Mourning Collapse"],
    planarSets: ["Tengoku@Livestream", "Rutilant Arena"],
  },
  "Rappa": {
    lightCones: ["Ninjutsu Inscription: Dazzling Evilbreaker", "After the Charmony Fall"],
    relicSets: ["Iron Cavalry Against the Scourge"],
    planarSets: ["Forge of the Kalpagni Lantern", "Talia: Kingdom of Banditry"],
  },
  "Robin": {
    lightCones: ["Flowing Nightglow", "But the Battle Isn't Over"],
    relicSets: ["Musketeer of Wild Wheat"],
    planarSets: ["Fleet of the Ageless", "Lushaka, the Sunken Seas"],
  },
  "Ruan Mei": {
    lightCones: ["Past Self in Mirror", "Memories of the Past"],
    relicSets: ["Watchmaker, Master of Dream Machinations"],
    planarSets: ["Sprightly Vonwacq", "Talia: Kingdom of Banditry"],
  },
  "Saber": {
    lightCones: ["A Thankless Coronation", "A Trail of Bygone Blood"],
    relicSets: ["Wavestrider Captain", "Scholar Lost in Erudition"],
    planarSets: ["Firmament Frontline: Glamoth"],
  },
  "Sampo": {
    lightCones: ["Patience Is All You Need", "Eyes of the Prey"],
    relicSets: ["Prisoner in Deep Confinement"],
    planarSets: ["Firmament Frontline: Glamoth", "Pan-Cosmic Commercial Enterprise"],
  },
  "Seele": {
    lightCones: ["In the Night", "Cruising in the Stellar Sea"],
    relicSets: ["Genius of Brilliant Stars"],
    planarSets: ["Rutilant Arena", "Space Sealing Station"],
  },
  "Serval": {
    lightCones: ["Before Dawn", "Make the World Clamor"],
    relicSets: ["Band of Sizzling Thunder"],
    planarSets: ["Firmament Frontline: Glamoth", "Rutilant Arena"],
  },
  "Silver Wolf": {
    lightCones: ["Incessant Rain", "Before the Tutorial Mission Starts"],
    relicSets: ["Genius of Brilliant Stars"],
    planarSets: ["Pan-Cosmic Commercial Enterprise", "Space Sealing Station"],
  },
  "Sparkle": {
    lightCones: ["Earthly Escapade", "Dance! Dance! Dance!"],
    relicSets: ["Sacerdos' Relived Ordeal"],
    planarSets: ["Lushaka, the Sunken Seas", "Broken Keel", "Penacony, Land of the Dreams"],
  },
  "Sunday": {
    lightCones: ["A Grounded Ascent", "But the Battle Isn't Over"],
    relicSets: ["Sacerdos' Relived Ordeal"],
    planarSets: ["Lushaka, the Sunken Seas", "Broken Keel"],
  },
  "Sushang": {
    lightCones: ["Sleep Like the Dead", "Subscribe for More!"],
    relicSets: ["Champion of Streetwise Boxing"],
    planarSets: ["Space Sealing Station", "Rutilant Arena"],
  },
  "The Herta": {
    lightCones: ["Into the Unreachable Veil", "Geniuses' Repose"],
    relicSets: ["Scholar Lost in Erudition"],
    planarSets: ["Izumo Gensei and Takama Divine Realm", "Rutilant Arena"],
  },
  "Tingyun": {
    lightCones: ["Past Self in Mirror", "Carve the Moon, Weave the Clouds"],
    relicSets: ["Messenger Traversing Hackerspace"],
    planarSets: ["Broken Keel"],
  },
  "Topaz": {
    lightCones: ["Worrisome, Blissful", "Swordplay"],
    relicSets: ["The Ashblazing Grand Duke", "Pioneer Diver of Dead Waters"],
    planarSets: ["Duran, Dynasty of Running Wolves"],
  },
  "Harmony MC": {
    lightCones: ["Past Self in Mirror", "Memories of the Past"],
    relicSets: ["Watchmaker, Master of Dream Machinations"],
    planarSets: ["Talia: Kingdom of Banditry", "Sprightly Vonwacq"],
  },
  "Preservation MC": {
    lightCones: ["Texture of Memories", "Landau's Choice"],
    relicSets: ["Knight of Purity Palace"],
    planarSets: ["Belobog of the Architects"],
  },
  "Remembrance MC": {
    lightCones: ["This Love, Forever", "Victory In a Blink"],
    relicSets: ["Hero of Triumphant Song"],
    planarSets: ["Sprightly Vonwacq"],
  },
  "Tribbie": {
    lightCones: ["If Time Were a Flower", "Dance! Dance! Dance!"],
    relicSets: ["Poet of Mourning Collapse", "Longevous Disciple"],
    planarSets: ["Lushaka, the Sunken Seas", "Bone Collection's Serene Demesne"],
  },
  "Welt": {
    lightCones: ["In the Name of the World", "Boundless Choreo"],
    relicSets: ["Wastelander of Banditry Desert", "Pioneer Diver of Dead Waters"],
    planarSets: ["Firmament Frontline: Glamoth", "Pan-Cosmic Commercial Enterprise"],
  },
  "Xueyi": {
    lightCones: ["Whereabouts Should Dreams Rest", "On the Fall of an Aeon"],
    relicSets: ["Genius of Brilliant Stars", "Thief of Shooting Meteor"],
    planarSets: ["Talia: Kingdom of Banditry", "Rutilant Arena"],
  },
  "Yanqing": {
    lightCones: ["In the Night", "Subscribe for More!"],
    relicSets: ["Hunter of Glacial Forest", "Scholar Lost in Erudition"],
    planarSets: ["Firmament Frontline: Glamoth", "Rutilant Arena"],
  },
  "Yukong": {
    lightCones: ["But the Battle Isn't Over", "Planetary Rendezvous"],
    relicSets: ["Messenger Traversing Hackerspace"],
    planarSets: ["Broken Keel", "Fleet of the Ageless"],
  },
  "Yunli": {
    lightCones: ["Dance at Sunset", "Under the Blue Sky"],
    relicSets: ["The Wind-Soaring Valorous", "The Ashblazing Grand Duke"],
    planarSets: ["Duran, Dynasty of Running Wolves", "Inert Salsotto"],
  },
}
