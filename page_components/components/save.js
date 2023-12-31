import React, { Component } from "react";
import CryptoJS from "crypto-js";
import { Map } from "immutable";
import Button from 'react-bootstrap/Button';
import { fire, water, earth, air } from "../currencies";

class MyComponent extends Component {
    password = "idle"

    exportState = () => {
        const stateToExport = {
            ...this.props.saveState,
            inventory: this.props.saveState.inventory.map(x=>({...x, effectV: x.effect()})),
            shop: this.props.saveState.shop.map(x=>({...x, effectV: x.effect(), costV: x.cost()})),
            relic: this.props.saveState.relic.effect !== undefined ? {...this.props.saveState.relic, effectV: this.props.saveState.relic.effect()} : {},
            activeRelic: this.props.saveState.activeRelic.effect !== undefined ? {...this.props.saveState.activeRelic, effectV: this.props.saveState.activeRelic.effect()} : {}
        };
        const stateToExportJson = JSON.stringify(stateToExport);
        const encryptedState = CryptoJS.AES.encrypt(stateToExportJson, this.password).toString();
        const downloadLink = document.createElement("a");
        const currentDate = new Date().toISOString().slice(0, 19)
        downloadLink.href = `data:text/plain;charset=utf-8,${encryptedState}`;
        downloadLink.download = `idleR-${currentDate}.txt`;
        downloadLink.click();
    };

    importState = async () => {
        try {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = ".txt";
            fileInput.onchange = async () => {
                const file = fileInput.files[0];
                const encryptedState = await file.text();
                const decryptedState = CryptoJS.AES.decrypt(encryptedState, this.password).toString(CryptoJS.enc.Utf8);
                const mapObjectNames = ["wallet", "ledger", "boostLedger", "artifactBonusLedger", "statBonusLedger", "stats", 
                                    "artifactStats", "relicStats", "missionStats", "messagesShown", "info", "boxes", "skills"];
                const deserializedState = JSON.parse(decryptedState, (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                        if (key === "inventory") {
                            return value.map(x=>({...x, effect: ()=>Map(x.effectV), statEffect:Map(x.statEffect)}));
                        } else if (key === "shop") {
                            return value.map(x=>({...x, effect: ()=>Map(x.effectV), cost: ()=>Map(x.costV), statEffect:Map(x.statEffect)}));
                        } else if (key === "relic") {
                            return { ...value, effect: ()=>Map(value?.effectV ?? {}), statEffect:Map(value?.statEffect ?? {})};
                        } else if (key === "activeRelic") {
                            return { ...value, effect: ()=>Map(value?.effectV ?? {}), statEffect:Map(value?.statEffect ?? {})};
                        } else if (mapObjectNames.includes(key)) {
                            console.log(key)
                            console.log(value)
                            console.log(Map(value))
                            return Map(value);
                        } else {
                            return value;
                        }
                    }
                    return value;
                });
                console.log(deserializedState)
                this.props.setSaveState(deserializedState);
            };
            fileInput.click();
        } catch (error) {
            console.error("Import error:", error);
            alert("Import error:", error);
        }
    };

    exportAndRestart = () => {
        this.exportState();
        this.props.setSaveState( {
            wallet: new Map({[fire.id]:3, [water.id]:3, [earth.id]:3, [air.id]:3 }),
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
            relic: { effect: ()=>Map({}), statEffect:Map({}) },
            activeRelic: { effect: ()=>Map({}), statEffect:Map({}) },
            messagesShown: new Map(),
            info: new Map(),
            boxes: new Map(),
            skills: new Map(),
            prestigeModal: false,
            loading: false,
          });
    }

    render() {
        return (
            <div style={{paddingLeft:"10px", fontWeight:"bold"}}>
                <div style={{color:"white"}}>
                    <p>The game automatically saves every 10 seconds to the browser storage.</p>
                    <p>You can backup your save using the buttons below.</p>
                </div>
                <div>
                    <Button style={{backgroundColor:"#00a4a6", borderColor:"#00a4a6", fontWeight:"bold"}}
                        onClick={this.exportState}>
                            Export save
                    </Button>
                    <Button style={{backgroundColor:"#00a4a6", borderColor:"#00a4a6", fontWeight:"bold", marginLeft:"10px"}}
                        onClick={this.importState}>
                            Import save
                    </Button>
                    <Button style={{backgroundColor:"#b90d0a", borderColor:"#b90d0a", fontWeight:"bold", marginLeft:"10px"}}
                        onClick={this.exportAndRestart}>
                            Export save and restart game
                    </Button>
                </div>
                <div style={{color:"white", paddingTop:"25px"}}>
                </div>
                <div style={{color:"white", paddingTop:"45px"}}>
                    <p>Consider joining the discord: <a style={{color:"white"}} href="https://discord.gg/7BZfa3QZc7">https://discord.gg/7BZfa3QZc7</a></p> 
                    <p>Code avaliable at: <a style={{color:"white"}} href="https://github.com/incrementalrelic/incrementalrelic">https://github.com/incrementalrelic/incrementalrelic</a></p>
                </div>
            </div>
        );
    }
}

export default MyComponent;