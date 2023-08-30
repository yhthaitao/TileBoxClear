import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager, { Design } from "../../../../src/config/DataManager";
import ConfigDot from "../../../../src/config/ConfigDot";
import NativeCall from "../../../../src/config/NativeCall";
import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import ItemBox from "./ItemBox";
import ItemGood from "./ItemGood";
import ConfigGood from "../../../../src/config/ConfigGood";

/** 关卡参数 */
export interface LevelParam {
    difficulty?: number,// 难度
    isGolden?: boolean,// 是否有金币
    levelTime?: number,// 关卡时间
    layer?: number,// 关卡显示层级
    objW?: { left: number, right: number },// 左右宽度
    map: any[],// 箱子数据
    item: any[],// 物品数据
}

/** box参数 */
export interface BoxParam {
    index: number;
    name: string;
    x: number;
    y: number;
    w: number;
    h: number;
    goods: any;
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
    @property(cc.Node) nodeMain: cc.Node = null;// 箱子父节点
    @property(cc.Node) uiTop: cc.Node = null;// 顶部节点
    @property(cc.Node) uiProcess: cc.Node = null;// 进度节点
    @property(cc.Node) uiTopLevel: cc.Node = null;// 等级ui
    @property(cc.Node) uiTopTime: cc.Node = null;// 时间ui
    @property(cc.Node) uiTopCoin: cc.Node = null;// 金币ui
    @property(cc.Node) uiTopProcess: cc.Node = null;// 进度ui
    @property(cc.Node) uiBottom: cc.Node = null;// 底部节点
    @property(cc.Node) uiBottomMain: cc.Node = null;// 底部物品父节点
    @property(cc.Node) uiProp: cc.Node = null;// 道具父节点
    @property(cc.Prefab) preBox: cc.Prefab = null;// 预制体：箱子
    @property(cc.Prefab) preGood: cc.Prefab = null;// 预制体：物品

    levelParam: LevelParam = {
        "difficulty": 1,
        "isGolden":true,
        "map":[
            {"x":-105.5,"y":90.5,"w":"462","h":"181"},{"x":-105.5,"y":271.5,"w":"308","h":"181"},{"x":-105.5,"y":452.5,"w":"462","h":"181"},
            {"x":-105.5,"y":633.5,"w":"308","h":"181"},{"x":-105.5,"y":814.5,"w":"462","h":"181"},{"x":-105.5,"y":995.5,"w":"308","h":"181"},
            {"x":-105.5,"y":1176.5,"w":"462","h":"181"},{"x":-105.5,"y":1357.5,"w":"308","h":"181"},{"x":-105.5,"y":1538.5,"w":"462","h":"181"},
            {"x":-105.5,"y":1719.5,"w":"308","h":"181"},{"x":-105.5,"y":1900.5,"w":"462","h":"181"},{"x":-105.5,"y":2081.5,"w":"308","h":"181"},
            {"x":-105.5,"y":2262.5,"w":"462","h":"181"},{"x":-105.5,"y":2443.5,"w":"308","h":"181"},{"x":-105.5,"y":2624.5,"w":"462","h":"181"},
            {"x":-105.5,"y":2805.5,"w":"308","h":"181"},{"x":-105.5,"y":2986.5,"w":"462","h":"181"},{"x":-105.5,"y":3167.5,"w":"308","h":"181"},
            {"x":-105.5,"y":3348.5,"w":"462","h":"181"},{"x":-105.5,"y":3529.5,"w":"308","h":"181"},{"x":-105.5,"y":3710.5,"w":"462","h":"181"},
            {"x":-105.5,"y":3891.5,"w":"308","h":"181"},{"x":-105.5,"y":4072.5,"w":"462","h":"181"},{"x":-105.5,"y":4253.5,"w":"308","h":"181"},
            {"x":-105.5,"y":4434.5,"w":"462","h":"181"},{"x":230,"y":760,"w":"160","h":"20"},{"x":230,"y":560,"w":"160","h":"20"},
            {"x":230,"y":360,"w":"160","h":"20"},{"x":230,"y":160,"w":"160","h":"20"}
        ],
        "item":[
            {"x":40,"y":90.5,"w":3,"p":0,"n":"3002","g":0},{"x":-250,"y":90.5,"w":3,"p":0,"n":"3008","g":0},
            {"x":-50,"y":271.5,"w":4,"p":1,"n":"4012","g":0},{"x":-105.5,"y":90.5,"w":3,"p":0,"n":"3002","g":0},
            {"x":-170,"y":271.5,"w":2,"p":1,"n":"2008","g":0},{"x":40,"y":452.5,"w":4,"p":2,"n":"4001","g":0},
            {"x":-250,"y":452.5,"w":3,"p":2,"n":"3006","g":0},{"x":-105.5,"y":452.5,"w":4,"p":2,"n":"4012","g":0},
            {"x":-40,"y":633.5,"w":4,"p":3,"n":"4001","g":0},{"x":-190,"y":633.5,"w":3,"p":3,"n":"3002","g":0},
            {"x":40,"y":814.5,"w":4,"p":4,"n":"4001","g":0},{"x":-250,"y":814.5,"w":4,"p":4,"n":"4012","g":0},
            {"x":-105.5,"y":814.5,"w":2,"p":4,"n":"2016","g":0},{"x":-40,"y":995.5,"w":3,"p":5,"n":"3002","g":0},
            {"x":-170,"y":995.5,"w":3,"p":5,"n":"3008","g":0},{"x":-200,"y":1357.5,"w":2,"p":7,"n":"2008","g":0},
            {"x":-10,"y":1357.5,"w":2,"p":7,"n":"2018","g":0},{"x":-105.5,"y":1357.5,"w":2,"p":7,"n":"2009","g":0},
            {"x":40,"y":1538.5,"w":2,"p":8,"n":"2016","g":0},{"x":-250,"y":1538.5,"w":3,"p":8,"n":"3001","g":0},
            {"x":-95,"y":1538.5,"w":3,"p":8,"n":"3006","g":0},{"x":-200,"y":1719.5,"w":2,"p":9,"n":"2009","g":0},
            {"x":-10,"y":1719.5,"w":2,"p":9,"n":"2018","g":0},{"x":-105.5,"y":1719.5,"w":2,"p":9,"n":"2008","g":0},
            {"x":-250,"y":1900.5,"w":3,"p":10,"n":"3002","g":0},{"x":-105.5,"y":1900.5,"w":2,"p":10,"n":"2009","g":0},
            {"x":-40,"y":2081.5,"w":3,"p":11,"n":"3008","g":0},{"x":-170,"y":2081.5,"w":3,"p":11,"n":"3001","g":0},
            {"x":40,"y":2262.5,"w":2,"p":12,"n":"2008","g":0},{"x":-250,"y":2262.5,"w":3,"p":12,"n":"3008","g":0},
            {"x":-95,"y":2262.5,"w":3,"p":12,"n":"3006","g":0},{"x":-40,"y":2443.5,"w":4,"p":13,"n":"4013","g":0},
            {"x":-170,"y":2443.5,"w":2,"p":13,"n":"2018","g":0},{"x":40,"y":2624.5,"w":2,"p":14,"n":"2009","g":0},
            {"x":-250,"y":2624.5,"w":4,"p":14,"n":"4001","g":0},{"x":-105.5,"y":2624.5,"w":3,"p":14,"n":"3006","g":0},
            {"x":-40,"y":2805.5,"w":3,"p":15,"n":"3001","g":0},{"x":-170,"y":2805.5,"w":3,"p":15,"n":"3001","g":0},
            {"x":40,"y":2986.5,"w":2,"p":16,"n":"2016","g":0},{"x":-250,"y":2986.5,"w":4,"p":16,"n":"4012","g":0},
            {"x":-105.5,"y":2986.5,"w":3,"p":16,"n":"3001","g":0},{"x":-200,"y":3167.5,"w":2,"p":17,"n":"2009","g":0},
            {"x":-10,"y":3167.5,"w":2,"p":17,"n":"2018","g":0},{"x":-105.5,"y":3167.5,"w":2,"p":17,"n":"2008","g":0},
            {"x":40,"y":3348.5,"w":3,"p":18,"n":"3008","g":0},{"x":-105.5,"y":3348.5,"w":3,"p":18,"n":"3002","g":0},
            {"x":-35,"y":3529.5,"w":4,"p":19,"n":"4013","g":0},{"x":-175,"y":3529.5,"w":4,"p":19,"n":"4013","g":0},
            {"x":40,"y":3710.5,"w":3,"p":20,"n":"3011","g":0},{"x":-250,"y":3710.5,"w":3,"p":20,"n":"3001","g":0},
            {"x":-105.5,"y":3710.5,"w":3,"p":20,"n":"3011","g":0},{"x":-35,"y":3891.5,"w":4,"p":21,"n":"4012","g":0},
            {"x":-175,"y":3891.5,"w":4,"p":21,"n":"4012","g":0},{"x":40,"y":4072.5,"w":3,"p":22,"n":"3011","g":0},
            {"x":-250,"y":4072.5,"w":3,"p":22,"n":"3008","g":0},{"x":-105.5,"y":4072.5,"w":3,"p":22,"n":"3001","g":0},
            {"x":-200,"y":4253.5,"w":2,"p":23,"n":"2009","g":0},{"x":-10,"y":4253.5,"w":2,"p":23,"n":"2009","g":0},
            {"x":-105.5,"y":4253.5,"w":2,"p":23,"n":"2018","g":0},{"x":40,"y":4434.5,"w":3,"p":24,"n":"3008","g":0},
            {"x":-250,"y":4434.5,"w":3,"p":24,"n":"3001","g":0},{"x":230,"y":160,"w":4,"p":28,"n":"4013","g":0},
            {"x":230,"y":160,"w":2,"p":28,"n":"2009","g":0},{"x":230,"y":160,"w":2,"p":28,"n":"2008","g":0},
            {"x":230,"y":160,"w":3,"p":28,"n":"3006","g":0},{"x":230,"y":160,"w":4,"p":28,"n":"4001","g":0},
            {"x":230,"y":360,"w":4,"p":27,"n":"4013","g":0},{"x":230,"y":360,"w":3,"p":27,"n":"3011","g":0},
            {"x":230,"y":360,"w":4,"p":27,"n":"4001","g":0},{"x":230,"y":360,"w":3,"p":27,"n":"3011","g":0},
            {"x":230,"y":360,"w":2,"p":27,"n":"2009","g":0},{"x":230,"y":560,"w":2,"p":26,"n":"2018","g":0},
            {"x":230,"y":560,"w":3,"p":26,"n":"3008","g":0},{"x":230,"y":560,"w":4,"p":26,"n":"4013","g":0},
            {"x":230,"y":560,"w":2,"p":26,"n":"2016","g":0},{"x":230,"y":560,"w":3,"p":26,"n":"3008","g":0},
            {"x":230,"y":760,"w":2,"p":25,"n":"2016","g":0},{"x":230,"y":760,"w":3,"p":25,"n":"3011","g":0},
            {"x":230,"y":760,"w":3,"p":25,"n":"3006","g":0},{"x":230,"y":760,"w":2,"p":25,"n":"2016","g":0},
            {"x":230,"y":760,"w":3,"p":25,"n":"3001","g":0},{"x":40,"y":1176.5,"w":4,"p":6,"n":"4010","g":0},
            {"x":-250,"y":1176.5,"w":4,"p":6,"n":"4010","g":0},{"x":-105.5,"y":1176.5,"w":4,"p":6,"n":"4010","g":0},
            {"x":40,"y":1900.5,"w":4,"p":10,"n":"4010","g":0},{"x":-250,"y":3348.5,"w":4,"p":18,"n":"4010","g":0},
            {"x":-105.5,"y":4434.5,"w":4,"p":24,"n":"4010","g":0}
        ]
    };

    resPath = {
        levelPath: { bundle: 'prefabs', path: './games/GameBox/res/level/SortLevel' },
    }

    /** 游戏用数据 */
    dataObj = { stepCount: 0, passTime: 0, isFinish: false };

    goodsCfg: any = {};// 物品配置
    goodsCount: number = 0;// 物品计数
    goodsTotal: number = 0;// 物品总数
    objGame: any = {};// 箱子数据（按游戏数据整理）
    arrGame: BoxParam[][] = [];// 箱子数据（按层级排列）
    arrGameCopy: BoxParam[][] = [];// 箱子数据（用于 返回上一步 确认箱子位置）
    isLock: boolean = false;// 游戏是否锁定
    timeGame = { cur: 0, init: 0, count: 0, total: 1200 };// 游戏时间
    timeProp = { iceCount: 0, iceTotal: 12, addTotal: 10 };// 道具时间

    bottomParamArr: GoodParam[][] = [];// 物品数据（检测区）
    bottomMax: number = 7;// 物品最大数量（检测区）
    bottomDis: number = 90;// 物品间距（检测区）
    bottomDisY: number = -20;// 物品y轴偏移量（检测区）
    bottomScale: number = 0.5;// 物品缩放比率（检测区）
    bottomPosArr: cc.Vec3[] = [];// 物品位置（检测区）
    bottomTime = { cur: 0, init: 0, total: 0.2 };// 物品消除时间（检测区）

    defaultDifficulty: number = 1;// 默认难度
    defaultObjW = { "left": 10, "right": 10 };// 默认左右留的宽度
    defaultTime: number = 300;// 默认关卡时间
    defaultLayer: number = 5.5;// 默认显示箱子层数

    mainScale: number = 1;// 箱子父节点缩放比例
    mainLeftX: number = 0;// 箱子最左边
    mainRightX: number = 0;// 箱子最后边
    winScaleByH: number = 1;// 屏幕缩放比例（根据高度判断）
    goodScaleBottom: number = 0.5;// 底部物品缩放比例
    nodeMainPosY: number = 0;// 箱子父节点Y值
    arrBoxY: { y: number, h: number }[] = [];// 每层箱子的位置数据

    baseTime: number = 1;// 1单位时间
    baseDis: number = 2000;// 单位时间移动距离
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

        this.gameStart();
    }

    /** 第一次开始 */
    gameStart() {
        this.clear();
        this.initData();
        this.initBox();
        this.initUI();
        this.loadLevel();
        this.initLevel();
        this.isLock = false;
    }

    /** 重新开始 */
    gameRestart() {
        this.clear();
        this.initData();
        this.resetBox();
        this.initUI();
        this.loadLevel();
        this.initLevel();
        this.isLock = false;
    }

    initData() {
        /** 游戏用数据 */
        this.dataObj = {
            stepCount: 0,
            passTime: new Date().getTime(),
            isFinish: false,
        };

        // 物品计数
        this.goodsCount = 0;
        this.goodsTotal = this.levelParam.item.length;

        // 倒计时开始
        this.timeGame.total = this.levelParam.levelTime || this.defaultTime;
        this.timeGame.cur = this.timeGame.init;
        this.timeGame.count = this.timeGame.total;
    }

    initBox() {
        // 重构物品配置信息
        this.goodsCfg = {};
        ConfigGood.goodsConf.forEach((obj) => { this.goodsCfg[obj.id] = obj; });

        // 配置箱子和物品数据
        this.objGame = {};
        for (let index = 0, length = this.levelParam.map.length; index < length; index++) {
            const obj = this.levelParam.map[index];
            let x = Math.floor(Number(obj.x));
            let y = Math.floor(Number(obj.y));
            let w = Math.floor(Number(obj.w));
            let h = Math.floor(Number(obj.h));
            let boxParam: BoxParam = {
                index: index, name: 'box_' + index, x: x, y: y, w: w, h: h, goods: {}, isMove: false, isFrame: this.getBoxIsFrame(h),
            };
            this.objGame[index] = boxParam;
        }
        let goods = this.levelParam.item;
        for (let index = 0, length = goods.length; index < length; index++) {
            const obj = goods[index];
            let keyGood = Number(obj.n);
            let nameRes = this.goodsCfg[keyGood].name;
            let w = this.goodsCfg[keyGood].w;
            let h = this.goodsCfg[keyGood].h;
            let keyBox = Number(obj.p);
            let dataBox: BoxParam = this.objGame[keyBox];
            let x = obj.x - this.levelParam.map[keyBox].x;
            let y = obj.y - this.levelParam.map[keyBox].y;
            let goodParam: GoodParam = {
                index: index, keyGood: keyGood, nameRes: nameRes, name: 'good_' + index, x: x, y: y, w: w, h: h, isMove: false,
                box: { name: dataBox.name, key: keyBox, x: x, y: y },
            };
            dataBox.goods[index] = goodParam;
        }
    }

    /** 重新设置物品 */
    resetBox() {
        // 重构物品配置信息
        this.goodsCfg = {};
        ConfigGood.goodsConf.forEach((obj) => { this.goodsCfg[obj.id] = obj; });

        // 配置箱子和物品数据
        this.objGame = {};
        for (let index = 0, length = this.levelParam.map.length; index < length; index++) {
            const obj = this.levelParam.map[index];
            let x = Math.floor(Number(obj.x));
            let y = Math.floor(Number(obj.y));
            let w = Math.floor(Number(obj.w));
            let h = Math.floor(Number(obj.h));
            let boxParam: BoxParam = {
                index: index, name: 'box_' + index, x: x, y: y, w: w, h: h, goods: {}, isMove: false, isFrame: this.getBoxIsFrame(h),
            };
            this.objGame[index] = boxParam;
        }

        /** 已解锁的物品 */
        let goodUnlock: { 1: [number], 2: [number], 3: [number], 4: [number] } = Common.clone(DataManager.data.boxData.goodUnlock);
        let goods = this.levelParam.item;
        let objGood = {};
        let resetKey = (key) => {
            if (!objGood[key]) {
                let first = Math.floor(key * 0.001);
                let unlocks: [number] = goodUnlock[first];
                if (unlocks.length > 1) {
                    let mid = Math.floor(unlocks.length * 0.5);
                    let index = Math.random() * (unlocks.length - mid) + mid;
                    let goodKey = goodUnlock[first].splice(index, 1)[0];
                    objGood[key] = goodKey;
                }
                else if (unlocks.length == 1) {
                    let index = 0;
                    let goodKey = goodUnlock[first].splice(index, 1)[0];
                    objGood[key] = goodKey;
                }
                else {
                    objGood[key] = key;
                }
            }
            return objGood[key];
        };
        for (let index = 0, length = goods.length; index < length; index++) {
            const obj = goods[index];
            let key = Number(obj.n);
            let keyGood = resetKey(key);
            let nameRes = this.goodsCfg[keyGood].name;
            let w = this.goodsCfg[keyGood].w;
            let h = this.goodsCfg[keyGood].h;
            let keyBox = Number(obj.p);
            let dataBox: BoxParam = this.objGame[keyBox];
            let x = obj.x - this.levelParam.map[keyBox].x;
            let y = obj.y - this.levelParam.map[keyBox].y;
            let goodParam: GoodParam = {
                index: index, keyGood: keyGood, nameRes: nameRes, name: 'good_' + index, x: x, y: y, w: w, h: h, isMove: false,
                box: { name: dataBox.name, key: keyBox, x: x, y: y },
            };
            dataBox.goods[index] = goodParam;
        }
    }

    initUI() {
        // 组织数据 dataBox
        this.arrGame = [];
        let arrBox = {};
        let arrBoxFrame: BoxParam[] = [];
        for (const key in this.objGame) {
            if (Object.prototype.hasOwnProperty.call(this.objGame, key)) {
                let boxParam: BoxParam = Common.clone(this.objGame[key]);
                if (boxParam.isFrame) {
                    arrBoxFrame.push(boxParam);
                }
                else {
                    if (arrBox[boxParam.y]) {
                        arrBox[boxParam.y].push(boxParam);
                    }
                    else {
                        arrBox[boxParam.y] = [boxParam];
                    }
                }
            }
        }

        let arrValue = Object.keys(arrBox);
        arrValue.sort((a, b) => { return Number(a) - Number(b) });
        for (let index = 0; index < arrValue.length; index++) {
            this.arrGame.push(arrBox[arrValue[index]]);
        }
        // 删除空箱子
        for (let i = this.arrGame.length - 1; i >= 0; i--) {
            let arrBoxParam = this.arrGame[i];
            for (let j = arrBoxParam.length - 1; j >= 0; j--) {
                if (Object.keys(arrBoxParam[j].goods).length <= 0) {
                    arrBoxParam.splice(j, 1);
                }
            }
            if (arrBoxParam.length <= 0) {
                this.arrGame.splice(i, 1);
            }
        }

        // 特殊箱子添加到第一层
        this.arrGame[0] = this.arrGame[0].concat(arrBoxFrame);
        // 控制箱子y值
        this.setLeftRight();
        let disBoxX = (this.mainLeftX + this.mainRightX) * 0.5;
        let disBoxY = this.arrGame[0][0].y;
        for (let index = 0, length = this.arrGame.length; index < length; index++) {
            let arrBoxParam = this.arrGame[index];
            arrBoxParam.forEach((boxParam) => {
                boxParam.x -= disBoxX;
                boxParam.y -= disBoxY;
             });
        }
        // 保存箱子原始数据（用于返回上一步逻辑中，确认消失箱子的位置）
        this.arrGameCopy = Common.clone(this.arrGame);

        // 缩放数据
        this.winScaleByH = cc.winSize.height / Design.height;
        let disBackToProp = 60 * this.winScaleByH;
        let disPropToBottom = 60 * this.winScaleByH;
        let disBottomToMain = 150 * this.winScaleByH;

        // 调整ui（uiTop）
        this.uiTop.height *= this.winScaleByH;
        this.uiTop.children.forEach((item) => { item.scale = this.winScaleByH; });
        this.uiTop.y = cc.winSize.height * 0.5 - this.uiTop.height * 0.5;

        // 调整ui（uiProcess）
        this.uiProcess.height *= this.winScaleByH;
        this.uiProcess.children.forEach((item) => {
            if (item.name == 'bar') {
                item.height *= this.winScaleByH;
            }
            else {
                item.scale = this.winScaleByH;
            }
        });
        this.uiProcess.y = this.uiTop.y - this.uiTop.height * 0.5 + this.uiProcess.height * 0.5;

        // 调整ui（uiProp）
        this.uiProp.height *= this.winScaleByH;
        this.uiProp.children.forEach((item) => { item.scale = this.winScaleByH; });
        this.uiProp.y = -cc.winSize.height * 0.5 + this.uiProp.height * 0.5 + disBackToProp;

        // 调整ui（uiBottom）
        this.uiBottom.y = this.uiProp.y + this.uiProp.height * 0.5 + this.uiBottom.height * 0.5 + disPropToBottom;

        // 调整ui（nodeMain）
        this.nodeMain.y = this.uiBottom.y + this.uiBottom.height * 0.5 + disBottomToMain;

        this.setMainScale();
        this.nodeMain.scale = this.mainScale;

        // 箱子层级 y
        this.arrBoxY = [];
        for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
            let boxArr = this.arrGame[i];
            let boxOne = boxArr[0];
            this.arrBoxY.push({ y: boxOne.y, h: boxOne.h });
        }

        // 底部物品位置
        this.bottomParamArr = [];
        this.bottomPosArr = [];
        let arrGoodPos = Common.getArrByName(this.uiBottom.getChildByName('pos'), 'pos');
        for (let index = 0, length = arrGoodPos.length; index < length; index++) {
            this.bottomPosArr.push(arrGoodPos[index].position);
        }

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
        for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
            for (let j = 0, lenB = this.arrGame[i].length; j < lenB; j++) {
                let boxParam: BoxParam = this.arrGame[i][j];
                let box = this.addBox(boxParam);
                for (const keyGood in boxParam.goods) {
                    if (!Object.prototype.hasOwnProperty.call(boxParam.goods, keyGood)) {
                        continue;
                    }
                    let goodParam: GoodParam = boxParam.goods[keyGood];
                    this.addGood(box, goodParam);
                }
                if (boxParam.isFrame) {
                    box.getComponent(ItemBox).sortGood();
                }
            }
        }
        NativeCall.logEventOne(ConfigDot.dot_loadok_to_all);
        this.playAniShow(true, () => {
            // 新手引导
            let guideName = this.checkNewPlayerState();
            switch (guideName) {
                case CConst.newPlayer_guide_sort_1:
                    DataManager.data.boxData.newTip.cur++;
                    DataManager.setData();
                    kit.Event.emit(CConst.event_enter_newPlayer, CConst.newPlayer_guide_sort_1);
                    break;
                case CConst.newPlayer_guide_sort_3:
                    DataManager.data.boxData.newTip.cur++;
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
        let wTotal = 682;
        let bar = this.uiTopProcess.getChildByName('bar');
        if (this.goodsCount == 0) {
            bar.width = 0;
        }
        else {
            cc.tween(bar).to(0.3, { width: wTotal * this.goodsCount / this.goodsTotal }).start();
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
                Common.log('倒计时结束');
                this.playAniGameOver();
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
            let isCollider = false;
            for (let index = 0, length = arrB.length; index < length; index++) {
                let boxParamB = arrB[index];
                if (boxParamB.isFrame) {
                    continue;
                }
                if (boxParamB.isMove) {
                    continue;
                }
                let rectB = getRect(boxParamB);
                if (rectA.intersects(rectB)) {
                    isCollider = true;
                    break;
                }
            }
            return isCollider;
        };

        let isContinueMove = false;
        // 箱子 多层
        for (let i = 0; i < this.arrGame.length; i++) {
            // 箱子 单层
            let arrBoxParam = this.arrGame[i];
            for (let j = 0; j < arrBoxParam.length; j++) {
                // 箱子 单个
                let boxParam = arrBoxParam[j];
                if (boxParam.isFrame) {
                    continue;
                }
                if (!boxParam.isMove) {
                    continue;
                }
                let box = this.nodeMain.getChildByName(boxParam.name);
                let scriptBox = box.getComponent(ItemBox);
                let yA = boxParam.y - this.speedBox.speedCur;
                if (i == 0) {
                    if (yA < this.arrBoxY[0].y) {
                        boxParam.isMove = false;
                        boxParam.y = this.arrBoxY[0].y;
                        scriptBox.refreshParams(boxParam.y);
                    }
                    else {
                        isContinueMove = true;
                        boxParam.y = yA;
                        scriptBox.refreshParams(boxParam.y);
                    }
                }
                else {
                    let rectA = getRect(boxParam);
                    rectA.y = yA;
                    let isCollider = funcCollider(rectA, this.arrGame[i - 1]);
                    if (isCollider) {
                        boxParam.isMove = false;
                        boxParam.y = this.arrBoxY[i].y;
                        scriptBox.refreshParams(boxParam.y);
                    }
                    else {
                        isContinueMove = true;
                        boxParam.y = yA;
                        scriptBox.refreshParams(boxParam.y);
                        let boxGoal = this.arrBoxY[i - 1];// 下层的位置
                        // 进入下层范围，数据转移到下层
                        if (boxParam.y < boxGoal.y + boxGoal.h * 0.5) {
                            arrBoxParam.splice(j, 1);
                            this.arrGame[i - 1].push(boxParam);
                            j--;
                        }
                    }
                }
            }
            // 删除空箱子
            if (arrBoxParam.length < 1) {
                this.arrGame.splice(i, 1);
                i--;
            }
        }

        // 是否继续移动
        if (!isContinueMove) {
            this.setMoveBox(false);
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
                if (nodeGood.scale > this.goodScaleBottom) {
                    nodeGood.scale -= 0.04;
                }
                else {
                    nodeGood.scale = this.goodScaleBottom;
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
            this.setMoveGood(false);
            if (this.getBottomGoodNum() > this.bottomMax - 1) {
                Common.log('检测区 无空位 goodsCount: ', this.goodsCount, '; goodsTotal: ', this.goodsTotal);
                this.playAniGameOver();
            }
        }
    }

    /** 开始移动 箱子 */
    setMoveBox(isMove) {
        if (isMove) {
            for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
                for (let j = 0, lenB = this.arrGame[i].length; j < lenB; j++) {
                    let boxParam = this.arrGame[i][j];
                    boxParam.isMove = true;
                }
            }
            this.speedBox.speedCur = this.speedBox.speedInit;
            this.speedBox.isMove = isMove;
        }
        else {
            this.speedBox.isMove = isMove;
        }
    };

    /** 开始移动 物品 */
    setMoveGood(isMove) {
        if (isMove) {
            for (let i = 0, lenA = this.bottomParamArr.length; i < lenA; i++) {
                for (let j = 0, lenB = this.bottomParamArr[i].length; j < lenB; j++) {
                    this.bottomParamArr[i][j].isMove = true;
                }
            }
            this.speedGood.speedCur = this.speedGood.speedInit;
            this.speedGood.isMove = isMove;
        }
        else {
            this.speedGood.isMove = isMove;
        }
    };

    /** 获取左右两侧x值 */
    setLeftRight() {
        for (let index = 0, length = this.arrGame.length; index < length; index++) {
            let arrBoxParam = this.arrGame[index];
            arrBoxParam.forEach((boxParam) => {
                if (this.mainLeftX > boxParam.x - boxParam.w * 0.5) {
                    this.mainLeftX = boxParam.x - boxParam.w * 0.5;
                }
                if (this.mainRightX < boxParam.x + boxParam.w * 0.5) {
                    this.mainRightX = boxParam.x + boxParam.w * 0.5;
                }
            });
        }
    }

    /** 设置真实缩放: 先计算适配宽时，能够显示的层级 */
    setMainScale() {
        let boxParam = this.arrGame[0][0];
        let layer = (this.levelParam.layer || this.defaultLayer);
        let height = boxParam.h * layer;
        let scaleByH = (cc.winSize.height * 0.5 - this.uiTop.height - this.nodeMain.y) / height;

        let objW = this.levelParam.objW || this.defaultObjW;
        let width = objW.left + objW.right;
        let widthDesign = cc.winSize.width - width;
        let widthReal = this.mainRightX - this.mainLeftX;
        let scaleByW = widthDesign / widthReal;

        if (widthReal * scaleByH + width > cc.winSize.width) {
            this.mainScale = scaleByW;
        }
        else {
            this.mainScale = scaleByH;
        }
        Common.log('layer: ', layer, '; scaleByH: ', scaleByH, '; scaleByW: ', scaleByW, '; mainScale: ', this.mainScale);
    };

    getBoxIsFrame(h: number) {
        return h < 100;
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
        this.eventTouchAfter([scriptGood.param]);
    }

    eventTouchAfter(arrGoodParam: GoodParam[]) {
        let removeBoxNum = 0;
        for (let index = 0, length = arrGoodParam.length; index < length; index++) {
            if (this.refreshOperationArea(arrGoodParam[index])) {
                removeBoxNum++;
            }
        }
        this.setMoveGood(true);
        if (removeBoxNum > 0) {
            // 开始移动 箱子
            this.setMoveBox(true);
        }
    }

    /** 刷新操作区 */
    refreshOperationArea(goodParam: GoodParam) {
        // 刷新数据
        let isRemoveBox = false;
        let isDelete = false;
        let box = this.nodeMain.getChildByName(goodParam.box.name);
        let scriptBox = box.getComponent(ItemBox);
        let good = scriptBox.nodeMain.getChildByName(goodParam.name);
        let scriptGood = good.getComponent(ItemGood);
        let pStart = Common.getLocalPos(good.parent, good.position, this.uiBottomMain);
        good.parent = this.uiBottomMain;
        good.scale = this.mainScale;
        good.active = true;
        scriptGood.refreshParams(pStart);
        this.goodParamsInsert(scriptGood.param);

        for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
            let arrBoxParam = this.arrGame[i];
            for (let j = 0, lenB = arrBoxParam.length; j < lenB; j++) {
                let boxParam = arrBoxParam[j];
                for (const key in boxParam.goods) {
                    if (Object.prototype.hasOwnProperty.call(boxParam.goods, key)) {
                        // 删除物品参数
                        let goodParamOne: GoodParam = boxParam.goods[key];
                        if (goodParamOne.name == goodParam.name) {
                            isDelete = true;
                            delete boxParam.goods[key];
                            scriptBox.param = boxParam;
                            if (scriptBox.param.isFrame) {
                                scriptBox.refreshGoods();
                            }
                            break;
                        }
                    }
                }
                // 特殊箱子
                if (boxParam.isFrame) {
                    if (isDelete) {
                        break;
                    }
                }
                // 普通箱子 箱子内无物品 删除箱子
                else {
                    if (Object.keys(boxParam.goods).length < 1) {
                        arrBoxParam.splice(j, 1);
                        DataManager.poolPut(box, this.poolBox);
                        isRemoveBox = true;
                    }
                    if (isDelete) {
                        break;
                    }
                }
            }
            // 当前层无箱子 删除层数据
            if (arrBoxParam.length < 1) {
                this.arrGame.splice(i, 1);
            }
            if (isDelete) {
                break;
            }
        }
        return isRemoveBox;
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
    goodParamsInsert(goodParam: GoodParam) {
        goodParam.isMove = true;
        let isAdd = false;
        for (let index = 0, lenA = this.bottomParamArr.length; index < lenA; index++) {
            let arrParams = this.bottomParamArr[index];
            let lenB = arrParams.length;
            if (lenB > 0 && lenB < 3 && arrParams[0].keyGood == goodParam.keyGood) {
                isAdd = true;
                arrParams.push(goodParam);
                continue;
            }
        }
        if (!isAdd) {
            this.bottomParamArr.push([goodParam]);
        }
    }

    /** 物品参数-检测y值 */
    goodParamsCheck(arrGoodParam: GoodParam[]) {
        let length = arrGoodParam.length;
        let isEnough = length > 2;
        if (isEnough) {
            let goodParam = arrGoodParam[0].y;
            for (let index = 1; index < length; index++) {
                if (goodParam != arrGoodParam[index].y) {
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
            Common.log('物品消完 goodsCount: ', this.goodsCount, '; goodsTotal: ', this.goodsTotal);
            this.playAniGameOver();
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
                this.gameRestart();
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
        NativeCall.logEventThree(ConfigDot.dot_adReq, "inter_homeRestart", "Interstital");
        let funcA = () => {
            // 打点 插屏播放完成（点击重玩按钮）
            NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_rePlay, String(level));
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

        let numGoodArr = this.bottomParamArr.length;
        // 没有物品
        if (numGoodArr <= 0) {
            kit.Event.emit(CConst.event_notice, "Can't be used now");
            return;
        }
        this.isLock = true;

        // 删除检测区物品数据 并 获取物品参数
        let arrGood = this.bottomParamArr[numGoodArr - 1];
        let goodParam = arrGood.splice(arrGood.length - 1, 1)[0];
        if (arrGood.length < 1) {
            this.bottomParamArr.splice(numGoodArr - 1, 1);
        }

        let good = this.uiBottomMain.getChildByName(goodParam.name);
        let box = this.nodeMain.getChildByName(goodParam.box.name);
        // 物品原来的箱子存在
        if (box) {
            let scriptBox = box.getComponent(ItemBox);
            let goodP1 = good.position;
            let goodP2 = Common.getLocalPos(scriptBox.nodeMain, cc.v3(goodParam.box.x, goodParam.box.y), this.uiBottomMain);
            let timeP12 = Common.getMoveTime(goodP1, goodP2, this.baseTime, this.baseDis);
            cc.tween(good).to(timeP12, { position: goodP2, scale: this.mainScale }).call(() => {
                good.parent = scriptBox.nodeMain;
                good.scale = 1.0;
                scriptBox.param.goods[goodParam.index] = goodParam;
                if (scriptBox.param.isFrame) {
                    scriptBox.sortGood();
                }
                good.getComponent(ItemGood).resetParams(goodParam);
                this.refreshBoxParam(scriptBox.param);

                this.isLock = false;
            }).start();
        }
        // 物品原来的箱子存在
        else {
            /**
             * 1.找到需要复原的箱子
             * 2.现有箱子+需要复原的箱子，组成一个包含箱子名字的数组
             * 3.对比游戏开始时所有箱子，排除掉已经消除的箱子
             * 4.剩余箱子物品复原 并 重新排列位置，
             * 5.根据数据移动现有箱子，底部物品返回到箱子中
             */

            // 获取矩形
            let getRect = (boxParam: BoxParam) => {
                return cc.rect(boxParam.x - boxParam.w * 0.5 + 1, boxParam.y, boxParam.w - 2, boxParam.h);
            };
            // 获取箱子列数
            let getBoxLayer = (boxParamCur: BoxParam, layerCur: number) => {
                let layer = 0;
                let rectA = getRect(boxParamCur);
                for (let i = layerCur - 1; i >= 0; i--) {
                    let isInter = false;
                    let arrLayer = this.arrGame[i];
                    for (let j = 0; j < arrLayer.length; j++) {
                        let boxParam = arrLayer[j];
                        let rectB = getRect(boxParam);
                        rectA.y = rectB.y + boxParamCur.h * 0.5;
                        isInter = cc.Intersection.rectRect(rectA, rectB);
                        if (isInter) {
                            break;
                        }
                    }
                    if (isInter) {
                        layer = i + 1;
                        break;
                    }
                }
                return layer;
            };

            // 拿到原箱子
            let boxParamCur: BoxParam = Common.clone(this.objGame[goodParam.box.key]);
            // 组合剩余箱子
            let names = [boxParamCur.name];
            for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
                for (let j = 0, lenB = this.arrGame[i].length; j < lenB; j++) {
                    names.push(this.arrGame[i][j].name);
                }
            }
            // 去除以消除箱子
            let dataBox: BoxParam[][] = Common.clone(this.arrGameCopy);
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
            boxParamCur.goods = {};
            this.addBox(boxParamCur);
            let objBox = {};
            for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
                for (let j = 0; j < this.arrGame[i].length; j++) {
                    let boxParam = this.arrGame[i][j];
                    objBox[boxParam.index] = Common.clone(boxParam);
                }
            }
            // 重置箱子位置
            this.arrGame = Common.clone(dataBox);// 赋值箱子
            for (let i = 0; i < this.arrGame.length; i++) {
                let arrLayer = this.arrGame[i];
                for (let j = 0; j < arrLayer.length; j++) {
                    let boxParam = arrLayer[j];
                    let isBox = boxParam.name == boxParamCur.name;
                    // 物品还原
                    if (isBox) {
                        boxParam.goods = {};
                    }
                    else {
                        boxParam.goods = objBox[boxParam.index] ? objBox[boxParam.index].goods : {};
                    }
                    // 框不移动
                    if (boxParam.isFrame) {
                        continue;
                    }
                    // 箱子层级
                    let layer = getBoxLayer(boxParam, i);
                    boxParam.y = this.arrBoxY[layer].y;
                    let box = this.nodeMain.getChildByName(boxParam.name);
                    let boxP1 = box.position;
                    let boxP2 = cc.v3(box.x, boxParam.y);
                    let timeY = Common.getMoveTime(cc.v3(0, 0), cc.v3(0, boxParamCur.h), this.baseTime, this.baseDis);
                    if (isBox) {
                        box.position = boxP2;
                        // 箱子高度变化+物品移动
                        let boxH = boxParamCur.h;
                        let scriptBox = box.getComponent(ItemBox);
                        scriptBox.param.y = boxParam.y;
                        scriptBox.itemIcon.height = 0;
                        cc.tween(scriptBox.itemIcon).to(timeY, { height: boxH }).call(() => {
                            let goodP1 = good.position;
                            let goodP2 = Common.getLocalPos(scriptBox.nodeMain, cc.v3(goodParam.box.x, goodParam.box.y), this.uiBottomMain);
                            let timeP12 = Common.getMoveTime(goodP1, goodP2, this.baseTime, this.baseDis);
                            // 物品移动
                            cc.tween(good).to(timeP12, { position: goodP2, scale: this.mainScale }).call(() => {
                                scriptBox.param.goods[goodParam.index] = goodParam;
                                good.parent = scriptBox.nodeMain;
                                good.scale = 1.0;
                                good.getComponent(ItemGood).resetParams(goodParam);
                                this.refreshBoxParam(scriptBox.param);

                                this.isLock = false;
                            }).start();
                        }).start();
                    }
                    else {
                        box.position = boxP1;
                        cc.tween(box).to(timeY, { position: boxP2 }).call(() => {
                            box.getComponent(ItemBox).refreshParams(boxParam.y);
                        }).start();
                    }
                    if (layer == i) {
                        continue;
                    }
                    // 转移箱子数据
                    arrLayer.splice(j, 1);
                    this.arrGame[layer].push(boxParam);
                    j--;
                }
            }
            for (let i = this.arrGame.length - 1; i >= 0; i--) {
                let arrLayer = this.arrGame[i];
                if (arrLayer.length <= 0) {
                    this.arrGame.splice(i, 1);
                }
            }
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
        for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
            for (let j = 0, lenB = this.arrGame[i].length; j < lenB; j++) {
                composeArr(this.arrGame[i][j]);
            }
        }

        /*****************************************************赋值物品数组 并 重新排序*************************************************************/
        let arrCopy: GoodParam[][] = Common.clone(arrGoodParam);
        for (let index = 0, length = arrCopy.length; index < length; index++) {
            let arrParam = arrCopy[index];
            if (arrParam) {
                let i = arrParam.length;
                while (i) {
                    let j = Math.floor(Math.random() * i--);
                    let temp = arrParam[i];
                    arrParam[i] = arrParam[j];
                    arrParam[j] = temp;
                }
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
            if (arrParamA && arrParamB) {
                voluationArr(arrParamA, arrParamB);
            }
        }

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
        kit.Audio.playEffect(CConst.sound_path_click);
        let needNum = 3;
        let keyGood = 0;
        if (this.bottomParamArr.length > 0) {
            for (let index = 0; index < this.bottomParamArr.length; index++) {
                let arrGoodParam = this.bottomParamArr[index];
                needNum = 3 - arrGoodParam.length;
                if (needNum <= this.bottomMax - this.getBottomGoodNum()) {
                    keyGood = arrGoodParam[0].keyGood;
                    break;
                }
            }
            // 物品标识为0，提示失败；
            if (keyGood == 0) {
                kit.Event.emit(CConst.event_notice, "Can't be used now");
                return;
            }
        }
        else {
            for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
                let arrBoxParam = this.arrGame[i];
                for (let j = 0, lenB = arrBoxParam.length; j < lenB; j++) {
                    let boxParam = arrBoxParam[j];
                    for (const key in boxParam.goods) {
                        if (Object.prototype.hasOwnProperty.call(boxParam.goods, key)) {
                            let goodParam: GoodParam = boxParam.goods[key];
                            keyGood = goodParam.keyGood;
                            break;
                        }
                    }
                    if (keyGood != 0) {
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
        for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
            let arrBoxParam = this.arrGame[i];
            for (let j = 0, lenB = arrBoxParam.length; j < lenB; j++) {
                let boxParam = arrBoxParam[j];
                let goodKeys = Object.keys(boxParam.goods);
                goodKeys.sort((a: string, b: string) => { return boxParam.goods[a].index - boxParam.goods[b].index; });
                for (let k = 0, lenC = goodKeys.length; k < lenC; k++) {
                    let value = goodKeys[k];
                    let goodParam: GoodParam = boxParam.goods[value];
                    if (goodParam.keyGood == keyGood) {
                        arrChose.push(goodParam);
                        if (arrChose.length > needNum - 1) {
                            isEnough = true;
                            break;
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

        this.eventTouchAfter(arrChose);
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

    /** 游戏结束 */
    playAniGameOver() {
        this.isLock = true;
        this.dataObj.isFinish = true;
        this.maskBottom.active = true;

        if (this.goodsCount >= this.goodsTotal) {
            Common.log('胜利');
        }
        else {
            Common.log('失败');
        }
    };

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

    refreshBoxParam(param: BoxParam) {
        for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
            for (let j = 0, lenB = this.arrGame[i].length; j < lenB; j++) {
                let boxParam = this.arrGame[i][j];
                if (boxParam.name == param.name) {
                    this.arrGame[i][j] = param;
                    return;
                }
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
        let gameData = DataManager.data.boxData;
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

    gameLog(sign: string) {
        let name = { a: sign + ' 当前游戏数据：' };
        for (let i = 0, lenA = this.arrGame.length; i < lenA; i++) {
            for (let j = 0, lenB = this.arrGame[i].length; j < lenB; j++) {
                let boxParam = this.arrGame[i][j];
                let key = '' + i + '-' + j + ': ';
                let value = boxParam.name + ', y = ' + boxParam.y + ', ';
                for (let key in boxParam.goods) {
                    if (Object.prototype.hasOwnProperty.call(boxParam.goods, key)) {
                        let goodParam: GoodParam = boxParam.goods[key];
                        value += goodParam.name + ', ';
                    }
                }
                name[key] = value;
            }
        }
        Common.log(JSON.stringify(name, null, 4));
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
        NativeCall.logEventOne(ConfigDot.dot_levelPass);
        let dot = ConfigDot['dot_pass_level_' + level];
        if (dot) {
            let passTime = Math.floor((new Date().getTime() - this.dataObj.passTime) / 1000); //通关时间
            NativeCall.logEventFore(dot, String(level), String(passTime), String(this.dataObj.stepCount));
        }
        NativeCall.logEventOne(ConfigDot.dot_pass_level_all);

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
            NativeCall.logEventThree(ConfigDot.dot_adReq, "inter_nextlevel", "Interstital");
            let funcA = () => {
                // 打点 插屏播放完成
                NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_win, String(level));
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

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_enter_nextLevel, this.gameStart, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    }
}