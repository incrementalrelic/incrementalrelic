const adjectives = ["adorable", "adventurous", "aggressive", "agreeable", "alert", "alive", "amused", "angry", 
"annoyed", "annoying", "anxious", "arrogant", "ashamed", "attractive", "average", "awful", 
"bad", "beautiful", "better", "bewildered", "black", "bloody", "blue", "blue-eyed", "blushing", 
"bored", "brainy", "brave", "breakable", "bright", "busy", "calm", "careful", "cautious", "charming", 
"cheerful", "clean", "clear", "clever", "cloudy", "clumsy", "colorful", "combative", "comfortable", 
"concerned", "condemned", "confused", "cooperative", "courageous", "crazy", "creepy", "crowded", 
"cruel", "curious", "cute", "dangerous", "dark", "dead", "defeated", "defiant", "delightful", 
"depressed", "determined", "different", "difficult", "disgusted", "distinct", "disturbed", "dizzy", 
"doubtful", "drab", "dull", "eager", "easy", "elated", "elegant", "embarrassed", "enchanting", 
"encouraging", "energetic", "enthusiastic", "envious", "evil", "excited", "expensive", "exuberant", 
"fair", "faithful", "famous", "fancy", "fantastic", "fierce", "filthy", "fine", "foolish", "fragile", 
"frail", "frantic", "friendly", "frightened", "funny", "gentle", "gifted", "glamorous", "gleaming", 
"glorious", "good", "gorgeous", "graceful", "grieving", "grotesque", "grumpy", "handsome", "happy", 
"healthy", "helpful", "helpless", "hilarious", "homeless", "homely", "horrible", "hungry", "hurt", 
"ill", "important", "impossible", "inexpensive", "innocent", "inquisitive", "itchy", "jealous", 
"jittery", "jolly", "joyous", "kind", "lazy", "light", "lively", "lonely", "long", "lovely", 
"lucky", "magnificent", "misty", "modern", "motionless", "muddy", "mushy", "mysterious", "nasty", 
"naughty", "nervous", "nice", "nutty", "obedient", "obnoxious", "odd", "old-fashioned", "open", 
"outrageous", "outstanding", "panicky", "perfect", "plain", "pleasant", "poised", "poor", "powerful", 
"precious", "prickly", "proud", "putrid", "puzzled", "quaint", "real", "red", "relieved", "repulsive", "rich", 
"scary", "selfish", "shiny", "shy", "silly", "sleepy", "smiling", "smoggy", "sore", "sparkling", "splendid", 
"spotless", "stormy", "strange", "stupid", "successful", "super", "talented", "tame", "tasty", "tender", 
"tense", "terrible", "thankful", "thoughtful", "thoughtless", "tired", "tough", "troubled", "ugliest", 
"ugly", "uninterested", "unsightly", "unusual", "upset", "uptight", "vast", "victorious", "vivacious", 
"wandering", "weary", "wicked", "wide-eyed", "wild", "witty", "worried", "worrisome", "wrong", "zany", "zealous"]

const swordAdjectives = ["ancient", "battle-worn", "beautiful", "bloody", "broken", "curved", "damascus", "deadly", 
"dull", "enchanted", "epic", "fearsome", "flaming", "forged", "gleaming", "jagged", "legendary", "mighty", "razor-sharp", 
"rusty", "sharp", "shiny", "sleek", "steel", "strong", "swift", "terrible", "vicious"];

const names = ["King","Queen","Bishop", "Knight", "Rook", "Pawn",
"Aardvark","Alligator","Alpaca","Anaconda","Ant","Anteater","Antelope","Aphid","Armadillo","Asp",
"Baboon","Badger","Bald Eagle","Barracuda","Bass","Basset Hound","Bat","Bearded Dragon","Beaver","Bedbug",
"Bee","Bee-eater","Bird","Bison","Black panther","Black Widow Spider","Blue Jay","Blue Whale","Bobcat",
"Buffalo","Butterfly","Buzzard","Camel","Canada Lynx","Carp","Cat","Caterpillar","Catfish","Cheetah",
"Chicken","Chimpanzee","Chipmunk","Cobra","Cod","Condor","Cougar","Cow","Coyote","Crab","Crane Fly",
"Cricket","Crocodile","Crow","Cuckoo","Deer","Dinosaur","Dog","Dolphin","Donkey","Dove","Dragonfly",
"Duck","Eagle","Eel","Elephant","Emu","Falcon","Ferret","Finch","Fish","Flamingo","Flea","Fly","Fox",
"Frog","Goat","Goose","Gopher","Gorilla","Guinea Pig","Hamster","Hare","Hawk","Hippopotamus","Horse",
"Hummingbird","Humpback Whale","Husky","Iguana","Impala","Kangaroo","Lemur","Leopard","Lion","Lizard",
"Llama","Lobster","Margay","Monitor lizard","Monkey","Moose","Mosquito","Moth","Mountain Zebra","Mouse",
"Mule","Octopus","Orca","Ostrich","Otter","Owl","Ox","Oyster","Panda","Parrot","Peacock","Pelican","Penguin",
"Perch","Pheasant","Pig","Pigeon","Polar bear","Porcupine","Quagga","Rabbit","Raccoon","Rat","Rattlesnake",
"Red Wolf","Rooster","Seal","Sheep","Skunk","Sloth","Snail","Snake","Spider","Tiger","Whale","Wolf","Wombat","Zebra",
"Private", "Corporal", "Specialist", "Sergeant", "Chief", "Lieutenant", "Major", "Captain", "Colonel", "General",
"Snowman","Alien","Banshee","Basilisk","Beelzebub","Bigfoot","Body Snatcher","Boogeyman","Centaur","Chimera","Chupacabra","The Critters",
"The Crypt Keeper","Cyclops","Devil","Demon","Dracula","Dragons","Drakon","Frankenstein","Freddy Kruger","Gargoyle","Ghosts",
"Ghoul","Gnome","Goblin","Gremlin","Grover","Headless Horseman","Horseman","Hobgoblin","Hornswagger","Hunchback","Hydra","Incubus",
"Kraken","Leatherface","Leprechaun","Leviathan","Malificient","Martian","Medusa","Minotaur","Mummy","Night Wump","Ogopogo","Phoenix",
"Pinhead","Poltergeist","Pumpkinhead","Sandworm","Sasquatch","Skeleton","Siren","Snozzwangler","Succubus","Swamp Thing","Tar Man","Troll",
"Typhon","Vampires","Voldemort","Werewolf","Wolfman","Yeti","Zombie","Ninja","Samurai","Bandit","Ice Troll","Beast","Orc","Undead","Pirate",
"Kobold","Murloc","Reaper","Dragon","Creature","Guard","Cyborg","Slime","Genie","Soldier","Henchman","Assassin","Cultist"
]

const weapons = ["Sword", "Spear", "Dagger", "Mace", "Axe", "Bow", "Crossbow", "Wand", "Staff", "Shield", "Brandistock", "Qiang", "Scimitar", 
"Halberd", "Flail", "Maul", "Glaive", "Whip", "Sickle", "Jagged Blade", "Spiked Mace", "Dual Blades", "War Hammer", "Longbow", "Crossbow", "Sling", 
"Boomerang", "Nunchaku", "Battle Axe", "Claymore", "Katana", "Rapier", "Dirk", "Nagamaki", "Kama", "Harpoon", "Sarissa", "War Scythe", "Machete", 
"Cleaver", "Pike", "Trident", "Katars", "Daggers", "Sabre", "Cudgel", "Bastard Sword", "Great Sword", "Long Sword", "Short Sword", "Two Handed Sword", 
"Shiv", "Sickle Sword", "Bolas", "Bulawa", "Chakram", "Choke", "Dusack", "Fauchard", "Flail Mace", "Glaive-guisarme", "Hammer", "Hand Flail", "Katar", 
"Khopesh", "Kukri", "Mancatcher", "Morning Star", "Partisan", "Pole Axe", "Quarterstaff", "Sai", "Sling Staff", "Spetum", "Trident Spear", "War Scythe", 
"War Club", "Composite Bow", "Blowgun", "Harpoon Gun", "Bo Staff", "Tessen", "Nine-section Whip", "Knuckle Dusters", "Brass Knuckles", "Brass Knuckles Knife", 
"Shivaji", "Javelin", "Tomahawk", "Shuriken", "Kusari-gama", "Net", "Caltrop", "War Fan", "Shield Sword", "Fencing Foil","War Pick","Battle Flail","Battle Hammer",
"Lance","Morningstar Flail","War Sickle","War Trident","War Spear","War Halberd","War Glaive","War Axe","War Machete","War Cleaver","War Club","War Fan With Blades"]

const stuff = ["Leather Helm", "Chainmail Helm", "Plate Helm", "Cloth Robe", "Leather Armor", "Chainmail Armor", "Plate Armor", "Ring of Protection",
 "Ring of Strength", "Ring of Dexterity", "Ring of Intelligence", "Ring of Wisdom", "Ring of Charisma", "Ring of Speed", "Ring of Invisibility", 
 "Ring of Regeneration", "Ring of Levitation", "Ring of Flight", "Ring of Fire Resistance", "Ring of Cold Resistance", "Ring of Poison Resistance", 
 "Ring of Magic Resistance", "Ring of True Sight", "Ring of Water Walking", "Ring of Teleportation", "Ring of Time Control", "Amulet of Life", 
 "Amulet of Health", "Amulet of Magic", "Amulet of Spell Resistance", "Amulet of Telekinesis", "Necklace of Ice Shards", 
 "Necklace of Lightning Bolts", "Necklace of Poison", "Earrings of Invisibility", "Earrings of Night Vision", "Earrings of Water Breathing", 
 "Earrings of Feather Falling", "Earrings of Levitation", "Earrings of Magic Detection", "Earrings of Magic Disruption", "Earrings of Magic Negation", 
 "Earrings of Magic Resistance", "Earrings of Magic Absorption", "Essence Generator", "Essence Amplifier", "Essence Converter", "Essence Ring", "Essence Amulet", 
 "Essence Pendant", "Essence Earring", "Essence Necklace"]

const exp = ["Energy Generator","Energy Amplifier","Energy Converter","Energy Ring","Energy Amulet","Energy Pendant","Energy Earring","Energy Necklace",
"Experience Booster","Experience Amplifier","Experience Converter","Experience Ring","Experience Amulet","Experience Pendant","Experience Earring","Experience Necklace"]

const goldList = ["Gold Pouch","Gold Ring","Gold Amulet","Gold Pendant","Gold Earring","Gold Necklace", "Gold bracelet", "Gold anklet", "Gold watch", "Gold cufflinks",
"Gold brooch", "Gold tiara", "Gold crown", "Gold hairpin", "Gold body chain", "Gold body harness", "Gold torque", "Gold armlet", "Gold bangle", "Gold pocket watch", 
"Gold locket", "Gold charm bracelet", "Gold medallion", "Gold lapel pin", "Gold tie pin", "Gold money clip", "Gold keychain", "Gold belt buckle"]

const fireList = ["Fireblade","Blazing Sword","Flaming Mace","Inferno Staff","Pyromancer's Wand","Firestorm Bow","Emberstorm Shuriken","Flame Whip","Blaze Daggers",
"Fire Elemental Staff","Firestorm Greatsword","Volcanic Axe","Meteor Hammer","Inferno Scimitar","Blazing Sickle","Pyromancer's Boomerang","Flametongue","Firebrand",
"Flamecaller","Firestarter","Firestormbringer","Blazefury","Flamewalker","Inferno's Touch","Pyromancer's Fury","Firestorm's Bane","Emberstorm's Edge","Flame's Bite",
"Blaze's Fury","Fire Elemental's Wrath","Firestorm's Fury","Volcanic's Fury","Meteor's Fury","Inferno's Fury","Blazing Fury","Pyromancer's Fury"]

const waterList = ["Frostblade","Tidal Mace","Aqua Staff","Hydromancer's Wand","Blizzard Bow","Tsunami Shuriken","Frost Whip","Water Daggers","Water Elemental Staff",
"Blizzard Greatsword","Tidal Axe","Frost Meteor Hammer","Hydromancer's Scimitar","Aqua Sickle","Tsunami Boomerang","Frostbite","Frostshanker","Frostbringer","Froststorm",
"Frostblade","Frostmourne","Frostbite","Frostcaller","Froststarter","Froststormbringer","Frostfury","Frostwalker","Hydromancer's Touch","Blizzard's Bane","Tidal's Edge",
"Water Elemental's Wrath","Blizzard's Fury","Tidal's Fury","Frost Meteor's Fury","Hydromancer's Fury","Aqua Fury","Tsunami's Fury"]

const windList = ["Galeblade","Storm Mace","Aeromancer's Staff","Sky Staff","Tempest Bow","Thunderstorm Shuriken","Wind Whip","Aero Daggers","Wind Elemental Staff",
"Thunderstorm Greatsword","Gale Axe","Sky Meteor Hammer","Aeromancer's Scimitar","Storm Sickle","Tempest Boomerang","Skyblade","Skycaller","Skystarter","Skystormbringer",
"Skyfury","Skywalker","Aeromancer's Touch","Tempest's Bane","Gale's Edge","Wind Elemental's Wrath","Thunderstorm's Fury","Gale's Fury","Sky Meteor's Fury","Aeromancer's Fury",
"Storm Fury","Tempest Fury"]

const earthList = ["Earthen Mace","Granite Sword","Terra Staff","Geomancer's Wand","Earthshatter Bow","Sandstorm Shuriken","Earth Whip","Earthen Daggers","Earth Elemental Staff",
"Earthshatter Greatsword","Granite Axe","Terra Meteor Hammer","Geomancer's Scimitar","Earthen Sickle","Sandstorm Boomerang","Stoneshanker","Earthbringer","Earthstarter",
"Earthstormbringer","Earthfury","Earthwalker","Geomancer's Touch","Sandstorm's Bane","Granite's Edge","Earth Elemental's Wrath","Earthshatter's Fury","Granite's Fury",
"Terra Meteor's Fury","Geomancer's Fury","Earthen Fury","Sandstorm's Fury"]

const firewater = ["Blizzardfire Sword","Frostfire Mace","Inferno Staff of Ice","Pyromancer's Frost Wand","Firestorm Blizzard Bow","Emberstorm Tsunami Shuriken",
"Flame Frost Whip","Blaze Water Daggers","Fire & Water Elemental Staff","Firestorm Tidal Greatsword","Volcanic Frost Axe","Meteor Blizzard Hammer","Inferno Tidal Scimitar",
"Blazing Aqua Sickle","Pyromancer's Tsunami Boomerang","Flametongue of Ice","Firebrand of Frost","Flamecaller of Water","Firestarter of Blizzard","Firestormbringer of Tidal",
"Blazefury of Aqua","Flamewalker of Tsunami","Inferno's Touch of Frost","Pyromancer's Fury of Water","Firestorm's Bane of Blizzard","Emberstorm's Edge of Tidal","Flame's Bite of Aqua",
"Blaze's Fury of Tsunami","Fire & Water Elemental's Wrath","Firestorm's Fury of Tidal","Volcanic's Fury of Frost","Meteor's Fury of Blizzard","Inferno's Fury of Water",
"Blazing Fury of Aqua","Pyromancer's Fury of Tsunami"]

const firewind = ["Galefire Sword","Stormfire Mace","Aeromancer's Inferno Staff","Sky Inferno Staff","Tempest Fire Bow","Thunderstorm Emberstorm Shuriken","Wind Flame Whip",
"Aero Blaze Daggers","Fire & Wind Elemental Staff","Thunderstorm Firestorm Greatsword","Gale Volcanic Axe","Sky Meteor Fire Hammer","Aeromancer's Inferno Scimitar",
"Storm Blazing Sickle","Tempest Pyromancer's Boomerang","Skyblade of Fire","Skycaller of Blaze","Skystarter of Inferno","Skystormbringer of Firestorm","Skyfury of Volcanic",
"Skywalker of Meteor","Aeromancer's Touch of Fire","Tempest's Bane of Emberstorm","Gale's Edge of Thunderstorm","Fire & Wind Elemental's Wrath","Thunderstorm's Fury of Firestorm",
"Gale's Fury of Volcanic","Sky Meteor's Fury of Inferno","Aeromancer's Fury of Blaze","Storm Fury of Fire","Tempest Fury of Emberstorm"]

const fireearth = ["Earthen Fireblade","Granite Inferno Mace","Terra Pyromancer's Staff","Geomancer's Fire Wand","Earthshatter Firestorm Bow","Sandstorm Emberstorm Shuriken",
"Earth Flame Whip","Earthen Blaze Daggers","Fire & Earth Elemental Staff","Earthshatter Volcanic Greatsword","Granite Meteor Fire Axe","Terra Inferno Scimitar",
"Geomancer's Blazing Sickle","Earthen Pyromancer's Boomerang","Stoneshanker of Fire","Earthbringer of Blaze","Earthstarter of Inferno","Earthstormbringer of Firestorm",
"Earthfury of Volcanic","Earthwalker of Meteor","Geomancer's Touch of Fire","Sandstorm's Bane of Emberstorm","Granite's Edge of Thunderstorm","Fire & Earth Elemental's Wrath",
"Earthshatter's Fury of Firestorm","Granite's Fury of Volcanic","Terra Meteor's Fury of Inferno","Geomancer's Fury of Blaze","Earthen Fury of Fire","Sandstorm's Fury of Emberstorm"]

const waterwind = ["Galeblade of Frost","Stormblade of Ice","Aeromancer's Tidal Staff","Sky Tidal Staff","Tempest Frost Bow","Thunderstorm Tsunami Shuriken","Wind Frost Whip",
"Aero Water Daggers","Water & Wind Elemental Staff","Thunderstorm Blizzard Greatsword","Gale Tidal Axe","Sky Frost Meteor Hammer","Aeromancer's Hydromancer's Scimitar",
"Storm Aqua Sickle","Tempest Tsunami Boomerang","Skyblade of Frost","Skycaller of Ice","Skystarter of Tidal","Skystormbringer of Blizzard","Skyfury of Aqua","Skywalker of Tsunami",
"Aeromancer's Touch of Frost","Tempest's Bane of Tidal","Gale's Edge of Aqua","Water & Wind Elemental's Wrath","Thunderstorm's Fury of Blizzard","Gale's Fury of Tidal",
"Sky Meteor's Fury of Frost","Aeromancer's Fury of Ice","Storm Fury of Water","Tempest Fury of Tsunami"]

const waterearth = ["Earthen Frostblade","Granite Tidal Mace","Terra Aqua Staff","Geomancer's Hydromancer's Wand","Earthshatter Blizzard Bow","Sandstorm Tsunami Shuriken",
"Earth Frost Whip","Earthen Water Daggers","Water & Earth Elemental Staff","Earthshatter Tidal Greatsword","Granite Frost Axe","Terra Blizzard Hammer","Geomancer's Tidal Scimitar",
"Earthen Aqua Sickle","Sandstorm Tsunami Boomerang","Stoneshanker of Frost","Earthbringer of Ice","Earthstarter of Tidal","Earthstormbringer of Blizzard","Earthfury of Aqua",
"Earthwalker of Tsunami","Geomancer's Touch of Frost","Sandstorm's Bane of Tidal","Granite's Edge of Aqua","Water & Earth Elemental's Wrath","Earthshatter's Fury of Blizzard",
"Granite's Fury of Tidal","Terra Meteor's Fury of Frost","Geomancer's Fury of Ice","Earthen Fury of Water","Sandstorm's Fury of Tsunami"]

const earthwind = ["Galeblade of Earth","Stormblade of Stone","Aeromancer's Earthen Staff","Sky Earthen Staff","Tempest Earthshatter Bow","Thunderstorm Sandstorm Shuriken",
"Wind Earth Whip","Aero Earthen Daggers","Earth & Wind Elemental Staff","Thunderstorm Earthshatter Greatsword","Gale Granite Axe","Sky Terra Meteor Hammer",
"Aeromancer's Geomancer's Scimitar","Storm Earthen Sickle","Tempest Sandstorm Boomerang","Skyblade of Earth","Skycaller of Stone","Skystarter of Earthen",
"Skystormbringer of Earthshatter","Skyfury of Granite","Skywalker of Terra","Aeromancer's Touch of Earth","Tempest's Bane of Sandstorm","Gale's Edge of Earthen",
"Earth & Wind Elemental's Wrath","Thunderstorm's Fury of Earthshatter","Gale's Fury of Granite","Sky Meteor's Fury of Terra","Aeromancer's Fury of Earth","Storm Fury of Stone",
"Tempest Fury of Earthen"]

const elemDictionary = {
    fire: fireList,
    water: waterList,
    earth: earthList,
    wind: windList,
    firewater: firewater,
    firewind: firewind,
    fireearth: fireearth,
    waterwind: waterwind,
    waterearth: waterearth,
    earthwind: earthwind
}

const nonElemDictionary = {
    gold: goldList,
    experience: exp,
}

const enemyNameWithoutPrefix = () => {
    const name = getRandomFromArray(names) 
    const nameWithAdjectives = getRandomFromArray([()=>name, ()=> getAdjective()+ " " +name])()
    return nameWithAdjectives
}

export const enemyName = () => {
    const name = getRandomFromArray(names) 
    const nameWithAdjectives = getRandomFromArray([()=>name, ()=> getAdjective()+ " " +name, ()=>getAdjective()+ " " +getAdjective()+ " " + name])()
    const nameWithAdjectivesAndPrefix = getRandomFromArray([()=>"The "+nameWithAdjectives, ()=>AvsAnSimple.query(nameWithAdjectives)+" "+nameWithAdjectives])()
    return capitalizeFirstLetter(nameWithAdjectivesAndPrefix)
}

export const itemName = (rewardD) => {
    var keys = [];
    var fnArray = [];
    if(rewardD["mission"]){
        keys.concat(Object.keys(rewardD["mission"]))
    }
    if(rewardD["artifactBonus"]){
        keys.concat(Object.keys(rewardD["artifactBonus"]))
    }
    var combinations = [...new Set(keys.reduce( (acc, v, i) =>
        acc.concat(keys.slice(i+1).map( w => v + '' + w )),
    []))];
    var elemNames = combinations.concat(keys).map(x => elemDictionary[x]).filter(x => x != undefined && x != null)
    var keyElemNames = Object.keys(rewardD).filter(x => rewardD[x] > 0).concat(keys).map(x => elemDictionary[x] != undefined ? x : undefined).filter(x => x != undefined && x != null)
    var checked = true
    if(elemNames.length){
        fnArray.push(x => getRandomFromArray(getRandomFromArray(elemNames)))
        checked = false
    }
    if (keyElemNames.length){
        fnArray.push(x => getRandomFromArray(elemDictionary[getRandomFromArray(keyElemNames)]))
        fnArray.push(x => getRandomFromArray(keyElemNames) + " " + getRandomFromArray(weapons))
        fnArray.push(x => getRandomFromArray(keyElemNames) + " " + getRandomFromArray(stuff))
        fnArray.push(x => enemyNameWithoutPrefix() + "'s " + capitalizeFirstLetter(getRandomFromArray(keyElemNames)) + " " + capitalizeFirstLetter(getRandomFromArray(swordAdjectives)) + " " + getRandomFromArray(weapons))
        fnArray.push(x => enemyNameWithoutPrefix() + "'s " + capitalizeFirstLetter(getRandomFromArray(keyElemNames)) + " "  + getRandomFromArray(weapons))
        fnArray.push(x => enemyNameWithoutPrefix() + "'s " + capitalizeFirstLetter(getRandomFromArray(keyElemNames)) + " "  + getRandomFromArray(stuff))
        fnArray.push(x => "The " + enemyNameWithoutPrefix() + "'s " + capitalizeFirstLetter(getRandomFromArray(keyElemNames)) + " "  + capitalizeFirstLetter(getRandomFromArray(swordAdjectives)) + " " + getRandomFromArray(weapons))
        fnArray.push(x => "The " + enemyNameWithoutPrefix() + "'s " + capitalizeFirstLetter(getRandomFromArray(keyElemNames)) + " "  + getRandomFromArray(weapons))
        fnArray.push(x => "The " + enemyNameWithoutPrefix() + "'s " + capitalizeFirstLetter(getRandomFromArray(keyElemNames)) + " "  + getRandomFromArray(stuff))
        checked = false
    }
    if(checked){
        fnArray.push(x => getRandomFromArray(getRandomFromArray(Object.keys(rewardD)
            .map(x => nonElemDictionary[x]).filter(x => x != undefined && x != null))))
    }
    fnArray.push(x => enemyNameWithoutPrefix() + "'s " + capitalizeFirstLetter(getRandomFromArray(swordAdjectives)) + " " + getRandomFromArray(weapons))
    fnArray.push(x => enemyNameWithoutPrefix() + "'s " + getRandomFromArray(weapons))
    fnArray.push(x => enemyNameWithoutPrefix() + "'s " + getRandomFromArray(stuff))
    fnArray.push(x => "The " + enemyNameWithoutPrefix() + "'s " + capitalizeFirstLetter(getRandomFromArray(swordAdjectives)) + " " + getRandomFromArray(weapons))
    fnArray.push(x => "The " + enemyNameWithoutPrefix() + "'s " + getRandomFromArray(weapons))
    fnArray.push(x => "The " + enemyNameWithoutPrefix() + "'s " + getRandomFromArray(stuff))
    const fn = getRandomFromArray(fnArray) 
    const name = fn();
    return capitalizeFirstLetter(name)
}

const getAdjective = () => {
    return capitalizeFirstLetter(getRandomFromArray(adjectives))
}

const getRandomFromArray = (arr) => {
    var randomIndex = Math.floor(Math.random() * arr.length); 
    return arr[randomIndex];
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//From https://github.com/EamonNerbonne/a-vs-an/blob/master/AvsAnDemo/AvsAn-simple.min.js
var AvsAnSimple = function(n) {
    function i(n) {
        var r = parseInt(t, 36) || 0,
            f = r && r.toString(36).length,
            u, e;
        for (n.article = t[f] == "." ? "a" : "an", t = t.substr(1 + f), u = 0; u < r; u++) e = n[t[0]] = {}, t = t.substr(1), i(e)
    }
    var t = "2h.#2.a;i;&1.N;*4.a;e;i;o;/9.a;e;h1.o.i;l1./;n1.o.o;r1.e.s1./;01.8;12.1a;01.0;12.8;9;2.31.7;4.5.6.7.8.9.8a;0a.0;1;2;3;4;5;6;7;8;9;11; .22; .–.31; .42; .–.55; .,.h.k.m.62; .k.72; .–.82; .,.92; .–.8;<2.m1.d;o;=1.=1.E;@;A6;A1;A1.S;i1;r1;o.m1;a1;r1; .n1;d1;a1;l1;u1;c1.i1.a1.n;s1;t1;u1;r1;i1;a1;s.t1;h1;l1;e1;t1;e1.s;B2.h2.a1.i1;r1;a.á;o1.r1.d1. ;C3.a1.i1.s1.s.h4.a2.i1.s1;e.o1.i;l1.á;r1.o1.í;u2.i;r1.r1.a;o1.n1.g1.j;D7.a1.o1.q;i2.n1.a1.s;o1.t;u1.a1.l1.c;á1. ;ò;ù;ư;E7;U1;R.b1;o1;l1;i.m1;p1;e1;z.n1;a1;m.s1;p5.a1.c;e;h;o;r;u1.l1;o.w1;i.F11. ;,;.;/;0;1;2;3;4;5;6;71.0.8;9;Ae;B.C.D.F.I2.L.R.K.L.M.N.P.Q.R.S.T.B;C1;M.D;E2.C;I;F1;r.H;I3.A1;T.R1. ;U;J;L3.C;N;P;M;O1. ;P1;..R2.A1. ;S;S;T1;S.U2.,;.;X;Y1;V.c;f1.o.h;σ;G7.e1.r1.n1.e;h1.a3.e;i;o;i1.a1.n1.g;o2.f1. ;t1.t1. ;r1.i1.a;w1.a1.r1.r;ú;Hs. ;&;,;.2;A.I.1;2;3;5;7;B1;P.C;D;F;G;H1;I.I6;C.G.N.P.S1.D;T.K1.9;L;M1;..N;O2. ;V;P;R1;T.S1.F.T;V;e2.i1.r;r1.r1.n;o2.n6;d.e1.s;g.k.o2;l.r1;i1.f;v.u1.r;I3;I2;*.I.n1;d1;e1;p1;e1;n1;d2;e1;n1;c1;i.ê.s1;l1;a1;n1;d1;s.J1.i1.a1.o;Ly. ;,;.;1;2;3;4;8;A3. ;P;X;B;C;D;E2. ;D;F1;T.G;H1.D.I1.R;L;M;N;P;R;S1;m.T;U1. ;V1;C.W1.T;Z;^;a1.o1.i1.g;o1.c1.h1.a1;b.p;u1.s1.h1;o.ộ;M15. ;&;,;.1;A1;.1;S./;1;2;3;4;5;6;7;8;Ai;B.C.D.F.G.J.L.M.N.P.R.S.T.V.W.X.Y.Z.B1;S1;T.C;D;E3.P1;S.W;n;F;G;H;I4. ;5;6;T1;M.K;L;M;N;O1.U;P;Q;R;S;T1;R.U2. ;V;V;X;b1.u1.m;f;h;o2.D1.e.U1;..p1.3;s1.c;Ny. ;+;.1.E.4;7;8;:;A3.A1;F.I;S1.L;B;C;D;E3.A;H;S1. ;F1;U.G;H;I7.C.D1. ;K.L.N.O.S.K;L;M1;M.N2.R;T;P1.O1.V1./1.B;R2;J.T.S1;W.T1;L1.D.U1.S;V;W2.A;O1.H;X;Y3.C1.L;P;U;a1.s1.a1.n;t1.h;v;²;×;O5;N1;E.l1;v.n2;c1.e.e1.i;o1;p.u1;i.P1.h2.i1.a;o2.b2;i.o.i;Q1.i1.n1.g1.x;Rz. ;&;,;.1;J./;1;4;6;A3. ;.;F1;T.B1;R.C;D;E3. ;S1.P;U;F;G;H1.S;I2.A;C1. ;J;K;L1;P.M5;1.2.3.5.6.N;O2.H;T2;A.O.P;Q;R1;F.S4;,...?.T.T;U4;B.M.N.S.V;X;c;f1;M1...h2.A;B;ò;S11. ;&;,;.4.E;M;O;T1..3.B;D;M;1;3;4;5;6;8;9;A3. ;8;S2;E.I.B;C3.A1. ;R2.A.U.T;D;E6. ;5;C3;A.O.R.I1.F.O;U;F3;&.H.O1.S.G1;D.H3.2;3;L;I2. ;S1.O.K2.I.Y.L3;A2. ;.;I1. ;O.M3;A1. ;I.U1.R.N5.A.C3.A.B.C.E.F.O.O5. ;A1.I;E;S1;U.V;P7;A7;A.C.D.M.N.R.S.E1. ;I4;C.D.N.R.L1;O.O.U.Y.Q1. ;R;S1;W.T9.A1. ;C;D;F;I;L;M;S;V;U7.B.L.M.N.P.R.S.V;W1.R;X1.M;h1.i1.g1.a1.o;p1.i1.o1;n.t2.B;i1.c1.i;T4.a2.i2.g1.a.s1.c;v1.e1.s;e1.a1.m1.p;u1.i2.l;r;à;Um..1.N1..1.C;/1.1;11. .21.1;L1.T;M1.N;N4.C1.L;D2. .P.K;R1. .a;b2;a.i.d;g1.l;i1.g.l2;i.y.m;no. ;a1.n.b;c;d;e1;s.f;g;h;i2.d;n;j;k;l;m;n;o;p;q;r;s;t;u;v;w;p;r3;a.e.u1.k;s3. ;h;t1;r.t4.h;n;r;t;x;z;í;W2.P1.:4.A1.F;I2.B;N1.H.O1.V;R1.F1.C2.N.U.i1.k1.i1.E1.l1.i;X7;a.e.h.i.o.u.y.Y3.e1.t1.h;p;s;[5.A;E;I;a;e;_2._1.i;e;`3.a;e;i;a7; .m1;a1;r1. .n1;d2; .ě.p1;r1;t.r1;t1;í.u1;s1;s1;i1. .v1;u1;t.d3.a1.s1. ;e2.m1. ;r1. ;i2.c1.h1. ;e1.s1.e2.m;r;e8;c1;o1;n1;o1;m1;i1;a.e1;w.l1;i1;t1;e1;i.m1;p1;e1;z.n1;t1;e1;n1;d.s2;a1. .t4;a1; .e1; .i1;m1;a1;r.r1;u1.t.u1.p1. ;w.f3. ;M;y1.i;h9. ;,;.;C;a1.u1.t1;b.e2.i1.r1;a.r1.m1.a1.n;o4.m2.a1; .m;n8; .b.d.e3; .d.y.g.i.k.v.r1.s1. ;u1.r;r1. ;t1;t1;p1;:.i6;b1;n.e1;r.n2;f2;l1;u1;ê.o1;a.s1;t1;a1;l1;a.r1; .s1; .u.k1.u1. ;l3.c1.d;s1. ;v1.a;ma. ;,;R;b1.a.e1.i1.n;f;p;t1.a.u1.l1.t1.i1.c1.a1.m1.p1.i;×;n6. ;V;W;d1; .t;×;o8;c2;h1;o.u1;p.d1;d1;y.f1; .g1;g1;i.no. ;';,;/;a;b;c1.o;d;e2.i;r;f;g;i;l;m;n;o;r;s;t;u;w;y;z;–;r1;i1;g1;e.t1;r1.s;u1;i.r3. ;&;f;s9.,;?;R;f2.e.o.i1.c1.h;l1. ;p2.3;i1. ;r1.g;v3.a.e.i.t2.A;S;uc; ...b2.e;l;f.k2.a;i;m1;a1. .n3;a3; .n5.a;c;n;s;t;r1;y.e2; .i.i8.c2.o1.r1.p;u1.m;d1;i1.o;g1.n;l1.l;m1;o.n;s1.s;v1.o1;c.r5;a.e.i.l.o.s3. ;h;u1.r2;e.p3;a.e.i.t2.m;t;v.w1.a;xb. ;';,;.;8;b;k;l;m1;a.t;y1. ;y1.l;{1.a;|1.a;£1.8;À;Á;Ä;Å;Æ;É;Ò;Ó;Ö;Ü;à;á;æ;è;é1;t3.a;o;u;í;ö;ü1; .Ā;ā;ī;İ;Ō;ō;œ;Ω;α;ε;ω;ϵ;е;–2.e;i;ℓ;";
    return i(n), {
        raw: n,
        query: function(t) {
            var i = n,
                f = 0,
                u, r;
            do r = t[f++]; while ("\"‘’“”$'-(".indexOf(r) >= 0);
            for (;;) {
                if (u = i.article || u, i = i[r], !i) return u;
                r = t[f++] || " "
            }
        }
    }
}({})