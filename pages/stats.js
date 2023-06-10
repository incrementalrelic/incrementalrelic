import React, {useState, useEffect, useRef, useMemo } from 'react';
import { colorByReward, anotherColorByReward, colorByRarity, randomIntFromInterval } from "./items";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { elements, fire, water, earth, air, gold, experience } from "./currencies";
import Button from 'react-bootstrap/Button';
import ReactTooltip from 'react-tooltip';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { ProgressBar, FormCheck } from 'react-bootstrap';
import { Map } from "immutable";
import { BoxToolTip, wooden, steel, golden, platinum, sapphire, diamond } from './box';
import { add } from "merchant.js";
import { enemyName } from "./nameGen";

export const attack = {id: "atk", icon: "⚔️", name: "ATK"};
export const defence = {id: "def", icon: "🛡️", name: "DEF"};
export const health = {id: "hp", icon: "❤️", name: "HP"};
export const regen = {id: "regen", icon: "💖", name: "REG"};

export const statsList = [attack, defence, health, regen]

export const statById = (id) => {
    switch (id) {
      case attack.id:
        return attack
      case defence.id:
        return defence
      case health.id:
        return health
      case regen.id:
        return regen
    }
  }

function Stats(props) {
    let stats = add(props.stats, props.artifactStats, props.relicStats, props.missionStats)
    let buffedStats = Map();
    [stats, buffedStats] = applyStatBuffs(props.skills, stats)
    let relicBuffedStats = Map();
    [stats, relicBuffedStats] = applyRelicStatBuffs(props.statBonusLedger, stats)
    const current = (statId, typeId) => statId !== regen.id ? Number(props.stats.get(typeId+"-"+statId) ?? 0) : Number(Number(Number(props.stats.get(typeId+"-"+statId) ?? 0)*0.1).toFixed(1))
    const price = (statId, typeId, n) => { 
        const currentPrice = Number(props.stats.get(typeId+"-"+statId) ?? 0) + 1
        n = n-1;
        return (n+1) * (currentPrice + currentPrice + n) / 2;
    }
    const [radioValue, setRadioValue] = useState({[fire.id]:1,[water.id]:1,[earth.id]:1,[air.id]:1});
    const colorByRewardChecked = (id, checked) => checked ? anotherColorByReward(id) : colorByReward(id)
    const toogleButtonStyle = (id, checked) => ({backgroundColor:colorByRewardChecked(id, checked), borderColor:"#333333", fontWeight:"bold", width:"100px"})

    return <div>
        <div style={{ width: "100%", height: "160px", background: "#181818", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
            {statsList.map((stat) =>
                <div key={stat.id}>
                    <table className='invisibleTable'>
                        <tbody>
                            <tr>
                                <td style={{width:"200px"}}>
                                    <p style={{color: "white", paddingLeft: "10px", fontWeight:"bold", width:"100%"}}>{
                                        Number(Number(stats.get(stat.id) || 0).toFixed(1))} {stat.icon} {"("+stat.name+")"}
                                    </p>
                                </td>
                                <td style={{width:"80%"}} data-tip data-for={stat.id}>
                                    <p style={{color: "white", paddingLeft: "10px", fontWeight:"bold"}}>
                                        {"( "}
                                            {elements.map(cur =>
                                                (<span key={cur.id}><span style={{color:colorByReward(cur.id)}}>{current(stat.id, cur.id)}</span> + </span>))
                                            }
                                            <span style={{color:"#e5e5e5"}}>{Number(Number(props.artifactStats.get(stat.id) ?? 0).toFixed(1))}</span> + 
                                            <span style={{color:"#ED553B"}}>{ Number(Number(props.missionStats.get(stat.id) ?? 0).toFixed(1))}</span> + 
                                            <span style={{color:"#987cbc"}}>{ Number(Number(buffedStats.get(stat.id) ?? 0).toFixed(1))}</span> + 
                                            <span style={{color:"#DB9D00"}}>{ Number(Number(props.relicStats.get(stat.id) ?? 0).toFixed(1))}</span> + 
                                            <span style={{color:"#987cbc"}}>{ Number(Number(relicBuffedStats.get(stat.id) ?? 0).toFixed(1))}</span>
                                        {" )"}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <ReactTooltip id={stat.id} place="right" type="dark">
                        <div style={{fontWeight:"bold"}}>
                            {elements.map(cur =>
                                (<p key={cur.id} style={{color:colorByReward(cur.id)}}>{current(stat.id, cur.id)} {stat.icon} from {cur.icon} upgrades</p>))
                            }
                            <p style={{color:"#e5e5e5"}}>{Number(Number(props.artifactStats.get(stat.id) ?? 0).toFixed(1))} {stat.icon} from Artifacts</p>
                            <p style={{color:"#ED553B"}}>{Number(Number(props.missionStats.get(stat.id) ?? 0).toFixed(1))} {stat.icon} from Actions</p>
                            <p style={{color:"#987cbc"}}>{Number(Number(buffedStats.get(stat.id) ?? 0).toFixed(1))} {stat.icon} from Boosts</p>
                            <p style={{color:"#DB9D00"}}>{Number(Number(props.relicStats.get(stat.id) ?? 0).toFixed(1))} {stat.icon} from Relic</p>
                            <p style={{color:"#987cbc"}}>{Number(Number(relicBuffedStats.get(stat.id) ?? 0).toFixed(1))} {stat.icon} from Relic Bonus</p>
                        </div>
                    </ReactTooltip>
                </div>
            )}
        </div>
        <Tabs style={{paddingTop: "10px"}} defaultActiveKey={fire.id} className="mb-3" >
            { elements.map(cur => (<Tab eventKey={cur.id} title={cur.icon} key={cur.id}>
                <div style={{paddingBottom: "10px", textAlign: "right"}}>
                    <ToggleButtonGroup type="radio" name={"purchase-amount"+cur.id}>
                        <ToggleButton style={toogleButtonStyle(cur.id, radioValue[cur.id] === 1)} 
                            value={1} 
                            checked={radioValue === 1}
                            onChange={(e) => setRadioValue({...radioValue, [cur.id]: 1})}
                        >x1</ToggleButton>
                        <ToggleButton style={toogleButtonStyle(cur.id, radioValue[cur.id] === 10)} 
                            value={10} 
                            checked={radioValue === 10}
                            onChange={(e) => setRadioValue({...radioValue, [cur.id]: 10})}
                        >x10</ToggleButton>
                        <ToggleButton style={toogleButtonStyle(cur.id, radioValue[cur.id] === 100)} 
                            value={100} 
                            checked={radioValue === 100}
                            onChange={(e) => setRadioValue({...radioValue, [cur.id]: 100})}
                        >x100</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <table style={{width: "-webkit-fill-available", height: "150px", background:"#181818"}}>
                    <tbody>
                        <tr>
                            <td style={{width:"50%", textAlign:"center"}}>
                                <Button style={{backgroundColor:colorByReward(cur.id), borderColor:colorByReward(cur.id), width:"70%", fontWeight:"bold"}}
                                        onClick={()=>props.buyStat(attack.id, cur.id, radioValue[cur.id])}>
                                    {radioValue[cur.id]} {attack.icon} for {price(attack.id, cur.id, radioValue[cur.id])} {cur.icon}
                                </Button>
                            </td>
                            <td style={{width:"50%", textAlign:"center"}}>
                                <Button style={{backgroundColor:colorByReward(cur.id), borderColor:colorByReward(cur.id), width:"70%", fontWeight:"bold"}}
                                        onClick={()=>props.buyStat(defence.id, cur.id, radioValue[cur.id])}>
                                    {radioValue[cur.id]} {defence.icon} for {price(defence.id, cur.id, radioValue[cur.id])} {cur.icon}
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td style={{width:"50%", textAlign:"center"}}>
                                <Button style={{backgroundColor:colorByReward(cur.id), borderColor:colorByReward(cur.id), width:"70%", fontWeight:"bold"}}
                                        onClick={()=>props.buyStat(health.id, cur.id, radioValue[cur.id])}>
                                    {radioValue[cur.id]} {health.icon} for {price(health.id, cur.id, radioValue[cur.id])} {cur.icon}
                                </Button>
                            </td>
                            <td style={{width:"50%", textAlign:"center"}}>
                                <Button style={{backgroundColor:colorByReward(cur.id), borderColor:colorByReward(cur.id), width:"70%", fontWeight:"bold"}}
                                        onClick={()=>props.buyStat(regen.id, cur.id, radioValue[cur.id])}>
                                    {Number(0.1 * radioValue[cur.id]).toFixed(1)} {regen.icon} for {price(regen.id, cur.id, radioValue[cur.id])} {cur.icon}
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Tab>))
            }
        </Tabs>
    </div>
}

const MemoStats = React.memo(Stats)
const MemoBattle = React.memo(Battle)
const MemoFight = React.memo(Fight)
const MemoSkills = React.memo(Skills)
export {MemoStats, MemoBattle}

function Battle(props) {
    const [logs, setLogs] = useState([]);
    const addInfoLog = (message) => setLogs( (l) => [...l.slice(-30), {color:"#DB9D00", message:message}])
    const addEnemyLog = (message) => setLogs( (l) => [...l.slice(-30), {color:"red", message:message}])
    const addPlayerLog = (message) => setLogs( (l) => [...l.slice(-30), {color:"green", message:message}])

    const SkillsTab = props.maxlevel < 30 ? null : props.maxlevel < 35 ? <Tab eventKey={"unlock35"} title={"🔒 Reach level 35 to unlock 🔒"} disabled={true}></Tab>
                        : <Tab eventKey={"Skills"} title={"Skills"}>
                            <MemoSkills onClickSetSkills={props.onClickSetSkills} skills={props.skills} />
                        </Tab>

    return <Tabs style={{marginTop: "-2px"}} defaultActiveKey={"Fight"} className="mb-3" >
        <Tab eventKey={"Fight"} title={"Fight"}>
            <MemoFight stats={props.stats} artifactStats={props.artifactStats} relicStats={props.relicStats} missionStats={props.missionStats} stage={props.stage} 
                        stageKills={props.stageKills} changeStage={props.changeStage} killEnemy={props.killEnemy} skills={props.skills} statBonusLedger={props.statBonusLedger}
                        addEnemyLog={addEnemyLog} addPlayerLog={addPlayerLog} addInfoLog={addInfoLog}/>
        </Tab>
        {SkillsTab}
        <Tab eventKey={"Logs"} title={"Logs"}>
            <Logs logs={logs} />
        </Tab>
    </Tabs>
}

function applyStatBuffs(skills, stats){
    const buffs = {}; 
    skills.valueSeq().toList().map(x => x.buff).forEach(buff => { 
        for (let [key, value] of Object.entries(buff)) { 
            if (buffs[key]) { 
                buffs[key] += value; 
            } else {
                buffs[key] = value;
            }
        }
    });

    const keys = Object.keys(buffs)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        buffs[key] = stats.get(key)*buffs[key]
    }
    const buffedStats = Map(buffs)
    return [add(stats,buffedStats), buffedStats]
}

function applyRelicStatBuffs(relicBuff, stats){
    const buffs = {}; 
    relicBuff.entrySeq().forEach(([key, value]) =>{
        if (buffs[key]) { 
            buffs[key] += value; 
        } else {
            buffs[key] = value;
        }
    });

    const keys = Object.keys(buffs)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        buffs[key] = stats.get(key)*buffs[key]
    }
    const buffedStats = Map(buffs)
    return [add(stats,buffedStats), buffedStats]
}

function Fight(props) {
    const rf = enemyName;
    let stats = useMemo(() => applyRelicStatBuffs(props.statBonusLedger, applyStatBuffs(props.skills, add(props.stats, props.artifactStats, props.relicStats, props.missionStats))[0])[0],
                [props.stats, props.artifactStats, props.relicStats, props.missionStats, props.skills, props.statBonusLedger])
    
    const [hp,setHp] = useState(stats.get(health.id));
    const [enemy, setEnemy] = useState(Map({atk:10, def:10, hp:10, regen:1, [experience.id]:20, [gold.id]:15, element:1.5, name:rf()}));
    const [ehp,setEhp] = useState(enemy.get(health.id));
    const [hpPercentage,setHpPercentage] = useState(100);
    const [ehpPercentage,setEhpPercentage] = useState(100);
    const [alive, setAlive] = useState(stats.get(health.id)>0);

    const numberToFixed = (number, point) => Number(Number(number).toFixed(point))

    useEffect(() => {
        if(props.stage === 0){
            setEnemy(Map({atk:10, def:10, hp:10, regen:1, [experience.id]:20, [gold.id]:15, element:1.5, name:rf()}))
            setEhp(10)
        }
        else
        {
            setEnemy(Map({atk:numberToFixed(10*(1.1**props.stage),1),
                def:numberToFixed(10*(1.1**props.stage),1),
                hp:numberToFixed(10*(1.1**props.stage),1),
                regen:numberToFixed(1*(1.1**props.stage),1),
                [experience.id]:numberToFixed(20*(1.1**props.stage),1),
                [gold.id]:numberToFixed(15*(1.1**props.stage),1),
                element:numberToFixed(2*(1.1**props.stage),1), 
                name:rf()
            }))
            setEhp(numberToFixed(10*(1.1**props.stage),1));
        }
    },[props.stage])

    useInterval(() => {
        const playerDmg = numberToFixed(randomIntFromInterval(stats.get(attack.id)*10, stats.get(attack.id)*13 ) / 10, 1)
        const enemyDmg = numberToFixed(randomIntFromInterval(enemy.get(attack.id)*10, enemy.get(attack.id)*13 ) / 10, 1)
        if(alive){
            let newHp;
            const playerDmgDone = numberToFixed(Math.max(0, playerDmg-enemy.get(defence.id)),1)
            const newEhp = numberToFixed(Math.min(enemy.get(health.id), ehp+enemy.get(regen.id))- playerDmgDone ,1)
            if(ehp<=0){
                props.addPlayerLog(`You heal for ${numberToFixed(stats.get(regen.id),1)}.`)

                newHp = numberToFixed(Math.min(stats.get(health.id), hp+stats.get(regen.id)),1)
                setHp(newHp)
                setHpPercentage(newHp*100 / stats.get(health.id))
                setEnemy(enemy.set("name", rf()))
                setEhp(enemy.get(health.id))
                setEhpPercentage(100)
            }
            else
            {
                props.addEnemyLog(`Enemy ${enemy.get("name")} heals for ${enemy.get(regen.id)}.`)
                props.addPlayerLog(`You hit Enemy ${enemy.get("name")} for ${playerDmgDone}.`)

                const enemyDmgDone = numberToFixed(Math.max(0, enemyDmg-stats.get(defence.id)),1)
                newHp = numberToFixed(Math.min(stats.get(health.id), hp+stats.get(regen.id))-Math.max(0, enemyDmg-stats.get(defence.id)),1)
                
                props.addPlayerLog(`You heal for ${numberToFixed(stats.get(regen.id),1)}.`)
                props.addEnemyLog(`Enemy ${enemy.get("name")} hits You for ${enemyDmgDone}.`)
                
                setHp(newHp)
                setHpPercentage(newHp*100 / numberToFixed(stats.get(health.id),1))
                if(newEhp<=0){
                    setEhp(0)
                    setEhpPercentage(0)
                    props.killEnemy(enemy, boxOdds)
                    props.addInfoLog(`Enemy ${enemy.get("name")} was defeated.`)
                }
                else
                {
                    setEhp(newEhp)
                    setEhpPercentage(newEhp*100 / enemy.get(health.id))
                }
            }
            if(newHp<=0){
                props.addEnemyLog(`You were defeated by ${enemy.get("name")}.`)

                setHp(0)
                setHpPercentage(0)
                setAlive(false)
            }
        }
        else{
            props.addPlayerLog(`You heal for ${numberToFixed(stats.get(regen.id),1)}.`)
            if(ehp<=0){ 
                setEnemy(enemy.set("name", rf()))
                setEhp(enemy.get(health.id))
                setEhpPercentage(100)
            }
            else{
                props.addEnemyLog(`Enemy ${enemy.get("name")} heals for ${enemy.get(regen.id)}.`)
                const newEhp = numberToFixed(Math.min(enemy.get(health.id), ehp+enemy.get(regen.id)),1)
                setEhp(newEhp)
                setEhpPercentage(newEhp*100 / enemy.get(health.id))
            }
            const newHp = numberToFixed(Math.min(stats.get(health.id), hp+stats.get(regen.id)),1)
            setHp(newHp)
            setHpPercentage(newHp*100 / numberToFixed(stats.get(health.id),1))
            if(newHp === numberToFixed(stats.get(health.id),1) && newHp > 0){
                props.addInfoLog(`You have recovered.`)
                setAlive(true)
            }
        }
    },1000);

    const boxOdds = props.stage >= 70 ? [[platinum, 5],[diamond, 5]]
                    : props.stage >= 65 ? [[platinum, 7],[diamond, 3]]
                    : props.stage >= 60 ? [[sapphire, 6],[platinum, 3],[diamond, 1]]
                    : props.stage >= 55 ? [[golden, 4],[sapphire, 4],[platinum, 2]]
                    : props.stage >= 50 ? [[golden, 5],[sapphire, 4],[platinum, 1]]
                    : props.stage >= 45 ? [[golden, 6],[sapphire, 4]]
                    : props.stage >= 40 ? [[steel, 6],[golden, 4]]
                    : props.stage >= 30 ? [[wooden, 6],[steel, 4]]
                    : [[wooden, 10]]

    return <div style={{backgroundColor:"#181818" , height: "425px"}}>
        <div className="d-flex flex-row">
            <div className="p-2">
                <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                    onClick={()=>props.changeStage(props.stage-1)}> 
                    {"<<"} 
                </Button>
            </div>
            <div className="p-2 flex-grow-1 bd-highlight col-example">
                <h3 style={{color: "white", fontWeight:"bold"}}>Stage {props.stage} - {props.stageKills} kills</h3>
            </div>
            <div className="p-2">
                <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                    onClick={()=>props.changeStage(props.stage+1)}> 
                    {">>"} 
                </Button>
            </div>
        </div>
        <div>
            <p style={{color: "green", paddingLeft: "10px", fontWeight:"bold", width:"100%"}}>
                40% {enemy.get(gold.id)} {gold.icon} or 30% {enemy.get(experience.id)} {experience.icon} or 
                20% {enemy.get("element")} of {fire.icon} {water.icon} {earth.icon} {air.icon}
                {boxOdds.map(([box, odd]) =>
                    <span key={box.id}> or {odd}%<span data-tip data-for={box.id} style={{color: colorByRarity(box.rarity)}}> 1 {box.name}</span></span>
                )}
            </p>
            {boxOdds.map(([box, odd]) =>
                <BoxToolTip key={box.id} box={box}/>
            )}
        </div>
        <div className="row">
            <div className="column" style={{overflow:"hidden"}}>
                <p style={{color: colorByRarity(3), paddingLeft: "10px", fontWeight:"bold", width:"100%"}}>
                    You
                </p>
                {
                    statsList.map(stat => 
                        stat.id === attack.id ?
                        <p key={stat.id} style={{color: "white", paddingLeft: "10px", fontWeight:"bold", width:"100%"}}>
                            {stat.icon} {Number(Number(stats.get(stat.id) || 0).toFixed(1))} - {numberToFixed(Number(stats.get(stat.id) || 0).toFixed(1)*1.3, 1)}
                        </p>
                        :
                        <p key={stat.id} style={{color: "white", paddingLeft: "10px", fontWeight:"bold", width:"100%"}}>
                            {stat.icon} {Number(Number(stats.get(stat.id) || 0).toFixed(1))}
                        </p>    
                    )
                }
                <div style={{paddingLeft: "10px", paddingTop: "35px", textAlign:'-webkit-center'}}>
                    <ProgressBar style={{width:"80%", height:"30px"}} className="health" now={hpPercentage} label={`${hp}/${numberToFixed(stats.get(health.id),1)}`} />
                </div>
            </div>
            <div className="column" style={{textAlign:"end", overflow:"hidden"}}>
                <p style={{color: colorByRarity(3), paddingLeft: "10px", fontWeight:"bold", width:"100%", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                    {enemy.get("name")}
                </p>
                {
                    statsList.map(stat => 
                        stat.id === attack.id ?
                        <p key={stat.id} style={{color: "white", paddingLeft: "10px", fontWeight:"bold", width:"100%"}}>
                            {Number(Number(enemy.get(stat.id) || 0).toFixed(1))} - {numberToFixed(Number(enemy.get(stat.id) || 0).toFixed(1)*1.3, 1)} {stat.icon} 
                        </p>
                        :
                        <p key={stat.id} style={{color: "white", paddingLeft: "10px", fontWeight:"bold", width:"100%"}}>{
                            Number(Number(enemy.get(stat.id) || 0).toFixed(1))} {stat.icon} 
                        </p>  
                    )
                }
                <div style={{paddingLeft: "10px", paddingTop: "35px", textAlign:'-webkit-center'}}>
                    <ProgressBar style={{width:"80%", height:"30px"}} className="right" now={ehpPercentage} label={`${ehp}/${enemy.get(health.id)}`} />
                </div>
            </div>
        </div>
    </div>
}

function Logs(props) {
    let messagesEnd;
    useEffect(()=>{
        if(messagesEnd != undefined){
            messagesEnd.scrollIntoView({ behavior: "smooth" })
        }
    },[props.logs])

    return <div style={{backgroundColor:"#181818" , height: "370px", overflowY: "auto", display: "block"}}>
        {props.logs.map((log,index)=>
            <p key={index} style={{color: log.color, paddingLeft: "10px", fontWeight:"bold", width:"100%"}}>
                { log.message }
            </p>  
        )}
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { messagesEnd = el; }}>
        </div>
    </div>
}

function Skills(props) {
    console.log(props.skills)
    return <div style={{backgroundColor:"#181818", paddingTop:"10px", color:"white", height: "370px", overflowY: "auto", display: "block", fontWeight:"bold"}}>
        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("1") !== undefined} onChange={()=> props.onClickSetSkills({id:"1", buff:{[attack.id]:0.1}, price:{[water.id]:-1}})}
            label={`Qi flowing enhancement - (10% ${attack.icon} for -1 ${water.icon} /s)`}/></div>
        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("2") !== undefined} onChange={()=> props.onClickSetSkills({id:"2", buff:{[defence.id]:0.1}, price:{[air.id]:-1}})}
            label={`Airflow Resistance - (10% ${defence.icon} for -1 ${air.icon} /s)`}/></div>
        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("3") !== undefined} onChange={()=> props.onClickSetSkills({id:"3", buff:{[health.id]:0.1}, price:{[earth.id]:-1}})}
            label={`Natural poison resistance - (10% ${health.icon} for -1 ${earth.icon} /s)`}/></div>
        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("4") !== undefined} onChange={()=> props.onClickSetSkills({id:"4", buff:{[regen.id]:0.1}, price:{[fire.id]:-1}})}
            label={`Divine phoenix's sanction - (10% ${regen.icon} for -1 ${fire.icon} /s)`}/></div>

        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("5") !== undefined} onChange={()=> props.onClickSetSkills({id:"5", buff:{[attack.id]:0.1,[defence.id]:0.1,[health.id]:0.1,[regen.id]:0.1}, price:{[gold.id]:-20}})}
            label={`Fortune god's blessing - (10% to all stats for -20 ${gold.icon} /s)`}/></div>

        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("6") !== undefined} onChange={()=> props.onClickSetSkills({id:"6", buff:{[attack.id]:0.25}, price:{[fire.id]:-5}})}
            label={`Exploding fists - (25% ${attack.icon} for -5 ${fire.icon} /s)`}/></div>
        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("7") !== undefined} onChange={()=> props.onClickSetSkills({id:"7", buff:{[defence.id]:0.25}, price:{[earth.id]:-5}})}
            label={`Iron skin tampering - (25% ${defence.icon} for -5 ${earth.icon} /s)`}/></div>
        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("8") !== undefined} onChange={()=> props.onClickSetSkills({id:"8", buff:{[health.id]:0.25}, price:{[water.id]:-5}})}
            label={`Flowing river core - (25% ${health.icon} for -5 ${water.icon} /s)`}/></div>
        <div style={{paddingLeft:"10px"}} ><FormCheck checked={props.skills.get("9") !== undefined} onChange={()=> props.onClickSetSkills({id:"9", buff:{[regen.id]:0.25}, price:{[air.id]:-5}})}
            label={`Rejuvenating meditation - (25% ${regen.icon} for -5 ${air.icon} /s)`}/></div>
    </div>
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }