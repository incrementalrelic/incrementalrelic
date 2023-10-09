import React from "react";
import { Map } from "immutable";
import { add, buy, inTheBlack, addItem, pouchEffectsLedger, scale } from "merchant.js";
import { missions } from "../page_components/missions"
import { gold, experience, currencies, elements, soul, allCurrencies, startCurrencies, fire, water, earth, air } from "../page_components/currencies";
import { get_level_info } from "../page_components/level";
import ActionTabs from '../page_components/actiontabs'
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import ConfirmModal from "../page_components/components/modal"
import { MemoShop as Shop, MemoInventory as Inventory } from "../page_components/shop"
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { MemoStats as Stats, MemoBattle as Battle , regen } from "../page_components/stats";
import { randomIntFromInterval, RelicType } from "../page_components/items";
import { boxes } from "../page_components/box"
import { MemoUpgrade as Upgrade, MemoBasicUpgrade as BasicUpgrade } from "../page_components/upgrade"
import PrestigeModal from "../page_components/components/prestigeModal";
import { Story, messages, MessageWrapper  } from "../page_components/components/levelUpMessage"
import Save from "../page_components/components/save"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: new Map(),
      ledger: new Map(),
      boostLedger: new Map(),
      artifactBonusLedger: new Map(),
      statBonusLedger: new Map(),
      stats: new Map(),
      artifactStats: new Map(),
      relicStats: new Map(),
      missionStats: new Map(),
      inventory: [],
      shop: [],
      relic: {},
      activeRelic: {},
      messagesShown: new Map(),
      info: new Map(),
      boxes: new Map(),
      skills: new Map(),
      prestigeModal: false,
      loading: true,
    };

    this.showPrestige = this.showPrestige.bind(this);
    this.prestigeConfirmed = this.prestigeConfirmed.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.updateShop = this.updateShop.bind(this);
    this.selectRelic = this.selectRelic.bind(this);
    this.upgradeRelic = this.upgradeRelic.bind(this);
    this.changeStage = this.changeStage.bind(this);
    this.killEnemy = this.killEnemy.bind(this);
    this.onClickSetSkills = this.onClickSetSkills.bind(this);
    this.buyStat = this.buyStat.bind(this);
    this.buyElement = this.buyElement.bind(this);
    this.buyEnhancement = this.buyEnhancement.bind(this);
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.missions = missions.map((element) => {
      element.start = element.start.bind(this)
      element.reward = element.reward.bind(this)
      return element
    });
  }

  componentDidMount() {
    // Check if running on the client-side before accessing localStorage
    if (typeof window !== 'undefined') {
      this.setState({
        wallet: this.load("wallet"),
        ledger: this.load("ledger"),
        boostLedger: this.load("boostLedger"), 
        artifactBonusLedger: this.load("artifactBonusLedger"), 
        statBonusLedger: this.load("statBonusLedger"), 
        stats: this.load("stats"),
        artifactStats: this.load("artifactStats"),
        relicStats: this.load("relicStats"),
        missionStats: this.load("missionStats"),
        inventory: this.load("inventory"), 
        shop: this.load("shop"),
        relic:this.load("relic"),
        activeRelic:this.load("activeRelic"),
        messagesShown: this.load("messages"),
        info: this.load("info"),
        boxes: this.load("boxes"),
        skills: this.load("skills"),
        prestigeModal: false,
        loading:false,
      });

      setInterval(this.update, 200);
      setInterval(this.save, 10000);
    }
  }

  update() {
    let wallet = add(this.state.wallet, this.state.ledger)
    if (!inTheBlack(wallet)) {
      const skills = this.state.skills.filter(m=> wallet.get(Object.keys(m.price)[0])>=0)
      const delskills = this.state.skills.filter(m=> wallet.get(Object.keys(m.price)[0])<0)
      const resMaps = delskills.map(m=> scale(Map(m.price),-0.2)).values()
      const ledger = add(this.state.ledger, ...resMaps)
      this.setState({
        skills,
        ledger
      });
    }
    else{
      this.setState({
        wallet
      });
    }
  }

  save() {
    if (typeof window !== 'undefined') {
      try{
        localStorage.setItem('wallet', JSON.stringify(Array.from(this.state.wallet.entries())));
        localStorage.setItem('ledger', JSON.stringify(Array.from(this.state.ledger.entries())));
        localStorage.setItem('boostLedger', JSON.stringify(Array.from(this.state.boostLedger.entries())));
        localStorage.setItem('artifactBonusLedger', JSON.stringify(Array.from(this.state.artifactBonusLedger.entries())));
        localStorage.setItem('statBonusLedger', JSON.stringify(Array.from(this.state.statBonusLedger.entries())));
        localStorage.setItem('stats', JSON.stringify(Array.from(this.state.stats.entries())));
        localStorage.setItem('artifactStats', JSON.stringify(Array.from(this.state.artifactStats.entries())));
        localStorage.setItem('relicStats', JSON.stringify(Array.from(this.state.relicStats.entries())));
        localStorage.setItem('missionStats', JSON.stringify(Array.from(this.state.missionStats.entries())));
        localStorage.setItem('info', JSON.stringify(Array.from(this.state.info.entries())));
        localStorage.setItem('boxes', JSON.stringify(Array.from(this.state.boxes.entries())));
        localStorage.setItem('skills', JSON.stringify(Array.from(this.state.skills.entries())));
        localStorage.setItem('messages', JSON.stringify(Array.from(this.state.messagesShown.entries())));
        localStorage.setItem('inventory', JSON.stringify(this.state.inventory.map(x=>({...x, effectV: x.effect()}))));
        localStorage.setItem('shop', JSON.stringify(this.state.shop.map(x=>({...x, effectV: x.effect(), costV: x.cost()}))));
        var relic = this.state.relic;
        localStorage.setItem('relic', JSON.stringify( relic.effect !== undefined ? {...relic, effectV: relic.effect()} : {}));
        var activeRelic = this.state.activeRelic;
        localStorage.setItem('activeRelic', JSON.stringify( activeRelic.effect !== undefined ? {...activeRelic, effectV: activeRelic.effect()} : {}));
      }
      catch(er){
        return false;
      }
    }
  }

  load(name) {
    console.log("load "+name)
    try{
      if(name === "relic"){
        var relic = JSON.parse(localStorage.getItem(name));
        return { ...relic, effect: ()=>Map(relic?.effectV ?? {}), statEffect:Map(relic?.statEffect ?? {})};
      }
      if(name === "activeRelic"){
        var activeRelic = JSON.parse(localStorage.getItem(name));
        return { ...activeRelic, effect: ()=>Map(activeRelic?.effectV ?? {}), statEffect:Map(activeRelic?.statEffect ?? {})};
      }
    }
    catch(er){
      console.log(er)
      return {};
    }
    
    try{
      if(name === "inventory"){
        return JSON.parse(localStorage.getItem(name)).map(x=>({...x, effect: ()=>Map(x.effectV), statEffect:Map(x.statEffect)}));
      }
      if(name === "shop"){
        return JSON.parse(localStorage.getItem(name)).map(x=>({...x, effect: ()=>Map(x.effectV), cost: ()=>Map(x.costV), statEffect:Map(x.statEffect)}));
      }
    }
    catch(er){
      console.log(er)
      return [];
    }

    try{
      console.log(name);
      var item = localStorage.getItem(name);
      if(name === "wallet"){
        return item !== undefined && item !== null ? new Map(JSON.parse(item)) : Map({[fire.id]:3, [water.id]:3, [earth.id]:3, [air.id]:3 })
      }
      return item !== undefined && item !== null ? new Map(JSON.parse(item)) : Map()
    }
    catch(er){
      return Map();
    }
  }

  updateShop(shop){
    console.log("here")
    console.log(shop)
    this.setState({
      shop,
    })
  }

  onClickSetSkills(m){
    const isAdd = this.state.skills.get(m.id) == undefined
    const skills = isAdd ? this.state.skills.set(m.id, m) : this.state.skills.remove(m.id)
    
    const costsLedger = isAdd ? Map(m.price): Map(m.price).map(x => x*-1)
    const costsLedgerScaled = scale(costsLedger, 0.2)
    const ledger = add(costsLedgerScaled, this.state.ledger)

    this.setState({
      skills,
      ledger
    })
  }

  buyItem(items, fromBox = false, sacrifice = []) {
    items = Array.isArray(items) ? items : [items]

    let walletWithCostsApplied = this.state.wallet
    let boxesWithCostsApplied = this.state.boxes

    for (let i = 0; i < items.length; i++) {
      if(fromBox){
        boxesWithCostsApplied = buy(items[i], boxesWithCostsApplied);
        if (!inTheBlack(boxesWithCostsApplied)) {
          return false;
        }
        boxesWithCostsApplied = addItem(items[i], boxesWithCostsApplied);
      }
      else{
        walletWithCostsApplied = buy(items[i], walletWithCostsApplied);
        if (!inTheBlack(walletWithCostsApplied)) {
          return false;
        }
        walletWithCostsApplied = addItem(items[i], walletWithCostsApplied);
      }
    }

    const artifactStats = add(this.state.artifactStats, ...items.map(x=> x.statEffect), ...sacrifice.map(x=> scale(x.statEffect, -1)))
    const artifactBonusLedger = this.state.artifactBonusLedger
    const ledgerArtifact = pouchEffectsLedger(items, Map({"artifact":0.2})).map((v,k) => artifactBonusLedger.get(k) !== undefined ? v + (v*(artifactBonusLedger.get(k))) : v );
    const sacrificeLedger = sacrifice.length>0 ? pouchEffectsLedger(sacrifice, Map({"artifact":-0.2})).map((v,k) => artifactBonusLedger.get(k) !== undefined ? v + (v*(artifactBonusLedger.get(k))) : v ) : Map()
    const ledgerWithM = add(this.state.ledger, ledgerArtifact, sacrificeLedger)
    const ledger = ledgerWithM.remove("mission").remove("artifactBonus").remove("statBonus")
    let boostLedger = this.state.boostLedger

    let modifiedItems = items.filter(i=> i.effect().get("mission") !== undefined && i.type === "artifact")
      .map(i=> ({type: i.type, effect: () => Map(i.effect().get("mission"))}))
    if(modifiedItems.length>0){
      boostLedger = add(boostLedger, pouchEffectsLedger(modifiedItems, Map({"artifact":1})))
    }

    let modifiedSItems = sacrifice.filter(i=> i.effect().get("mission") !== undefined && i.type === "artifact")
      .map(i=> ({type: i.type, effect: () => Map(i.effect().get("mission"))}))
    if(modifiedSItems.length>0){
      boostLedger = add(boostLedger, pouchEffectsLedger(modifiedSItems, Map({"artifact":-1})))
    }

    let relic = this.state.relic
    if(!fromBox && items[0].type === RelicType && relic.type === undefined){
      relic = items[0]
    }

    const inventory = sacrifice.length > 0 ? this.state.inventory.filter(i=> !sacrifice.some(s=> s.id === i.id )) : this.state.inventory

    this.setState({
      wallet: walletWithCostsApplied,
      relic,
      artifactStats,
      ledger,
      boostLedger,
      inventory : [...inventory, ...items ],
      boxes: boxesWithCostsApplied
    });
    return true
  }

  buyStat(statId, typeId, n){
    const price = this.state.stats.get(typeId+"-"+statId) ?? 0
    const newPrice = price + 1;
    var total = (n) * (newPrice + newPrice + n-1) / 2;
    const purchase = {
      type: "stat",
      cost: () => {
          return Map({[typeId]:-total});
      },
      effect: () => {
        if(statId !== regen.id){
          return Map({[statId]:n, [typeId+"-"+statId]:n});
        }
        else{
          return Map({[statId]:0.1*n, [typeId+"-"+statId]:n});
        }
      }
    }

    const walletWithCostsApplied = buy(purchase, this.state.wallet);
    if (!inTheBlack(walletWithCostsApplied)) {
      return false;
    }

    const ledgerStat = pouchEffectsLedger([purchase], Map({"stat":1}));
    const stats = add(this.state.stats, ledgerStat)
    this.setState({
      stats,
      wallet: walletWithCostsApplied
    });
    return true
  }

  buyEnhancement(enhancement, costMap){
    const purchase = {
      type: "element",
      cost: () => {
          return costMap;
      }
    }
    const walletWithCostsApplied = buy(purchase, this.state.wallet);
    if (!inTheBlack(walletWithCostsApplied)) {
      return false;
    }

    const inc = (x) => ((x??0) + 1)
    const info = this.state.info.update(enhancement , inc)
    
    this.setState({
      info,
      wallet: walletWithCostsApplied
    });
  }

  buyElement(costMap){
    const purchase = {
      type: "element",
      cost: () => {
          return costMap;
      }
    }
    const walletWithCostsApplied = buy(purchase, this.state.wallet);
    if (!inTheBlack(walletWithCostsApplied)) {
      return false;
    }
    this.setState({
      wallet: walletWithCostsApplied
    });
  }

  selectRelic(relic){
    if(relic.type === RelicType){
      this.setState({
        relic
      })
    }
  }

  upgradeRelic(relic, cost, uuid){
    const purchase = {
      cost: () => {
          return cost;
      }
    }
    const walletWithCostsApplied = buy(purchase, this.state.wallet);
    if (!inTheBlack(walletWithCostsApplied)) {
      return false;
    }
    const inv = this.state.inventory.filter(x => x.id != this.state.relic.id && x.id != uuid)
    var info = this.state.info
    if(uuid !== null && uuid !== undefined){
      info = info.set("lastMergedId", uuid)
    }

    this.setState({
      wallet: walletWithCostsApplied,
      relic,
      inventory: [...inv, relic],
      info
    })
  }
  
  showPrestige(level){
    if(level >= 20){
      this.setState({
        prestigeModal: !this.state.prestigeModal
      })
    }
  }

  prestigeConfirmed(){
    const relic = this.state.relic.type !== undefined ? this.state.relic : {}
    const exp = Number(relic.exp ?? 0) * this.state.wallet.get(experience.id) / 100
    var level_info = get_level_info(this.state.wallet.get(experience.id))
    var level = level_info.level;
    const inventory = relic.type !== undefined ? [ relic ] : []
    const soulVal = (this.state.wallet.get(soul.id) ?? 0) + Number(Number(level*(1+Number(this.state.info.get("soulBonus")??0)*0.05)*(1+Number(this.state.artifactBonusLedger.get(soul.id)??0))).toFixed(2))

    let boostLedger = Map()
    if(relic.effect != undefined && relic.effect().get("mission") !== undefined){
      let modifiedRelic = {type: "relic", effect: () => Map(relic.effect().get("mission"))}
      boostLedger = pouchEffectsLedger([modifiedRelic], Map({"relic":1}))
    }
    
    let soulBoosts = Map()
    currencies.forEach( x => {
      if(Number(this.state.info.get(x.id+"bst") ?? 0) > 0){
        soulBoosts = soulBoosts.set(x.id, Number(this.state.info.get(x.id+"bst") ?? 0)*0.03)
      }
    })
    let artifactBonusLedger = Map()
    if(relic.effect != undefined && relic.effect().get("artifactBonus") !== undefined){
      let modifiedRelic = {type: "relic", effect: () => Map(relic.effect().get("artifactBonus"))}
      artifactBonusLedger = pouchEffectsLedger([modifiedRelic], Map({"relic":1}))
    }
    artifactBonusLedger = add(artifactBonusLedger, soulBoosts)

    let statBonusLedger = Map()
    if(relic.effect != undefined && relic.effect().get("statBonus") !== undefined){
      let modifiedRelic = {type: "relic", effect: () => Map(relic.effect().get("statBonus"))}
      statBonusLedger = pouchEffectsLedger([modifiedRelic], Map({"relic":1}))
    }
    
    const ledgerWithM = pouchEffectsLedger([relic], Map({"relic":0.2})).map( (v,k) => artifactBonusLedger.get(k) !== undefined ? v + (v*(artifactBonusLedger.get(k))) : v );
    const ledger = ledgerWithM.remove("mission").remove("artifactBonus").remove("statBonus")
    const relicStats = this.state.relic.statEffect

    this.setState({
      info: this.state.info.set("maxLevel", Math.max(Number(this.state.info.get("maxLevel") ?? 0), level)),
      wallet: Map({[experience.id]:exp, [soul.id]:soulVal}),
      ledger,
      artifactStats: Map(),
      missionStats: Map(),
      relicStats,
      boostLedger: boostLedger,
      artifactBonusLedger: artifactBonusLedger,
      statBonusLedger: statBonusLedger,
      skills: Map(),
      boxes: Map(),
      inventory : inventory,
      shop: [],
      relic,
      activeRelic:{...relic},
      prestigeModal: !this.state.prestigeModal
    });
  }

  changeStage(stage){
    if(stage >= 0){
      this.setState({
        info: this.state.info.set("stage", stage)
      })
    }
  }

  killEnemy(enemy, boxOdds){
    const n = randomIntFromInterval(1,100)
    let reward;
    let quantity;
    if(n>90){
      let t = n-90
      for (let i = 0; i < boxOdds.length; i++) {
        const [box, odd] = boxOdds[i]
        if(t<=odd && t>0){
          reward = box.id
        }
        t -= odd
      }
      quantity = 1
    }
    else if(n>70){
      reward = elements[randomIntFromInterval(0,3)].id
      quantity = enemy.get("element")
    }
    else if(n>40){
      reward = experience.id
      quantity = enemy.get(experience.id)
    }
    else{
      reward = gold.id
      quantity = enemy.get(gold.id)
    }

    if(randomIntFromInterval(1,100) <= (Number(this.state.info.get("doubleC") ?? 0) *2)){
      quantity = quantity * 2
    }

    const killReward = {
      type: "enemy",
      cost: () => {
      },
      effect: () => {
        return Map({[reward]:quantity});
      }
    }

    const inc = (x) => ((x??0) + 1)
    const info = this.state.info.update("stage" + (this.state.info.get("stage") ?? 0) ,inc)

    const ledgerkillReward = pouchEffectsLedger([killReward], Map({"enemy":1}));
    let wallet = this.state.wallet
    let stateBoxes = this.state.boxes
    if(ledgerkillReward.keySeq().some(r => boxes.some(b=> b.id == r))){
      stateBoxes = add(stateBoxes, ledgerkillReward)
    }else{
      wallet = add(wallet, ledgerkillReward)
    }
    this.setState({
      info,
      wallet,
      boxes: stateBoxes
    })
  }

  render() {
    var level_info = get_level_info(this.state.wallet.get(experience.id))
    var modal = null;
    var percentage = Number(Number(level_info.current_exp*100)/Number(level_info.next_level_exp)).toFixed(0)
    if(!this.state.loading && !(this.state.messagesShown.get(""+level_info.level)) && messages[""+level_info.level] != undefined){
      modal =  <ConfirmModal title={level_info.level == 1 ? "Welcome" :"Level up"} children={ <MessageWrapper height={"300px"} mkey={""+level_info.level} />}
                onClose={()=>{
                  const messagesShown = this.state.messagesShown.set(""+level_info.level, true)
                  this.setState({
                    messagesShown
                  });
                }}/>
    }
    const currenciesShow = level_info.level<2 ? startCurrencies : this.state.info.get("maxLevel")>=20 ? allCurrencies : currencies
    return (
      <div style={{margin:"10px"}}>
        {modal}
        {
          this.state.prestigeModal &&
          <PrestigeModal activeRelic={this.state.activeRelic} relic={this.state.relic} ledger={this.state.ledger} skills={this.state.skills} 
                  relicStats={this.state.relicStats} artifactBonusLedger={this.state.artifactBonusLedger} statBonusLedger={this.state.statBonusLedger} 
                  soulBoosts={this.state.info} artifactStats={this.state.artifactStats} missionStats={this.state.missionStats} boostLedger={this.state.boostLedger}
                  onConfirm={this.prestigeConfirmed} onClose={()=>this.showPrestige(level_info.level)} boxesState={this.state.boxes} level={level_info.level}
          />
        }
        <table style={{ width: "100%", tableLayout:"fixed"}}>
          <thead>
            <tr >
            { currenciesShow.map((currency) =>
              <th key={currency.id} style={{minWidth:88/currenciesShow.length+"%", width:88/currenciesShow.length+"%", whiteSpace:"nowrap", color:"white", overflow:"hidden", textOverflow:"ellipsis", position: "relative"}}>
                <h3>{currency.icon}
                  { Number(this.state.wallet.get(currency.id) || 0) >= 10000 ? Number(this.state.wallet.get(currency.id) || 0).toExponential(2) : Number(this.state.wallet.get(currency.id) || 0).toFixed(2)}
                </h3>
                {(this.state.ledger.get(currency.id) != 0 && this.state.ledger.get(currency.id)  &&
                <a key={currency.id} style={{color: this.state.ledger.get(currency.id)>0 ? "green": "red", marginLeft:"50px", position:"absolute", top:"50%", transform:"translateY(50%)" }}>{Number(this.state.ledger.get(currency.id)*5 || 0).toFixed(3)} {currency.icon} /s </a>)}
              </th>)
            }
            { level_info.current_exp !== undefined && 
              <th>
                <div onClick={()=>this.showPrestige(level_info.level)} style={{ width: 150, height: 150, marginTop: 5 , marginBottom: 5 }}>
                  <CircularProgressbarWithChildren 
                    value={percentage} 
                    background
                    backgroundPadding={6}
                    circleRatio={0.75}
                    styles={buildStyles({
                      rotation: 1 / 2 + 1 / 8,
                      strokeLinecap: "butt",
                      backgroundColor: "#3e98c7",
                      textColor: "#fff",
                      pathColor: "#fff",
                      trailColor: "gray"
                    })}
                  >
                    <div style={{ fontSize: 12, marginTop: -5 }}>
                      <strong>Level {level_info.level}</strong>
                    </div>
                    <div style={{ fontSize: 12, marginTop: -5 }}>
                      {level_info.current_exp >= 10000 ? Number(level_info.current_exp).toExponential(2) :level_info.current_exp} / {level_info.next_level_exp >= 10000 ? Number(level_info.next_level_exp).toExponential(2) :level_info.next_level_exp} ⭐
                    </div>
                    {level_info.level>=18 &&
                      <div style={{ fontSize: 12, marginTop: -5 , fontWeight: "bold"}}>
                        {level_info.level<20? `🔒 Level 20 🔒`: "Reincarnate"}
                      </div>
                    }
                  </CircularProgressbarWithChildren>
                </div>
              </th>
            }
            </tr>
          </thead>
        </table>
        <div style={{paddingTop: "10px"}}>
          <Tabs defaultActiveKey={"Training"} className="mb-3" >
            <Tab eventKey={"Training"} title={"Training"}>
              <div className="row">
                <div className='column'>
                  <div>
                    <h1 style={{color:"white", fontWeight: "bold"}}> Actions </h1>
                    {<ActionTabs missions={this.missions} level={level_info.level} boostLedger={this.state.boostLedger}/>}
                  </div>
                </div>
                {
                  (level_info.level>=10 || this.state.info.get("maxLevel")>=10)?
                  <div className='column'>
                    <Shop items={this.state.shop} buy={this.buyItem} updateShop={this.updateShop} level={level_info.level} 
                          artifactBonusLedger={this.state.artifactBonusLedger} shopcd={this.state.info.get("shopcd") ?? 0} 
                          aluck={this.state.info.get("shopal") ?? 0} rluck={this.state.info.get("shoprl") ?? 0}
                          aBStatsMult={this.state.info.get("aBStatsMult") ?? 0} maxlevel={this.state.info.get("maxLevel") ?? 0}/>
                    <Inventory items={this.state.inventory} ledger={this.state.ledger} boxesState={this.state.boxes} openBox={this.buyItem} 
                          artifactBonusLedger={this.state.artifactBonusLedger} maxlevel={this.state.info.get("maxLevel") ?? 0}
                          boostLedger={this.state.boostLedger} selectRelic={this.selectRelic} relic={this.state.relic} level={level_info.level}
                          aBStatsMult={this.state.info.get("aBStatsMult") ?? 0}/>
                  </div>
                  :
                  <div className='column'>
                    <p style={{padding:"10px",color:"white", background:"#494949", fontWeight:"bold"}}> 🔒 Reach level 10 to unlock 🔒</p>
                  </div>
                }
              </div>
            </Tab>
            { (level_info.level>=15 || this.state.info.get("maxLevel")>=20 ) &&
              <Tab eventKey={"Workshop"} title={level_info.level>=20 || this.state.info.get("maxLevel")>=20 ? this.state.info.get("maxLevel")>=20 ? "Workshop" : "🔒 Reincarnate to unlock 🔒" : `🔒 Reach level 20 to unlock 🔒`} 
                disabled={this.state.info.get("maxLevel") === undefined}>
                <div className="row">
                  <div className='column'>
                      <div>
                        <h1 style={{color:"white", fontWeight: "bold"}}> Upgrade </h1>
                        <BasicUpgrade relic={this.state.relic} upgradeRelic={this.upgradeRelic} maxlevel={Math.max(Number(this.state.info.get("maxLevel") ?? 0), level_info.level)} />
                      </div>
                    </div>
                  <div className='column'>
                      <div>
                        <Upgrade relic={this.state.relic} upgradeRelic={this.upgradeRelic} items={this.state.inventory} buyElement={this.buyElement} info={this.state.info} level={level_info.level}
                          buyEnhancement={this.buyEnhancement} maxlevel={Math.max(Number(this.state.info.get("maxLevel") ?? 0), level_info.level)} buy={this.buyItem}
                          mergebst={this.state.info.get("mergebst") ?? 0} aBStatsMult={this.state.info.get("aBStatsMult") ?? 0} lastMergedId={this.state.info.get("lastMergedId")} />
                      </div>
                  </div>
                </div>
              </Tab>
            }
            { (level_info.level>=25 || this.state.info.get("maxLevel")>=30) &&
              <Tab eventKey={"Battle"} title={Math.max(Number(this.state.info.get("maxLevel") ?? 0), level_info.level)>=30 ? "Battle" : `🔒 Reach level 30 to unlock 🔒`} 
                disabled={Math.max(Number(this.state.info.get("maxLevel") ?? 0), level_info.level)<30}>
                <div className="row">
                  <div className='column'>
                    <div>
                      <h1 style={{color:"white", fontWeight: "bold"}}> Stats </h1>
                      <Stats stats={this.state.stats} buyStat={this.buyStat} artifactStats={this.state.artifactStats} relicStats={this.state.relicStats} 
                          missionStats={this.state.missionStats} skills={this.state.skills} statBonusLedger={this.state.statBonusLedger} />
                    </div>
                  </div>
                  <div className='column'>
                      <Battle stats={this.state.stats} artifactStats={this.state.artifactStats} relicStats={this.state.relicStats} missionStats={this.state.missionStats} stage={this.state.info.get("stage") ?? 0} 
                          stageKills={this.state.info.get("stage" + (this.state.info.get("stage") ?? 0)) ?? 0} skills={this.state.skills}
                          changeStage={this.changeStage} killEnemy={this.killEnemy} onClickSetSkills={this.onClickSetSkills}
                          maxlevel={Math.max(Number(this.state.info.get("maxLevel") ?? 0), level_info.level)} statBonusLedger={this.state.statBonusLedger} />
                  </div>
                </div>
              </Tab>
            }
            <Tab eventKey={"Story"} title={"Story"} >
              <div>
                <Story level={Math.max(Number(this.state.info.get("maxLevel") ?? 0), level_info.level)}/>
              </div>
            </Tab>
            <Tab eventKey={"Save"} title={"Save"} >
              <div>
                <Save saveState={this.state} setSaveState={(x) => this.setState(x)}/>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ()=><App />;
