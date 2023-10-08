import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import { experience, gold, fire, water, earth, air, soul } from "../currencies";
import { gen_rarity_odds, generate_artifact, colorByReward, rarityName, colorByRarity, generate_relic } from "../items";
import { MemoItemTd as Item } from '../shop'
import { CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';

const config = require('../../next.config')

const item = {...generate_relic(10, 0, gen_rarity_odds({1:0,2:0,3:0,4:100})), cost: ()=>Map(), name: "The shopkeeper's heirloom"}

export function Story(props){
    const keys = Object.keys(messages).filter(x=> x <= props.level)
    const [messageKey, setMessageKey] = useState(keys.length-1);
    return <div style={{backgroundColor:"#333333" , height: "500px", fontWeight:"bold"}}>
        <div className="d-flex flex-row">
            <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                onClick={()=>{if(messageKey > 0) setMessageKey(messageKey-1)}}> 
                {"<<"} 
            </Button>
                <div className="p-2 flex-grow-1 bd-highlight col-example">
                </div>
            <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}}
                onClick={()=>{if(messageKey < keys.length-1) setMessageKey(messageKey+1)}}> 
                {">>"} 
            </Button>
        </div>
        <div style={{backgroundColor:"#333333", padding:"20px", height: "100%" }}>
            <MessageWrapper mkey={keys[messageKey]} />
        </div>
    </div>
}

export function MessageWrapper(props) {
    const { mkey, height } = props;
    return (
      <div style={{ display: "flex", height: "100%", minHeight: height }}>
        <div style={{ flex: 2, marginRight:"10px"}}>
            {messages[mkey]}
        </div> 
        <div style={{ flex: 1, position: "relative" }}>
            <div style={{width: '100%', height: '100%', position: 'relative'}}>
                <img src={config.basePath+"/chars/"+char[mkey]+".png"} alt={char[mkey]} position="absolute" width={"100%"}/>
            </div>
        </div>
      </div>
    );
}

export const messages = {"1":levelOne(), "3": levelThree(), "8": levelEight(), "10": levelTen(), 
                        "15":levelFifteen(), "18":levelEighteen(), 
                        "20": levelTwenty(), "25": levelTwentyFive(), "30": levelThirty(), "35":levelThirtyFive(), "40":levelForty(),
                        "45": levelFortyFive(), "50": levelFifty(), "55": levelFiftyFive()}



export const char = {"1":"orange", "3": "orange", "8": "orange", "10": "shopkeeper", "15":"lilac", "18":"shopkeeper", 
                        "20": "aqua", "25": "lilac", "30": "crimson", "35":"crimson", "40":"aqua",
                        "45": "aqua", "50": "aqua", "55": "crimson"}

export function levelOne(props){
    return <div style={{color:"#f5ab35"}}><p>Ah, hello young elementalist.</p><p>I am a little busy right now so go take a quick walk around the temple while I am finishing, I am sure you will find something interesting.</p></div>
}

export function levelThree(props){
    return <div><div style={{color:"#f5ab35"}}><p>Oh, You are back already... Well I guess I can't delay it any longer.</p><p>I see you gathered a few elements too {fire.icon}{water.icon}{earth.icon}{air.icon}. I'll teach you some basic rituals, try getting use to them.</p>
        <p>You'll lose some of the elements {fire.icon}{water.icon}{earth.icon}{air.icon} you collected, but at least you get some experience {experience.icon} and a little bit of gold {gold.icon}.</p></div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-Action: Elemental rituals</p>
            </div>
        </div>
}

export function levelEight(props){
    return <div><div style={{color:"#f5ab35"}}><p>What!? You are here again? I am very busy as always...</p>
                <p>You want to learn a new ritual? Hmmm, I see you already mastered the ones I tought you at first.</p>
                <p>Well I guess I could teach You elemental transmutation. Unlike the other rituals I tought You, these allow You to tranform elements of a given type into a different one {water.icon+"->"+fire.icon}.</p>
                <p>These rituals are a powerful tool to have in every elementalist toolbox. But more important than having learned something from someone is learning something by yourself.</p>
                <p>So go and master these new tools and next time try to learn the rituals by yourself instead of bothering me again!</p>
                </div>
                <div style={{color:"white"}}><b>You have unlocked:</b>
                    <p>-Action: Elemental transmutation rituals</p>
                </div>
            </div>
}

export function levelTen(props){
    return <div><div style={{color:"#00a4a6"}}><p>Psssht</p><p>Hey kiddo, you are a elementalist right? I knew it! Well you have great luck! You see, I have aquired these brand new <em>ancient</em> artifacts and I am selling them for cheap.</p>
        <p>Artifacts provides a variety of buffs like this one:</p>
        <Item item={{...generate_artifact(10, 0, gen_rarity_odds({1:0,2:0,3:0,4:100})), cost: ()=>Map(), name: "The shopkeeper's heirloom"}} />
        <p>The colors of the artifact represent its elemental rewards <a style={{color:colorByReward(fire.id)}}>red</a> {fire.icon}, <a style={{color:colorByReward(water.id)}}>blue</a> {water.icon}
        , <a style={{color:colorByReward(earth.id)}}>green</a> {earth.icon} and <a style={{color:colorByReward(air.id)}}>grey</a> {air.icon}.</p>
        <p>They also come in 4 different rarities <a style={{color:colorByRarity(1)}}>{rarityName(1)}</a>, <a style={{color:colorByRarity(2)}}>{rarityName(2)}</a>
        , <a style={{color:colorByRarity(3)}}>{rarityName(3)}</a> and <a style={{color:colorByRarity(4)}}>{rarityName(4)}</a>, with each rarity giving different types of buffs.</p>
        <p>No, that one is not for sale. I have other stuff tho, top notch quality too so make sure to look around!</p></div>
            <div style={{color:"white"}}><b style={{textAlign:"center"}}>You have unlocked:</b>
                <p>-Shop</p>
                <p>-Artifacts</p>
            </div>
        </div>
}

export function levelFifteen(props){
    return <div><div style={{color:"#dda0dd"}}><p>Are you the new student from master <b style={{color:"#f5ab35"}}>Orange</b>? Ah yes he has been quite busy recently, if I am not mistaken he started watching ☠ one piece 👒.
        </p><p>Well my name is <b>Lilac</b>, I specialize in practical elementalism and since You already seem to have a good understanding of the basics I can teach you a few tecniques</p></div>
        <div style={{color:"white"}}><b>You have unlocked:</b>
            <p>-Action: Practical elemental rituals</p>
        </div>
    </div>
}

export function levelEighteen(props){
    return <div><div style={{color:"#00a4a6"}}><p>Psssht</p><p>Hello again, I have got a new item supplier and he just sent me some relics.</p>
        <p>Unlike artifacts, relics don't give buffs when equiped and instead you need to perform a <a style={{color:"black"}}>dark ritual</a> known as reincarnation to get their power.</p>
        <p> I also have a relic in the display, but since I am not level <b>20</b> I can't do anything with it:</p>
        <Item item={item} />
        <p>You can visually distinguish relics from artifacts by their <a style={{color:"black"}}>darker colors</a>. Probably something to do with that <a style={{color:"black"}}>dark ritual</a> I mentioned.</p>
        <p>Again, that one is not for sale. But I am sure you'll find quite a few relics in the shop next time, if I had to guess I would say that <b>3 out of 10 of items I have on display are relics</b>!</p></div>
            <div style={{color:"white"}}><b style={{textAlign:"center"}}>You have unlocked:</b>
                <p>-Relics</p>
            </div>
        </div>
}

export function levelTwenty(props){
    return <div>
            <div style={{color:"#00ffff"}}>
                <p>Hello elementalist, it seems it's finally time for You to learn about reincarnation! I'm professor <b>Aqua</b> and I'm a speciallist on reincarnation.</p>
                <p>Reincarnation is a special ritual where you sacrifice your level and artifacts in exchange for you relics blessing and power. Additionally You will aquire some of the sacrificed artifacts' souls {soul.icon}</p>
                <p>These souls {soul.icon} can be used to further strengthen you relic or for some more other enhancements that I'll soon tell you about</p>
                <p>Once you're ready to reincarnate press the level indicator at the top of the page</p>
                
                <div style={{ width: 150, height: 150, marginTop: 5 , marginBottom: 5 }}>
                    <CircularProgressbarWithChildren 
                        value={0} 
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
                        <strong>Level 20</strong>
                        </div>
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                        0 / 1000 ⭐
                        </div>
                        <div style={{ fontSize: 12, marginTop: -5 , fontWeight: "bold"}}>
                            Click this to reincarnate
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
                <p>I would recommend on having at least an epic or ideally a legendary relic, but if you can't find one you can just go with the best rare you can find</p></div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-Reincarnation</p>
            </div>
        </div>
}

export function levelTwentyFive(props){
    return <div><div style={{color:"#dda0dd"}}><p>Hey how have you been? Unfortunately master <b style={{color:"#f5ab35"}}>Orange</b> is still watching ☠ one piece 👒. 
            He's still in the ☣️ punk hazard arc ☣️ so it should take a while for him to be available, in the meanwhile I'll teach you a few more practical elementalism tecniques.
            </p>
            <p>
                Also, I have spoken with professor <b style={{color:"#00ffff"}}>Aqua</b> and she told me that after your first reincarnation, she arranged to grant you access to the soul enhancement in the Workshop.
            </p>
            </div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-Action: A few more practical elemental rituals</p>
                <p>-Soul Enhancement</p>
            </div>
        </div>
}

export function levelThirty(props){
    return <div><div style={{color:"#f64747"}}><p>ATTENTION! Hello rookies it finally came the time when we met! I am the instructor, I mean the professor for battle elementalism!</p>
            <p>My name is general <b>Crimson</b> and make sure to address me as such!
            </p>
            <p>My goal is to shape you fine young men, into elementalist warriors capable of rivaling even the most vile of beasts. Come foward, battle awaits!
            </p></div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-Battle</p>
            </div>
        </div>
}

export function levelThirtyFive(props){
    return <div><div style={{color:"#f64747"}}>
            <p>I was just checking You performance on the battlefield and You should feel ashamed of yourself!</p>
            <p>I mean, You are not even using skills. Did you fall asleep on the class where we covered them?</p>
            <p>I guess I will teach you some skills and a few battle rituals. Altough i doubt any of that will make any difference!</p>
            <p>You know what, I will even teach you how to upgrade your relic for battle! Just don't forget that you need to reincarnate to get the relics power</p>
            <p>Since we are in the topic of relics and reincarnation, professor <b style={{color:"#00ffff"}}>Aqua</b> mentioned that some new soul enhancements were available.
             Something to do with boosts to elemental gains.</p>
            <p>Altough I can't understand why someone would buy those instead of battle power for their relic</p>
            </div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-Action: battle ritual</p>
                <p>-Battle: skills</p>
                <p>-Relic Upgrade: battle stats</p>
                <p>-Soul Enhancement: artifact boosts</p>
            </div>
        </div>
}

export function levelForty(props){
    return <div>
            <div style={{color:"#00ffff"}}>
                <p>Ah, I finally found You. Your relic has become a lot difference since the last time I saw You.</p>
                <p>It seems you've been almost as busy as master <b style={{color:"#f5ab35"}}>Orange</b> 😊.</p>
                <p>I think You are ready for the next step in the relic Workshop, it is called Relic Transfusion! 
                    Since there has been an increase in relics discovered, elemental scientists developed a process to extract some of these relics power into their own relics!</p>
                <p>Unfortunately the current process only works for <a style={{color:colorByRarity(3)}}>{rarityName(3)}</a> and <a style={{color:colorByRarity(4)}}>{rarityName(4)}</a> relics, but
                 I am sure a day will come where it will work for <a style={{color:colorByRarity(2)}}>{rarityName(2)}</a> relics too</p>
            </div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-Relic Transfusion</p>
            </div>
        </div>
}

export function levelFortyFive(props){
    return <div>
            <div style={{color:"#00ffff"}}>
                <p>It seems I underestimated the rarity of <a style={{color:colorByRarity(3)}}>{rarityName(3)}</a> and <a style={{color:colorByRarity(4)}}>{rarityName(4)}</a> relics. I'll let on in a secret then.</p>
                <p>If You visit the workshop You shoul be able to acess the item fusion station. In there you can fuse several artifacts and relics into higher rarirty ones.</p>
                <p>I have heard rumors that if You use the station for a <a style={{color:colorByRarity(4)}}>{rarityName(4)}</a> item it changes the items bonuses, so it can be a good idea to get specific bonuses for the relic transfusion ritual.</p>
            </div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-Item fusion</p>
            </div>
        </div>
}

export function levelFifty(props){
    return <div>
            <div style={{color:"#00ffff"}}>
                <p>I have heard news from general <b style={{color:"#f64747"}}>Crimson</b> about your achivements in the battlefield.</p>
                <p>After some research I was able to find some enhancements to exchange the power of souls {soul.icon} power for battle related benefits.</p>
                <p>Additionally I was able to find a way to improve the transfusion ritual absortion rate.</p>
                <p>I hope these enhancements will be able to benefit You in your quest for strengh as You fight more powerful foes.</p>
            </div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-New Soul Enhancements</p>
            </div>
        </div>
}

export function levelFiftyFive(props){
    return <div>
            <div style={{color:"#f64747"}}>
                <p>It is incredible to see your growth.</p>
                <p>I can't believe you came this far with those awful battle rituals. I taught them to You as a joke, I can't believe You actually still use them 😂.</p>
                <p>I expected You would try them a few times and then realise I was messing arround and look for something better.</p>
                <p>I really should punish your stupidity, but I feel like using those rituals all this time was punishment enough.</p>
                <p>So instead I'll reward your perseverance by telling You some of the rituals I personally use.</p>
            </div>
            <div style={{color:"white"}}><b>You have unlocked:</b>
                <p>-Action: Advanced battle rituals</p>
            </div>
        </div>
}
