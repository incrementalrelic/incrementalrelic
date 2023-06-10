import { experience, gold, fire, water, earth, air, elements, allCurrencies } from "./currencies";
import { regen, statsList } from "./stats"
import { Map } from "immutable";
import { missionsByLevel } from "./missions";
import { v4 as uuidv4} from 'uuid';
import { itemName } from "./nameGen";

export const ArtifactType = "artifact"
export const RelicType = "relic"

export const colorByReward = (reward) => {
    switch (reward) {
        case fire.id:
            return "#b90d0a"
        case water.id:
            return "#3c73a8"
        case earth.id:
            return "#32612d"
        case air.id:
            return "#7f7d9c"
        case gold.id:
            return "#bba14f"
        case experience.id:
            return "#6064dc"
        default:
            return "white"
    }
}
  
export const anotherColorByReward = (reward) => {
    switch (reward) {
        case fire.id:
            return "#E03D28"
        case water.id:
            return "#79AAE3"
        case earth.id:
            return "#72A269"
        case air.id:
            return "#BAB7D8"
        case gold.id:
            return "#715D08"
        case experience.id:
            return "#9E99FF"
        default:
            return "white"
    }
}

export const rarityName = (rarity) => {
    switch (rarity) {
        case 1:
            return "Common"
        case 2:
            return "Rare"
        case 3:
            return "Epic"
        case 4:
            return "Legendary"
    }
}

export const colorByRarity = (rarity) => {
    switch (rarity) {
      case 1:
        return "#a0643c"
      case 2:
        return "#386ca4"
      case 3:
        return "#987cbc"
      case 4:
        return "#DB9D00"
    }
  }

export function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function gen_rarity_artifact(luck=0){
    var n = randomIntFromInterval(1+luck,100)
    if(n>99){
        return 4
    }
    if(n>95){
        return 3
    }
    if(n>70){
        return 2
    }
    return 1
}

function gen_rarity_relic(luck=0){
    var n = randomIntFromInterval(1+luck,100)
    if(n>98){
        return 4
    }
    if(n>90){
        return 3
    }
    return 2
}

export function gen_rarity_odds(odds){
    var n = randomIntFromInterval(1,100)
    let sum = 0;
    for (let i = 1; i < 5; i++) {
        sum += odds[i]
        if(n <= sum){
            return i
        }
    }
}

var elems = [fire, water, earth, air ,gold , experience]


export function generate_item(level, genBonus, aluck=0, rluck=0){
    var n = randomIntFromInterval(1,100)
    if(n>70 && level>=18){
        return generate_relic(level, genBonus, gen_rarity_relic(rluck))
    }
    return generate_artifact(level, genBonus, gen_rarity_artifact(aluck))
}

export function generate_artifact(level, genBonus, rarity = gen_rarity_artifact()){
    //var rf = () => (Math.random() + 1).toString(36).substring(7);
    var price_gold = () => randomIntFromInterval(50,100)*4
    var price_elem = () => randomIntFromInterval(4,8)
    var reward_gold = () => randomIntFromInterval(8,10)*0.01
    var reward_elem = () => randomIntFromInterval(10,30)*0.001
    var reward_experience = () => randomIntFromInterval(3,6)*0.25
    var reward_mission = () => randomIntFromInterval(10,15)*0.01
    
    var price = (elem) => elem.id == gold.id ? price_gold() : price_elem()
    var reward = (elem) => elem.id == gold.id ? reward_gold() : elem.id == experience.id ? reward_experience() : reward_elem()

    var priceD = Object.assign({}, ...elems.map((x) => ({[x.id]: 0})));
    var rewardD = Object.assign({}, ...elems.map((x) => ({[x.id]: 0})));
    var rewardS = Object.assign({}, ...statsList.map((x) => ({[x.id]: 0})));
    for (let i = 0; i < rarity; i++) {
        var p = elems[randomIntFromInterval(0,4)]
        var r = rarity == 2? elems[randomIntFromInterval(0,5)] : elems[randomIntFromInterval(0,4)]
        if(i==0){
            priceD[gold.id] = -price_gold()
        } else {
            priceD[p.id] -= price(p)
        }
        if(rarity == 3 && (randomIntFromInterval(1,10)==10||i==0)){
            var ms = missionsByLevel(level)
            var m = randomIntFromInterval(1,ms.length-1)
            var rm = rewardD["mission"] != undefined && rewardD["mission"][m] != undefined ? rewardD["mission"][m] : 0
            rewardD["mission"] = {...rewardD["mission"], [m]: rm + reward_mission()}
        }
        else if(rarity == 4 && (randomIntFromInterval(1,10)==10||i==0)){
            var element = elements[randomIntFromInterval(0,elements.length-1)]
            var m = element.id
            var rm = rewardD["mission"] != undefined && rewardD["mission"][m] != undefined ? rewardD["mission"][m] : 0
            rewardD["mission"] = {...rewardD["mission"], [m]: rm + reward_mission()}
        }
        else {
            rewardD[r.id] += reward(r) * (rarity<3?1:2)
        }
    }

    if(level >= 30){
        var mult = 1
        if(typeof genBonus === 'object' && genBonus !== null && genBonus.aBStatsMult !== null){
            mult = genBonus.aBStatsMult +1 
        }
        for (let i = 0; i < rarity*mult; i++) {
            const s = statsList[randomIntFromInterval(0,3)]
            rewardS[s.id] += s.id !== regen.id ? 1 : 0.1
        }
    }

    var folder = "";
    var tmp = [fire, water, earth, air]
    var tmp_names = ["red", "blue", "green", "grey"]
    for (let i = 0; i < tmp.length; i++) {
        if(rewardD[tmp[i].id] !== 0){
            folder = folder === "" ? tmp_names[i]: folder+"-"+tmp_names[i] ;
        }
    }

    folder = folder === "" ? "gold" : folder

    const src = "/"+folder+"/n"+randomIntFromInterval(1,40)+".png"

    return {
        id: uuidv4(),
        src: src, 
        name: itemName(rewardD), 
        effect:"cool",
        type: ArtifactType,
        rarity: rarity,
        cost: () => {
            return Map(priceD);
        },
        effect: () => {
            return Map(rewardD);
        },
        statEffect : Map(rewardS)
    }
}


export function generate_relic(level, genBonus, rarity = gen_rarity_relic()){
    //var rf = () => (Math.random() + 1).toString(36).substring(7);
    var nbonus = rarity == 2 ? 2 : rarity == 3 ? 4 : 6
    var price_gold = () => randomIntFromInterval(50,100)*4*2
    var price_elem = () => randomIntFromInterval(4,8)*2
    var reward_gold = () => randomIntFromInterval(5,10)*0.5
    var reward_elem = () => randomIntFromInterval(1,3)*0.10
    
    var price = (elem) => elem.id == gold.id ? price_gold() : price_elem()
    var reward = (elem) => elem.id == gold.id ? reward_gold() : reward_elem()
    var reward_mission = () => randomIntFromInterval(30,45)*0.01
    var reward_stat = () => randomIntFromInterval(10,15)*0.01

    var priceD = Object.assign({}, ...elems.map((x) => ({[x.id]: 0})));
    var rewardD = Object.assign({}, ...elems.map((x) => ({[x.id]: 0})));
    var rewardS = Object.assign({}, ...statsList.map((x) => ({[x.id]: 0})));
    for (let i = 0; i < nbonus; i++) {
        var p = elems[randomIntFromInterval(0,4)]
        var r = elems[randomIntFromInterval(0,4)]
        if(i==0){
            priceD[gold.id] = -price_gold()
        } else {
            priceD[p.id] -= price(p)
        }
        if(rarity == 3 && (randomIntFromInterval(1,10)==10||i==0)){
            var ms = missionsByLevel(level)
            var m = randomIntFromInterval(1,ms.length-1)
            var rm = rewardD["mission"] != undefined && rewardD["mission"][m] != undefined ? rewardD["mission"][m] : 0
            rewardD["mission"] = {...rewardD["mission"], [m]: rm + reward_mission()}
        }
        else if(rarity == 4 && (randomIntFromInterval(1,20)==20||i==0) && i !== 1){
            var ms = missionsByLevel(level)
            var m = randomIntFromInterval(1,ms.length-1)
            var rm = rewardD["mission"] != undefined && rewardD["mission"][m] != undefined ? rewardD["mission"][m] : 0
            rewardD["mission"] = {...rewardD["mission"], [m]: rm + reward_mission()}
        }
        else if(rarity == 4 && (randomIntFromInterval(1,20)==20||i==1)){
            const last = level >= 30 ? 2 : 1
            const res = randomIntFromInterval(0, last)
            if(res == 0){
                var element = elements[randomIntFromInterval(0,elements.length-1)]
                var m = element.id
                var rm = rewardD["mission"] != undefined && rewardD["mission"][m] != undefined ? rewardD["mission"][m] : 0
                rewardD["mission"] = {...rewardD["mission"], [m]: rm + reward_mission()}
            }
            else if(res == 1){
                var element = allCurrencies[randomIntFromInterval(0,allCurrencies.length-1)]
                var m = element.id
                var rm = rewardD["artifactBonus"] != undefined && rewardD["artifactBonus"][m] != undefined ? rewardD["artifactBonus"][m] : 0
                rewardD["artifactBonus"] = {...rewardD["artifactBonus"], [m]: rm + reward_mission()}
            }
            else{
                var stat = statsList[randomIntFromInterval(0,statsList.length-1)]
                var m = stat.id
                var rm = rewardD["statBonus"] != undefined && rewardD["statBonus"][m] != undefined ? rewardD["statBonus"][m] : 0
                rewardD["statBonus"] = {...rewardD["statBonus"], [m]: rm + reward_stat()}
            }
        }
        else {
            rewardD[r.id] += reward(r)
        }
    }

    var folder = "";
    var tmp = [fire, water, earth, air]
    var tmp_names = ["red", "blue", "green", "grey"]
    for (let i = 0; i < tmp.length; i++) {
        if(rewardD[tmp[i].id] !== 0){
            folder = folder === "" ? tmp_names[i]: folder+"-"+tmp_names[i] ;
        }
    }

    folder = folder === "" ? "gold" : folder

    const src = "/"+folder+"/r"+randomIntFromInterval(1,40)+".png"

    return {
        id: uuidv4(),
        src: src, 
        name: itemName(rewardD), 
        effect:"cool",
        type: RelicType,
        rarity: rarity,
        exp: Number(Number(0.5*rarity).toFixed(1)),
        cost: () => {
            return Map(priceD);
        },
        effect: () => {
            return Map(rewardD);
        },
        statEffect: Map(rewardS)
    }
}

export default generate_item;