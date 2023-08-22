import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import GameDot from "../../../../src/config/GameDot";
import NativeCall from "../../../../src/config/NativeCall";
import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataBox from "./DataBox";
import ItemBox from "./ItemBox";
import ItemGood from "./ItemGood";

/** box参数 */
export interface BoxParam {
    index: number;
    name: string;
    x: number;
    y: number;
    w: number;
    h: number;
    layerI: number;
    layerJ: number;
    goods: any;
    yBottom: number;
    isMove: boolean;
    isFrame: boolean;
}

/** good参数 */
export interface GoodParam {
    index: number;
    name: string;
    nameRes: string;
    x: number;
    y: number;
    w: number;
    h: number;
    keyGood: number;
    isMove: boolean;
    box: { name: string, key: number, x: number, y: number },
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameBox extends cc.Component {

    @property(cc.Node) maskTop: cc.Node = null;// 顶部屏蔽
    @property(cc.Node) maskBottom: cc.Node = null;// 底部屏蔽
    @property([cc.Label]) arrTimeLayer: cc.Label[] = [];// 时间
    @property(cc.Node) boxBottom: cc.Node = null;// 底部箱子
    @property(cc.Node) nodeMain: cc.Node = null;// 箱子父节点
    @property(cc.Node) uiTop: cc.Node = null;// 顶部节点
    @property(cc.Node) uiTopLevel: cc.Node = null;// 等级ui
    @property(cc.Node) uiTopTime: cc.Node = null;// 时间ui
    @property(cc.Node) uiTopCoin: cc.Node = null;// 金币ui
    @property(cc.Node) uiTopProcess: cc.Node = null;// 进度ui
    @property(cc.Node) uiBottom: cc.Node = null;// 底部节点
    @property(cc.Node) uiBottomMain: cc.Node = null;// 底部物品父节点
    @property(cc.Node) nodeProp: cc.Node = null;// 道具父节点
    @property(cc.Prefab) preBox: cc.Prefab = null;// 预制体：箱子
    @property(cc.Prefab) preGood: cc.Prefab = null;// 预制体：物品

    // dataLevel = {
    //     map: [
    //         { "x": -150, "y": 90.5, "w": "231", "h": "181" },
    //         { "x": -150, "y": 271.5, "w": "231", "h": "181" },
    //         { "x": -150, "y": 452.5, "w": "231", "h": "181" },
    //         { "x": -150, "y": 633.5, "w": "231", "h": "181" },
    //         { "x": -150, "y": 814.5, "w": "231", "h": "181" },
    //         { "x": -150, "y": 995.5, "w": "231", "h": "181" },
    //         { "x": 150, "y": 90.5, "w": "231", "h": "181" },
    //         { "x": 150, "y": 271.5, "w": "231", "h": "181" },
    //         { "x": 150, "y": 452.5, "w": "231", "h": "181" },
    //         { "x": 150, "y": 633.5, "w": "231", "h": "181" },
    //         { "x": 150, "y": 814.5, "w": "231", "h": "181" },
    //         { "x": 150, "y": 995.5, "w": "231", "h": "181" }
    //     ],
    //     item: [
    //         { "x": -150, "y": 271.5, "w": 1, "p": 1, "n": "1001" },
    //         { "x": -150, "y": 633.5, "w": 1, "p": 3, "n": "1001" },
    //         { "x": -150, "y": 995.5, "w": 1, "p": 5, "n": "1001" },
    //         { "x": 150, "y": 271.5, "w": 1, "p": 7, "n": "1001" },
    //         { "x": 150, "y": 633.5, "w": 1, "p": 9, "n": "1001" },
    //         { "x": 150, "y": 995.5, "w": 1, "p": 11, "n": "1001" },
    //         { "x": -150, "y": 90.5, "w": 4, "p": 0, "n": "4006" },
    //         { "x": -150, "y": 452.5, "w": 4, "p": 2, "n": "4006" },
    //         { "x": -150, "y": 814.5, "w": 4, "p": 4, "n": "4006" },
    //         { "x": 150, "y": 90.5, "w": 4, "p": 6, "n": "4006" },
    //         { "x": 150, "y": 452.5, "w": 4, "p": 8, "n": "4006" },
    //         { "x": 150, "y": 814.5, "w": 4, "p": 10, "n": "4006" }
    //     ]
    // };

    // dataLevel = {
    //     "map": [
    //         { "x": -231, "y": 814.5, "w": "154", "h": "181" }, { "x": -155, "y": 1538.5, "w": "231", "h": "181" }, { "x": -115, "y": 1719.5, "w": "231", "h": "181" },
    //         { "x": -154, "y": 2081.5, "w": "308", "h": "181" }, { "x": -231, "y": 2262.5, "w": "154", "h": "181" }, { "x": -231, "y": 2443.5, "w": "154", "h": "181" },
    //         { "x": -154, "y": 2624.5, "w": "308", "h": "181" }, { "x": -231, "y": 2805.5, "w": "154", "h": "181" }, { "x": -231, "y": 2986.5, "w": "154", "h": "181" },
    //         { "x": -154, "y": 3167.5, "w": "308", "h": "181" }, { "x": 0, "y": 90.5, "w": 231, "h": 181 }, { "x": 0, "y": 271.5, "w": 231, "h": 181 }, { "x": 0, "y": 452.5, "w": 231, "h": 181 },
    //         { "x": 0, "y": 633.5, "w": "616", "h": "181" }, { "x": 0, "y": 814.5, "w": "231", "h": "181" }, { "x": 0, "y": 995.5, "w": "308", "h": "181" }, { "x": 0, "y": 1176.5, "w": "420", "h": "181" },
    //         { "x": 0, "y": 1357.5, "w": "539", "h": "181" }, { "x": 0, "y": 1900.5, "w": "308", "h": "181" }, { "x": 0, "y": 2262.5, "w": "308", "h": "181" }, { "x": 0, "y": 2443.5, "w": "308", "h": "181" },
    //         { "x": 0, "y": 2805.5, "w": "308", "h": "181" }, { "x": 0, "y": 2986.5, "w": "308", "h": "181" }, { "x": 231, "y": 814.5, "w": "154", "h": "181" }, { "x": 155, "y": 1538.5, "w": "231", "h": "181" },
    //         { "x": 115, "y": 1719.5, "w": "231", "h": "181" }, { "x": 154, "y": 2081.5, "w": "308", "h": "181" }, { "x": 231, "y": 2262.5, "w": "154", "h": "181" }, { "x": 231, "y": 2443.5, "w": "154", "h": "181" },
    //         { "x": 154, "y": 2624.5, "w": "308", "h": "181" }, { "x": 231, "y": 2805.5, "w": "154", "h": "181" }, { "x": 231, "y": 2986.5, "w": "154", "h": "181" }, { "x": 154, "y": 3167.5, "w": "308", "h": "181" }
    //     ],
    //     "item": [
    //         { "x": 100, "y": 633.5, "w": 1, "p": 13, "n": "1001", "g": 0 }, { "x": -200, "y": 814.5, "w": 1, "p": 0, "n": "1001", "g": 0 }, { "x": -265, "y": 814.5, "w": 1, "p": 0, "n": "1001", "g": 0 },
    //         { "x": 200, "y": 814.5, "w": 1, "p": 23, "n": "1001", "g": 0 }, { "x": 0, "y": 814.5, "w": 3, "p": 14, "n": "3001", "g": 0 }, { "x": 0, "y": 1176.5, "w": 3, "p": 16, "n": "3001", "g": 0 },
    //         { "x": -155, "y": 1719.5, "w": 3, "p": 2, "n": "3001", "g": 0 }, { "x": -100, "y": 1900.5, "w": 1, "p": 18, "n": "1001", "g": 0 }, { "x": -100, "y": 2262.5, "w": 1, "p": 19, "n": "1001", "g": 0 },
    //         { "x": 0, "y": 2805.5, "w": 3, "p": 21, "n": "3001", "g": 0 }, { "x": 0, "y": 2986.5, "w": 3, "p": 22, "n": "3001", "g": 0 }, { "x": 70, "y": 3167.5, "w": 3, "p": 32, "n": "3001", "g": 0 },
    //         { "x": 0, "y": 633.5, "w": 3, "p": 13, "n": "3011", "g": 0 }, { "x": -230, "y": 2081.5, "w": 3, "p": 3, "n": "3011", "g": 0 }, { "x": 184, "y": 3167.5, "w": 3, "p": 32, "n": "3011", "g": 0 },
    //         { "x": -100, "y": 633.5, "w": 1, "p": 13, "n": "1003", "g": 0 }, { "x": 35, "y": 271.5, "w": 1, "p": 11, "n": "1003", "g": 0 }, { "x": -220, "y": 1357.5, "w": 1, "p": 17, "n": "1003", "g": 0 },
    //         { "x": -89, "y": 1538.5, "w": 1, "p": 1, "n": "1003", "g": 0 }, { "x": -100, "y": 2805.5, "w": 1, "p": 21, "n": "1003", "g": 0 }, { "x": -100, "y": 2986.5, "w": 1, "p": 22, "n": "1003", "g": 0 },
    //         { "x": 35, "y": 452.5, "w": 1, "p": 12, "n": "1007", "g": 0 }, { "x": -50, "y": 452.5, "w": 1, "p": 12, "n": "1007", "g": 0 }, { "x": -50, "y": 271.5, "w": 1, "p": 11, "n": "1007", "g": 0 },
    //         { "x": 265, "y": 814.5, "w": 1, "p": 23, "n": "1007", "g": 0 }, { "x": -100, "y": 1176.5, "w": 1, "p": 16, "n": "1007", "g": 0 }, { "x": 100, "y": 1900.5, "w": 1, "p": 18, "n": "1007", "g": 0 },
    //         { "x": 100, "y": 2262.5, "w": 1, "p": 19, "n": "1007", "g": 0 }, { "x": 100, "y": 2986.5, "w": 1, "p": 22, "n": "1007", "g": 0 }, { "x": 265, "y": 3167.5, "w": 1, "p": 32, "n": "1007", "g": 0 },
    //         { "x": -220, "y": 633.5, "w": 3, "p": 13, "n": "3012", "g": 0 }, { "x": 220, "y": 633.5, "w": 3, "p": 13, "n": "3012", "g": 0 }, { "x": 80, "y": 995.5, "w": 3, "p": 15, "n": "3012", "g": 0 },
    //         { "x": 180, "y": 1357.5, "w": 3, "p": 17, "n": "3012", "g": 0 }, { "x": -231, "y": 2262.5, "w": 3, "p": 4, "n": "3012", "g": 0 }, { "x": 231, "y": 2262.5, "w": 3, "p": 27, "n": "3012", "g": 0 },
    //         { "x": 231, "y": 2443.5, "w": 3, "p": 28, "n": "3012", "g": 0 }, { "x": 231, "y": 2624.5, "w": 3, "p": 29, "n": "3012", "g": 0 }, { "x": 80, "y": 2624.5, "w": 3, "p": 29, "n": "3012", "g": 0 },
    //         { "x": 0, "y": 90.5, "w": 3, "p": 10, "n": "3008", "g": 0 }, { "x": -50, "y": 1357.5, "w": 3, "p": 17, "n": "3008", "g": 0 }, { "x": -189, "y": 1538.5, "w": 3, "p": 1, "n": "3008", "g": 0 },
    //         { "x": 230, "y": 2081.5, "w": 3, "p": 26, "n": "3008", "g": 0 }, { "x": 0, "y": 2262.5, "w": 3, "p": 19, "n": "3008", "g": 0 }, { "x": -50, "y": 2443.5, "w": 3, "p": 20, "n": "3008", "g": 0 },
    //         { "x": -70, "y": 995.5, "w": 4, "p": 15, "n": "4014", "g": 0 }, { "x": 130, "y": 1176.5, "w": 4, "p": 16, "n": "4014", "g": 0 }, { "x": 231, "y": 2986.5, "w": 4, "p": 31, "n": "4014", "g": 0 },
    //         { "x": -231, "y": 2986.5, "w": 4, "p": 8, "n": "4014", "g": 0 }, { "x": -221, "y": 3167.5, "w": 4, "p": 9, "n": "4014", "g": 0 }, { "x": -86, "y": 3167.5, "w": 4, "p": 9, "n": "4014", "g": 0 },
    //         { "x": -90, "y": 2081.5, "w": 4, "p": 3, "n": "4006", "g": 0 }, { "x": 90, "y": 2081.5, "w": 4, "p": 26, "n": "4006", "g": 0 }, { "x": -231, "y": 2443.5, "w": 4, "p": 5, "n": "4006", "g": 0 },
    //         { "x": -90, "y": 2624.5, "w": 4, "p": 6, "n": "4006", "g": 0 }, { "x": -231, "y": 2805.5, "w": 4, "p": 7, "n": "4006", "g": 0 }, { "x": 231, "y": 2805.5, "w": 4, "p": 30, "n": "4006", "g": 0 },
    //         { "x": -160, "y": 1176.5, "w": 1, "p": 16, "n": "1002", "g": 0 }, { "x": -150, "y": 1357.5, "w": 1, "p": 17, "n": "1002", "g": 0 }, { "x": 104, "y": 1538.5, "w": 1, "p": 24, "n": "1002", "g": 0 },
    //         { "x": -60, "y": 1719.5, "w": 1, "p": 2, "n": "1002", "g": 0 }, { "x": 60, "y": 1719.5, "w": 1, "p": 25, "n": "1002", "g": 0 }, { "x": 100, "y": 2805.5, "w": 1, "p": 21, "n": "1002", "g": 0 },
    //         { "x": 60, "y": 1357.5, "w": 2, "p": 17, "n": "2002", "g": 0 }, { "x": 209, "y": 1538.5, "w": 2, "p": 24, "n": "2002", "g": 0 }, { "x": 150, "y": 1719.5, "w": 2, "p": 25, "n": "2002", "g": 0 },
    //         { "x": 0, "y": 1900.5, "w": 2, "p": 18, "n": "2002", "g": 0 }, { "x": 80, "y": 2443.5, "w": 2, "p": 20, "n": "2002", "g": 0 }, { "x": -230, "y": 2624.5, "w": 2, "p": 6, "n": "2002", "g": 0 }
    //     ]
    // };

    dataLevel = {
        "map": [
            { "x": -148, "y": 452.5, "w": "320", "h": "181" }, { "x": -228, "y": 633.5, "w": "160", "h": "181" },
            { "x": -148, "y": 814.5, "w": "320", "h": "181" }, { "x": -228, "y": 995.5, "w": "160", "h": "181" },
            { "x": -148, "y": 1176.5, "w": "320", "h": "181" }, { "x": -148, "y": 1357.5, "w": "320", "h": "181" },
            { "x": -228, "y": 1538.5, "w": "160", "h": "181" }, { "x": -148, "y": 1719.5, "w": "320", "h": "181" },
            { "x": -148, "y": 1900.5, "w": "320", "h": "181" }, { "x": -228, "y": 2081.5, "w": "160", "h": "181" },
            { "x": -148, "y": 2262.5, "w": "320", "h": "181" }, { "x": -148, "y": 2443.5, "w": "320", "h": "181" },
            { "x": -228, "y": 2624.5, "w": "160", "h": "181" }, { "x": -148, "y": 2805.5, "w": "320", "h": "181" },
            { "x": -148, "y": 2986.5, "w": "320", "h": "181" }, { "x": -228, "y": 3167.5, "w": "160", "h": "181" },
            { "x": -148, "y": 3348.5, "w": "320", "h": "181" }, { "x": -148, "y": 3529.5, "w": "320", "h": "181" },
            { "x": -228, "y": 3710.5, "w": "160", "h": "181" }, { "x": 0, "y": 90.5, "w": "616", "h": "181" },
            { "x": 0, "y": 271.5, "w": "616", "h": "181" }, { "x": -68, "y": 633.5, "w": "160", "h": "181" },
            { "x": -68, "y": 995.5, "w": "160", "h": "181" }, { "x": -68, "y": 1538.5, "w": "160", "h": "181" },
            { "x": -68, "y": 2081.5, "w": "160", "h": "181" }, { "x": -68, "y": 2624.5, "w": "160", "h": "181" },
            { "x": -68, "y": 3167.5, "w": "160", "h": "181" }, { "x": -68, "y": 3710.5, "w": "160", "h": "181" },
            { "x": 280, "y": 633.5, "w": "154", "h": "20" }, { "x": 110, "y": 633.5, "w": "154", "h": "20" },
            { "x": 193, "y": 814.5, "w": "154", "h": "20" }, { "x": 193, "y": 452.5, "w": "154", "h": "20" },
        ],
        "item": [
            { "x": -245, "y": 90.5, "w": 2, "p": 19, "n": "2003", "g": 0 }, { "x": -168, "y": 90.5, "w": 1, "p": 19, "n": "1012", "g": 0 },
            { "x": -77, "y": 90.5, "w": 3, "p": 19, "n": "3001", "g": 0 }, { "x": 26.5, "y": 90.5, "w": 2, "p": 19, "n": "2016", "g": 0 },
            { "x": 116, "y": 90.5, "w": 2, "p": 19, "n": "2017", "g": 0 }, { "x": 230, "y": 90.5, "w": 4, "p": 19, "n": "4013", "g": 0 },
            { "x": -230, "y": 271.5, "w": 2, "p": 20, "n": "2016", "g": 0 }, { "x": -134, "y": 271.5, "w": 2, "p": 20, "n": "2017", "g": 0 },
            { "x": -23, "y": 271.5, "w": 3, "p": 20, "n": "3012", "g": 0 }, { "x": 75.5, "y": 271.5, "w": 1, "p": 20, "n": "1012", "g": 0 },
            { "x": 146.5, "y": 271.5, "w": 1, "p": 20, "n": "1002", "g": 0 }, { "x": 230, "y": 271.5, "w": 2, "p": 20, "n": "2004", "g": 0 },
            { "x": -238, "y": 452.5, "w": 3, "p": 0, "n": "3001", "g": 0 }, { "x": -148, "y": 452.5, "w": 1, "p": 0, "n": "1012", "g": 0 },
            { "x": -58, "y": 452.5, "w": 3, "p": 0, "n": "3012", "g": 0 }, { "x": -228, "y": 633.5, "w": 3, "p": 1, "n": "3006", "g": 0 },
            { "x": -68, "y": 633.5, "w": 3, "p": 21, "n": "3006", "g": 0 }, { "x": -244, "y": 814.5, "w": 2, "p": 2, "n": "2018", "g": 0 },
            { "x": -148, "y": 814.5, "w": 2, "p": 2, "n": "2016", "g": 0 }, { "x": -52, "y": 814.5, "w": 2, "p": 2, "n": "2018", "g": 0 },
            { "x": -228, "y": 995.5, "w": 3, "p": 3, "n": "3006", "g": 0 }, { "x": -68, "y": 995.5, "w": 3, "p": 22, "n": "3006", "g": 0 },
            { "x": -219, "y": 1176.5, "w": 3, "p": 4, "n": "3001", "g": 0 }, { "x": -120.5, "y": 1176.5, "w": 1, "p": 4, "n": "1002", "g": 0 },
            { "x": -49.5, "y": 1176.5, "w": 1, "p": 4, "n": "1012", "g": 0 }, { "x": -244, "y": 1357.5, "w": 2, "p": 5, "n": "2003", "g": 0 },
            { "x": -148, "y": 1357.5, "w": 2, "p": 5, "n": "2017", "g": 0 }, { "x": -52, "y": 1357.5, "w": 2, "p": 5, "n": "2016", "g": 0 },
            { "x": -228, "y": 1538.5, "w": 4, "p": 6, "n": "4013", "g": 0 }, { "x": -68, "y": 1538.5, "w": 3, "p": 23, "n": "3006", "g": 0 },
            { "x": -238, "y": 1719.5, "w": 3, "p": 7, "n": "3001", "g": 0 }, { "x": -148, "y": 1719.5, "w": 1, "p": 7, "n": "1012", "g": 0 },
            { "x": -58, "y": 1719.5, "w": 3, "p": 7, "n": "3012", "g": 0 }, { "x": -244, "y": 1900.5, "w": 2, "p": 8, "n": "2003", "g": 0 },
            { "x": -148, "y": 1900.5, "w": 2, "p": 8, "n": "2018", "g": 0 }, { "x": -52, "y": 1900.5, "w": 2, "p": 8, "n": "2017", "g": 0 },
            { "x": -228, "y": 2081.5, "w": 4, "p": 9, "n": "4013", "g": 0 }, { "x": -68, "y": 2081.5, "w": 3, "p": 24, "n": "3006", "g": 0 },
            { "x": -244, "y": 2262.5, "w": 2, "p": 10, "n": "2003" }, { "x": -148, "y": 2262.5, "w": 2, "p": 10, "n": "2018" },
            { "x": -52, "y": 2262.5, "w": 2, "p": 10, "n": "2008", "g": 0 }, { "x": -246.5, "y": 2443.5, "w": 1, "p": 11, "n": "1011", "g": 0 },
            { "x": -148, "y": 2443.5, "w": 3, "p": 11, "n": "3001", "g": 0 }, { "x": -49.5, "y": 2443.5, "w": 1, "p": 11, "n": "1012", "g": 0 },
            { "x": -228, "y": 2624.5, "w": 3, "p": 12, "n": "3006", "g": 0 }, { "x": -68, "y": 2624.5, "w": 4, "p": 25, "n": "4013", "g": 0 },
            { "x": -246.5, "y": 2805.5, "w": 1, "p": 13, "n": "1012", "g": 0 }, { "x": -175.5, "y": 2805.5, "w": 1, "p": 13, "n": "1011", "g": 0 },
            { "x": -77, "y": 2805.5, "w": 3, "p": 13, "n": "3012", "g": 0 }, { "x": -244, "y": 2986.5, "w": 2, "p": 14, "n": "2004", "g": 0 },
            { "x": -148, "y": 2986.5, "w": 2, "p": 14, "n": "2016", "g": 0 }, { "x": -52, "y": 2986.5, "w": 2, "p": 14, "n": "2018", "g": 0 },
            { "x": -228, "y": 3167.5, "w": 4, "p": 15, "n": "4013", "g": 0 }, { "x": -68, "y": 3167.5, "w": 4, "p": 26, "n": "4013", "g": 0 },
            { "x": -254.5, "y": 3348.5, "w": 1, "p": 16, "n": "1011", "g": 0 }, { "x": -183.5, "y": 3348.5, "w": 1, "p": 16, "n": "1002", "g": 0 },
            { "x": -112.5, "y": 3348.5, "w": 1, "p": 16, "n": "1011", "g": 0 }, { "x": -41.5, "y": 3348.5, "w": 1, "p": 16, "n": "1012", "g": 0 },
            { "x": -219, "y": 3529.5, "w": 3, "p": 17, "n": "3011", "g": 0 }, { "x": -120.5, "y": 3529.5, "w": 1, "p": 17, "n": "1002", "g": 0 },
            { "x": -49.5, "y": 3529.5, "w": 1, "p": 17, "n": "1002", "g": 0 }, { "x": -228, "y": 3710.5, "w": 2, "p": 18, "n": "2004", "g": 0 },
            { "x": -68, "y": 3710.5, "w": 3, "p": 27, "n": "3001", "g": 0 }, { "x": 193, "y": 452.5, "w": 1, "p": 31, "n": "1012", "g": 0 },
            { "x": 193, "y": 452.5, "w": 3, "p": 31, "n": "3001", "g": 0 }, { "x": 193, "y": 452.5, "w": 3, "p": 31, "n": "3006", "g": 0 },
            { "x": 193, "y": 452.5, "w": 2, "p": 31, "n": "2018", "g": 0 }, { "x": 193, "y": 452.5, "w": 2, "p": 31, "n": "2003", "g": 0 },
            { "x": 193, "y": 452.5, "w": 1, "p": 31, "n": "1011", "g": 0 }, { "x": 110, "y": 633.5, "w": 2, "p": 29, "n": "2008", "g": 0 },
            { "x": 110, "y": 633.5, "w": 1, "p": 29, "n": "1002", "g": 0 }, { "x": 110, "y": 633.5, "w": 2, "p": 29, "n": "2016", "g": 0 },
            { "x": 110, "y": 633.5, "w": 3, "p": 29, "n": "3001", "g": 0 }, { "x": 110, "y": 633.5, "w": 2, "p": 29, "n": "2008", "g": 0 },
            { "x": 110, "y": 633.5, "w": 2, "p": 29, "n": "2008", "g": 0 }, { "x": 280, "y": 633.5, "w": 1, "p": 28, "n": "1011", "g": 0 },
            { "x": 280, "y": 633.5, "w": 2, "p": 28, "n": "2008", "g": 0 }, { "x": 280, "y": 633.5, "w": 2, "p": 28, "n": "2008", "g": 0 },
            { "x": 280, "y": 633.5, "w": 3, "p": 28, "n": "3012", "g": 0 }, { "x": 280, "y": 633.5, "w": 3, "p": 28, "n": "3001", "g": 0 },
            { "x": 280, "y": 633.5, "w": 2, "p": 28, "n": "2017", "g": 0 }, { "x": 193, "y": 814.5, "w": 2, "p": 30, "n": "2003", "g": 0 },
            { "x": 193, "y": 814.5, "w": 3, "p": 30, "n": "3012", "g": 0 }, { "x": 193, "y": 814.5, "w": 3, "p": 30, "n": "3011", "g": 0 },
            { "x": 193, "y": 814.5, "w": 2, "p": 30, "n": "2017", "g": 0 }, { "x": 193, "y": 814.5, "w": 3, "p": 30, "n": "3006", "g": 0 },
            { "x": 193, "y": 814.5, "w": 3, "p": 30, "n": "3011", "g": 0 }
        ]
    };

    resPath = {
        levelPath: { bundle: 'prefabs', path: './games/GameBox/res/level/SortLevel' },
    }

    /** 游戏用数据 */
    dataObj = { stepCount: 0, passTime: 0, isFinish: false, };

    goodsCfg: any = {};// 物品配置
    goodsCount: number = 0;// 物品计数
    goodsTotal: number = 0;// 物品总数
    dataGame: any = {};// 箱子数据（按游戏数据整理）
    dataBox: BoxParam[][] = [];// 箱子数据（按层级排列）
    dataBoxCopy: BoxParam[][] = [];// 箱子数据（用于 返回上一步 确认箱子位置）
    isLock: boolean = false;// 游戏是否锁定
    timeGame = { cur: 0, init: 0, count: 0, total: 120 };// 游戏时间
    timeProp = { iceCount: 0, iceTotal: 12, addTotal: 10 };// 道具时间

    bottomParamArr: GoodParam[][] = [];// 物品数据（检测区）
    bottomMax: number = 7;// 物品最大数量（检测区）
    bottomDis: number = 90;// 物品间距（检测区）
    bottomDisY: number = -40;// 物品y轴偏移量（检测区）
    bottomScale: number = 0.5;// 物品缩放比率（检测区）
    bottomPosArr: cc.Vec3[] = [];// 物品位置（检测区）
    bottomTime = { cur: 0, init: 0, total: 0.2 };// 物品消除时间（检测区）

    rectBg: cc.Rect = cc.rect();// 箱子底部碰撞数据
    arrBoxY: { y: number, h: number }[] = [];// 每层箱子的位置数据

    baseTime: number = 1;
    baseDis: number = 2000;
    poolBox: cc.NodePool = null;// 箱子缓存
    poolGood: cc.NodePool = null;// 物品缓存

    /** 移动速度 箱子 */
    speedBox = {
        speedCur: 0, speedDis: 2, speedInit: 0, speedMax: 20, isMove: false,
    };
    /** 移动速度 物品 */
    speedGood = {
        speedCur: 0, speedDis: 5, speedInit: 0, speedMax: 50, isMove: false,
    };

    protected onLoad(): void {
        this.listernerRegist();
    }

    protected start(): void {
        this.poolBox = new cc.NodePool();
        this.poolGood = new cc.NodePool();

        // 初始ui
        this.nodeMain.opacity = 0;
        this.maskTop.setContentSize(cc.winSize);
        this.maskTop.active = true;
        this.maskBottom.setContentSize(cc.winSize);
        this.maskBottom.active = false;

        this.enterLevel();
    }

    /**
     * 关卡入口
     */
    enterLevel() {
        //游戏初始化
        this.clear();
        this.initData();
        this.initUI();
        this.loadLevel();
        this.initLevel();
        this.isLock = false;
    }

    initData() {
        /** 游戏用数据 */
        this.dataObj = { stepCount: 0, passTime: new Date().getTime(), isFinish: false, };

        DataBox.goodsConf.forEach((obj) => {
            this.goodsCfg[obj.id] = obj;
        });
        this.dataGame = {};
        let boxs = this.dataLevel.map;
        let dataBoxBottom = this.getDataBoxBottom();
        let disY = Math.floor(Number(cc.winSize.height * 0.5 - (Number(dataBoxBottom.h) * 5 + this.uiTop.height)));
        let dataBoxBottomY = Math.floor(Number(dataBoxBottom.y));
        for (let index = 0, length = boxs.length; index < length; index++) {
            const obj = boxs[index];
            let x = Math.floor(Number(obj.x));
            let y = Math.floor(Number(obj.y + disY - dataBoxBottomY));
            let w = Math.floor(Number(obj.w));
            let h = Math.floor(Number(obj.h));
            let boxParam: BoxParam = {
                index: index, name: 'box_' + index, x: x, y: y, w: w, h: h, layerI: 0, layerJ: 0,
                goods: {}, yBottom: disY, isMove: false, isFrame: h < 100,
            };
            this.dataGame[index] = boxParam;
        }
        let goods = this.dataLevel.item;
        for (let index = 0, length = goods.length; index < length; index++) {
            const obj = goods[index];
            let keyGood = Number(obj.n);
            let nameRes = this.goodsCfg[keyGood].name;
            let w = this.goodsCfg[keyGood].w;
            let h = this.goodsCfg[keyGood].h;
            let keyBox = Number(obj.p);
            let dataBox: BoxParam = this.dataGame[keyBox];
            let x = obj.x - this.dataLevel.map[keyBox].x;
            let y = obj.y - this.dataLevel.map[keyBox].y;
            let goodParam: GoodParam = {
                index: index, keyGood: keyGood, nameRes: nameRes, name: 'good_' + index, x: x, y: y, w: w, h: h, isMove: false,
                box: { name: dataBox.name, key: keyBox, x: x, y: y },
            };
            dataBox.goods[index] = goodParam;
        }

        // 组织数据 dataBox
        this.dataBox = [];
        let arrBox = {};
        for (const key in this.dataGame) {
            if (Object.prototype.hasOwnProperty.call(this.dataGame, key)) {
                let box: BoxParam = Common.clone(this.dataGame[key]);
                if (arrBox[box.y]) {
                    box.layerJ = arrBox[box.y].length;
                    arrBox[box.y].push(box);
                }
                else {
                    box.layerJ = 0;
                    arrBox[box.y] = [box];
                }
            }
        }
        let arrValue = Object.keys(arrBox);
        arrValue.sort((a, b) => { return Number(a) - Number(b) });
        for (let index = 0; index < arrValue.length; index++) {
            let arrBoxParam: BoxParam[] = arrBox[arrValue[index]];
            arrBoxParam.forEach((boxParam: BoxParam) => { boxParam.layerI = index; });
            this.dataBox.push(arrBoxParam);
        }
        this.dataBoxCopy = Common.clone(this.dataBox);// 用于确认消失箱子的位置

        // 箱子层级 y
        this.arrBoxY = [];
        for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
            let boxArr = this.dataBox[i];
            let boxOne = boxArr[0];
            this.arrBoxY.push({ y: boxOne.y, h: boxOne.h });
        }

        // 底部物品位置
        this.bottomParamArr = [];
        this.bottomPosArr = [];
        for (let index = 0; index < this.bottomMax; index++) {
            let x = index * this.bottomDis - Math.floor(this.bottomMax * 0.5) * this.bottomDis;
            this.bottomPosArr[index] = cc.v3(x, this.bottomDisY, 0);
        }

        // 物品计数
        this.goodsCount = 0;
        this.goodsTotal = goods.length;

        // 倒计时开始
        this.timeGame.cur = this.timeGame.init;
        this.timeGame.count = this.timeGame.total;
    }

    initUI() {
        let w = cc.winSize.width;
        let h = cc.winSize.height;
        this.uiTop.y = h * 0.5 - this.uiTop.height * 0.5;
        this.nodeProp.y = -h * 0.5 + this.nodeProp.height * 0.5;
        this.uiBottom.y = this.nodeProp.y + this.uiBottom.height + 20;

        // 底部碰撞框
        let dataBoxBottom = this.getDataBoxBottom();
        let disY = cc.winSize.height * 0.5 - (Number(dataBoxBottom.h) * 5 + this.uiTop.height);
        this.boxBottom.y = disY;
        let collider = this.boxBottom.getComponent(cc.BoxCollider);
        Common.refreshCollider(collider, 0, -10, w, 20);

        // 箱子碰撞数据
        let rectX = this.boxBottom.x + collider.offset.x - collider.size.width * 0.5;
        let rectY = this.boxBottom.y - collider.offset.y - collider.size.height * 0.5;
        this.rectBg = cc.rect(rectX, rectY, collider.size.width, collider.size.height);

        this.setUITime();// 设置时间
        this.setUIProcess();// 设置进度
    }

    async loadLevel() {
        // if (isSpecial) {
        //     let cfg = this.resPath.levelPath;
        //     let path = cfg.path + 'Else';
        //     let asset: cc.JsonAsset = await kit.Resources.loadRes(cfg.bundle, path, cc.JsonAsset);
        //     return asset;
        // }
        // else {
        //     let cfg = this.resPath.levelPath;
        //     let path = cfg.path;
        //     let sortLevel = DataManager.data.sortData.level;
        //     if (sortLevel > 2000) { path = path + '1'; }
        //     else if (sortLevel > 4000) { path = path + '2'; }
        //     else if (sortLevel > 6000) { path = path + '3'; }
        //     else if (sortLevel > 8000) { path = path + '4'; }
        //     else if (sortLevel > 10000) { path = path + '5'; }
        //     else if (sortLevel > 12000) { path = path + '6'; }
        //     else if (sortLevel > 14000) { path = path + '7'; }
        //     else if (sortLevel > 16000) { path = path + '8'; }
        //     else if (sortLevel > 18000) { path = path + '9'; }
        //     let asset: cc.JsonAsset = await kit.Resources.loadRes(cfg.bundle, path, cc.JsonAsset);
        //     return asset;
        // }
    }

    /** 初始化游戏关卡 */
    initLevel() {
        for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
            for (let j = 0, lenB = this.dataBox[i].length; j < lenB; j++) {
                let boxParam: BoxParam = this.dataBox[i][j];
                let box = this.addBox(boxParam);
                for (const keyGood in boxParam.goods) {
                    if (!Object.prototype.hasOwnProperty.call(boxParam.goods, keyGood)) {
                        continue;
                    }
                    let goodParam: GoodParam = boxParam.goods[keyGood];
                    this.addGood(box, Common.clone(goodParam));
                }
                if (boxParam.isFrame) {
                    box.getComponent(ItemBox).sortGood();
                }
            }
        }

        NativeCall.logEventOne(GameDot.dot_loadok_to_all);
        this.playAniShow(true, () => {
            // 新手引导
            let guideName = this.checkNewPlayerState();
            switch (guideName) {
                case CConst.newPlayer_guide_sort_1:
                    DataManager.data.sortData.newTip.cur++;
                    DataManager.setData();
                    kit.Event.emit(CConst.event_enter_newPlayer, CConst.newPlayer_guide_sort_1);
                    break;
                case CConst.newPlayer_guide_sort_3:
                    DataManager.data.sortData.newTip.cur++;
                    DataManager.setData();
                    kit.Event.emit(CConst.event_enter_newPlayer, CConst.newPlayer_guide_sort_3);
                    break;
                default:
                    break;
            }
            this.checkEvaluate();
        });
    }

    /** 设置时间 */
    setUITime() {
        let m = Math.floor(this.timeGame.count / 60);
        let s = Math.floor(this.timeGame.count % 60);
        let strM = m < 10 ? '0' + m : String(m);
        let strS = s < 10 ? '0' + s : String(s);
        this.arrTimeLayer[0].getComponent(cc.Label).string = strM;
        this.arrTimeLayer[1].getComponent(cc.Label).string = strS;
    }

    /** 设置进度 */
    setUIProcess() {
        let wTotal = this.uiTopProcess.width - 6;
        let bar = this.uiTopProcess.getChildByName('bar');
        if (this.goodsCount == 0) {
            bar.width = 0;
        }
        else {
            let w = wTotal * this.goodsCount / this.goodsTotal;
            cc.tween(bar).to(0.3, { width: w }).start();
        }
        let labelCur = this.uiTopProcess.getChildByName('labelCur');
        labelCur.getComponent(cc.Label).string = String(this.goodsCount);
        let labelTotal = this.uiTopProcess.getChildByName('labelTotal');
        labelTotal.getComponent(cc.Label).string = String(this.goodsTotal);
    }

    protected update(dt: number): void {
        this.cycleTime(dt);
        this.cycleBox(dt);
        this.cycleGood(dt);
    }

    /** 时间逻辑 */
    cycleTime(dt: number) {
        if (this.isLock) {
            return;
        }

        this.timeGame.cur += dt;
        if (this.timeGame.cur < 1) {
            return;
        }
        this.timeGame.cur = this.timeGame.init;

        // 冻结 倒计时
        if (this.timeProp.iceCount > 0) {
            this.timeProp.iceCount--;
            // 冻结 结束
            if (this.timeProp.iceCount <= 0) {
                this.playAniIceFinish();
            }
            return;
        }

        // 游戏 倒计时
        if (this.timeGame.count > 0) {
            this.timeGame.count--;
            this.setUITime();
            if (this.timeGame.count <= 0) {
                this.isLock = true;
                this.dataObj.isFinish = true;
                Common.log('游戏结束 倒计时结束');
            }
        }
    }

    /** 箱子逻辑 */
    cycleBox(dt: number) {
        // 移动判断
        if (!this.speedBox.isMove) {
            return;
        }
        if (this.speedBox.speedCur > this.speedBox.speedMax) {
            this.speedBox.speedCur = this.speedBox.speedMax
        }
        else {
            this.speedBox.speedCur += this.speedBox.speedDis;
        }

        /** 获取矩形 */
        let getRect = (boxParam: BoxParam) => {
            return cc.rect(boxParam.x - boxParam.w * 0.5 + 1, boxParam.y, boxParam.w - 2, boxParam.h);
        };

        // 碰撞检测
        let funcCollider = (rectA: cc.Rect, arrB: BoxParam[]) => {
            for (let index = 0, length = arrB.length; index < length; index++) {
                let B = arrB[index];
                if (rectA.intersects(getRect(B))) {
                    return B;
                }
            }
            return null;
        };

        // 移动box
        let boxParamsRemove = (i: number, j: number) => {
            let boxLayer = this.dataBox[i];
            let boxOne = boxLayer[j];
            if (boxLayer.length > 1) {
                this.dataBox[i].splice(j, 1);
            }
            else {
                this.dataBox.splice(i, 1);
            }
            this.dataBox[i - 1].push(boxOne);
            this.dataBox[i - 1].sort((a: BoxParam, b: BoxParam) => {
                return a.x - b.x;
            });
        };

        let isContinueMove = false;
        let isRemove = false;
        // 箱子 多层
        for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
            // 箱子 单层
            let boxArr = this.dataBox[i];
            for (let j = 0, lenB = boxArr.length; j < lenB; j++) {
                // 箱子 单个
                let boxOne = boxArr[j];
                if (boxOne.isFrame) {
                    continue;
                }
                if (!boxOne.isMove) {
                    continue;
                }
                let box = this.nodeMain.getChildByName(boxOne.name);
                let scriptBox = box.getComponent(ItemBox);
                let yA = boxOne.y - this.speedBox.speedCur;
                if (i == 0) {
                    let rectA = getRect(boxOne);
                    rectA.y -= this.speedBox.speedCur * 0.5;
                    let isInter = rectA.intersects(this.rectBg);
                    if (isInter) {
                        boxOne.isMove = false;
                        boxOne.y = this.arrBoxY[0].y;
                        scriptBox.refreshParams(boxOne.y);
                    }
                    else {
                        isContinueMove = true;
                        boxOne.y = yA;
                        scriptBox.refreshParams(boxOne.y);
                    }
                }
                else {
                    let rectA = getRect(boxOne);
                    rectA.y -= this.speedBox.speedCur * 0.5;
                    let boxB = funcCollider(rectA, this.dataBox[i - 1]);
                    if (boxB) {
                        boxOne.isMove = false;
                        boxOne.y = this.arrBoxY[i].y;
                        scriptBox.refreshParams(boxOne.y);
                    }
                    else {
                        isContinueMove = true;
                        boxOne.y = yA;
                        scriptBox.refreshParams(boxOne.y);
                        let boxGoal = this.arrBoxY[i - 1];
                        if (boxOne.y <= boxGoal.y + boxGoal.h * 0.5) {
                            boxParamsRemove(i, j);
                            isRemove = true;
                            break;
                        }
                    }
                }
            }
            // 重新移动
            if (isRemove) {
                isRemove = false;
                break;
            }
        }

        // 是否继续移动
        if (!isContinueMove) {
            this.speedBox.isMove = false;
        }
    }

    /** 物品逻辑 */
    cycleGood(dt: number) {
        // 移动判断
        if (!this.speedGood.isMove) {
            return;
        }
        if (this.speedGood.speedCur > this.speedGood.speedMax) {
            this.speedGood.speedCur = this.speedGood.speedMax
        }
        else {
            this.speedGood.speedCur += this.speedGood.speedDis;
        }

        let isContinueMove = false;
        let index = -1;
        for (let i = 0, lenA = this.bottomParamArr.length; i < lenA; i++) {
            let arrGoodParam = this.bottomParamArr[i];
            for (let j = 0, lenB = arrGoodParam.length; j < lenB; j++) {
                index += 1;
                let goodParam = arrGoodParam[j];
                if (!goodParam.isMove) {
                    continue;
                }

                let bottomMainY = cc.winSize.height * 0.5 - this.uiBottom.y - this.bottomPosArr[0].y;
                if (goodParam.y > bottomMainY + 120) {
                    goodParam.y -= 100;
                }
                let pX = this.bottomPosArr[index].x;
                let pY = this.bottomPosArr[index].y;
                let disX = goodParam.x - pX;
                let disY = goodParam.y - pY;
                let disAB = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));

                isContinueMove = true;
                let speed = this.speedGood.speedCur;
                let speedX = speed * disX / disAB;
                let speedY = speed * disY / disAB;
                goodParam.x -= speedX;
                goodParam.y -= speedY;
                let nodeGood = this.uiBottomMain.getChildByName(goodParam.name);
                if (nodeGood.scale > 0.5) {
                    nodeGood.scale -= 0.04;
                }
                else {
                    nodeGood.scale = 0.5;
                }
                if (Math.pow(disX, 2) + Math.pow(disY, 2) <= Math.pow(speed, 2)) {
                    goodParam.isMove = false;
                    goodParam.x = pX;
                    goodParam.y = pY;
                    let good = this.uiBottomMain.getChildByName(goodParam.name);
                    good.getComponent(ItemGood).refreshParams(cc.v3(goodParam.x, goodParam.y));
                    nodeGood.scale = 0.5;
                    continue;
                }
                else {
                    nodeGood.getComponent(ItemGood).refreshParams(cc.v3(goodParam.x, goodParam.y));
                }
            }
            // 检测物品是否可以消除
            if (this.goodParamsCheck(arrGoodParam)) {
                isContinueMove = true;
                this.bottomTime.cur += dt;
                if (this.bottomTime.cur >= this.bottomTime.total) {
                    this.bottomTime.cur = this.bottomTime.init;
                    this.goodParamsRemove(arrGoodParam, i);
                    this.goodParamsRestart();
                    break;
                }
            }
        }
        // 是否继续移动
        if (!isContinueMove) {
            this.speedGood.isMove = false;
            if (this.getBottomGoodNum() > this.bottomMax - 1) {
                this.isLock = true;
                this.dataObj.isFinish = true;
                Common.log('游戏结束 检测去无空位 goodsCount: ', this.goodsCount, '; goodsTotal: ', this.goodsTotal);
            }
        }
    }

    /** 获取最下方箱子数据 */
    getDataBoxBottom(): any {
        let dataBoxBottom = null;
        for (let index = 0, length = this.dataLevel.map.length; index < length; index++) {
            let dataBox = this.dataLevel.map[index];
            if (dataBoxBottom) {
                if (dataBox.y < dataBoxBottom.y) {
                    dataBoxBottom = dataBox;
                }
            }
            else {
                dataBoxBottom = dataBox;
            }
        }
        return dataBoxBottom;
    };

    /**
     * 检测 用户评价
     * @returns 
     */
    checkEvaluate() {
        let _data = DataManager.data;
        if (_data.isAllreadyEvaluate) {
            return;
        }
        if (_data.boxData.level == 6 || _data.boxData.level == 26) {
            kit.Popup.show(CConst.popup_path_user_evaluate, {}, { mode: PopupCacheMode.Frequent });
        }
    }

    /**
     * 点击事件
     * @param good
     * @returns 
     */
    eventTouch(good: cc.Node) {
        let scriptGood = good.getComponent(ItemGood);
        // 游戏不能继续
        if (this.isLock || this.getBottomGoodNum() > this.bottomMax - 1) {
            scriptGood.state = 0;
            return;
        }
        // 删除数据
        let box = good.parent.parent;
        let scriptBox = box.getComponent(ItemBox);
        delete scriptBox.param.goods[scriptGood.param.index];
        // 转移节点
        let pStart = Common.getLocalPos(good.parent, good.position, this.uiBottomMain);
        good.parent = this.uiBottomMain;
        scriptGood.refreshParams(pStart);
        if (scriptBox.param.isFrame) {
            good.active = true;
            scriptBox.refreshGoods();
        }
        // 检测箱子
        this.checkBox(box);

        // 构建底部ui参数
        this.goodParamsInsert(scriptGood.param);
    }

    eventTouchAfter(goodParam: GoodParam) {
        let box = this.nodeMain.getChildByName(goodParam.box.name);
        let names = [];
        for (let index = 0; index < box.getComponent(ItemBox).nodeMain.children.length; index++) {
            const element = box.getComponent(ItemBox).nodeMain.children[index];
            names.push(element.name);
        }
        console.log('goodParam: ', goodParam, '; names: ', names);
        let good = box.getComponent(ItemBox).nodeMain.getChildByName(goodParam.name);
        let scriptGood = good.getComponent(ItemGood);
        // 删除数据
        let scriptBox = box.getComponent(ItemBox);
        delete scriptBox.param.goods[scriptGood.param.index];
        // 转移节点
        let pStart = Common.getLocalPos(good.parent, good.position, this.uiBottomMain);
        good.parent = this.uiBottomMain;
        scriptGood.refreshParams(pStart);
        if (scriptBox.param.isFrame) {
            good.active = true;
            scriptBox.refreshGoods();
        }
        // 检测箱子
        this.checkBox(box);

        // 构建底部ui参数
        this.goodParamsInsert(scriptGood.param);
    }

    /** 检测箱子掉落 */
    checkBox(box: cc.Node): void {
        let scriptBox = box.getComponent(ItemBox);
        if (scriptBox.nodeMain.childrenCount > 0) {
            return;
        }
        if (scriptBox.param.isFrame) {
            return;
        }
        // 删除数据
        let indexI = -1;
        let indexJ = -1;
        for (let i = 0, lenLayer = this.dataBox.length; i < lenLayer; i++) {
            let boxLayer = this.dataBox[i];
            for (let j = 0, lenBox = boxLayer.length; j < lenBox; j++) {
                let boxOne = boxLayer[j];
                boxOne.isMove = !boxOne.isFrame;
                if (boxOne.name == scriptBox.param.name) {
                    indexI = i;
                    if (lenBox > 1) {
                        indexJ = j;
                    }
                }
            }
        }

        if (indexJ < 0) {
            this.dataBox.splice(indexI, 1);
        }
        else {
            this.dataBox[indexI].splice(indexJ, 1);
        }
        DataManager.poolPut(box, this.poolBox);

        // 开始移动 箱子
        this.speedBox.isMove = true;
        this.speedBox.speedCur = this.speedBox.speedInit;
    }

    /** 物品参数-数量 */
    getBottomGoodNum() {
        let paramsNum = 0;
        this.bottomParamArr.forEach((param: GoodParam[]) => {
            paramsNum += param.length;
        });
        return paramsNum;
    }

    /** 物品参数-插入 */
    goodParamsInsert(param: GoodParam) {
        param.isMove = true;
        let isAdd = false;
        for (let index = 0, lenA = this.bottomParamArr.length; index < lenA; index++) {
            let arrParams = this.bottomParamArr[index];
            for (let index = 0, lenB = arrParams.length; index < lenB; index++) {
                arrParams[index].isMove = true;
            }
            let lenB = arrParams.length;
            if (lenB > 0 && lenB < 3 && arrParams[0].keyGood == param.keyGood) {
                isAdd = true;
                arrParams.push(param);
                continue;
            }
        }
        if (!isAdd) {
            this.bottomParamArr.push([param]);
        }

        // 开始移动 物品
        this.speedGood.isMove = true;
        this.speedGood.speedCur = this.speedGood.speedInit;
    }

    /** 物品参数-检测 */
    goodParamsCheck(arrParam: GoodParam[]) {
        let length = arrParam.length;
        let isEnough = length > 2;
        if (isEnough) {
            let paramY = arrParam[0].y;
            for (let index = 1; index < length; index++) {
                let params = arrParam[index];
                if (paramY != params.y) {
                    isEnough = false;
                    break;
                }
            }
        }
        return isEnough;
    }

    // 移除物品
    goodParamsRemove(arrParam: GoodParam[], arrIndex: number) {
        let names = [];
        for (let index = 0, length = arrParam.length; index < length; index++) {
            let param = arrParam[index];
            names.push(param.name);
            let good = this.uiBottomMain.getChildByName(param.name);
            DataManager.poolPut(good, this.poolGood);
        }
        this.bottomParamArr.splice(arrIndex, 1);
        this.goodsCount += arrParam.length;
        if (this.goodsCount >= this.goodsTotal) {
            this.goodsCount = this.goodsTotal;
            this.isLock = true;
            this.dataObj.isFinish = true;
            Common.log('游戏结束 物品消完 goodsCount: ', this.goodsCount, '; goodsTotal: ', this.goodsTotal);
        }
        this.setUIProcess();
    }

    // 物品继续移动
    goodParamsRestart() {
        for (let i = 0, lenA = this.bottomParamArr.length; i < lenA; i++) {
            let arrParams = this.bottomParamArr[i];
            for (let j = 0, lenB = arrParams.length; j < lenB; j++) {
                let params = arrParams[j];
                params.isMove = true;
            }
        }
    }

    /** 回收 */
    clear() {
        // 回收物品
        for (let i = this.nodeMain.childrenCount - 1; i >= 0; i--) {
            let box = this.nodeMain.children[i];
            let boxMain = box.getComponent(ItemBox).nodeMain;
            let goodLen = boxMain.childrenCount;
            if (goodLen > 0) {
                for (let j = goodLen - 1; j >= 0; j--) {
                    let good = boxMain.children[j];
                    DataManager.poolPut(good, this.poolGood);
                }
            }
            DataManager.poolPut(box, this.poolBox);
        }
        for (let index = this.uiBottomMain.childrenCount - 1; index >= 0; index--) {
            let good = this.uiBottomMain.children[index];
            DataManager.poolPut(good, this.poolGood);
        }
        this.timeProp.iceCount = 0;
        this.playAniIceFinish();
    }

    /** 按钮事件 重玩 */
    eventBtnReplay() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 重玩 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_path_click);

        let funcReplay = () => {
            this.playAniShow(false, () => {
                this.enterLevel();
            });
        };
        // 前30关，有一次免广告重玩的机会
        let level = DataManager.data.boxData.level;
        if (level <= 30 && DataManager.data.rePlayNum > 0) {
            DataManager.data.rePlayNum -= 1;
            DataManager.setData();
            funcReplay();
            return;
        }
        // 打点 插屏广告请求（过关）
        NativeCall.logEventThree(GameDot.dot_adReq, "inter_homeRestart", "Interstital");
        let funcA = () => {
            // 打点 插屏播放完成（点击重玩按钮）
            NativeCall.logEventTwo(GameDot.dot_ads_advert_succe_rePlay, String(level));
            funcReplay();
        };
        let isReady = DataManager.playAdvert(funcA, funcA);
        if (!isReady) {
            funcA();
        }
    }

    /** 按钮事件 设置 */
    eventBtnSetting() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 设置 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_path_click);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    }

    /** 按钮事件 上一步 */
    eventBtnReturn() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 返回上一步 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_path_click);

        let lenA = this.bottomParamArr.length;
        // 没有物品
        if (lenA <= 0) {
            kit.Event.emit(CConst.event_notice, "Can't be used now");
            return;
        }
        this.isLock = true;

        let arrParamA = this.bottomParamArr[lenA - 1];
        let lenB = arrParamA.length;
        let goodParam = arrParamA[lenB - 1];
        if (lenB > 1) {
            arrParamA.splice(lenB - 1, 1);
        }
        else {
            this.bottomParamArr.splice(lenA - 1, 1);
        }

        let good = this.uiBottomMain.getChildByName(goodParam.name);
        let box = this.nodeMain.getChildByName(goodParam.box.name);
        // 物品原来的箱子存在
        if (box) {
            let scriptBox = box.getComponent(ItemBox);
            let goodP1 = good.position;
            let goodP2 = Common.getLocalPos(scriptBox.nodeMain, cc.v3(goodParam.box.x, goodParam.box.y), this.uiBottomMain);
            let timeP12 = Common.getMoveTime(goodP1, goodP2, this.baseTime, this.baseDis);
            cc.tween(good).call(() => {
                // 物品开始移动
                this.speedGood.isMove = true;
                this.speedGood.speedCur = this.speedGood.speedInit;
            }).to(timeP12, { position: goodP2, scale: 1 }).call(() => {
                scriptBox.param.goods[goodParam.index] = goodParam;
                good.parent = scriptBox.nodeMain;
                good.getComponent(ItemGood).resetParams(goodParam);
                this.isLock = false;
            }).start();
        }
        else {
            /** 获取矩形 */
            let getRect = (boxParam: BoxParam) => {
                return cc.rect(boxParam.x - boxParam.w * 0.5 + 1, boxParam.y, boxParam.w - 2, boxParam.h);
            };
            /** 获取箱子列数 */
            let getBoxLayer = (boxParamCur: BoxParam, layerCur: number) => {
                let layer = 0;
                let rectA = getRect(boxParamCur);
                rectA.y -= boxParamCur.h * 0.5;
                for (let i = layerCur - 1; i >= 0; i--) {
                    let arrBoxParam = dataBox[i];
                    let isInter = false;
                    for (let j = 0, lenB = arrBoxParam.length; j < lenB; j++) {
                        let rectB = getRect(arrBoxParam[j]);
                        isInter = cc.Intersection.rectRect(rectA, rectB);
                        if (isInter) {
                            break;
                        }
                    }
                    if (isInter) {
                        layer = i + 1;
                    }
                    else {
                        rectA.y -= boxParamCur.h;
                    }
                }
                return layer;
            };

            let boxParamCur: BoxParam = this.dataGame[goodParam.box.key];
            boxParamCur.goods = {};
            // 组合剩余箱子
            let names = [boxParamCur.name];
            for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
                for (let j = 0, lenB = this.dataBox[i].length; j < lenB; j++) {
                    names.push(this.dataBox[i][j].name);
                }
            }
            // 去除以消除箱子
            let dataBox: BoxParam[][] = Common.clone(this.dataBoxCopy);
            for (let i = dataBox.length - 1; i >= 0; i--) {
                let arrBoxParam = dataBox[i];
                for (let j = arrBoxParam.length - 1; j >= 0; j--) {
                    let boxParamB = arrBoxParam[j];
                    if (names.indexOf(boxParamB.name) < 0) {
                        arrBoxParam.splice(j, 1);
                        if (arrBoxParam.length < 1) {
                            dataBox.splice(i, 1);
                        }
                    }
                }
            }

            // 添加箱子 刚出现时高度为0
            let box = this.addBox(boxParamCur);
            // 重置箱子位置
            this.dataBox = Common.clone(dataBox);
            for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
                let arrBoxParam = this.dataBox[i];
                for (let j = 0; j < arrBoxParam.length; j++) {
                    let boxParam = arrBoxParam[j];
                    if (boxParam.isFrame) {
                        continue;
                    }
                    let layer = getBoxLayer(boxParam, i);
                    boxParam.y = this.arrBoxY[layer].y;
                    let box = this.nodeMain.getChildByName(boxParam.name);
                    let timeY = Common.getMoveTime(box.position, cc.v3(box.x, boxParam.y), this.baseTime, this.baseDis);
                    cc.tween(box).to(timeY, { y: boxParam.y }).call(() => {
                        let scriptBox = box.getComponent(ItemBox);
                        scriptBox.refreshParams(boxParam.y);
                    }).start();
                    if (layer == i) {
                        continue;
                    }
                    // 转移箱子数据
                    arrBoxParam.splice(j, 1);
                    this.dataBox[layer].push(boxParam);
                    j--;
                    if (arrBoxParam.length <= 0) {
                        this.dataBox.splice(j, 1);
                        i--;
                    }
                }
            }

            // 箱子高度变化+物品移动
            let boxH = boxParamCur.h;
            let timeH = Common.getMoveTime(box.position, cc.v3(box.x, box.y + boxH), this.baseTime, this.baseDis);
            box.height = 0;
            cc.tween(box).to(timeH, { height: boxH }).call(() => {
                let scriptBox = box.getComponent(ItemBox);
                let goodP1 = good.position;
                let goodP2 = Common.getLocalPos(scriptBox.nodeMain, cc.v3(goodParam.box.x, goodParam.box.y), this.uiBottomMain);
                let timeP12 = Common.getMoveTime(goodP1, goodP2, this.baseTime, this.baseDis);
                // 物品移动
                cc.tween(good).call(() => {
                    // 物品开始移动
                    this.speedGood.isMove = true;
                    this.speedGood.speedCur = this.speedGood.speedInit;
                }).to(timeP12, { position: goodP2, scale: 1 }).call(() => {
                    scriptBox.param.goods[goodParam.index] = goodParam;
                    good.parent = scriptBox.nodeMain;
                    good.getComponent(ItemGood).resetParams(goodParam);
                    this.isLock = false;
                }).start();
            }).start();
        }
    }

    /** 按钮事件 刷新 */
    eventBtnRefresh() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 刷新 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        this.isLock = true;
        kit.Audio.playEffect(CConst.sound_path_click);

        /*****************************************************组合物品数组*************************************************************/
        let arrGoodParam: GoodParam[][] = [];
        let composeArr = (boxParam: BoxParam) => {
            for (const key in boxParam.goods) {
                if (Object.prototype.hasOwnProperty.call(boxParam.goods, key)) {
                    let goodParam: GoodParam = boxParam.goods[key];
                    let char = String(goodParam.keyGood);
                    let index = Number(char.substring(0, 1)) - 1;
                    if (arrGoodParam[index]) {
                        arrGoodParam[index].push(goodParam);
                    }
                    else {
                        arrGoodParam[index] = [goodParam];
                    }
                }
            }
        };
        // 组合物品数组 操作区
        for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
            let boxArr = this.dataBox[i];
            for (let j = 0, lenB = boxArr.length; j < lenB; j++) {
                let boxOne = boxArr[j];
                composeArr(boxOne);
            }
        }
        // // 组合物品数组 检测区
        // this.bottomMain.children.forEach((good: cc.Node) => {
        //     let goodParam: GoodParam = good.getComponent(ItemGood).param;
        //     let char = String(goodParam.keyGood);
        //     let index = Number(char.substring(0, 1)) - 1;
        //     if (arrGoodParam[index]) {
        //         arrGoodParam[index].push(goodParam);
        //     }
        //     else {
        //         arrGoodParam[index] = [goodParam];
        //     }
        // });


        /*****************************************************赋值物品数组 并 重新排序*************************************************************/
        let arrCopy: GoodParam[][] = Common.clone(arrGoodParam);
        for (let index = 0, length = arrCopy.length; index < length; index++) {
            let arrParam = arrCopy[index];
            let i = arrParam.length;
            while (i) {
                let j = Math.floor(Math.random() * i--);
                let temp = arrParam[i];
                arrParam[i] = arrParam[j];
                arrParam[j] = temp;
            }
        }


        /**********************************************重新排序后的物品数组 赋值给 物品数组, 并执行更新*************************************************/
        let voluationArr = (arrParamA: GoodParam[], arrParamB: GoodParam[]) => {
            for (let index = 0, length = arrParamA.length; index < length; index++) {
                let goodParamA = arrParamA[index];
                let goodParamB = arrParamB[index];
                goodParamA.nameRes = goodParamB.nameRes;
                goodParamA.w = goodParamB.w;
                goodParamA.h = goodParamB.h;
                goodParamA.keyGood = goodParamB.keyGood;
                let box = this.nodeMain.getChildByName(goodParamA.box.name);
                let good = box.getComponent(ItemBox).nodeMain.getChildByName(goodParamA.name);
                if (good) {
                    good.getComponent(ItemGood).refreshRes(goodParamA);
                }
            }
        };
        for (let index = 0, length = arrGoodParam.length; index < length; index++) {
            let arrParamA = arrGoodParam[index];
            let arrParamB = arrCopy[index];
            voluationArr(arrParamA, arrParamB);
        }


        /**********************************************重新排序底部物品 并 移动*************************************************/
        // let layerIndex = 0;
        // let arrInsert: GoodParam[] = [];
        // let reInsert = (goodParam: GoodParam)=>{
        //     let isAdd = false;
        //     for (let index = 0, lenA = this.bottomParamArr.length; index < lenA; index++) {
        //         let arrParams = this.bottomParamArr[index];
        //         let lenB = arrParams.length;
        //         if (lenB > 0 && lenB < 3 && arrParams[0].keyGood == goodParam.keyGood) {
        //             isAdd = true;
        //             arrParams.push(goodParam);
        //             break;
        //         }
        //     }
        //     if (!isAdd) {
        //         layerIndex++;
        //         this.bottomParamArr.splice(layerIndex, 0, [goodParam]);
        //     }
        // };
        // // 获取需要重新排列的数组
        // if (this.bottomParamArr.length > 0) {
        //     let arrGoodParam = this.bottomParamArr[0];
        //     let arrOne = arrGoodParam.splice(1, arrGoodParam.length - 1);
        //     for (let index = 0, length = arrOne.length; index < length; index++) {
        //         arrInsert.push(arrOne[index]);
        //     }
        //     let arrElse = this.bottomParamArr.splice(1, this.bottomParamArr.length - 1);
        //     for (let i = 0, lenA = arrElse.length; i < lenA; i++) {
        //         let arrGoodParam = arrElse[i];
        //         for (let j = 0, lenB = arrGoodParam.length; j < lenB; j++) {
        //             arrInsert.push(arrGoodParam[j]);
        //         }
        //     }
        // }
        // // 数组插入到对应位置
        // for (let index = 0, length = arrInsert.length; index < length; index++) {
        //     let goodParam = arrInsert[index];
        //     reInsert(goodParam);
        // }


        /**********************************************设置移动-物品*************************************************/
        // for (let i = 0, lenA = this.bottomParamArr.length; i < lenA; i++) {
        //     let arrGoodParam = this.bottomParamArr[i];
        //     for (let j = 0, lenB = arrGoodParam.length; j < lenB; j++) {
        //         let goodParam = arrGoodParam[j];
        //         goodParam.isMove = true;
        //     }
        // }
        // this.speedGood.isMove = true;
        // this.speedGood.speedCur = this.speedGood.speedInit;



        /** 延时解锁 */
        this.scheduleOnce(() => { this.isLock = false; }, 0.75);
    }

    /** 按钮事件 提示 */
    eventBtnTip() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 提示 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        this.isLock = true;
        kit.Audio.playEffect(CConst.sound_path_click);

        let needNum = 3;
        let keyGood = 0;
        if (this.bottomParamArr.length > 0) {
            let arrGoodParam = this.bottomParamArr[0];
            needNum -= arrGoodParam.length;
            keyGood = arrGoodParam[0].keyGood;
            if (needNum > this.bottomMax - this.getBottomGoodNum()) {
                this.isLock = false;
                kit.Event.emit(CConst.event_notice, "Can't be used now");
                return;
            }
        }
        else {
            for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
                let arrBoxParam = this.dataBox[i];
                for (let j = 0, lenB = arrBoxParam.length; j < lenB; j++) {
                    let boxParam = arrBoxParam[j];
                    let arrKey = Object.keys(boxParam.goods);
                    if (arrKey.length > 0) {
                        keyGood = boxParam.goods[arrKey[0]].keyGood;
                        break;
                    }
                }
                if (keyGood != 0) {
                    break;
                }
            }
            if (keyGood == 0) {
                this.isLock = false;
                Common.log('eventBtnTip 箱子里没有物品')
                return;
            }
        }
        let isEnough: boolean = false;
        let arrChose: GoodParam[] = [];
        for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
            let arrBoxParam = this.dataBox[i];
            for (let j = 0, lenB = arrBoxParam.length; j < lenB; j++) {
                let boxParam = arrBoxParam[j];
                for (const key in boxParam.goods) {
                    if (Object.prototype.hasOwnProperty.call(boxParam.goods, key)) {
                        let goodParam: GoodParam = boxParam.goods[key];
                        if (goodParam.keyGood == keyGood) {
                            arrChose.push(goodParam);
                            if (arrChose.length > needNum - 1) {
                                isEnough = true;
                                break;
                            }
                        }
                    }
                }
                if (isEnough) {
                    break;
                }
            }
            if (isEnough) {
                break;
            }
        }

        let delay = 0;
        for (let index = 0, length = arrChose.length; index < length; index++) {
            delay += 0.1;
            let goodParam = arrChose[index];
            this.scheduleOnce(this.eventTouchAfter.bind(this, goodParam), delay);
        }
        this.scheduleOnce(() => { this.isLock = false; }, 0.75);
    }

    /** 按钮事件 时间冻结 */
    eventBtnTimeIce() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 冻结时间 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_path_click);
        this.timeProp.iceCount += this.timeProp.iceTotal;
        this.playAniIceStart();
    }

    /** 按钮事件 时间增加 */
    eventBtnTimeAdd() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 增加事件 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_path_click);

        this.timeGame.count += this.timeProp.addTotal;
        this.setUITime();
    }

    /** 按钮事件 使用磁铁 1 */
    eventBtnMagnetOne() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 磁铁1 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
    }

    /** 按钮事件 使用磁铁 2 */
    eventBtnMagnetTwo() {
        // 锁定 或 物品移动过程中，不触发道具
        Common.log('按钮 磁铁2 isLock: ', this.isLock, '; speedBox: ', this.speedBox.isMove, '; speedGood: ', this.speedGood.isMove);
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
    }

    /** 动作：游戏显示 */
    playAniShow(isShow, callback) {
        let opaStart = isShow ? 0 : 255;
        let opaFinish = isShow ? 255 : 0;
        this.nodeMain.opacity = opaStart;
        cc.tween(this.nodeMain).call(() => {
            this.maskBottom.active = true;
        }).to(0.383, { opacity: opaFinish }, cc.easeSineInOut()).call(() => {
            this.maskBottom.active = false;
            callback && callback();
        }).start();

        this.uiBottomMain.opacity = opaStart;
        cc.tween(this.uiBottomMain).to(0.383, { opacity: opaFinish }, cc.easeSineInOut()).start();
    }

    /** 动作 冻结开始 */
    playAniIceStart() {
        this.arrTimeLayer[0].node.color = cc.Color.BLUE;
        this.arrTimeLayer[1].node.color = cc.Color.BLUE;
        this.arrTimeLayer[2].node.color = cc.Color.BLUE;
    }

    /** 动作 冻结结束 */
    playAniIceFinish() {
        this.arrTimeLayer[0].node.color = cc.Color.WHITE;
        this.arrTimeLayer[1].node.color = cc.Color.WHITE;
        this.arrTimeLayer[2].node.color = cc.Color.WHITE;
    }

    /** 添加 箱子 */
    addBox(param: BoxParam): cc.Node {
        let node = this.getBox();
        node.parent = this.nodeMain;
        node.getComponent(ItemBox).init(param);
        return node;
    };

    /** 获取 箱子 */
    getBox(): cc.Node {
        return this.poolBox.size() > 0 ? this.poolBox.get() : cc.instantiate(this.preBox);
    }

    /** 添加 物品 */
    addGood(box: cc.Node, param: GoodParam): cc.Node {
        let node = this.getGood();
        node.parent = box.getComponent(ItemBox).nodeMain;
        node.getComponent(ItemGood).init(param);
        return node;
    };

    removeDataBox(box: cc.Node){
        let boxScript = box.getComponent(ItemBox);
        for (let i = 0, lenA = this.dataBox.length; i < lenA; i++) {
            for (let j = 0, lenB = this.dataBox[i].length; j < lenB; j++) {
                let boxParam = this.dataBox[i][j];
                if (boxParam.index == boxScript.param.index) {
                    this.dataBox[i].splice(j, 1);
                    break;
                }
            }
            if (this.dataBox[i].length <= 0) {
                this.dataBox.splice(i, 1);
                break;
            }
        }
    };

    /** 获取 物品 */
    getGood(): cc.Node {
        return this.poolGood.size() > 0 ? this.poolGood.get() : cc.instantiate(this.preGood);;
    }

    /** 检测新手引导状态 */
    checkNewPlayerState() {
        return null;
        let gameData = DataManager.data.sortData;
        if (gameData.level == 1 && gameData.newTip.cur == 0) {
            return CConst.newPlayer_guide_sort_1;
        }
        else if (gameData.level == 1 && gameData.newTip.cur == 1) {
            return CConst.newPlayer_guide_sort_2;
        }
        else if (gameData.level == 2 && gameData.newTip.cur == 2) {
            return CConst.newPlayer_guide_sort_3;
        }
        return null;
    }

    /**
     * 关卡结束
     */
    levelGameOver() {
        // 打点
        NativeCall.sTsEvent();
        NativeCall.closeBanner();

        let level = DataManager.data.boxData.level

        // 打点 过关
        NativeCall.logEventOne(GameDot.dot_levelPass);
        let dot = GameDot['dot_pass_level_' + level];
        if (dot) {
            let passTime = Math.floor((new Date().getTime() - this.dataObj.passTime) / 1000); //通关时间
            NativeCall.logEventFore(dot, String(level), String(passTime), String(this.dataObj.stepCount));
        }
        NativeCall.logEventOne(GameDot.dot_pass_level_all);

        // 进入下一关
        let funcNext = () => {
            let gameData = DataManager.data.boxData;
            gameData.level += 1;
            DataManager.setData(true);
            kit.Event.emit(CConst.event_enter_gameWin);
        };
        let isPlayAds = DataManager.checkIsPlayAdvert(level);
        if (isPlayAds) {
            // 打点 插屏广告请求（过关）
            NativeCall.logEventThree(GameDot.dot_adReq, "inter_nextlevel", "Interstital");
            let funcA = () => {
                // 打点 插屏播放完成
                NativeCall.logEventTwo(GameDot.dot_ads_advert_succe_win, String(level));
                funcNext();

                // 广告计时
                DataManager.data.adRecord.time = Math.floor(new Date().getTime() * 0.001);
                DataManager.data.adRecord.level = level;
                DataManager.setData();
            };
            let funcB = () => {
                funcNext();
            };
            let isReady = DataManager.playAdvert(funcA, funcB);
            if (!isReady) {
                funcB();
            }
        }
        else {
            funcNext();
        }
    }

    /**
     * 碰撞回调
     * @param other 
     * @param self 
     */
    collision(other: cc.BoxCollider, self: cc.BoxCollider) {
        let scriptSelf = self.node.getComponent(ItemBox);
        if (scriptSelf) {
            scriptSelf.moveEnd();
        }

        let scriptOther = other.node.getComponent(ItemBox);
        if (scriptOther) {
            scriptOther.moveEnd();
        }
    }

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_enter_nextLevel, this.enterLevel, this);
        kit.Event.on(CConst.event_collider_start, this.collision, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    }
}