import React, {useState, useEffect, useMemo} from 'react';
import { MemoItemTd as Item } from './shop'
import { add, buy, inTheBlack, pouchEffectsLedger, scale } from "merchant.js";
import { currencies, elements, currencyById, soul, fire, water, earth, air, gold, experience } from './currencies';
import { ArtifactType, colorByRarity, colorByReward, generate_artifact, generate_relic, randomIntFromInterval, RelicType } from "./items";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { attack, defence, health, regen, statsList } from "./stats"
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Map } from "immutable";
import { v4 as uuidv4} from 'uuid';

const config = require('../next.config')

const relicBuff = (reward, n) => {
    var reward_gold = () => n>1 ? Number(expectedSumOfRandomNumbers(8,10,n)*0.01).toFixed(2) : randomIntFromInterval(8,10)*0.01
    var reward_elem = () => n>1 ? Number(expectedSumOfRandomNumbers(10,30,n)*0.001).toFixed(3) : randomIntFromInterval(10,30)*0.001
    var reward_experience = () => n>1 ? Number(expectedSumOfRandomNumbers(3,6,n)*0.25).toFixed(2) : randomIntFromInterval(3,6)*0.25
    switch (reward.id) {
        case fire.id:
        case water.id:
        case earth.id:
        case air.id:
            return Map({[reward.id]: Number(reward_elem())})
        case gold.id:
            return Map({[gold.id]: Number(reward_gold())})
        case experience.id:
            return Map({[experience.id]: Number(reward_experience())})
        case attack.id:
        case defence.id:
        case health.id:
            return Map({[reward.id]: 1*n})
        case regen.id:
            return Map({[regen.id]: 0.1*n})
        default:
            return 0
    }
}

const expectedSumOfRandomNumbers = (min, max, n) => {
    const mean = n * (min + max) / 2;
    const stdDev = Math.sqrt(n * (max - min + 1) ** 2 / 12);
    return mean + stdDev * standardNormalRandom();
}

const standardNormalRandom = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const relicCost = (reward, n) => {
    switch (reward.id) {
        case fire.id:
        case water.id:
        case earth.id:
        case air.id:
            return Map({[reward.id]: -25*n, [soul.id]: -1*n})
        case gold.id:
            return Map({[gold.id]: -1000*n, [soul.id]: -1*n})
        case experience.id:
            return Map({[experience.id]: -10000*n, [soul.id]: -1*n})
        case attack.id:
        case defence.id:
        case health.id:
        case regen.id:
            return Map({[soul.id]: -1*n})
        default:
            return 0
    }
}

const relicBuffText = (reward, n) => {
    switch (reward.id) {
        case fire.id:
        case water.id:
        case earth.id:
        case air.id:
            return `${Number(0.010*n)} to ${Number(0.030*n)} ${reward.icon}/s for ${n}${soul.icon} and ${25*n}${reward.icon}`
        case gold.id:
            return `${Number(0.080*n)} to ${Number(0.100*n)} ${reward.icon}/s for ${n}${soul.icon} and ${n*1000}${reward.icon}`
        case experience.id:
            return `${Number(0.75*n)} to ${Number(1.50*n)} ${reward.icon}/s for ${n}${soul.icon} and ${n*10000}${reward.icon}`
        case attack.id:
        case defence.id:
        case health.id:
            return `${n} ${reward.icon} for ${n}${soul.icon}`
        case regen.id:
            return `${Number(n*0.1).toFixed(1)} ${reward.icon} for ${n}${soul.icon}`
        default:
            return ""
    }
}

function Upgrade(props) {
    const soulEnhancementTab = props.maxlevel < 25 ? <Tab eventKey={"unlock25"} title={"🔒 Reach level 25 to unlock 🔒"} disabled={true}></Tab>
                                : <Tab eventKey={"SoulEnhancement"} title={"Soul Enhancement"}>
                                    <MemoSoulEnhancement info={props.info} buyEnhancement={props.buyEnhancement} maxlevel={props.maxlevel} />
                                </Tab>


    const mergeRelicTab = props.maxlevel < 35 ? null : props.maxlevel < 40 ? <Tab eventKey={"unlock40"} title={"🔒 Reach level 40 to unlock 🔒"} disabled={true}></Tab>
                        : <Tab eventKey={"MergeRelic"} title={"Relic Transfusion"}>
                            <MemoMergeRelic upgradeRelic={props.upgradeRelic} items={props.items} relic={props.relic} mergebst={props.mergebst}/>
                        </Tab>
                        
    const mergeItemsTab = props.maxlevel < 40 ? null : props.maxlevel < 45 ? <Tab eventKey={"unlock45"} title={"🔒 Reach level 45 to unlock 🔒"} disabled={true}></Tab>
    : <Tab eventKey={"MergeItems"} title={"Item fusion"}>
        <MemoMergeItems items={props.items} relic={props.relic} buy={props.buy} level={props.level} aBStatsMult={props.aBStatsMult} lastMergedId={props.lastMergedId}/>
    </Tab>

    return <Tabs defaultActiveKey={"SoulShop"} className="mb-3" >
            <Tab eventKey={"SoulShop"} title={"Soul Shop"}>
                <MemoSoulShop buyElement={props.buyElement} />
            </Tab>
            {soulEnhancementTab}
            {mergeRelicTab}
            {mergeItemsTab}
        </Tabs>
}

function BasicUpgrade(props) {
    const [radioValue, setRadioValue] = useState(1);
    if( props.relic.id === undefined){
        return null
    }
    const relicEffects = props.relic.effect()
    const relicStats = props.relic.statEffect
    const addReward = (reward) => {
        const res = add(relicBuff(reward, radioValue), relicEffects)
        console.log(res)
        const relic = {...props.relic, id:uuidv4(), effect: () => res}
        props.upgradeRelic(relic, relicCost(reward, radioValue))
    }

    const addStatReward = (stat) => {
        const res = add(relicBuff(stat, radioValue), relicStats)
        const relic = {...props.relic, id:uuidv4(), statEffect: res}
        props.upgradeRelic(relic, relicCost(stat, radioValue))
    }
    const toogleButtonStyle = (checked) => ({backgroundColor: checked?"#005256":"#068488", borderColor:"#181818", fontWeight:"bold", width:"100px"})

    return (
        <div>
            <div style={{ textAlign:'-webkit-center'}}>
                <table style={{paddingLeft:"10px"}}>
                <tbody>
                    <tr>
                    <Item item={props.relic} delay place="right"/>
                    </tr>
                </tbody>
                </table>
            </div>
            <div style={{paddingBottom: "10px", paddingTop:"10px", paddingRight:"17px", marginTop:"10px", textAlign: "right", background:"#181818"}}>
                <ToggleButtonGroup type="radio" name={"purchase-amount"}>
                    <ToggleButton style={toogleButtonStyle(radioValue === 1)} 
                        value={1} 
                        checked={radioValue === 1}
                        onChange={(e) => setRadioValue(1)}
                    >x1</ToggleButton>
                    <ToggleButton style={toogleButtonStyle(radioValue === 10)} 
                        value={10} 
                        checked={radioValue === 10}
                        onChange={(e) => setRadioValue(10)}
                    >x10</ToggleButton>
                    <ToggleButton style={toogleButtonStyle(radioValue === 100)} 
                        value={100} 
                        checked={radioValue === 100}
                        onChange={(e) => setRadioValue(100)}
                    >x100</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div style={{background:"#181818", paddingTop:"5px", paddingBottom:"5px", display:"block", overflowY:"auto", height:"300px"}}>
                <table className='invisibleTable' style={{display:"table", width:"100%"}}>
                    <tbody>
                        {currencies.map((currency) =>
                            <tr key={currency.id}>
                                <td>
                                    <p style={{color: "green", paddingLeft:"10px", fontWeight:"bold"}}>{Number(relicEffects.get(currency.id) || 0).toFixed(3)} {currency.icon} /s </p>
                                </td>
                                <td style={{textAlign:"right", paddingRight:"10px"}}>
                                    <Button style={{backgroundColor:colorByReward(currency.id), borderColor:colorByReward(currency.id), width:"70%", fontWeight:"bold"}} onClick={() => addReward(currency)}>
                                        {relicBuffText(currency, radioValue)}
                                    </Button>
                                </td>
                            </tr>)
                        }
                        { props.maxlevel < 30 ? null : props.maxlevel < 35 ? <tr><td colSpan={2}><p style={{padding:"10px",color:"white", background:"#494949", fontWeight:"bold"}}> 🔒 Reach level 35 to unlock 🔒</p></td></tr>
                            :statsList.map((stat) =>
                          <tr key={stat.id}>
                                <td>
                                    <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>{Number(Number(relicStats.get(stat.id) || 0).toFixed(1))} {stat.icon}  </p>
                                </td>
                                <td style={{textAlign:"right", paddingRight:"10px"}}>
                                    <Button style={{backgroundColor: "white", borderColor:"white", color:"black", width:"70%", fontWeight:"bold"}} onClick={() => addStatReward(stat)}>
                                        {relicBuffText(stat, radioValue)}
                                    </Button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function MergeRelic(props) {
    const [selected, setSelected] = useState({})
    const [result, setResult] = useState({})

    useEffect(()=>{
        if(selected.effect !== undefined){
            const percentage = 0.2 + Number(props.mergebst * 0.02)
            let mreseffect = props.relic.effect()
            if(selected.effect().get("mission") !== undefined){
                const mres = scale(Map(selected.effect().get("mission")), percentage)
                mreseffect = mreseffect.set("mission", add(Map(mreseffect.get("mission") ?? {}), mres).toObject())
            }
            if(selected.effect().get("artifactBonus") !== undefined){
                const mres = scale(Map(selected.effect().get("artifactBonus")), percentage)
                mreseffect = mreseffect.set("artifactBonus", add(Map(mreseffect.get("artifactBonus") ?? {}), mres).toObject())
            }
            if(selected.effect().get("statBonus") !== undefined){
                const mres = scale(Map(selected.effect().get("statBonus")), percentage)
                mreseffect = mreseffect.set("statBonus", add(Map(mreseffect.get("statBonus") ?? {}), mres).toObject())
            }
            const res = {...props.relic, effect: () => mreseffect, id: uuidv4()}
            setSelected({})
            setResult(res)
        }
    }
    ,[props.relic.id, props.items, props.mergebst])

    const addReward = () => {
        if(selected.id != undefined){
            props.upgradeRelic(result, Map({[soul.id]: -10}), selected.id)
            setSelected({})
            setResult({})
        }
    }

    function splitToChunks(list, elementsPerSubArray) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(list[i]);
        }
        return matrix;
    }

    const select = useMemo(() => (e) => {
        let mreseffect = props.relic.effect()
        let eseffect = e.effect()
        const percentage = 0.2 + Number(props.mergebst * 0.02)
        if(eseffect.get("mission") !== undefined){
            const mres = scale(Map(e.effect().get("mission")), percentage)
            mreseffect = mreseffect.set("mission", add(Map(mreseffect.get("mission") ?? {}), mres).toObject())
        }
        if(eseffect.get("artifactBonus") !== undefined){
            const mres = scale(Map(e.effect().get("artifactBonus")), percentage)
            mreseffect = mreseffect.set("artifactBonus", add(Map(mreseffect.get("artifactBonus") ?? {}), mres).toObject())
        }
        if(eseffect.get("statBonus") !== undefined){
            const mres = scale(Map(e.effect().get("statBonus")), percentage)
            mreseffect = mreseffect.set("statBonus", add(Map(mreseffect.get("statBonus") ?? {}), mres).toObject())
        }
        const res = {...props.relic, effect: () => mreseffect, id: uuidv4()}
        setSelected(e)
        setResult(res)
    },[props.relic.id, props.mergebst])

    const fun = () => splitToChunks(props.items.filter(i => i.type === RelicType && i.rarity >=3 && i.id !== props.relic.id),5).map((row, index) => (
        <tr key={index}>
          {row.map((item) => {
            return <Item key={item.id} item={item} onClick={select} selected={selected}/>
            }
          )}
        </tr>)
    )

    return (
        <div>
            <p style={{color: "white", fontWeight:"bold"}}>Absortion rate: { 20 + Number(props.mergebst * 2)}%</p>
            <div className="row">
                <div className="column">
                    <table style={{paddingLeft:"10px", width:"fit-content"}}>
                    <tbody>
                        <tr>
                        <Item item={props.relic} delay place="right"/>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className="column">
                    <div style={{ width: 100, height:100 ,position: "relative", height: "100px", backgroundImage: `url(${config.basePath+"/plus.png"})`, alignSelf:'center'}}/>
                </div>
                <div className="column">
                    <table style={{paddingLeft:"10px", width:"fit-content"}}>
                    <tbody>
                        <tr>
                            {selected.id && <Item item={selected}/>}
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className="column">
                    <div style={{ width: 100, height:100 ,position: "relative", height: "100px", backgroundImage: `url(${config.basePath+"/equals.png"})`, alignSelf:'center'}}/>
                </div>
                <div className="column">
                    <table style={{paddingLeft:"10px", width:"fit-content"}}>
                    <tbody>
                        <tr>
                        {result.id && <Item item={result} delay/>}
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <div style={{paddingTop:"15px"}}>
                <table style={{ width: "100%", height: "220px", overflowY: "auto", display: "block"}}>  
                    <tbody>
                        {fun()}
                    </tbody>
                </table>
            </div>
            <div style={{paddingTop:"15px", textAlign:"center"}}>
                <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} onClick={addReward}>
                    Merge - 10 {soul.icon}
                </Button>
            </div>
        </div>
    )
}


function SoulShop(props) {
    return <div>
            <table className='invisibleTable' style={{width: "-webkit-fill-available", height: "425px", overflowY: "auto", display: "block", background:"#181818"}}>
                <tbody style={{display:"table", width: "100%"}}>
                    <tr>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 25 {fire.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 25 {water.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 25 {earth.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 25 {air.icon}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button style={{backgroundColor:colorByReward(fire.id), borderColor:colorByReward(fire.id), width:"100%", fontWeight:"bold", marginBottom: "10px"}}
                                onClick={()=> props.buyElement(Map({[fire.id]:25, [soul.id]:-1}))}>
                                Buy for 1 {soul.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(water.id), borderColor:colorByReward(water.id), width:"100%", fontWeight:"bold", marginBottom: "10px"}}
                                onClick={()=> props.buyElement(Map({[water.id]:25, [soul.id]:-1}))}>
                                Buy for 1 {soul.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(earth.id), borderColor:colorByReward(earth.id), width:"100%", fontWeight:"bold", marginBottom: "10px"}}
                                onClick={()=> props.buyElement(Map({[earth.id]:25, [soul.id]:-1}))}>
                                Buy for 1 {soul.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(air.id), borderColor:colorByReward(air.id), width:"100%", fontWeight:"bold", marginBottom: "10px"}}
                                onClick={()=> props.buyElement(Map({[air.id]:25, [soul.id]:-1}))}>
                                Buy for 1 {soul.icon}
                            </Button>
                        </td>
                    </tr>

                    <tr style={{paddingTop:"15px"}}>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 250 {fire.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 250 {water.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 250 {earth.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 250 {air.icon}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button style={{backgroundColor:colorByReward(fire.id), borderColor:colorByReward(fire.id), width:"100%", fontWeight:"bold", marginBottom: "10px"}}
                                onClick={()=> props.buyElement(Map({[fire.id]:250, [gold.id]:-10000}))}>
                                Buy for 10000 {gold.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(water.id), borderColor:colorByReward(water.id), width:"100%", fontWeight:"bold", marginBottom: "10px"}}
                                onClick={()=> props.buyElement(Map({[water.id]:250, [gold.id]:-10000}))}>
                                Buy for 10000 {gold.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(earth.id), borderColor:colorByReward(earth.id), width:"100%", fontWeight:"bold", marginBottom: "10px"}}
                                onClick={()=> props.buyElement(Map({[earth.id]:250, [gold.id]:-10000}))}>
                                Buy for 10000 {gold.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(air.id), borderColor:colorByReward(air.id), width:"100%", fontWeight:"bold", marginBottom: "10px"}}
                                onClick={()=> props.buyElement(Map({[air.id]:250, [gold.id]:-10000}))}>
                                Buy for 10000 {gold.icon}
                            </Button>
                        </td>
                    </tr>
                    
                    <tr style={{paddingTop:"15px"}}>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 300 {experience.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 300 {experience.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 300 {experience.icon}</h1>
                        </td>
                        <td style={{textAlign:"center"}}>
                            <h1 style={{color:"white", background:"#494949", fontWeight:"bold"}}> 300 {experience.icon}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button style={{backgroundColor:colorByReward(fire.id), borderColor:colorByReward(fire.id), width:"100%", fontWeight:"bold"}}
                                onClick={()=> props.buyElement(Map({[experience.id]:300, [fire.id]:-100}))}>
                                Buy for 100 {fire.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(water.id), borderColor:colorByReward(water.id), width:"100%", fontWeight:"bold"}}
                                onClick={()=> props.buyElement(Map({[experience.id]:300, [water.id]:-100}))}>
                                Buy for 100 {water.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(earth.id), borderColor:colorByReward(earth.id), width:"100%", fontWeight:"bold"}}
                                onClick={()=> props.buyElement(Map({[experience.id]:300, [earth.id]:-100}))}>
                                Buy for 100 {earth.icon}
                            </Button>
                        </td>
                        <td>
                            <Button style={{backgroundColor:colorByReward(air.id), borderColor:colorByReward(air.id), width:"100%", fontWeight:"bold"}}
                                onClick={()=> props.buyElement(Map({[experience.id]:300, [air.id]:-100}))}>
                                Buy for 100 {air.icon}
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
}


function SoulEnhancement(props) {
    const cdPrice = [1,2,5,10,25,50,100,200,500,1000]

    return <div style={{background:"#181818", marginTop:"20px", paddingTop:"10px", paddingBottom:"10px", height:"420px", display:"block", overflowY:"auto"}}>
        <table className='invisibleTable' style={{display:"table", width:"100%"}}>
            <tbody>
                <tr key="soulBonus">
                    <td>
                        <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                            {props.info.get("soulBonus") === undefined ? 0 : props.info.get("soulBonus")*5 }% bonus to {soul.icon} gained in reincarnation (Max:50%)
                        </p>
                    </td>
                    <td style={{textAlign:"right", paddingRight:"10px"}}>
                        <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number(props.info.get("soulBonus") ?? 0)>=10}
                            onClick={()=>props.buyEnhancement("soulBonus", Map({[soul.id]:-cdPrice[Number(props.info.get("soulBonus") ?? 0)]}))}>
                            {Number(props.info.get("soulBonus") ?? 0)>=10 ? "Purchased" : "+5% for " + cdPrice[Number(props.info.get("soulBonus") ?? 0)] + " "+ soul.icon}
                        </Button>
                    </td>
                </tr>
                <tr key="shopcd">
                    <td>
                        <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                            Shop cooldown: {props.info.get("shopcd") === undefined ? 0 : -props.info.get("shopcd") } cooldown (Max:10)
                        </p>
                    </td>
                    <td style={{textAlign:"right", paddingRight:"10px"}}>
                        <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number(props.info.get("shopcd") ?? 0)>=10}
                            onClick={()=>props.buyEnhancement("shopcd", Map({[soul.id]:-cdPrice[Number(props.info.get("shopcd") ?? 0)]}))}>
                            {Number(props.info.get("shopcd") ?? 0)>=10 ? "Purchased" : "-1 second for " + cdPrice[Number(props.info.get("shopcd") ?? 0)] + " "+ soul.icon}
                        </Button>
                    </td>
                </tr>
                <tr key="shopal">
                    <td>
                        <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                            Shop Artifact Luck: {props.info.get("shopal") === undefined ? 0 : props.info.get("shopal") } luck (Max:10)
                        </p>
                    </td>
                    <td style={{textAlign:"right", paddingRight:"10px"}}>
                        <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number(props.info.get("shopal") ?? 0)>=10}
                            onClick={()=>props.buyEnhancement("shopal", Map({[soul.id]:-cdPrice[Number(props.info.get("shopal") ?? 0)]}))}>
                            {Number(props.info.get("shopal") ?? 0)>=10 ? "Purchased" : "+1 luck for " + cdPrice[Number(props.info.get("shopal") ?? 0)] + " "+ soul.icon}
                        </Button>
                    </td>
                </tr>
                <tr key="shopal2">
                    <td colSpan={2}>
                        <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                            Current odds for artifacts are 
                            <span style={{color:colorByRarity(1)}}> Common {Number(((70-Number(props.info.get("shopal") ?? 0))*100)/(100-Number(props.info.get("shopal") ?? 0))).toFixed(1)}% </span>
                            <span style={{color:colorByRarity(2)}}>Rare {Number((25*100)/(100-Number(props.info.get("shopal") ?? 0))).toFixed(1)}% </span>
                            <span style={{color:colorByRarity(3)}}>Epic {Number((4*100)/(100-Number(props.info.get("shopal") ?? 0))).toFixed(1)}% </span>
                            <span style={{color:colorByRarity(4)}}>Legendary {Number((1*100)/(100-Number(props.info.get("shopal") ?? 0))).toFixed(2)}% </span>
                        </p>
                    </td>
                </tr>
                <tr key="shoprl">
                    <td>
                        <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                            Shop Relic Luck: {props.info.get("shoprl") === undefined ? 0 : props.info.get("shoprl") } luck (Max:10)
                        </p>
                    </td>
                    <td style={{textAlign:"right", paddingRight:"10px"}}>
                        <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number(props.info.get("shoprl") ?? 0)>=10}
                            onClick={()=>props.buyEnhancement("shoprl", Map({[soul.id]:-cdPrice[Number(props.info.get("shoprl") ?? 0)]}))}>
                            {Number(props.info.get("shoprl") ?? 0)>=10 ? "Purchased" : "+1 luck for " + cdPrice[Number(props.info.get("shoprl") ?? 0)] + " "+ soul.icon}
                        </Button>
                    </td>
                </tr>
                <tr key="shoprl2">
                    <td colSpan={2}>
                        <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                            Current odds for relics are 
                            <span style={{color:colorByRarity(2)}}> Rare {Number(((90-Number(props.info.get("shoprl") ?? 0))*100)/(100-Number(props.info.get("shoprl") ?? 0))).toFixed(1)}% </span>
                            <span style={{color:colorByRarity(3)}}>Epic {Number((8*100)/(100-Number(props.info.get("shoprl") ?? 0))).toFixed(1)}% </span>
                            <span style={{color:colorByRarity(4)}}>Legendary {Number((2*100)/(100-Number(props.info.get("shoprl") ?? 0))).toFixed(2)}% </span>
                        </p>
                    </td>
                </tr>
                <tr key="shoprefr">
                    <td>
                        <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                            Shop Max Refreshs: {props.info.get("shoprefr") === undefined ? 0 : props.info.get("shoprefr") } refreshs (Max:10)
                        </p>
                    </td>
                    <td style={{textAlign:"right", paddingRight:"10px"}}>
                        <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number(props.info.get("shoprefr") ?? 0)>=10}
                            onClick={()=>props.buyEnhancement("shoprefr", Map({[soul.id]:-cdPrice[Number(props.info.get("shoprefr") ?? 0)]}))}>
                            {Number(props.info.get("shoprefr") ?? 0)>=10 ? "Purchased" : "+1 shop max refresh " + cdPrice[Number(props.info.get("shoprefr") ?? 0)] + " "+ soul.icon}
                        </Button>
                    </td>
                </tr>
                { props.maxlevel < 30 ? null : props.maxlevel < 35 ? <tr><td colSpan={2}><p style={{padding:"10px",color:"white", background:"#494949", fontWeight:"bold"}}> 🔒 Reach level 35 to unlock 🔒</p></td></tr>
                    : currencies.map((currency) =>
                    <tr key={currency.id}>
                        <td>
                            <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                                Boost {currency.icon} artifacts and relics: {props.info.get(currency.id+"bst") === undefined ? 0 : props.info.get(currency.id+"bst")*3}% applied on reincarnation (Max:30%)
                            </p>
                        </td>
                        <td style={{textAlign:"right", paddingRight:"10px"}}>
                            <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number(props.info.get(currency.id+"bst") ?? 0)>=10}
                                onClick={()=>props.buyEnhancement(currency.id+"bst", Map({[soul.id]:-cdPrice[Number(props.info.get(currency.id+"bst") ?? 0)]}))}>
                                {Number(props.info.get(currency.id+"bst") ?? 0)>=10 ? "Purchased" : "3% for " + cdPrice[Number(props.info.get(currency.id+"bst") ?? 0)] + " "+ soul.icon}
                            </Button>
                        </td>
                    </tr>
                    )
                }
                { props.maxlevel < 45 ? null : props.maxlevel < 50 ? <tr><td colSpan={2}><p style={{padding:"10px",color:"white", background:"#494949", fontWeight:"bold"}}> 🔒 Reach level 50 to unlock 🔒</p></td></tr>
                    : 
                    [<tr key="mergebst">
                        <td>
                            <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                                Boost relic merge absortion rate: +{props.info.get("mergebst") === undefined ? 0 : props.info.get("mergebst")*2}% (Max:20%)
                            </p>
                        </td>
                        <td style={{textAlign:"right", paddingRight:"10px"}}>
                            <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number(props.info.get("mergebst") ?? 0)>=10}
                                onClick={()=>props.buyEnhancement("mergebst", Map({[soul.id]:-cdPrice[Number(props.info.get("mergebst") ?? 0)]}))}>
                                {Number(props.info.get("mergebst") ?? 0)>=10 ? "Purchased" : "2% for " + cdPrice[Number(props.info.get("mergebst") ?? 0)] + " "+ soul.icon}
                            </Button>
                        </td>
                    </tr>,
                    <tr key="doubleC">
                        <td>
                            <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                                Fight reward double chance: +{props.info.get("doubleC") === undefined ? 0 : props.info.get("doubleC")*2}% (Max:20%)
                            </p>
                        </td>
                        <td style={{textAlign:"right", paddingRight:"10px"}}>
                            <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number(props.info.get("doubleC") ?? 0)>=10}
                                onClick={()=>props.buyEnhancement("doubleC", Map({[soul.id]:-cdPrice[Number(props.info.get("doubleC") ?? 0)]}))}>
                                {Number(props.info.get("doubleC") ?? 0)>=10 ? "Purchased" : "2% for " + cdPrice[Number(props.info.get("doubleC") ?? 0)] + " "+ soul.icon}
                            </Button>
                        </td>
                    </tr>,
                    <tr key="aBStatsMult">
                        <td>
                            <p style={{color: "white", paddingLeft:"10px", fontWeight:"bold"}}>
                                Artifact Battle stats multiplier: x{props.info.get("aBStatsMult") === undefined ? 1 : props.info.get("aBStatsMult")+1} (Max:x10)
                            </p>
                        </td>
                        <td style={{textAlign:"right", paddingRight:"10px"}}>
                            <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} disabled={Number((props.info.get("aBStatsMult") ?? 0)+1)>=10}
                                onClick={()=>props.buyEnhancement("aBStatsMult", Map({[soul.id]:-cdPrice[Number((props.info.get("aBStatsMult") ?? 0)+1)]}))}>
                                {Number((props.info.get("aBStatsMult") ?? 0)+1)>=10 ? "Purchased" : "x" + Number((props.info.get("aBStatsMult") ?? 0)+2) + " for " + cdPrice[Number((props.info.get("aBStatsMult") ?? 0)+1)] + " "+ soul.icon}
                            </Button>
                        </td>
                    </tr>]
                }
            </tbody>
        </table>
    </div>
}

const MemoSoulShop = React.memo(SoulShop)
const MemoSoulEnhancement = React.memo(SoulEnhancement)
const MemoMergeRelic = React.memo(MergeRelic)
const MemoMergeItems = React.memo(MergeItems)
const MemoUpgrade = React.memo(Upgrade)
const MemoBasicUpgrade = React.memo(BasicUpgrade)
export {MemoUpgrade, MemoBasicUpgrade}

function MergeItems(props) {
    const [selected, setSelected] = useState([])
    const [rarity, setRarity] = useState(0)
    const [rarityFilter, setRarityFilter] = useState(0)
    const [stype, setStype] = useState("")
    const [result, setResult] = useState({})
    const [artifactSkip, setArtifactSkip] = useState(1);
    const [relicSkip, setRelicSkip] = useState(1);
    
    const addReward = () => {
        if(selected.id != undefined){
            setSelected([])
        }
    }

    function splitToChunks(list, elementsPerSubArray) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(list[i]);
        }
        return matrix;
    }
    
    useEffect(()=>{
        if(selected.length>0 && props.lastMergedId !== null && props.lastMergedId !== undefined){
            const filtered = selected.filter(i => i.id !== props.lastMergedId)
            setSelected(filtered)
            if(filtered.length === 0){
                setRarity(0)
                setRarityFilter(0)
                setStype("")
            }
        }
    }
    ,[props.lastMergedId])


    const select = useMemo(() => (e) => {
        if(e.rarity===4){
            setResult({})
            setSelected([e ])
            setRarity(e.rarity)
            setStype(e.type) 
        }
        else{
            setResult({})
            setSelected([...selected.slice(-4), e ])
            setRarity(e.rarity)
            setStype(e.type)   
        }
    },[selected])

    const unselect = useMemo(() => (e) => {
        const filtered = selected.filter(i => i.id !== e.id)
        setSelected(filtered)
        if(filtered.length === 0){
            setRarity(rarityFilter)
            setStype("")
        }
    },[selected])

    const fun = (type, r) => splitToChunks(props.items.filter(i => (r === 0 || r === i.rarity) && (stype===""|| stype===type) && i.type === type 
                                            && i.id !== props.relic.id && !selected.some(x=> x.id === i.id)),5)
                                            .splice(type == ArtifactType ? (artifactSkip-1)*5 : (relicSkip-1)*5 , 5)
                                            .map((row, index) => (
        <tr key={index}>
          {row.map((item) => {
            return <Item key={item.id} item={item} onClick={select} origin={"U"} />
            }
          )}
        </tr>)
    )

    const rarityTest = (rarity) =>{
        switch (rarity) {
            case 1:
                return `Merge items 100${fire.icon} 100${water.icon} 100${earth.icon} 100${air.icon} 1000${gold.icon} `
            case 2:
                return `Merge items 250${fire.icon} 250${water.icon} 250${earth.icon} 250${air.icon} 2500${gold.icon} `
            case 3:
                return `Merge items 1000${fire.icon} 1000${water.icon} 1000${earth.icon} 1000${air.icon} 10000${gold.icon} `
            case 4:
                return `Reroll item 5${soul.icon}`
            default:
                return "Select items to merge"
        }
    }

    const rarityCost = (rarity) => {
        switch (rarity) {
            case 1:
                return Map({[fire.id]:-100, [water.id]:-100, [earth.id]:-100, [air.id]:-100, [gold.id]:-1000})
            case 2:
                return Map({[fire.id]:-250, [water.id]:-250, [earth.id]:-250, [air.id]:-250, [gold.id]:-2500})
            case 3:
                return Map({[fire.id]:-1000, [water.id]:-1000, [earth.id]:-1000, [air.id]:-1000, [gold.id]:-10000})
            case 4:
                return Map({[soul.id]:-5})
            default:
                return "Select items to merge"
        }
    }

    const buy = () => {
        if((selected.length === 5 || (selected.length === 1 && rarity === 4)) && rarity>0 && stype!==""){
            const func = stype === ArtifactType ? generate_artifact : generate_relic
            let item = func(props.level, {aBStatsMult:props.aBStatsMult}, Math.min(rarity+1,4))
            item = {...item, cost: ()=>rarityCost(rarity)}
            if(props.buy( item, false, selected)){
                setResult(item)
                setSelected([])
                setRarity(rarityFilter)
                setStype("")
            }
        }
    }

    const artifactCount = props.items.filter(i => (rarity === 0 || rarity === i.rarity) && i.type === ArtifactType).length
    const artifactPages = artifactCount > 0 ? Math.ceil(artifactCount / 25) : 1 
    const relicCount = props.items.filter(i => (rarity === 0 || rarity === i.rarity) && i.type === RelicType).length
    const relicPages = relicCount > 0 ? Math.ceil(relicCount / 25) : 1 
    
    const changeArtifactSkip = (i) => {
        if(i>0 && i<=artifactPages)
            setArtifactSkip(i)
    }
    const changeRelicSkip = (i) => {
        if(i>0 && i<=relicPages)
            setRelicSkip(i)
    }

    if(artifactPages < artifactSkip){
        setArtifactSkip(artifactPages)
    } 
    if(relicPages < relicSkip){
        setRelicSkip(relicPages)
    }

    return (
        <div style={{background:"#181818",padding: "10px"}}>
            <div className="d-flex flex-row">
            <div className="p-1">
            {
                result.id !==undefined 
                ? <p style={{color:"white", fontWeight:"bold"}}>Merge result was:</p>
                : <p style={{color:"white", fontWeight:"bold"}}>Selected: 
                    <span style={{fontWeight:"bold", color:selected.length===5 ||(selected.length===1 && rarity===4) ?"green":"red"}}> {selected.length}/{rarity===4?1:5}</span>
                </p>
            }
            </div>
            <div className="p-1 flex-grow-1 bd-highlight col-example"/>
            <div>
                <Button style={{backgroundColor:(rarity === 0 || rarity === 1) ? colorByRarity(1) : "#333333", borderColor:"black", width:"30px", height:"30px", marginRight:"10px"}}
                onClick={() => {if(selected.length === 0) {setRarityFilter(rarity === 1 ? 0 : 1); setRarity(rarity === 1 ? 0 : 1)}}}/>
                <Button style={{backgroundColor:(rarity === 0 || rarity === 2) ? colorByRarity(2) : "#333333", borderColor:"black", width:"30px", height:"30px", marginRight:"10px"}}
                onClick={() => {if(selected.length === 0) {setRarityFilter(rarity === 2 ? 0 : 2); setRarity(rarity === 2 ? 0 : 2)}}}/>
                <Button style={{backgroundColor:(rarity === 0 || rarity === 3) ? colorByRarity(3) : "#333333", borderColor:"black", width:"30px", height:"30px", marginRight:"10px"}}
                onClick={() => {if(selected.length === 0) {setRarityFilter(rarity === 3 ? 0 : 3); setRarity(rarity === 3 ? 0 : 3)}}}/>
                <Button style={{backgroundColor:(rarity === 0 || rarity === 4) ? colorByRarity(4) : "#333333", borderColor:"black", width:"30px", height:"30px", marginRight:"10px"}}
                onClick={() => {if(selected.length === 0) {setRarityFilter(rarity === 4 ? 0 : 4); setRarity(rarity === 4 ? 0 : 4)}}}/>
            </div>

            </div>
            <div className="row">
                <div className="column">
                    <table style={{paddingLeft:"10px", width:"fit-content", height: "105px", alignSelf: result.id !==undefined ? "center" : "start"}}>
                    <tbody>
                    <tr>
                        { result.id !==undefined ?
                            <td><Item item={result} origin={"Re"} /></td>
                            :selected.map((item, index) => (
                                <td key={index}>
                                    <Item key={item.id} item={item} onClick={unselect}/>
                                </td>)
                            )}
                    </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <Tabs defaultActiveKey={"Artifacts"} className="mb-3" style={{paddingTop:"15px"}} >
                <Tab eventKey={"Artifacts"} title={"Artifacts"}>
                    <div>
                        <table style={{ width: "100%", height: "135px", overflowY: "auto", display: "block"}}>  
                            <tbody>
                                {fun(ArtifactType, rarity)}
                            </tbody>
                        </table>
                        <div className="d-flex flex-row">
                            <div className="p-2">
                                <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                                    onClick={()=>changeArtifactSkip(artifactSkip-1)}> 
                                    {"<<"} 
                                </Button>
                            </div>
                            <div className="p-2 flex-grow-1 bd-highlight col-example">
                                <p style={{color: "white", fontWeight:"bold", textAlign:"center"}}>Page {artifactSkip} of {artifactPages}</p>
                            </div>
                            <div className="p-2">
                                <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                                    onClick={()=>changeArtifactSkip(artifactSkip+1)}> 
                                    {">>"} 
                                </Button>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={"Relics"} title={"Relics"}>
                    <div>
                        <table style={{ width: "100%", height: "135px", overflowY: "auto", display: "block"}}>  
                            <tbody>
                                {fun(RelicType, rarity)}
                            </tbody>
                        </table>
                        <div className="d-flex flex-row">
                            <div className="p-2">
                                <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                                    onClick={()=>changeRelicSkip(relicSkip-1)}> 
                                    {"<<"} 
                                </Button>
                            </div>
                            <div className="p-2 flex-grow-1 bd-highlight col-example">
                            <p style={{color: "white", fontWeight:"bold", textAlign:"center"}}>Page {relicSkip} of {relicPages}</p>
                            </div>
                            <div className="p-2">
                                <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                                    onClick={()=>changeRelicSkip(relicSkip+1)}> 
                                    {">>"} 
                                </Button>
                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
            <div style={{paddingTop:"15px", textAlign:"center"}}>
                <Button style={{backgroundColor:"#6064dc", borderColor:"#6064dc", width:"100%", fontWeight:"bold"}} onClick={buy}>
                    {rarityTest(rarity)}
                </Button>
            </div>
        </div>
    )
}