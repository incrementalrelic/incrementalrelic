import { Map } from "immutable";
import { add, buy, inTheBlack } from "merchant.js";
import { experience, gold, elements, fire, water, earth, air } from "./currencies";

const colorByMissionReward = (reward) => {
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
            return "#dddddd"
    }
}

const attack = {id: "atk", icon: "⚔️", name: "ATK"};
const defence = {id: "def", icon: "🛡️", name: "DEF"};
const health = {id: "hp", icon: "❤️", name: "HP"};
const regen = {id: "regen", icon: "💖", name: "REG"};

const colorByMission = (mission) => {
    console.log("GERE")
    return mission.level >= 35 ? "#dddddd" : colorByMissionReward(mission.cost_types[0])
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function format_cost(cost) { 
    var str = ""
    for (const item of cost) {
        if(str != "") str = str + " "
        str = str + " - " + (-item.value) + " "+ item.type.icon
    }
    if(str == "") return "Free" 
    return str
}

function format_reward(use_cost, rewards, id){ 
    return function(){
        const boost = this.state.boostLedger.get(""+id) ? this.state.boostLedger.get(""+id) + 1 : 1
        let newRewards = rewards.map(r => ({...r, quantity_min: boost*r.quantity_min, quantity_max: boost*r.quantity_max}))
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index].id
            const element_boost = this.state.boostLedger.get(element) ? this.state.boostLedger.get(element) + 1 : 1
            if(use_cost[element] && element_boost > 1){
                newRewards = newRewards.map(r => ({...r, quantity_min: element_boost*r.quantity_min, quantity_max: element_boost*r.quantity_max}))
            }
        }
        var str = ""
        for (const item of newRewards) {
            if(str != "") str = str + " + "
            if(item.odd !== 1){
                str = str + (item.odd*100) + "% "
            }
            if(item.quantity_min != item.quantity_max){
                str = str + Number(Number(item.quantity_min).toFixed(2)) + "-" + Number(Number(item.quantity_max).toFixed(2)) + " " + item.type.icon
            }
            else{
                str = str + Number(Number(item.quantity_min).toFixed(2)) + " " + item.type.icon
            }
        }
        return str
    }
}

function mission(text, level, cost, rewards, id){
    const temp={}
    cost.forEach( x => temp [x.type.id] = x.value )
    return {
        id: id,
        cost_types : cost.map( c  => c.type.id ),
        reward_types : rewards.map( r  => r.type.id ),
        text : text,
        level : level,
        cost : format_cost(cost),
        reward : format_reward(temp, rewards, id),
        start : element_mission(temp, rewards, id)
    }
}

function stat_mission(text, level, cost, rewards, id){
    const temp={}
    cost.forEach( x => temp [x.type.id] = x.value )
    return {
        id: id,
        cost_types : cost.map( c  => c.type.id ),
        reward_types : rewards.map( r  => r.type.id ),
        text : text,
        level : level,
        cost : format_cost(cost),
        reward : format_reward(temp, rewards, id),
        start : stat_start_mission(temp, rewards, id)
    }
}

var NormalMission = {
    id: 0,
    cost_types : [experience.id, fire.id, water.id, earth.id, air.id],
    reward_types : [experience.id, fire.id, water.id, earth.id, air.id],
    text : "Outdoor excursion",
    cost : format_cost([]),
    level : 1,
    reward : () => "1 "+ experience.icon+ " + 50% one of " + fire.icon + " "+ water.icon + " "+ earth.icon + " "+ air.icon,
    start : function() {
        var wallet = this.state.wallet;

        if (Math.random() > 0.50) {
            var element = elements[Math.floor(Math.random() * elements.length)];
            wallet = add(this.state.wallet, Map({ [element.id]: 1 }));
        }
        wallet = add(wallet, Map({ [experience.id]: 1 }));
        this.setState({
            wallet
        });
        return true;
    }
}

function element_mission(use_cost, rewards, id) { return function(){
    const boost = this.state.boostLedger.get(""+id) ? this.state.boostLedger.get(""+id) + 1 : 1
    let newRewards = rewards.map(r => ({...r, quantity_min: boost*r.quantity_min, quantity_max: boost*r.quantity_max}))
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index].id
        const element_boost = this.state.boostLedger.get(element) ? this.state.boostLedger.get(element) + 1 : 1
        if(use_cost[element] && element_boost > 1){
            newRewards = newRewards.map(r => ({...r, quantity_min: element_boost*r.quantity_min, quantity_max: element_boost*r.quantity_max}))
        }
    }
    const cost = {cost: () => {
        return Map(use_cost);
    }}
    var wallet = buy(cost, this.state.wallet);
    if (!inTheBlack(wallet)) {
        return false;
    }

    newRewards.forEach(reward => {
        if (Math.random() > 1-reward.odd) {
            let quantity = reward.quantity_min
            if(reward.quantity_min !== reward.quantity_max){
                quantity = randomIntFromInterval(reward.quantity_min, reward.quantity_max)
            }
            wallet = add(wallet, Map({ [reward.type.id]: quantity }));
        }
    });
    this.setState({
        wallet
    });
    return true;
}}

function stat_start_mission(use_cost, rewards, id) { return function(){
    const boost = this.state.boostLedger.get(""+id) ? this.state.boostLedger.get(""+id) + 1 : 1
    let newRewards = rewards.map(r => ({...r, quantity_min: boost*r.quantity_min, quantity_max: boost*r.quantity_max}))
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index].id
        const element_boost = this.state.boostLedger.get(element) ? this.state.boostLedger.get(element) + 1 : 1
        if(use_cost[element] && element_boost > 1){
            newRewards = newRewards.map(r => ({...r, quantity_min: element_boost*r.quantity_min, quantity_max: element_boost*r.quantity_max}))
        }
    }
    const cost = {cost: () => {
        return Map(use_cost);
    }}
    var wallet = buy(cost, this.state.wallet);
    if (!inTheBlack(wallet)) {
        return false;
    }

    let missionStats = this.state.missionStats
    newRewards.forEach(reward => {
        if (Math.random() > 1-reward.odd) {
            let quantity = randomIntFromInterval(reward.quantity_min, reward.quantity_max)
            missionStats = add(this.state.missionStats, Map({ [reward.type.id]: quantity }));
        }
    });
    this.setState({
        wallet,
        missionStats
    });
    return true;
}}

function level_3_reward(type){ 
    return [{ type: experience, odd: 1 , quantity_min:10, quantity_max:20},
        { type: gold, odd: 1 , quantity_min:10, quantity_max:20},
        { type: type, odd: 0.4 , quantity_min:1, quantity_max:1}]
}

function FireBasicsMission(){
    return mission("Play with matches", 3, [{type: fire, value:-1}], level_3_reward(fire), 1)
}

function WaterBasicsMission(){
    return mission("Take a shower", 3, [{type: water, value:-1}], level_3_reward(water), 2)
}

function EarthBasicsMission(){
    return mission("Touch grass", 3, [{type: earth, value:-1}], level_3_reward(earth), 3)
}

function AirBasicsMission(){
    return mission("Guided breathing session", 3, [{type: air, value:-1}], level_3_reward(air), 4)
}

function level_8_reward(type){ 
    return [{ type: experience, odd: 1 , quantity_min:15, quantity_max:25},
        { type: gold, odd: 1 , quantity_min:15, quantity_max:25},
        { type: type, odd: 0.6 , quantity_min:1, quantity_max:1}]
}

function FireToWaterBasicsMission(){
    return mission("Boiling water for tea time", 8, [{type: fire, value:-1}], level_8_reward(water),5)
}

function FireToEarthBasicsMission(){
    return mission("Manufacture obsidian", 8, [{type: fire, value:-1}], level_8_reward(earth),6)
}

function FireToAirBasicsMission(){
    return mission("Learn smoke communication", 8, [{type: fire, value:-1}], level_8_reward(air),7)
}

function WaterToFireBasicsMission(){
    return mission("Make a water lens", 8, [{type: water, value:-1}], level_8_reward(fire),8)
}

function WaterToEarthBasicsMission(){
    return mission("Water the plants", 8, [{type: water, value:-1}], level_8_reward(earth),9)
}

function WaterToAirBasicsMission(){
    return mission("Enjoy a sauna session", 8, [{type: water, value:-1}], level_8_reward(air),10)
}

function EarthToFireBasicsMission(){
    return mission("Gather flint and steel", 8, [{type: earth, value:-1}], level_8_reward(fire),11)
}

function EarthToWaterBasicsMission(){
    return mission("Build a well", 8, [{type: earth, value:-1}], level_8_reward(water),12)
}

function EarthToAirBasicsMission(){
    return mission("Clean the dust", 8, [{type: earth, value:-1}], level_8_reward(air),13)
}

function AirToFireBasicsMission(){
    return mission("Use a blower fan", 8, [{type: air, value:-1}], level_8_reward(fire),14)
}

function AirToWaterBasicsMission(){
    return mission("Collect condensation", 8, [{type: air, value:-1}], level_8_reward(water),15)
}

function AirToEarthBasicsMission(){
    return mission("Create a dust devil", 8, [{type: air, value:-1}], level_8_reward(earth),16)
}

function FireToGoldMission(){
    return mission("Manufacture fireworks", 15, [{type: fire, value:-3}], [{ type: gold, odd: 1 , quantity_min:75, quantity_max:100}],17)
}

function WaterToExpMission(){
    return mission("Take Swimming lessons", 15, [{type: water, value:-3}], [{ type: experience, odd: 1 , quantity_min:75, quantity_max:100}],18)
}

function EarthToGoldMission(){
    return mission("Search for minerals", 15, [{type: earth, value:-3}], [{ type: gold, odd: 1 , quantity_min:75, quantity_max:100}],19)
}

function AirToExpMission(){
    return mission("QiGong Breathing", 15, [{type: air, value:-3}], [{ type: experience, odd: 1 , quantity_min:75, quantity_max:100}],20)
}

function FireToExpMission(){
    return mission("Inner Fire Breathing", 25, [{type: fire, value:-5}, {type: air, value:-1}], [{ type: experience, odd: 1 , quantity_min:170, quantity_max:230}],21)
}

function WaterToGoldMission(){
    return mission("Escort Merchant Ship", 25, [{type: water, value:-5}], [{ type: gold, odd: 1 , quantity_min:170, quantity_max:230}],22)
}

function EarthToExpMission(){
    return mission("Sand Golem Summoning", 25, [{type: earth, value:-5},{type: water, value:-1}], [{ type: experience, odd: 1 , quantity_min:170, quantity_max:230}],23)
}

function AirToGoldMission(){
    return mission("Improve local windmill production", 25, [{type: air, value:-5}], [{ type: gold, odd: 1 , quantity_min:170, quantity_max:230}],24)
}

function AttackMission(){
    return stat_mission("Cultivate Internal Energy", 35, [{type: fire, value:-15},{type: water, value:-5},{type: air, value:-15}], [{ type: attack, odd: 1 , quantity_min:0.1, quantity_max:0.1}],25)
}

function DefenceMission(){
    return stat_mission("Bone strengthening", 35, [{type: water, value:-15},{type: earth, value:-15},{type: air, value:-5}], [{ type: defence, odd: 1 , quantity_min:0.1, quantity_max:0.1}],26)
}

function HealthMission(){
    return stat_mission("Process Spiritual Pills", 35, [{type: fire, value:-15},{type: water, value:-5},{type: earth, value:-15}], [{ type: health, odd: 1 , quantity_min:0.1, quantity_max:0.1}],27)
}

function AttackMission1(){
    return stat_mission("Elemental Assault Training", 55, [{type: fire, value:-150},{type: water, value:-150},{type: earth, value:-150},{type: air, value:-150}], [{ type: attack, odd: 1 , quantity_min:0.5, quantity_max:0.5}],28)
}

function DefenceMission1(){
    return stat_mission("Four Elements Fortress Drill", 55, [{type: fire, value:-150},{type: water, value:-150},{type: earth, value:-150},{type: air, value:-150}], [{ type: defence, odd: 1 , quantity_min:0.5, quantity_max:0.5}],29)
}

function RegenMission(){
    return stat_mission("Practice Elemental Recovery", 55, [{type: fire, value:-150},{type: water, value:-150},{type: earth, value:-150},{type: air, value:-150}], [{ type: regen, odd: 1 , quantity_min:0.1, quantity_max:0.1}],30)
}

const missions = [NormalMission, FireBasicsMission(), WaterBasicsMission(), EarthBasicsMission(), AirBasicsMission(), 
    FireToWaterBasicsMission(), FireToEarthBasicsMission(), FireToAirBasicsMission(),
    WaterToFireBasicsMission(), WaterToEarthBasicsMission(), WaterToAirBasicsMission(),
    EarthToFireBasicsMission(), EarthToWaterBasicsMission(), EarthToAirBasicsMission(),
    AirToFireBasicsMission(), AirToWaterBasicsMission(), AirToEarthBasicsMission(),
    FireToGoldMission(), WaterToExpMission(), EarthToGoldMission(), AirToExpMission(),
    FireToExpMission(), WaterToGoldMission(), EarthToExpMission(), AirToGoldMission(),
    AttackMission(), DefenceMission(), HealthMission(), AttackMission1(), DefenceMission1(), RegenMission()
];

const missionsByLevel = (level) => missions.filter((mission) => level >= mission.level)

module.exports = {
    missions, missionsByLevel, colorByMission
}
  