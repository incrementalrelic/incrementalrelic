import React, {useMemo, useState} from 'react';
import ReactiveButton from './components/progressButton';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { elements, experience } from "../functions/currencies";

export default React.memo(function ActionTabs(props) {
    const [state, setState] = useState(-1);
    const [interva, setInterva] = useState(null);

    const onClickHandler = (id, mission) => {
        setState(id);
        clearInterval(interva)
        var i = setInterval(
            () => {
                setState(-1)
                if(!mission()){
                    id=-1
                    clearInterval(i)
                };
                setTimeout( () => setState(id), 250)
            },
            3000
        );
        setInterva(i)
    };
    
    const lockedP = (level)=> <p style={{padding:"10px",color:"white", background:"#494949", fontWeight:"bold"}}> 🔒 Reach level {level} to unlock 🔒</p>
    const locked = useMemo(()=> props.level >= 55 ? null : 
                                props.level >= 50 && props.level < 55 ? lockedP(55) :
                                props.level >= 30 && props.level < 35 ? lockedP(35) :
                                props.level >= 20 && props.level < 25 ? lockedP(25) :
                                props.level >= 10 && props.level < 15 ? lockedP(15) :
                                props.level >= 3 && props.level < 8 ? lockedP(8) :
                                props.level < 3 ? lockedP(3) : null, [props.level])

    let vars = elements.map(cur => (<Tab eventKey={cur.id} title={cur.icon} key={cur.id}>
                    <table style={{width: "-webkit-fill-available", height: "384px", overflowY: "auto", display: "block", background:"#181818"}}>
                        <tbody style={{display:"table", width: "100%"}}>
                            {props.missions.filter((mission) => mission.cost_types.includes(cur.id) && props.level >= mission.level).map((mission) =>
                                (<tr key={mission.text}>
                                    <td style={{padding:"10px"}}><ReactiveButton style={{ width: "180px", fontWeight: "bold"}} height= "55px" buttonState={state===mission.text ? "loading" : "idle"} 
                                            onClick={ (e) => onClickHandler(mission.text, mission.start)} idleText={mission.text} loadDuration={3}/></td>
                                    <td style={{color: mission.id !== 0 ? "red" : "green", padding: "10px"}}>{mission.cost}</td>
                                    <td style={{color: "green"}}>{mission.reward()}</td>
                                </tr>))
                            }
                            <tr key="locked"><td colSpan={3}>{locked}</td></tr>
                        </tbody>
                    </table>
                </Tab>))

    return <Tabs defaultActiveKey={experience.id} className="mb-3" >
        <Tab eventKey={experience.id} title={experience.icon}>
            <table style={{width: "-webkit-fill-available", height: "384px", overflowY: "auto", display: "block", background:"#181818"}}>
                <tbody style={{display:"table", width: "100%"}}>
                    {props.missions.filter((mission) => props.level >= mission.level).map((mission) =>
                        (<tr key={mission.text}>
                            <td colSpan={1} style={{padding:"10px"}}><ReactiveButton style={{ width: "180px", fontWeight: "bold"}} height="55px" buttonState={state===mission.text ? "loading" : "idle"} 
                                    onClick={ (e) => onClickHandler(mission.text, mission.start)} idleText={mission.text} loadDuration={3}/></td>
                            <td colSpan={1}  style={{color: mission.id !== 0 ? "red" : "green", padding: "10px"}}>{mission.cost}</td>
                            <td colSpan={1}  style={{color: "green"}}>{mission.reward()}</td>
                        </tr>))
                    }
                    <tr key="locked"><td colSpan={3}>{locked}</td></tr>
                </tbody>
            </table>
        </Tab>
        {vars}
    </Tabs>
})