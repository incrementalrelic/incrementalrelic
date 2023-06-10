import React, {useState, useEffect} from 'react';
import { ArtifactType, generate_item, RelicType, colorByReward, rarityName, colorByRarity, generate_artifact } from "./items";
import { currencies, fire, water, earth, air, soul, experience, elements, currencyById } from "../functions/currencies";
import { attack, defence, health, regen, statById, statsList } from "./stats"
import Button from 'react-bootstrap/Button';
import ReactiveButton from './components/progressButton';
import ReactTooltip from 'react-tooltip';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { missions, colorByMission } from "../functions/missions";
import { boxes, Box, BoxModal } from './box';

const TypeMessage = ({isRelic, style, rarity}) => (
  <div>
    <p style={{color: isRelic? "#DB9D00" : "#e5e5e5"}}>{rarityName(rarity)} {isRelic? "Relic" : "Artifact"}</p>
  </div>
);

const RelicMessage = ({isRelic, style, item}) => (
  <div>
    {isRelic? <p style={style}>Applied if relic equipped during ressurection:</p> : (null)}
    {isRelic? <p style={{color:"#DB9D00"}}>{item.exp ?? 0}% of current exp {experience.icon}</p> : (null)}
  </div>
);

const OwnedRelicMessage = ({isRelic, style, item}) => (
  <div>
    {isRelic? <p style={style}>If equiped on ressurection gain:</p> : (null)}
    {isRelic? <p style={{color:"#DB9D00"}}>{item.exp ?? 0}% of current exp {experience.icon}</p> : (null)}
  </div>
);

const Background = ({children , item, isShop, origin}) => (
  <div data-tip data-for={isShop ? item.id : item.id+"R"+origin} style={{position:'relative', top:2,bottom:0,right:0,left:0, flexDirection: 'column', zIndex: 1, height: "105px"}}>
    {children}
  </div>
);

function Shop(props) {
    if (typeof window === 'undefined') {
      return (null)
    }

    const [show, setShow] = useState(false);
    const gen_item = ()=> generate_item(props.level, {aBStatsMult:props.aBStatsMult}, props.aluck, props.rluck)
    const gen_items = () => [gen_item(), gen_item(), gen_item(), gen_item(), gen_item()];
    const gen_items_first = () => [generate_artifact(props.level,0,1), generate_artifact(props.level,0,2),generate_artifact(props.level,0,2),
                                    generate_artifact(props.level,0,3), generate_artifact(props.level,0,1)];

    const [items, setItems] = useState(props.items.length != 0 ? props.items : gen_items_first());
    let vItems = items

    useEffect(() => {
      if(props.items.length === 0 ){
        vItems = gen_items_first()
        props.updateShop(vItems)
      }
      else{
        setItems(props.items)
      }
    }, [props.items]);

    if(!(props.items.length != 0)){
      props.updateShop(vItems)
    }

    const onClickHandler = () => {
      let aItems = gen_items()
      setShow(true)
      setItems(aItems)
      props.updateShop(aItems)
      setTimeout(
          () => {
            setShow(false)
          },
          (20-props.shopcd)*1000
      );
  };

  return (
    <div>
      <div className="row">
        <div className='column'>
          <h1 style={{color:"white", fontWeight: "bold"}}>Shop</h1>
        </div>
        <div className='column'>
          <ReactiveButton style={{ width: "100%", marginTop:"7px", fontWeight: "bold"}} height= "inherit" buttonState={show ? "loading" : "idle"} 
                              loadDuration={20-props.shopcd} onClick={ (e) => onClickHandler()} idleText={"Refresh Shop"}/>
        </div>
      </div>
      <table style={{ width: "100%", height: "110px"}}>  
          <tbody>
            <tr>
              {items.map((item, index) =>
                <td key={item.id}>
                    <MemoItem item={item} isShop={true} onClick={(e) => {
                          if(!item.bought){
                            item.bought = props.buy(e)
                            if(item.bought){
                              items[index]= item
                              props.updateShop([...items])
                            }
                          }
                        }
                      }/>
                      <ReactTooltip id={item.id} place="top" type="dark" effect="solid">
                        <h3 style={{color:colorByRarity(item.rarity)}}>{item.name}</h3>
                        <TypeMessage isRelic={item.type === RelicType} style={{color:colorByRarity(item.rarity)}} rarity={item.rarity} />
                        {currencies.map((currency) =>
                          item.cost().get(currency.id) != 0 && item.cost().get(currency.id) &&
                          <p key={currency.id} style={{color: "red"}}>{Number(item.cost().get(currency.id) || 0).toFixed(0)} {currency.icon}</p>)
                        }
                        <RelicMessage isRelic={item.type === RelicType} style={{color:"#e5e5e5"}} item={item} />
                        {currencies.map((currency) =>
                          item.effect().get(currency.id) != 0 && item.effect().get(currency.id) &&
                          <p key={currency.id} style={{color: "green"}}>{Number(item.effect().get(currency.id) || 0).toFixed(3)} {currency.icon} /s 
                          {props.artifactBonusLedger.get(currency.id) === undefined || item.type === RelicType ? ""
                          : " + " + Number(Number(item.effect().get(currency.id) || 0) * props.artifactBonusLedger.get(currency.id)).toFixed(3) + " " + currency.icon + " /s"}</p>)
                        }
                        {item.effect().get("mission") && Object.entries(item.effect().get("mission")).map(([key, value]) =>
                          elements.some(e=> e.id== key) ?
                          <p key={key} style={{color: colorByRarity(4)}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByReward(key)}}>{currencyById(key).icon} missions</span></p>
                          :<p key={key} style={{color: colorByRarity(3)}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByMission(missions[key])}}>{missions[key].text}</span></p>
                        )}
                        {item.effect().get("artifactBonus") && Object.entries(item.effect().get("artifactBonus")).map(([key, value]) =>
                          currencies.some(e=> e.id== key) ?
                          <p key={key} style={{color: colorByRarity(4)}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByReward(key)}}>{currencyById(key).icon} artifacts</span></p>
                          :soul.id == key ?
                          <p key={key} style={{color:colorByRarity(4)}}>{Number(value*100).toFixed(0)}% boost for {soul.icon} on reincarnation</p>
                          :null
                        )}
                        {item.effect().get("statBonus") && Object.entries(item.effect().get("statBonus")).map(([key, value]) =>
                          statsList.some(e=> e.id== key) ?
                          <p key={key} style={{color: colorByRarity(4)}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByReward(key)}}>{statById(key).icon}</span></p>
                          :null
                        )}
                        {statsList.map((stat) =>
                          item.statEffect !== undefined && item.statEffect.get(stat.id) != 0 && item.statEffect.get(stat.id) &&
                          <p key={stat.id} style={{color: "white"}}>{Number(Number(item.statEffect.get(stat.id) || 0).toFixed(1))} {stat.icon}</p>)
                        }
                      </ReactTooltip>
                  </td>
                  )
                }
            </tr>
          </tbody>
      </table>
    </div>
  )
}

function Inventory(props) {
  const [modal, setModal] = useState(false);
  const [box, setBox] = useState({});
  const [artifactSkip, setArtifactSkip] = useState(1);
  const [relicSkip, setRelicSkip] = useState(1);

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

  const res = (type) => splitToChunks(props.items.filter(i => i.type === type),5).splice(type == ArtifactType ? (artifactSkip-1)*5 : (relicSkip-1)*5 , 5)
  .map((row, index) => (
    <tr key={index}>
      {row.map((item) => {
        return <MemoItemTd key={item.id} item={item} setRelic={props.selectRelic}
              relic={props.relic} artifactBonusLedger={props.artifactBonusLedger}/>
        }
      )}
    </tr>)
  )

  const openModal = (x) => {
    setBox(x)
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  const artifactCount = props.items.filter(i => i.type === ArtifactType).length
  const artifactPages = artifactCount > 0 ? Math.ceil(artifactCount / 25) : 1 
  const relicCount = props.items.filter(i => i.type === RelicType).length
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
    <Tabs defaultActiveKey={"Artifacts"} className="mb-3" >
      <Tab eventKey={"Artifacts"} title={"Artifacts"}>
        <div>
          <table style={{ width: "100%", height: "195px", overflowY: "auto", display: "block"}}>  
              <tbody>
                {res(ArtifactType)}
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
          <table style={{ width: "100%", height: "195px", overflowY: "auto", display: "block"}}>  
              <tbody>
                {res(RelicType)}
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
      {Math.max(props.maxlevel, props.level)>=30 &&
        <Tab eventKey={"Box"} title={"Treasure Box"}>
          <div>
            {modal && <BoxModal box={box} quantity={props.boxesState.get(box.id) ?? 0} openBox={props.openBox} level={props.level} closeModal={closeModal} aBStatsMult={props.aBStatsMult}/>}
            <table style={{ width: "100%", height: "250px", overflowY: "auto", display: "block"}}>  
                <tbody>  
                  <tr>
                    {boxes.map(box =>
                      (props.boxesState.get(box.id) && props.boxesState.get(box.id) !==0) ?
                      <Box key={box.id} box={box} quantity={props.boxesState.get(box.id) ?? 0} openModal={openModal}/>
                      : (null)
                    )}  
                  </tr>
                </tbody>
            </table>
          </div>
        </Tab>
      }
      <Tab eventKey={"Gains"} title={"Gains"}>
        <div style={{ width: "100%", height: "250px", overflowY: "auto", display: "block", background: "#181818"}}>
            {currencies.map((currency) =>
              props.ledger.get(currency.id) != 0 && props.ledger.get(currency.id)  &&
              <p key={currency.id} style={{color: props.ledger.get(currency.id)>0 ? "green": "red", paddingLeft:"10px", fontWeight:"bold"}}>{Number(props.ledger.get(currency.id)*5 || 0).toFixed(3)} {currency.icon} /s </p>)
            }
        </div>
      </Tab>
      <Tab eventKey={"Boosts"} title={"Boosts"}>
        <div style={{ width: "100%", height: "250px", overflowY: "auto", display: "block", background: "#181818"}}>
          {props.artifactBonusLedger.entrySeq().sort(function([key1, value1], [key2, value2]) { return !isNaN(key2) && isNaN(key1) ? -1 : value2 - value1 }).map(([key, value]) =>
            key !== soul.id ?
              <p key={key} style={{color: colorByRarity(4), paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByReward(key)}}>{currencyById(key).icon} artifacts</span></p>
              : <p key={key} style={{color: colorByRarity(4), paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for {soul.icon} on reincarnation</p>)
          }
          {props.boostLedger.entrySeq().sort(function([key1, value1], [key2, value2]) { return !isNaN(key2) && isNaN(key1) ? -1 : value2 - value1 }).map(([key, value]) =>
              elements.some(e=> e.id== key) ?
              <p key={key} style={{color: colorByRarity(4), paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByReward(key)}}>{currencyById(key).icon} missions</span></p>
              : <p key={key} style={{color: colorByRarity(3), paddingLeft:"10px", fontWeight:"bold"}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByMission(missions[key])}}>{missions[key].text}</span></p>)
          }
        </div>
      </Tab>
    </Tabs>
  )
}

const MemoInventory = React.memo(Inventory)
const MemoShop = React.memo(Shop)
const MemoItem = React.memo(Item)
const MemoItemTd = React.memo(ItemTd)
export {MemoInventory, MemoShop, MemoItemTd}

function Item (props) {
  var {isShop, item, onClick, origin} = props
  return (
    <Background item={item} isShop={isShop} origin={origin}>
      <div style={{ width: 100, height:100, position: "relative", height: "100px", backgroundImage: `url(${item.src})`}}>
        <div style={{width: 100, height:100, backgroundImage: props.isShop && item.bought ? `url(${"/s.png"})` : !props.isShop && props.using ? `url(${"/u.png"})` : `url(${"/n.png"})`}}>
          <img
              src={require("/"+item.rarity+".png")}
              width={100}
              height={100}
              onClick={() => onClick(item)}
              />
        </div>
      </div>
    </Background>
  )
} 

function ItemTd (props) {
  var {relic, item, setRelic, onClick, selected, place, tteffect, artifactBonusLedger, origin, delay} = props
  onClick = onClick !== undefined ? onClick : setRelic !== undefined ? setRelic : () => void 0
  relic = relic !== undefined ? relic : {}
  origin = origin !== undefined ? origin : ""
  delay = delay !== undefined ? delay : relic.id == item.id
  return (
    <td>
      <MemoItem item={item} isShop={false} onClick={onClick} using={relic.id == item.id || selected?.id == item.id} origin={origin}/>
      <ReactTooltip id={item.id+"R"+origin} place={ place!== undefined ? place : "top"} type="dark" effect={ tteffect!== undefined ? tteffect : "solid"}
          delayHide={delay? 100: 0} delayUpdate={delay? 100: 0}>
          <div style={{ width: "100%", maxHeight: "400px", overflowY: "auto", display: "block"}}>
            <h3 style={{color:colorByRarity(item.rarity)}}>{item.name}</h3>
            <TypeMessage isRelic={item.type === RelicType} style={{color:colorByRarity(item.rarity)}} rarity={item.rarity} />
            <OwnedRelicMessage isRelic={item.type === RelicType} style={{color:"#e5e5e5"}} item={item}/>
            {currencies.map((currency) =>
              item.effect().get(currency.id) != 0 && item.effect().get(currency.id) &&
              <p key={currency.id} style={{color: "green"}}>{Number(item.effect().get(currency.id) || 0).toFixed(3)} {currency.icon} /s 
              { artifactBonusLedger === undefined || artifactBonusLedger.get(currency.id) === undefined || (item.type === RelicType && relic.id !== item.id) ? ""
              : " + " + Number(Number(item.effect().get(currency.id) || 0) * artifactBonusLedger.get(currency.id)).toFixed(3) + " " + currency.icon + " /s"}</p>)
            }
            {item.effect().get("mission") && Object.entries(item.effect().get("mission")).map(([key, value]) => {
              return elements.some(e=> e.id== key) ?
              <p key={key} style={{color: colorByRarity(4)}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByReward(key)}}>{currencyById(key).icon} missions</span></p>
              : <p key={key} style={{color: colorByRarity(3)}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByMission(missions[Number(key)])}}>{missions[Number(key)].text}</span></p>
            }
            )}
            {item.effect().get("artifactBonus") && Object.entries(item.effect().get("artifactBonus")).map(([key, value]) =>
              currencies.some(e=> e.id== key) ?
              <p key={key} style={{color: colorByRarity(4)}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByReward(key)}}>{currencyById(key).icon} artifacts</span></p>
              :soul.id == key ?
              <p key={key} style={{color:colorByRarity(4)}}>{Number(value*100).toFixed(0)}% boost for {soul.icon} on reincarnation</p>
              : null
            )}
            {item.effect().get("statBonus") && Object.entries(item.effect().get("statBonus")).map(([key, value]) =>
              statsList.some(e=> e.id== key) ?
              <p key={key} style={{color: colorByRarity(4)}}>{Number(value*100).toFixed(0)}% boost for <span style={{color: colorByReward(key)}}>{statById(key).icon}</span></p>
              :null
            )}
            {statsList.map((stat) =>
              item.statEffect !== undefined && item.statEffect.get(stat.id) != 0 && item.statEffect.get(stat.id) &&
              <p key={stat.id} style={{color: "white"}}>{Number(Number(item.statEffect.get(stat.id) || 0).toFixed(1))} {stat.icon}</p>)
            }
          </div>
      </ReactTooltip>
    </td>
  )
} 

export default MemoShop;