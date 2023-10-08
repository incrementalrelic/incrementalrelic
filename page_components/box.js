import React, {useState, useEffect} from 'react';
import { gen_rarity_odds, generate_artifact, colorByReward, rarityName, colorByRarity, ArtifactType, generate_relic, RelicType } from "./items";
import { statsList, statById } from "./stats"
import { currencies, elements, currencyById, soul } from "./currencies";
import ReactTooltip from 'react-tooltip';
import ConfirmModal from "./components/modal"
import Button from 'react-bootstrap/Button';
import { missions, colorByMission } from "./missions";
import { Map } from "immutable";

const config = require('../next.config')
 
export const wooden = {id: "woodB", name: "Wooden box", type: "artifact", rarity:1, src:"/wooden.png", odds:{1:70,2:25,3:4,4:1}};
export const steel = {id: "steelB", name: "Steel box", type: "artifact", rarity:2, src:"/steel.png", odds:{1:50,2:40,3:9,4:1}};
export const golden = {id: "goldB", name: "Golden box", type: "artifact", rarity:3, src:"/golden.png", odds:{1:0,2:70,3:24,4:6}};
export const sapphire = {id: "sapphireB", name: "Sapphire box", type: "relic", rarity:3, src:"/sapphire.png", odds:{1:0,2:70,3:24,4:6}};
export const platinum = {id: "platinumB", name: "Platinum box", type: "artifact", rarity:4, src:"/platinum.png", odds:{1:0,2:0,3:90,4:10}};
export const diamond = {id: "diamondB", name: "Diamond box", type: "relic", rarity:4, src:"/diamond.png", odds:{1:0,2:0,3:90,4:10}};
export const boxes = [wooden, steel, golden, sapphire, platinum, diamond]

const BoxBackground = ({children, box}) => (
    <div data-tip data-for={box.id} style={{position:'relative', top:2,bottom:0,right:0,left:0, flexDirection: 'column', zIndex: 1, height: "105px"}}>
      {children}
    </div>
  );  

  
const Background = ({children , item}) => (
    <div data-tip data-for={item.id} style={{position:'relative', top:2,bottom:0,right:0,left:0, flexDirection: 'column', zIndex: 1, height: "105px"}}>
      {children}
    </div>
  );

const TypeMessage = ({isRelic, rarity}) => (
    <div>
        <p style={{color: isRelic? "#DB9D00" : "#e5e5e5"}}>{rarityName(rarity)} {isRelic? "Relic" : "Artifact"}</p>
    </div>
);

export const Box = (props) => {
    var {box, quantity} = props
    
    return (
        <td onClick={()=>props.openModal(box)}>
            <BoxBackground box={box}>
                <div style={{ width: 100, height:100, position: "relative", height: "100px", backgroundImage: `url(${config.basePath+box.src})`, textAlign:'center'}}>
                    <img
                        alt={box.rarity}
                        src={config.basePath+"/"+box.rarity+".png"}
                        width={100}
                        height={100}
                    />
                    <div style={{position:'absolute', paddingLeft:"3px" , bottom:"3px", right: "3px", color: "white", backgroundColor: "black" }}>{quantity}</div>
                </div>
            </BoxBackground>
            <BoxToolTip {...props}/>
        </td>
    )
}

export const BoxToolTip = (props) =>{
    var {box, quantity} = props
    return (
        <ReactTooltip id={box.id} place="top" type="dark" effect="solid">
            <h3 style={{color:colorByRarity(box.rarity)}}>{box.name}</h3>
            <div>
                {quantity && <p style={{color: "white"}}>Click to open</p>}
            </div>
            <div>
                {quantity && <p style={{color: "white"}}>Quantity: {quantity}</p>}
            </div>
            {Object.keys(box.odds).map(key => 
                <p key={key} style={{color: colorByRarity(Number(key)), fontWeight:'bold'}}>{box.odds[key]}% of {rarityName(Number(key))} {box.type === ArtifactType ? "artifact" :"relic"}</p>
            )}
        </ReactTooltip>
    )
}

export const BoxModal = (props) =>{
    var {box, quantity, level, openBox, aBStatsMult} = props
    const [items, setItems] = useState([]);
    const [skip, setSkip] = useState(1);

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

    const res = () => splitToChunks(items,5).splice((skip-1)*5 , 5).map((row) => (
        <tr>
          {row.map((item) =>
            <td key={item.id}>
              <Item item={item}/>
              <ReactTooltip id={item.id} place="top" type="dark" effect="solid">
                <h3 style={{color:colorByRarity(item.rarity)}}>{item.name}</h3>
                <TypeMessage isRelic={item.type === RelicType} rarity={item.rarity} />
                {currencies.map((currency) =>
                  item.effect().get(currency.id) != 0 && item.effect().get(currency.id) &&
                  <p key={currency.id} style={{color: "green"}}>{Number(item.effect().get(currency.id) || 0).toFixed(3)} {currency.icon} /s</p>)
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
          )}
        </tr>)
      )

    const onClickHandler = (n) => {
        const generate = box.type === ArtifactType ? generate_artifact : generate_relic
        var arr = Array.from({length: n}, (v, i) => ({...generate(level, {aBStatsMult:aBStatsMult}, gen_rarity_odds(box.odds)), cost: ()=>Map({[box.id]:-1})}))
        openBox(arr, true)
        setItems(arr)
    }

    const itemPages = items.length>0 ? Math.ceil(items.length/25) : 1

    const changeSkip = (i) => {
      if(i>=0 && i<=itemPages)
        setSkip(i)
    }

    if(itemPages < skip){
      setSkip(itemPages)
    }

    return <ConfirmModal title={"Open "+ box.name} onClose={props.closeModal}> 
        <div>
            { quantity >= 1 &&<Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                onClick={() => onClickHandler(1)}> 
                {"Open 1"} 
            </Button>}
            { quantity >= 10 && <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949", marginLeft:"10px"}}
                onClick={() => onClickHandler(10)}>  
                {"Open 10"} 
            </Button>}
            { quantity > 1 && <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949", marginLeft:"10px"}}
                onClick={() => onClickHandler(quantity)}>  
                {"Open all "+ quantity} 
            </Button>}
        </div>
        <br/>
        <div>
          <table style={{ width: "100%", height: "250px", overflowY: "auto", display: "block"}}>  
              <tbody>
                {res()}
              </tbody>
          </table>
          { Math.ceil(itemPages) >= 2 &&
          <div className="d-flex flex-row">
            <div className="p-2">
                <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                    onClick={()=>changeSkip(skip-1)}> 
                    {"<<"} 
                </Button>
            </div>
            <div className="p-2 flex-grow-1 bd-highlight col-example">
                <p style={{color: "white", fontWeight:"bold", textAlign:"center"}}>Page {skip} of {itemPages}</p>
            </div>
            <div className="p-2">
                <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                    onClick={()=>changeSkip(skip+1)}> 
                    {">>"} 
                </Button>
            </div>
          </div>}
        </div>
    </ConfirmModal>
}

const Item = (props) => {
  var {item} = props
  return (
    <Background item={item}>
      <div style={{ width: 100, height:100, position: "relative", height: "100px", backgroundImage: `url(${config.basePath+item.src})`}}>
        <div style={{width: 100, height:100}}>
          <img 
              src={config.basePath+"/"+item.rarity+".png"}
              width={100}
              height={100}
              />
        </div>
      </div>
    </Background>
  )
} 