import React, {useState} from 'react';
import { Map } from "immutable";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import  {MemoItemTd as Item } from '../shop'
import { currencies, elements, currencyById, soul } from '../currencies';
import { add, scale } from "merchant.js";
import { statById, statsList } from '../stats';
import { missions } from "../missions";
import { boxes } from '../box';

const config = require('../../next.config')

export default function PrestigeModal(props) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false)
    props.onClose()
  }

  const handleConfirm = () => {
    setShow(false)
    props.onConfirm()
  }

  const soulBonus = props.soulBoosts.get("soulBonus") ?? 0
  let soulBoosts = Map()
  currencies.forEach( x => {
    if(Number(props.soulBoosts.get(x.id+"bst") ?? 0) > 0){
      soulBoosts = soulBoosts.set(x.id, Number(props.soulBoosts.get(x.id+"bst") ?? 0)*0.03)
    }
  })
  const skillVals = add(...props.skills.map(m=> scale(Map(m.price),0.2)).values())
  const diff = add(props.relic.effect(), scale(props.activeRelic.effect(),-1))
  const diffLedger = add(scale(props.ledger,-1), scale(props.relic.effect(),0.2), skillVals)
  const diffBoost = add(scale(Map(props.activeRelic.effect().get("mission")??{}),-1), Map(props.relic.effect().get("mission")??{}))
  const diffArtifactBoost = add(scale(Map(props.activeRelic.effect().get("artifactBonus")??{}),-1), Map(props.relic.effect().get("artifactBonus")??{}))
  const diffStatBoost = add(scale(Map(props.activeRelic.effect().get("statBonus")??{}),-1), Map(props.relic.effect().get("statBonus")??{}))
  const diffStats = add(scale(props.activeRelic.statEffect,-1), props.relic.statEffect)
  const statsLost = scale(add(props.artifactStats, props.missionStats),-1)
  const boostLost = add(scale(props.boostLedger,-1), Map(props.relic.effect().get("mission")??{}))
  const artifactBoostLost = add(scale(props.artifactBonusLedger,-1), Map(props.relic.effect().get("artifactBonus")??{}), soulBoosts)
  const statBonusLost = add(scale(props.statBonusLedger,-1), Map(props.relic.effect().get("statBonus")??{}))
  return (
      <Modal dialogClassName="box-modal" show={show} onHide={handleClose}>
        <div style={{backgroundColor:"#333333", color:"white", fontWeight:'bold'}}>
          <Modal.Header>
            <Modal.Title style={{fontWeight:'bold'}}>Confirm Prestige</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="row">
              <div class="column">
              <p style={{marginLeft:"50px"}}>Old Relic</p>
              <table style={{width:"fit-content", marginLeft:"50px"}}>
                <tbody>
                  <tr>
                    <Item item={props.activeRelic} origin={"L"} delay place="left"/>
                  </tr>
                </tbody>
              </table>
              </div>
              <div class="column">
              <div style={{ width: 100, height:100, marginTop:"40px" ,position: "relative", height: "100px", backgroundImage:  `url(${config.basePath+"/arrow.png"})`, alignSelf:'center'}}>
              </div>
              </div>
              <div class="column">
              <p>New Relic</p>
              <table style={{width:"fit-content"}}>
                <tbody>
                  <tr>
                    <Item item={props.relic} origin={"R"} delay place="right"/>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>

            <p style={{marginTop: "10px"}}>Relic changes and gains</p>
            <div style={{ width: "100%", height: "150px", overflowY: "auto", display: "block", background: "#181818"}}>
              <p style={{color: "green", paddingLeft:"10px", fontWeight:"bold"}}>+{Number(Number(props.level*(1+soulBonus*0.05)*(1+Number(props.artifactBonusLedger.get(soul.id)??0))).toFixed(2))} {soul.icon}
                 ({Number(Number(1*(1+soulBonus*0.05)*(1+Number(props.artifactBonusLedger.get(soul.id)??0))).toFixed(2))} per level)</p>
              {currencies.map((currency) =>
                diff.get(currency.id) != 0 && diff.get(currency.id) &&
                <p key={currency.id} style={{color: diff.get(currency.id)>0 ? "green": "red", paddingLeft:"10px", fontWeight:"bold"}}>{diff.get(currency.id)>0 ? "+":""}{Number(diff.get(currency.id) || 0).toFixed(3)} {currency.icon} /s </p>)
              }
              {diffBoost.entrySeq().sort(function([key1, value1], [key2, value2]) { return !isNaN(key2) && isNaN(key1) ? -1 : value2 - value1 }).map(([key, value]) =>
                value===0? null
                :elements.some(e=> e.id== key) ?
                <p key={key} style={{color: value>0 ? "green": "red", paddingLeft:"10px", fontWeight:"bold"}}>{value>0 ? "+":""}{Number(value*100).toFixed(0)}% boost for {currencyById(key).icon} missions</p>
                : <p key={key} style={{color: value>0 ? "green": "red", paddingLeft:"10px", fontWeight:"bold"}}>{value>0 ? "+":""}{Number(value*100).toFixed(0)}% boost for {missions[key].text}</p>)
              }
              {diffArtifactBoost.entrySeq().sort(function([key1, value1], [key2, value2]) { return !isNaN(key2) && isNaN(key1) ? -1 : value2 - value1 }).map(([key, value]) =>
                value===0? null
                :currencies.some(e=> e.id== key) ?
                <p key={key} style={{color: value>0 ? "green": "red", paddingLeft:"10px", fontWeight:"bold"}}>{value>0 ? "+":""}{Number(value*100).toFixed(0)}% boost for {currencyById(key).icon} artifacts</p>
                :soul.id == key ?
                <p key={key} style={{color: value>0 ? "green": "red", paddingLeft:"10px", fontWeight:"bold"}}>{value>0 ? "+":""}{Number(value*100).toFixed(0)}% boost for {soul.icon} on reincarnation</p>
                : null)
              }
              {diffStatBoost.entrySeq().sort(function([key1, value1], [key2, value2]) { return !isNaN(key2) && isNaN(key1) ? -1 : value2 - value1 }).map(([key, value]) =>
                value===0? null
                :statsList.some(e=> e.id== key) ?
                <p key={key} style={{color: value>0 ? "green": "red", paddingLeft:"10px", fontWeight:"bold"}}>{value>0 ? "+":""}{Number(value*100).toFixed(0)}% boost for {statById(key).icon}</p>
                :null)
              }
              {statsList.map((stat) =>
                diffStats.get(stat.id) != 0 && diffStats.get(stat.id) &&
                <p key={stat.id} style={{color: diffStats.get(stat.id)>0 ? "green" : "red", paddingLeft:"10px"}}>{diffStats.get(stat.id)>0 ? "+":""}{Number(Number(diffStats.get(stat.id) || 0).toFixed(1))} {stat.icon}</p>)
              }
            </div>

            <p style={{marginTop: "10px"}}>Lost on reincarnate</p>
            <div style={{ width: "100%", height: "150px", overflowY: "auto", display: "block", background: "#181818"}}>
            {currencies.map((currency) =>
              diffLedger.get(currency.id) < 0 && diffLedger.get(currency.id)  &&
              <p key={currency.id} style={{color: diffLedger.get(currency.id)>0 ? "green": "red", paddingLeft:"10px", fontWeight:"bold"}}>{Number(diffLedger.get(currency.id)*5 || 0).toFixed(3)} {currency.icon} /s </p>)
            }
            {statsList.map((stat) =>
              statsLost !== undefined && statsLost.get(stat.id) != 0 && statsLost.get(stat.id) &&
              <p key={stat.id} style={{color: "red", paddingLeft:"10px"}}>{Number(Number(statsLost.get(stat.id) || 0).toFixed(1))} {stat.icon}</p>)
            }
            {boostLost.entrySeq().sort(function([key1, value1], [key2, value2]) { return !isNaN(key2) && isNaN(key1) ? -1 : value2 - value1 }).map(([key, value]) =>
              value>=0? null
              :elements.some(e=> e.id== key) ?
              <p key={key} style={{color: "red", paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for {currencyById(key).icon} missions</p>
              : <p key={key} style={{color: "red", paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for {missions[key].text}</p>)
            }
            {artifactBoostLost.entrySeq().sort(function([key1, value1], [key2, value2]) { return !isNaN(key2) && isNaN(key1) ? -1 : value2 - value1 }).map(([key, value]) =>
              Number(value*100).toFixed(0)>=0? null
              :currencies.some(e=> e.id== key) ?
              <p key={key} style={{color: "red", paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for {currencyById(key).icon} artifacts</p>
              : soul.id == key ?
              <p key={key} style={{color: "red", paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for {soul.icon} on reincarnation</p>
              : null)
            }
            {statBonusLost.entrySeq().sort(function([key1, value1], [key2, value2]) { return !isNaN(key2) && isNaN(key1) ? -1 : value2 - value1 }).map(([key, value]) =>
              value>=0? null
              :statsList.some(e=> e.id== key) ?
              <p key={key} style={{color: "red", paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for {statById(key).icon}</p>
              : null)
            }
            {boxes.map(box =>
              (props.boxesState.get(box.id) && props.boxesState.get(box.id) !==0) ?
              <p key={box.id} style={{color: "red", paddingLeft:"10px", fontWeight:"bold"}}>-{Number(props.boxesState.get(box.id) ?? 0).toFixed(0)} {box.name}</p>
              : (null)
            )}  
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}} onClick={handleConfirm}>
              Confirm Prestige
            </Button>
            <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}} onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
  );
}