import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import ConfigDot from "../../../../src/config/ConfigDot";
import NativeCall from "../../../../src/config/NativeCall";
import DataManager from "../../../../src/config/DataManager";
import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import ItemBox from "./ItemBox";
import ItemGood from "./ItemGood";
import { BoxParam, Design, GoodParam, LevelParam, FailParam, WinParam, FinishType, PropType } from "../../../../src/config/ConfigCommon";
import { LangChars } from "../../../../src/config/ConfigLang";
import { ConfigGold } from "../../../../src/config/ConfigGold";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameBox extends cc.Component {

    @property({ type: cc.Node, tooltip: '事件拦截-游戏底层' }) maskTop: cc.Node = null;
    @property({ type: cc.Node, tooltip: '事件拦截-游戏顶层' }) maskBottom: cc.Node = null;
    @property({ type: cc.Node, tooltip: '背景' }) bg: cc.Node = null;
    @property({ type: [cc.Label], tooltip: '游戏事件label数组' }) arrTimeLayer: cc.Label[] = [];
    @property({ type: cc.Node, tooltip: '箱子父节点' }) nodeMain: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-顶部' }) uiTop: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-顶部-关卡等级' }) uiTopLevel: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-顶部-碎片数量' }) uiTopSuipian: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-顶部-时间' }) uiTopTime: cc.Node = null;
    @property({ type: cc.Node, tooltip: '消除进度' }) uiProcess: cc.Node = null;
    @property({ type: cc.Node, tooltip: '事件拦截-操作区顶部' }) uiMask: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-底部' }) uiBottom: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-底部-检测区' }) uiBottomMain: cc.Node = null;
    @property({ type: cc.Node, tooltip: '消除动作节点' }) uiParticle: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-道具' }) uiProp: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-道具-冰冻' }) uiPropIce: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-道具-提示' }) uiPropTip: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-道具-回退' }) uiPropBack: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'ui-道具-刷新' }) uiPropRefresh: cc.Node = null;
    @property({ type: cc.Prefab, tooltip: '预制体：箱子' }) preBox: cc.Prefab = null;
    @property({ type: cc.Prefab, tooltip: '预制体：物品' }) preGood: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: '冰冻效果节点' }) effectIce: cc.Node = null;
    @property({ type: cc.Node, tooltip: '点击效果节点' }) effectExp: cc.Node = null;
    @property({ type: cc.Node, tooltip: '点击效果节点' }) effectTouch: cc.Node = null;

    levelParam: LevelParam = null;
    /** 游戏用数据 */
    objData = {
        level: 1, numSuipian: 0, stepCount: 0, passTime: 0, boxInLine: 0, isFinish: false
    };
    heightObj = {};

    goodsCfg: any = {};// 物品配置
    goodsCount: number = 0;// 物品计数
    goodsTotal: number = 0;// 物品总数
    objGame: any = {};// 箱子数据（按游戏数据整理）
    objGameCopy: any = {};// 箱子数据（用于 返回上一步 确认箱子位置）
    isLock: boolean = false;// 游戏是否锁定
    timeGame = { cur: 0, init: 0, count: 0, total: 1200 };// 游戏时间
    timeProp = { iceCount: 0, iceTotal: 15, addTotal: 10 };// 道具时间

    bottomParamArr: GoodParam[][] = [];// 物品数据（检测区）
    bottomMax: number = 7;// 物品最大数量（检测区）
    bottomPosArr: cc.Vec3[] = [];// 物品位置（检测区）
    bottomTime = { cur: 0, init: 0, total: 0.2 };// 物品消除时间（检测区）

    defaultObjW = { "left": 10, "right": 10 };// 默认左右留的宽度
    defaultTime: number = 300;// 默认关卡时间
    defaultLayer: number = 5.5;// 默认显示箱子层数

    mainScale: number = 1;// 箱子父节点缩放比例
    mainLayer: number = 5;// 箱子父节点实际显示的层数
    mainLeftX: number = 0;// 箱子最左边
    mainRightX: number = 0;// 箱子最后边
    processDisH: number = 8;// 进度条透明部分高度
    // 底部物品缩放比例 61  86  116  134
    goodScaleBottom = {
        1: 0.5 * 134 / 90,
        2: 0.5 * 134 / 90,
        3: 0.5 * 134 / 105,
        4: 0.5 * 134 / 110,
        5: 0.5, 6: 0.5, 7: 0.5, 8: 0.5, 9: 0.5,
    };
    boxBottomY: number = 0;
    boxH: number = 181;

    baseTime: number = 1;// 1单位时间
    baseDis: number = 2000;// 单位时间移动距离

    /** 移动速度 箱子 */
    speedBox = {
        speedCur: 0, speedDis: 2, speedInit: 0, speedMax: 20, isMove: false,
    };

    /** 移动速度 物品 */
    speedGood = {
        speedCur: 0, speedDis: 5, speedInit: 0, speedMax: 50, isMove: false,
    };

    protected onLoad(): void {
        Common.log('页面 游戏 onLoad()');

        this.listernerRegist();

        // 缩放数据
        let winScaleByH = cc.winSize.height / Design.height;
        let disBackToProp = 60 * winScaleByH;
        let disTopToProcess = 63 * winScaleByH;
        let disPropToBottom = 60 * winScaleByH;
        let disBottomToMain = 150 * winScaleByH;

        // 调整ui（uiTop）
        this.uiTop.height *= winScaleByH;
        this.uiTop.children.forEach((item) => { item.scale = winScaleByH; });
        this.uiTop.y = cc.winSize.height * 0.5 - this.uiTop.height * 0.5;

        // 调整ui（uiProcess）
        this.uiProcess.height *= winScaleByH;
        this.uiProcess.children.forEach((item) => {
            if (item.name == 'bar') {
                item.height *= winScaleByH;
            }
            else {
                item.scale = winScaleByH;
            }
        });
        this.uiProcess.y = this.uiTop.y - disTopToProcess;
        this.processDisH *= winScaleByH;

        // 调整ui（uiMask）
        this.uiMask.height = cc.winSize.height * 0.5 - this.uiProcess.y + this.uiProcess.height * 0.5 - this.processDisH;
        this.uiMask.y = cc.winSize.height * 0.5;

        // 调整ui（uiProp）
        this.uiProp.height *= winScaleByH;
        this.uiProp.children.forEach((item) => { item.scale = winScaleByH; });
        this.uiProp.y = -cc.winSize.height * 0.5 + this.uiProp.height * 0.5 + disBackToProp;

        // 调整ui（uiBottom）
        this.uiBottom.y = this.uiProp.y + this.uiProp.height * 0.5 + this.uiBottom.height * 0.5 + disPropToBottom;

        // 调整ui（nodeMain）
        this.nodeMain.y = this.uiBottom.y + this.uiBottom.height * 0.5 + disBottomToMain;

        // 按钮特效
        this.bg.on(cc.Node.EventType.TOUCH_START, this.eventTouchShow, this, true);
    }

    protected onEnable(): void {
        // 初始ui
        this.nodeMain.opacity = 0;
        this.maskTop.setContentSize(cc.winSize);
        this.maskTop.active = true;
        this.maskBottom.setContentSize(cc.winSize);
        this.maskBottom.active = false;

        this.gameLoad();
    }

    /** 第一次开始 */
    gameLoad(isRestart = false) {
        Common.log('功能：游戏开始 isRestart: ', isRestart ? 'true' : 'false');
        this.setIsLock(true);
        this.clear();
        this.initData();
        this.loadBg();
        this.initBox(isRestart);
        this.initUI();
        this.initLevel();
        NativeCall.showBanner();
    }

    /** 初始化数据 */
    initData() {
        /** 游戏用数据 */
        this.objData = {
            level: DataManager.data.challengeData.level,
            numSuipian: 0,
            stepCount: 0,
            passTime: new Date().getTime(),
            boxInLine: 0,
            isFinish: false,
        };
        this.levelParam = DataManager.getChallengeLevelData(this.objData.level);
        // 屏幕系数
        this.mainScale = 1;// 箱子父节点缩放比例
        this.mainLayer = 5;// 箱子父节点实际显示的层数
        this.mainLeftX = 0;// 箱子最左边
        this.mainRightX = 0;// 箱子最后边
        // 物品计数
        this.goodsCount = 0;
        this.goodsTotal = this.levelParam.item.length;
        // 倒计时开始
        this.timeGame.total = this.levelParam.levelTime || this.defaultTime;
        this.timeGame.cur = this.timeGame.init;
        this.timeGame.count = this.timeGame.total;

        // 游戏初始 碎片ui不显示
        this.uiTopSuipian.opacity = 0;
        NativeCall.logEventOne(ConfigDot.dot_challenge_start);
    }

    /** 加载关卡数据 */
    loadBg() {
        // 加载背景
        let bgId = Math.floor((this.objData.level - 1) / 5 % 4) + 1;
        let pathBg = CConst.pathGameBg + bgId;
        kit.Resources.loadRes(CConst.bundleCommon, pathBg, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 bg: ', pathBg);
                return;
            }
            this.bg.getComponent(cc.Sprite).spriteFrame = assets;
        });
        // 困难标签
        if (this.levelParam.difficulty) {
            this.uiTopLevel.getChildByName('nodeSign').active = true;
        }
        else {
            this.uiTopLevel.getChildByName('nodeSign').active = false;
        }
    }

    /** 重新组合关卡数据 */
    initBox(isRestart = false) {
        // 重构物品配置信息
        this.goodsCfg = DataManager.getObjAllGoods();
        // 用于磁铁和时钟功能
        let topY = 0;
        let topH = 0;
        let frameY = 0;
        let topBoxIndex = this.levelParam.map.length - 1;
        let topGoodIndex = this.levelParam.item.length - 1;
        // 配置箱子和物品数据
        this.objGame = {};
        for (let index = 0, length = this.levelParam.map.length; index < length; index++) {
            let obj = this.levelParam.map[index];
            let w = Number(obj.w);
            let h = Number(obj.h);
            let x = Number(obj.x);
            let y = Number(obj.y) - h * 0.5;
            if (topY < y) {
                topY = y;
                topH = h;
            }
            let isFrame = this.getBoxIsFrame(h);
            if (isFrame && y > frameY) {
                frameY = y;
            }
            if (this.mainLeftX > (x - w * 0.5)) {
                this.mainLeftX = x - w * 0.5;
            }
            if (this.mainRightX < x + w * 0.5) {
                this.mainRightX = x + w * 0.5;
            }
            let boxParam: BoxParam = {
                index: index, name: 'box_' + index, x: x, y: y, w: w, h: h, goods: {},
                isMove: false, isFrame: isFrame, boxType: Number(obj.id),
            };
            this.objGame[index] = boxParam;
        }

        // 金币逻辑
        let isGolden = this.levelParam.isGolden ? true : false;
        this.uiTopSuipian.opacity = isGolden ? 255 : 0;
        let goldY = 0;
        let goldMin = 6;
        let goldMax = 8;
        let goldCount = 0;
        let goldTotal = Math.floor(Math.random() * (goldMax + 1 - goldMin) + goldMin);// 有金币的物品数量

        /** 已解锁的物品, 重新开始时，从物品类型会有变化 */
        let goodUnlock: {
            1: [number], 2: [number], 3: [number], 4: [number], 5: [number], 6: [number]
        } = Common.clone(DataManager.data.boxData.goodUnlock);
        let objGood = {};
        let resetKey = (key) => {
            if (!objGood[key]) {
                let first = Math.floor(key * 0.001);
                let unlocks: [number] = goodUnlock[first];
                if (unlocks && unlocks.length > 1) {
                    let mid = Math.floor(unlocks.length * 0.5);
                    let index = Math.random() * (unlocks.length - mid) + mid;
                    let goodKey = goodUnlock[first].splice(index, 1)[0];
                    objGood[key] = goodKey;
                }
                else if (unlocks && unlocks.length == 1) {
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
        let objUnlock = {};
        for (let index = 0, length = this.levelParam.item.length; index < length; index++) {
            let obj = this.levelParam.item[index];
            if (!objUnlock[obj.n]) {
                objUnlock[obj.n] = obj.n;
            }
            let keyGood = isRestart ? resetKey(Number(obj.n)) : Number(obj.n);
            let isGold = false;
            let cfg = this.goodsCfg[keyGood];
            let res = cfg.name;
            let w = cfg.w;
            let h = cfg.h;
            let keyBox = Number(obj.p);
            let dataBox: BoxParam = this.objGame[keyBox];
            let x = obj.x - dataBox.x
            let y = obj.y - h * 0.5 - dataBox.y + 15;
            let first = Math.floor(keyGood * 0.001);
            if (first > 4) {
                y = obj.y - h * 0.5 - dataBox.y;
            }
            else if (dataBox.isFrame) {
                y = 15;
            }
            // 关卡内有金币  物品可以有金币  物品空间高度上间隔两个箱子以上的距离  有金币的物品数量还有剩余
            if (isGolden && ConfigGold[keyGood] && dataBox.y > goldY && goldCount < goldTotal) {
                goldCount++;
                isGold = true;
                Common.log('金币碎片: ' + keyGood + '; res: ' + res + '; 金币计数：', goldCount, '; boxY: ', dataBox.y);
                goldY = dataBox.y + dataBox.h * 2;
            }
            let goodParam: GoodParam = {
                index: index, keyGood: keyGood, nameRes: res, name: 'good_' + index, x: x, y: y, w: w, h: h, isMove: false, 
                gold: { isGold: isGold, count: 0, total: 4 },
                box: { name: dataBox.name, key: keyBox, x: x, y: y },
            };
            dataBox.goods[index] = goodParam;
        }
        // 设置箱子居中
        let xDis = (Math.abs(this.mainRightX) - Math.abs(this.mainLeftX)) * 0.5;
        for (let key in this.objGame) {
            if (Object.prototype.hasOwnProperty.call(this.objGame, key)) {
                let boxParam: BoxParam = this.objGame[key];
                // 删除空箱子
                if (Object.keys(boxParam.goods).length < 1) {
                    delete this.objGame[key];
                }
                // 移动箱子以剧中
                else {
                    boxParam.x -= xDis;
                }
            }
        }

        let isStoreData = false;
        /********************************************** 使用 磁铁 和 时钟 **************************************************/
        // 检测是否有大物品
        let checkIsHaveBig = (objGoods: any) => {
            let keyBig = null;
            for (const key in objGoods) {
                if (Object.prototype.hasOwnProperty.call(objGoods, key)) {
                    let param: GoodParam = objGoods[key];
                    let index = Number(String(param.keyGood).substring(0, 1));
                    if (index > 1) {
                        keyBig = key;
                        break;
                    }
                }
            }
            return keyBig;
        };
        // 新箱子
        let getBoxParam = (boxKey: string, index: number) => {
            let boxParam: BoxParam = Common.clone(this.objGame[boxKey]);
            boxParam.index = index;
            boxParam.name = 'box_' + index;
            boxParam.goods = {};
            return boxParam;
        };
        // 新物品
        let getGoodParam = (keyGood: number, index: number) => {
            let cfg = this.goodsCfg[keyGood];
            let res = cfg.name;
            let goodMegnet: GoodParam = {
                index: index, keyGood: keyGood, nameRes: res, name: 'good_' + index, x: 0, y: 0 + 15, w: cfg.w, h: cfg.h,
                isMove: false, 
                gold: { isGold: false, count: 0, total: 4 },
                box: { name: '', key: 0, x: 0, y: 0 },
            };
            return goodMegnet;
        };
        // 添加新物品
        let addGoodParam = (boxKey: string, goodId: number) => {
            topY += topH;
            topBoxIndex += 1;
            topGoodIndex += 1;

            let boxCur = this.objGame[boxKey];
            // 新箱子
            let boxNew = getBoxParam(boxKey, topBoxIndex);
            this.objGame[topBoxIndex] = boxNew;

            // 新物品
            let goodNew = getGoodParam(goodId, topGoodIndex);

            let bigKey = checkIsHaveBig(boxCur.goods);
            // 有大物品
            if (bigKey) {
                // 新物品替换大物品
                let goodBig: GoodParam = Common.clone(boxCur.goods[bigKey]);
                delete boxCur.goods[bigKey];
                boxCur.goods[topGoodIndex] = goodNew;
                boxCur.goods[topGoodIndex].x = goodBig.x;
                boxCur.goods[topGoodIndex].y = goodBig.y;
                boxCur.goods[topGoodIndex].box = { name: boxCur.name, key: boxCur.index, x: goodBig.x, y: goodBig.y };
                // 大物品转移到新箱子
                boxNew.y = topY;
                boxNew.goods[bigKey] = goodBig;
                boxNew.goods[bigKey].box = { name: boxNew.name, key: boxNew.index, x: goodBig.x, y: goodBig.y };
            }
            // 全是小物品（当前箱子挪到最上边，新箱子取代其位置，新物品放到箱子里）
            else {
                boxNew.y = boxCur.y;
                boxCur.y = topY;
                boxNew.goods[topGoodIndex] = goodNew;
                boxNew.goods[topGoodIndex].box = { name: boxNew.name, key: boxNew.index, x: goodNew.x, y: goodNew.y };
            }
        };
        let arrIdBox = Object.keys(this.objGame);
        arrIdBox = arrIdBox.filter((key) => {
            let obj = this.objGame[key];
            if (frameY > 0) {
                return !this.getBoxIsFrame(Number(obj.h)) && Number(obj.y) > frameY && Object.keys(obj.goods).length > 0;
            }
            else {
                return !this.getBoxIsFrame(Number(obj.h));
            }
        });

        // 使用道具-磁铁
        if (DataManager.useProp(PropType.magnet) < 0) {
            Common.log('道具 磁铁 未使用');
        }
        else {
            Common.log('道具 磁铁 使用');
            isStoreData = true;
            for (let index = 0; index < 3; index++) {
                let boxId = Math.floor(Math.random() * (arrIdBox.length - 1));
                let boxKey = arrIdBox.splice(boxId, 1)[0];
                addGoodParam(boxKey, 9002);
            }
        }

        // 使用道具-时钟
        if (DataManager.useProp(PropType.clock) < 0) {
            Common.log('道具 时钟 未使用');
        }
        else {
            Common.log('道具 时钟 使用');
            isStoreData = true;
            for (let index = 0; index < 3; index++) {
                let boxId = Math.floor(Math.random() * (arrIdBox.length - 1));
                let boxKey = arrIdBox.splice(boxId, 1)[0];
                addGoodParam(boxKey, 9001);
            }
        }
        // 存储数据
        if (isStoreData) {
            DataManager.setData();
        }
    }

    /** 初始化游戏ui */
    initUI() {
        // 保存箱子原始数据（用于返回上一步逻辑中，确认消失箱子的位置）
        this.objGameCopy = Common.clone(this.objGame);

        // 排列
        let arrGame = this.sortArrByXY(Object.values(this.objGame));
        // 计算操作区缩放比例
        this.setMainScale();
        this.nodeMain.scale = this.mainScale;
        // 最下层 y
        this.boxBottomY = arrGame[0].y;

        // 计算最多的一行箱子数量
        let boxInLine = 1;
        for (let index = 1; index < arrGame.length; index++) {
            let boxCur: BoxParam = arrGame[index];
            let boxLast: BoxParam = arrGame[index - 1];
            if (boxCur.y == boxLast.y) {
                boxInLine++;
            }
            else {
                if (boxInLine > this.objData.boxInLine) {
                    this.objData.boxInLine = boxInLine;
                }
                boxInLine = 1;
            }
        }

        // 刷新底部物品数据
        this.bottomParamArr = [];
        this.bottomPosArr = [];
        let arrGoodPos = Common.getArrByName(this.uiBottom.getChildByName('pos'), 'pos');
        for (let index = 0, length = arrGoodPos.length; index < length; index++) {
            this.bottomPosArr.push(arrGoodPos[index].position);
        }

        this.setUILevel();// 设置关卡等级
        this.setUISuipian();// 设置碎片数量
        this.setUITime();// 设置时间
        this.setIceHide();// 设置时间颜色
        this.setUIProcess();// 设置游戏进度
        // 设置道具栏
        this.setUIProp(PropType.ice);
        this.setUIProp(PropType.tip);
        this.setUIProp(PropType.back);
        this.setUIProp(PropType.refresh);
    }

    /** 初始化游戏关卡 */
    initLevel() {
        for (const key in this.objGame) {
            if (Object.prototype.hasOwnProperty.call(this.objGame, key)) {
                const boxParam: BoxParam = this.objGame[key];
                let box = this.addBox(boxParam);
                for (const key in boxParam.goods) {
                    if (!Object.prototype.hasOwnProperty.call(boxParam.goods, key)) {
                        continue;
                    }
                    let goodParam: GoodParam = boxParam.goods[key];
                    this.addGood(box, goodParam);
                }
                box.getComponent(ItemBox).sortGood(true);
            }
        }
    }

    /** 设置关卡等级 */
    setUILevel() {
        let label = this.uiTopLevel.getChildByName('label');
        label.getComponent(cc.Label).string = 'Lv.' + this.objData.level;
    }

    /** 设置碎片数量 */
    setUISuipian() {
        let label = this.uiTopSuipian.getChildByName('label');
        label.getComponent(cc.Label).string = 'x' + this.objData.numSuipian;
    }

    /** 设置时间 */
    setUITime() {
        let m = Math.floor(this.timeGame.count / 60);
        let s = Math.floor(this.timeGame.count % 60);
        let mm = m < 10 ? '0' + m : '' + m;
        let ss = s < 10 ? '0' + s : '' + s;
        this.arrTimeLayer[0].getComponent(cc.Label).string = mm;
        this.arrTimeLayer[1].getComponent(cc.Label).string = ss;
        this.arrTimeLayer[2].getComponent(cc.Label).string = ':';
    }

    /** 设置进度 */
    setUIProcess() {
        let wTotal = 682;
        let bar = this.uiProcess.getChildByName('bar');
        if (this.goodsCount == 0) {
            bar.width = 0;
        }
        else {
            cc.tween(bar).to(0.3, { width: wTotal * this.goodsCount / this.goodsTotal }).start();
        }
        let labelCur = this.uiProcess.getChildByName('labelCur');
        labelCur.getComponent(cc.Label).string = String(this.goodsCount);
        let labelTotal = this.uiProcess.getChildByName('labelTotal');
        labelTotal.getComponent(cc.Label).string = String(this.goodsTotal);
    }

    /** 设置道具栏 */
    setUIProp(type: PropType) {
        let funcProp = (isLock: boolean, prop: cc.Node, count: number) => {
            let button = prop.getChildByName('button');
            let locked = prop.getChildByName('locked');
            let nodeY = prop.getChildByName('nodeY');
            let nodeN = prop.getChildByName('nodeN');
            if (isLock) {
                button.active = false;
                locked.active = true;
                nodeY.active = false;
                nodeN.active = false;
                return;
            }

            button.active = true;
            locked.active = false;
            nodeY.active = true;
            nodeN.active = true;

            if (nodeY && nodeY) {
                if (count > 0) {
                    nodeY.active = true;
                    nodeN.active = false;
                    let itemLabel = nodeY.getChildByName('label');
                    itemLabel.getComponent(cc.Label).string = '' + count;
                }
                else {
                    nodeY.active = false;
                    nodeN.active = true;
                }
            }
        };
        let isLock = false;
        let data = DataManager.data;
        switch (type) {
            case PropType.ice:
                isLock = data.boxData.level < data.prop.ice.unlock;
                funcProp(isLock, this.uiPropIce, DataManager.data.prop.ice.count);
                break;
            case PropType.tip:
                isLock = data.boxData.level < data.prop.tip.unlock;
                funcProp(isLock, this.uiPropTip, DataManager.data.prop.tip.count);
                break;
            case PropType.back:
                isLock = data.boxData.level < data.prop.back.unlock;
                funcProp(isLock, this.uiPropBack, DataManager.data.prop.back.count);
                break;
            case PropType.refresh:
                isLock = data.boxData.level < data.prop.refresh.unlock;
                funcProp(isLock, this.uiPropRefresh, DataManager.data.prop.refresh.count);
                break;
            default:
                break;
        }
    };


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
                this.setIceHide();
            }
            return;
        }

        // 游戏 倒计时
        if (this.timeGame.count > 0) {
            this.timeGame.count--;
            this.setUITime();
            if (this.timeGame.count <= 0) {
                this.playAniGameOver(FinishType.failTime);
            }
        }
    }

    /** 箱子逻辑 */
    cycleBox(dt: number) {
        // 移动判断
        if (!this.speedBox.isMove) {
            return;
        }
        this.speedBox.speedCur += this.speedBox.speedDis;
        if (this.speedBox.speedCur > this.speedBox.speedMax) {
            this.speedBox.speedCur = this.speedBox.speedMax
        }

        let isContinueMove = false;
        let arrGame = this.sortArrByXY(Object.values(this.objGame));
        for (let index = 0, length = arrGame.length; index < length; index++) {
            // 箱子 单个
            let boxParam = arrGame[index];
            if (boxParam.isFrame) {
                continue;
            }
            if (!boxParam.isMove) {
                continue;
            }
            // 最下层
            let box = this.nodeMain.getChildByName(boxParam.name);
            let scriptBox = box.getComponent(ItemBox);
            let yA = boxParam.y - this.speedBox.speedCur;
            if (yA <= this.boxBottomY) {
                boxParam.isMove = false;
                boxParam.y = this.boxBottomY;
                scriptBox.refreshParams(boxParam.y);
                continue;
            }
            // 有碰撞（停止）
            let rectA = this.getBoxRect(boxParam);
            rectA.y = yA;
            let start = index - this.objData.boxInLine * 2;
            let arrBottom = arrGame.slice(start < 0 ? 0 : start, index);
            let objCollider = this.checkBoxCollider(rectA, arrBottom);
            if (objCollider.isCollider) {
                boxParam.isMove = false;
                boxParam.y = objCollider.colliderY;
                scriptBox.refreshParams(boxParam.y);
                continue;
            }
            isContinueMove = true;
            boxParam.y = yA;
            scriptBox.refreshParams(boxParam.y);
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
                let scaleBottom = this.goodScaleBottom[Number(String(goodParam.keyGood).substring(0, 1))];
                if (nodeGood.scale > scaleBottom) {
                    nodeGood.scale -= 0.04;
                }
                else {
                    nodeGood.scale = scaleBottom;
                }
                if (Math.pow(disX, 2) + Math.pow(disY, 2) <= Math.pow(speed, 2)) {
                    goodParam.isMove = false;
                    goodParam.x = pX;
                    goodParam.y = pY;
                    let good = this.uiBottomMain.getChildByName(goodParam.name);
                    good.getComponent(ItemGood).refreshParams(cc.v3(goodParam.x, goodParam.y));
                    nodeGood.scale = scaleBottom;
                    continue;
                }
                else {
                    nodeGood.getComponent(ItemGood).refreshParams(cc.v3(goodParam.x, goodParam.y));
                }
            }
            // 检测物品是否可以消除
            if (this.goodParamsCheck(arrGoodParam)) {
                isContinueMove = true;
                // 播放动画(只播放一次)
                if (this.bottomTime.cur == this.bottomTime.init) {
                    this.playAniRemoveGoods(arrGoodParam);
                }
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
                this.playAniGameOver(FinishType.failSpace);
            }
        }
    }

    /** 获取矩形 */
    getBoxRect(boxParam: BoxParam) {
        let disW = 1;// 宽度 左右减1
        return cc.rect(boxParam.x - boxParam.w * 0.5 + disW, boxParam.y, boxParam.w - disW * 2, boxParam.h);
    };

    // 检测是否有碰撞
    checkBoxCollider(rectA: cc.Rect, arrParam: BoxParam[]) {
        let isCollider = false;
        let colliderY = 0;
        for (let index = 0, length = arrParam.length; index < length; index++) {
            let boxParamB = arrParam[index];
            if (boxParamB.isFrame) {
                continue;
            }
            if (boxParamB.isMove) {
                continue;
            }
            let rectB = this.getBoxRect(boxParamB);
            if (rectA.intersects(rectB)) {
                isCollider = true;
                colliderY = rectB.y + rectB.height;
                break;
            }
        }
        return { isCollider: isCollider, colliderY: colliderY };
    };

    /** 开始移动 箱子 */
    setMoveBox(isMove) {
        if (isMove) {
            for (const key in this.objGame) {
                if (Object.prototype.hasOwnProperty.call(this.objGame, key)) {
                    const element: BoxParam = this.objGame[key];
                    element.isMove = true
                }
            }
            this.speedBox.speedCur = this.speedBox.speedInit;
        }
        this.speedBox.isMove = isMove;
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

    /** 物品上的金色破碎 */
    setGoldPosui() {
        for (let key in this.objGame) {
            if (!Object.prototype.hasOwnProperty.call(this.objGame, key)) {
                continue;
            }
            let boxParam = this.objGame[key];
            if (boxParam.y > this.mainLayer * 181) {
                continue;
            }
            // 特殊箱子 只检测 index 编号最小的
            if (boxParam.isFrame) {
                let goodParams = Object.values(boxParam.goods);
                // 空箱子
                if (goodParams.length <= 0) {
                    continue;
                }
                let arrGoodParam: GoodParam[] = Common.getArrByFunc(goodParams, (a: GoodParam, b: GoodParam) => {
                    return a.index - b.index;
                });
                // 物品上无金色遮罩
                let goodParam = arrGoodParam[0];
                if (!goodParam.gold.isGold) {
                    continue;
                }
                // 物品节点不存在
                let box = this.nodeMain.getChildByName(boxParam.name);
                if (!box) {
                    continue;
                }
                let scriptBox = box.getComponent(ItemBox);
                let good = scriptBox.nodeMain.getChildByName(goodParam.name);
                if (!good) {
                    continue;
                }
                // 遮罩破碎
                let scriptGood = good.getComponent(ItemGood);
                scriptGood.refreshGold();
                // 同步数据
                let key = goodParam.index;
                scriptBox.param.goods[key] = Common.clone(scriptGood.param);
                boxParam = Common.clone(scriptBox.param);
            }
            // 普通箱子
            else {
                for (let key in boxParam.goods) {
                    // 属性不存在
                    if (!Object.prototype.hasOwnProperty.call(boxParam.goods, key)) {
                        continue;
                    }
                    // 物品上无金色遮罩
                    let goodParam: GoodParam = boxParam.goods[key];
                    if (!goodParam.gold.isGold) {
                        continue;
                    }
                    // 物品节点不存在
                    let box = this.nodeMain.getChildByName(boxParam.name);
                    if (!box) {
                        continue;
                    }
                    let scriptBox = box.getComponent(ItemBox);
                    let good = scriptBox.nodeMain.getChildByName(goodParam.name);
                    if (!good) {
                        continue;
                    }
                    // 遮罩破碎
                    let scriptGood = good.getComponent(ItemGood);
                    scriptGood.refreshGold();
                    // 同步数据
                    scriptBox.param.goods[key] = Common.clone(scriptGood.param);
                    boxParam = Common.clone(scriptBox.param);
                }
            }
        }
    };

    /** 设置真实缩放: 先计算适配宽时，能够显示的层级 */
    setMainScale() {
        let layer = (this.levelParam.layer || this.defaultLayer);
        let hBox = this.boxH * layer;
        let hMain = cc.winSize.height * 0.5 - this.nodeMain.y - this.uiMask.height;
        let scaleByH = hMain / hBox;

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
        this.mainLayer = hMain / (this.boxH * this.mainScale);
    };

    /** 检测特殊箱子 */
    getBoxIsFrame(h: number) {
        return h < 100;
    };

    /** 重新排列箱子数据 */
    sortArrByXY(boxParams: BoxParam[]): BoxParam[] {
        boxParams.sort((a: BoxParam, b: BoxParam) => {
            let aTop = a.y + a.h;
            let bTop = b.y + b.h;
            if (aTop == bTop) {
                return a.x - b.x;
            }
            else {
                return aTop - bTop;
            }
        });
        return boxParams;
    };

    /** 点击事件 */
    eventTouchGood(good: cc.Node) {
        let scriptGood = good.getComponent(ItemGood);
        // 游戏不能继续
        if (this.isLock || this.getBottomGoodNum() > this.bottomMax - 1) {
            scriptGood.state = 0;
            return;
        }

        // 使用道具 时钟
        if (scriptGood.param.keyGood == 9001) {
            if (this.speedBox.isMove || this.speedGood.isMove) {
                scriptGood.state = 0;
                return;
            }
            this.usePropClock(good);
            return;
        }

        // 使用道具 磁铁
        if (scriptGood.param.keyGood == 9002) {
            if (this.speedBox.isMove || this.speedGood.isMove) {
                scriptGood.state = 0;
                return;
            }
            this.usePropMagnet(good);
            return;
        }

        this.eventTouchAfter([scriptGood.param]);
    }

    eventTouchAfter(arrGoodParam: GoodParam[]) {
        kit.Audio.playEffect(CConst.sound_clickGood);
        for (let index = 0, length = arrGoodParam.length; index < length; index++) {
            this.refreshOperationArea(arrGoodParam[index])
        }
        this.setMoveGood(true);
        this.setMoveBox(true);
        this.setGoldPosui();
    }

    /** 经验事件效果反馈 */
    effectExpShow(point: cc.Vec3) {
        let main = this.effectExp.getChildByName('main');
        let itemDragon = this.effectExp.getChildByName('dragon');
        let itemExp = DataManager.poolGet(itemDragon, DataManager.objPool.effectExp);
        itemExp.parent = main;
        itemExp.scale = 0.6;
        itemExp.active = true;
        itemExp.position = point;
        let dragon = itemExp.getComponent(dragonBones.ArmatureDisplay)
        dragon.playAnimation('yundong', 0);
        let pGoal = Common.getLocalPos(this.uiProcess.parent, this.uiProcess.position, main);
        let obj = {
            p1: cc.v2(point.x, point.y),
            p2: cc.v2(pGoal.x, (point.y + pGoal.y) * 0.5),
            pTo: cc.v2(pGoal.x, pGoal.y),
        };
        let time1 = Common.getMoveTime(cc.v3(obj.p1.x, obj.p1.y), cc.v3(obj.p2.x, obj.p2.y), 1, 1000);
        let time2 = Common.getMoveTime(cc.v3(obj.p2.x, obj.p2.y), cc.v3(obj.pTo.x, obj.pTo.y), 1, 1000);
        let tDelay = (main.childrenCount - 1) * 0.15;
        itemExp.opacity = 0;
        cc.Tween.stopAllByTarget(itemExp);
        cc.tween(itemExp).delay(tDelay).call(() => {
            itemExp.opacity = 255;
        }).bezierTo(time1 + time2, obj.p1, obj.p2, obj.pTo).call(() => {
            DataManager.poolPut(itemExp, DataManager.objPool.effectExp);
        }).start();
    }

    /** 点击事件效果反馈 */
    eventTouchShow(event: cc.Event.EventTouch) {
        var pos = event.getLocation();
        let main = this.effectTouch.getChildByName('main');
        let itemDragon = this.effectTouch.getChildByName('dragon');
        let itemTouch = DataManager.poolGet(itemDragon, DataManager.objPool.effectTouch);
        itemTouch.parent = main;
        itemTouch.active = true;
        itemTouch.scale = 0.5;
        itemTouch.position = main.convertToNodeSpaceAR(cc.v3(pos.x, pos.y));
        let dragon = itemTouch.getComponent(dragonBones.ArmatureDisplay)
        dragon.once(dragonBones.EventObject.COMPLETE, () => {
            DataManager.poolPut(itemTouch, DataManager.objPool.effectTouch);
        })
        dragon.timeScale = 1.3;
        dragon.playAnimation('yundong', 1);
    }

    /** 刷新操作区 */
    refreshOperationArea(goodParam: GoodParam) {
        // 箱子
        let box = this.nodeMain.getChildByName(goodParam.box.name);
        let scriptBox = box.getComponent(ItemBox);
        // 物品
        let good = scriptBox.nodeMain.getChildByName(goodParam.name);
        let scriptGood = good.getComponent(ItemGood);

        let pStart = Common.getLocalPos(good.parent, good.position, this.uiBottomMain);
        good.parent = this.uiBottomMain;
        good.scale = this.mainScale;
        good.active = true;
        scriptGood.refreshParams(pStart);
        this.playAniSuipian(good);
        this.goodParamsInsert(scriptGood.param);
        // 删除物品数据
        this.removeGoodParam(goodParam);
        scriptBox.sortGood();
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

    /** 移除物品 */
    goodParamsRemove(arrParam: GoodParam[], arrIndex: number) {
        for (let index = 0, length = arrParam.length; index < length; index++) {
            let param = arrParam[index];
            let good = this.uiBottomMain.getChildByName(param.name);
            DataManager.poolPut(good, DataManager.objPool.good);
        }
        this.bottomParamArr.splice(arrIndex, 1);
        this.goodsCount += arrParam.length;
        if (this.goodsCount >= this.goodsTotal) {
            this.goodsCount = this.goodsTotal;
            this.playAniGameOver(FinishType.win);
        }
        this.setUIProcess();
    }

    /** 物品继续移动 */
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
            for (let j = boxMain.childrenCount - 1; j >= 0; j--) {
                let good = boxMain.children[j];
                DataManager.poolPut(good, DataManager.objPool.good);
            }
            DataManager.poolPut(box, DataManager.objPool.box);
        }
        for (let index = this.uiBottomMain.childrenCount - 1; index >= 0; index--) {
            let good = this.uiBottomMain.children[index];
            DataManager.poolPut(good, DataManager.objPool.good);
        }
        this.timeProp.iceCount = 0;
        this.setIceHide();
    }

    /** 按钮事件 设置 */
    eventBtnSetting() {
        // 锁定 或 物品移动过程中，不触发道具
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }

        kit.Audio.playEffect(CConst.sound_clickUI);
        this.gamePause();
        kit.Popup.show(CConst.popup_path_settingGame, {}, { mode: PopupCacheMode.Frequent });
    }

    /** 道具 按钮事件 时间冻结 */
    eventBtnTimeIce() {
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);

        // 使用道具-冰冻
        let propNum = DataManager.useProp(PropType.ice);
        if (propNum < 0) {
            let coin = DataManager.data.numCoin;
            let need = 50;
            // 进入购买金币
            if (coin < need) {
                kit.Popup.show(CConst.popup_path_getCoins, { isGoShop: true }, { mode: PopupCacheMode.Frequent, });
                return;
            }
            else {
                DataManager.data.numCoin -= need;
                NativeCall.logEventTwo(ConfigDot.dot_buy_succ_ice, String(this.objData.level));
            }
        }
        DataManager.setData();

        // 更新ui
        this.setUIProp(PropType.ice);
        this.setIceShow();

        // 道具逻辑
        this.timeProp.iceCount += this.timeProp.iceTotal;
    }

    /** 道具 按钮事件 提示 */
    eventBtnTip() {
        // 锁定 或 物品移动过程中，不触发道具
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);

        // 使用道具-提示
        let propNum = DataManager.useProp(PropType.tip);
        if (propNum < 0) {
            let coin = DataManager.data.numCoin;
            let need = 50;
            // 进入购买金币
            if (coin < need) {
                kit.Popup.show(CConst.popup_path_getCoins, { isGoShop: true }, { mode: PopupCacheMode.Frequent, });
                return;
            }
            else {
                DataManager.data.numCoin -= need;
                NativeCall.logEventTwo(ConfigDot.dot_buy_succ_tip, String(this.objData.level));
            }
        }
        DataManager.setData();
        // 更新ui
        this.setUIProp(PropType.tip);

        // 道具逻辑
        let needNum = 3;
        let keyGood = 0;
        let arrPropElse = [9001, 9002];
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
                kit.Event.emit(CConst.event_notice, LangChars.notice_canotBeUse);
                return;
            }
        }
        else {
            for (const keyA in this.objGame) {
                if (!Object.prototype.hasOwnProperty.call(this.objGame, keyA)) {
                    continue;
                }
                const boxParam: BoxParam = this.objGame[keyA];
                for (const keyB in boxParam.goods) {
                    if (!Object.prototype.hasOwnProperty.call(boxParam.goods, keyB)) {
                        continue;
                    }
                    const goodParam: GoodParam = boxParam.goods[keyB];
                    if (arrPropElse.indexOf(goodParam.keyGood) < 0) {
                        keyGood = goodParam.keyGood;
                        break;
                    }
                }
                if (keyGood != 0) {
                    break;
                }
            }
            if (keyGood == 0) {
                this.isLock = false;
                return;
            }
        }

        let isEnough: boolean = false;
        let arrChose: GoodParam[] = [];
        for (const keyA in this.objGame) {
            if (!Object.prototype.hasOwnProperty.call(this.objGame, keyA)) {
                continue;
            }
            const boxParam: BoxParam = this.objGame[keyA];
            for (const keyB in boxParam.goods) {
                if (!Object.prototype.hasOwnProperty.call(boxParam.goods, keyB)) {
                    continue;
                }
                const goodParam: GoodParam = boxParam.goods[keyB];
                if (goodParam.keyGood != keyGood) {
                    continue;
                }
                arrChose.push(goodParam);
                if (arrChose.length > needNum - 1) {
                    isEnough = true;
                    break;
                }
            }
            if (isEnough) {
                break;
            }
        }
        this.eventTouchAfter(arrChose);
    }

    /** 道具 按钮事件 上一步 */
    eventBtnBack() {
        // 锁定 或 物品移动过程中，不触发道具
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);

        let numGoodArr = this.bottomParamArr.length;
        // 没有物品
        if (numGoodArr <= 0) {
            kit.Event.emit(CConst.event_notice, LangChars.notice_canotBeUse);
            return;
        }

        // 使用道具-返回上一步
        let propNum = DataManager.useProp(PropType.back);
        if (propNum < 0) {
            let coin = DataManager.data.numCoin;
            let need = 30;
            // 进入购买金币
            if (coin < need) {
                kit.Popup.show(CConst.popup_path_getCoins, { isGoShop: true }, { mode: PopupCacheMode.Frequent, });
                return;
            }
            else {
                DataManager.data.numCoin -= need;
                NativeCall.logEventTwo(ConfigDot.dot_buy_succ_back, String(this.objData.level));
            }
        }
        DataManager.setData();

        // 更新ui
        this.setUIProp(PropType.back);

        // 道具逻辑
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
                scriptBox.sortGood();
                good.getComponent(ItemGood).resetParams(goodParam);
                this.objGame[scriptBox.param.index] = Common.clone(scriptBox.param);

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

            // 拿到原箱子
            let boxParamNew: BoxParam = Common.clone(this.objGameCopy[goodParam.box.key]);
            boxParamNew.goods = {};
            this.addBox(boxParamNew);
            this.objGame[boxParamNew.index] = boxParamNew;
            for (const key in this.objGame) {
                if (!Object.prototype.hasOwnProperty.call(this.objGame, key)) {
                    continue;
                }
                const boxParam: BoxParam = this.objGame[key];
                boxParam.y = this.objGameCopy[boxParam.index].y;
            }

            // 重置箱子位置
            let arrGame = this.sortArrByXY(Object.values(this.objGame));
            for (let index = 0, length = arrGame.length; index < length; index++) {
                let boxParam = arrGame[index];
                // 框不移动
                if (boxParam.isFrame) {
                    continue;
                }
                if (index == 0) {
                    boxParam.y = 0;
                }
                else {
                    boxParam.y = this.getBoxPositionY(boxParam, this.sortArrByXY(arrGame.slice(0, index)));
                }
                let box = this.nodeMain.getChildByName(boxParam.name);
                let y1 = box.y;
                let y2 = boxParam.y;
                let timeY = 0.15;
                if (boxParam.index == boxParamNew.index) {
                    box.y = y2;
                    // 箱子高度变化+物品移动
                    let boxH = boxParam.h;
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
                            this.objGame[scriptBox.param.index] = Common.clone(scriptBox.param);

                            this.isLock = false;
                        }).start();
                    }).start();
                }
                else {
                    box.y = y1;
                    cc.tween(box).to(timeY, { y: y2 }).call(() => {
                        box.getComponent(ItemBox).refreshParams(boxParam.y);
                    }).start();
                }
            }
        }
    }

    /** 道具 按钮事件 刷新 */
    eventBtnRefresh() {
        // 锁定 或 物品移动过程中，不触发道具
        if (this.isLock || this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);

        // 使用道具-刷新
        let propNum = DataManager.useProp(PropType.refresh);
        if (propNum < 0) {
            let coin = DataManager.data.numCoin;
            let need = 20;
            // 进入购买金币
            if (coin < need) {
                kit.Popup.show(CConst.popup_path_getCoins, { isGoShop: true }, { mode: PopupCacheMode.Frequent, });
                return;
            }
            else {
                DataManager.data.numCoin -= need;
                NativeCall.logEventTwo(ConfigDot.dot_buy_succ_refresh, String(this.objData.level));
            }
        }
        DataManager.setData();

        // 刷新ui
        this.setUIProp(PropType.refresh);

        // 道具逻辑
        this.isLock = true;
        /*****************************************************组合物品数组*************************************************************/
        let objParamGood = {};
        for (const keyA in this.objGame) {
            if (!Object.prototype.hasOwnProperty.call(this.objGame, keyA)) {
                continue;
            }
            const boxParam: BoxParam = this.objGame[keyA];
            for (const keyB in boxParam.goods) {
                if (!Object.prototype.hasOwnProperty.call(boxParam.goods, keyB)) {
                    continue;
                }
                const goodParam: GoodParam = boxParam.goods[keyB];
                let key = Math.floor(Number(goodParam.keyGood) * 0.001);
                if (objParamGood[key]) {
                    objParamGood[key].push(goodParam);
                }
                else {
                    objParamGood[key] = [goodParam];
                }
            }
        }
        let objParamCopy = Common.clone(objParamGood);
        for (const key in objParamCopy) {
            if (!Object.prototype.hasOwnProperty.call(objParamCopy, key)) {
                continue;
            }
            let arrParams: GoodParam[] = objParamCopy[key];
            let i = arrParams.length - 1;
            while (i > 1) {
                let j = Math.floor(Math.random() * i);
                let temp = arrParams[i];
                arrParams[i] = arrParams[j];
                arrParams[j] = temp;
                i--;
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
                goodParamA.gold = goodParamB.gold;
                let box = this.nodeMain.getChildByName(goodParamA.box.name);
                let scriptBox = box.getComponent(ItemBox);
                let good = scriptBox.nodeMain.getChildByName(goodParamA.name);
                if (good) {
                    let scriptGood = good.getComponent(ItemGood);
                    scriptGood.refreshRes(goodParamA);
                    scriptBox.param.goods[goodParamA.index] = goodParamA;
                    this.objGame[scriptBox.param.index] = scriptBox.param;
                }
            }
        };
        for (const keyA in objParamGood) {
            if (!Object.prototype.hasOwnProperty.call(objParamGood, keyA)) {
                continue;
            }
            voluationArr( objParamGood[keyA], objParamCopy[keyA]);
        }

        /** 延时解锁 */
        this.scheduleOnce(() => { this.isLock = false; }, 0.75);
    }

    /** 按钮事件 上一关 */
    eventBtnLevelBack() {
        if (this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        if (this.objData.level < 2) {
            return;
        }
        DataManager.data.challengeData.level--;
        DataManager.setData();

        this.gameLoad();
        this.gameStart();
    }

    /** 按钮事件 下一关 */
    eventBtnLevelNext() {
        if (this.speedBox.isMove || this.speedGood.isMove) {
            return;
        }
        DataManager.data.challengeData.level++;
        DataManager.setData();

        this.gameLoad();
        this.gameStart();
    }

    /** 使用道具-时钟 */
    usePropClock(good: cc.Node) {
        if (this.isLock) {
            return;
        }

        kit.Audio.playEffect(CConst.sound_clickUI);

        let goodParam = Common.clone(good.getComponent(ItemGood).param);
        let p1 = Common.getLocalPos(good.parent, good.position, this.node);
        let p2 = Common.getLocalPos(this.uiTopTime.parent, this.uiTopTime.position, this.node);
        p2.y -= goodParam.h * 0.5 * this.mainScale;
        let time = Common.getMoveTime(p1, p2, 1, 1500);
        let obj = {
            p1: cc.v2(p1.x, p1.y),
            p2: cc.v2(p2.x, p1.y),
            pTo: cc.v2(p2.x, p2.y),
        };
        good.parent = this.node;
        good.position = p1;

        // 删除物品数据
        this.removeGoodParam(goodParam);

        // ui移动
        cc.tween(good).bezierTo(time, obj.p1, obj.p2, obj.pTo).call(() => {
            DataManager.poolPut(good, DataManager.objPool.good);
            cc.tween(this.uiTopTime).to(0.1, { scale: 1.1 }).call(() => {
                // 道具逻辑
                this.timeGame.count += this.timeProp.addTotal;
                this.setUITime();
            }).to(0.15, { scale: 1.0 }).start();
        }).start();

        this.setMoveGood(true);
        this.setGoldPosui();
        this.setMoveBox(true);
    }

    /** 使用道具-磁铁 */
    usePropMagnet(good: cc.Node) {
        if (this.isLock) {
            return;
        }
        this.isLock = true;

        kit.Audio.playEffect(CConst.sound_clickUI);

        let removeBottomGood = (node: cc.Node, parent: cc.Node) => {
            // 复制新节点 添加到 父节点上
            let p1 = Common.getLocalPos(node.parent, node.position, parent);
            let bottomGood = cc.instantiate(node);
            bottomGood.position = p1;
            bottomGood.getComponent(ItemGood).param = Common.clone(node.getComponent(ItemGood).param);
            bottomGood.parent = parent;
            return bottomGood;
        };

        // 删除磁铁
        let timeMagnet = 0.25;
        let timeMove = 0.25;
        let uiMagnet = this.node.getChildByName('uiMagnet');
        uiMagnet.active = true;
        uiMagnet.x = 0;
        let magnetIcon = uiMagnet.getChildByName('icon');
        magnetIcon.x = -cc.winSize.width * 0.6;
        magnetIcon.active = true;
        cc.tween(magnetIcon).to(timeMagnet, { x: 0 }).start();
        let magnetMain = uiMagnet.getChildByName('main');
        magnetMain.active = true;
        magnetMain.x = 0;

        let needKey = 0;
        let needNum = 3;
        let bottomNum = 0;
        let arrGoods: cc.Node[] = [];
        if (this.bottomParamArr.length > 0) {
            let arrParam = this.bottomParamArr.pop();
            needKey = arrParam[0].keyGood;
            bottomNum = arrParam.length;
            for (let index = 0, length = arrParam.length; index < length; index++) {
                let goodParam = arrParam[index];
                let good = this.uiBottomMain.getChildByName(goodParam.name);
                let bottomGood = removeBottomGood(good, magnetMain);
                DataManager.poolPut(good, DataManager.objPool.good);
                arrGoods.push(bottomGood);
            }
            let enough = false;
            let midNum = needNum - bottomNum;
            let arrSign: { keyA: string, keyB: string }[] = [];
            for (const keyA in this.objGame) {
                if (!Object.prototype.hasOwnProperty.call(this.objGame, keyA)) {
                    continue;
                }
                const boxParam: BoxParam = this.objGame[keyA];
                for (const keyB in boxParam.goods) {
                    if (!Object.prototype.hasOwnProperty.call(boxParam.goods, keyB)) {
                        continue;
                    }
                    let goodParam: GoodParam = boxParam.goods[keyB];
                    if (goodParam.keyGood == needKey) {
                        arrSign.push({ keyA: keyA, keyB: keyB });
                        enough = arrSign.length >= midNum;
                        if (enough) {
                            break;
                        }
                    }
                }
                if (enough) {
                    break;
                }
            }
            for (let index = arrSign.length - 1; index >= 0; index--) {
                let midGood = this.removeMidParam(arrSign[index].keyA, arrSign[index].keyB, magnetMain);
                arrGoods.push(midGood);
            }
        }
        else {
            let enough = false;
            let midNum = 3;
            let arrSign: { keyA: string, keyB: string }[] = [];
            let specialKey = [9001, 9002];
            for (const keyA in this.objGame) {
                if (!Object.prototype.hasOwnProperty.call(this.objGame, keyA)) {
                    continue;
                }
                const boxParam: BoxParam = this.objGame[keyA];
                for (const keyB in boxParam.goods) {
                    if (Object.prototype.hasOwnProperty.call(boxParam.goods, keyB)) {
                        continue;
                    }
                    const goodParam: GoodParam = boxParam.goods[keyB];
                    if (needKey <= 0 && specialKey.indexOf(goodParam.keyGood) < 0) {
                        needKey = goodParam.keyGood;
                    }
                    if (goodParam.keyGood == needKey) {
                        arrSign.push({ keyA: keyA, keyB: keyB });
                        enough = arrSign.length >= midNum;
                        if (enough) {
                            break;
                        }
                    }
                }
                if (enough) {
                    break;
                }
            }
            for (let index = arrSign.length - 1; index >= 0; index--) {
                let midGood = this.removeMidParam(arrSign[index].keyA, arrSign[index].keyB, magnetMain);
                arrGoods.push(midGood);
            }
        }

        // 移除物品
        let scriptGood = good.getComponent(ItemGood);
        let goodParam: GoodParam = Common.clone(scriptGood.param);
        // 移除物品ui
        good.removeFromParent();
        // 移除物品数据
        this.removeGoodParam(goodParam);

        // 物品移动
        let effectExpMain = this.effectExp.getChildByName('main');
        arrGoods.forEach((good, index) => {
            good.active = true;
            let scale = 1.0;
            let script = good.getComponent(ItemGood);
            let first = Math.floor(script.param.keyGood * 0.001);
            if (first == 2) {
                scale = 0.9;
            }
            else if (first == 3) {
                scale = 0.85;
            }
            else if (first == 4) {
                scale = 0.8;
            }
            let x = 0;
            if (index % 3 == 0) {
                x = -25 + Math.random() * 20 - 10;
            }
            else if (index % 3 == 2) {
                x = 25 + Math.random() * 20 - 10;
            }
            let y = index % 3 == 1 ? 10 : -10;
            let angle = Math.random() * 30 - 15;
            cc.tween(good).parallel(
                cc.tween().to(timeMove, { position: cc.v3(x, y) }),
                cc.tween().to(timeMove, { angle: angle }),
                cc.tween().to(timeMove, { scale: scale }),
            ).delay(0.55).call(() => {
                let point = Common.getLocalPos(good.parent, good.position, effectExpMain);
                this.effectExpShow(cc.v3(point.x, point.y));
            }).start();
        });

        uiMagnet.active = true;
        uiMagnet.position = cc.v3();
        cc.tween(uiMagnet).delay(1.0)
            .to(0.1, { x: -cc.winSize.width * 0.1 }, cc.easeSineOut())
            .to(0.35, { x: cc.winSize.width * 0.6 }, cc.easeSineIn()).call(() => {
                uiMagnet.active = false;
                uiMagnet.position = cc.v3();
                magnetMain.removeAllChildren();

                // 更新ui
                this.isLock = false;
                this.goodsCount += 3;
                if (this.goodsCount >= this.goodsTotal) {
                    this.goodsCount = this.goodsTotal;
                    this.playAniGameOver(FinishType.win);
                }
                this.setUIProcess();
            }).start();

        this.setMoveGood(true);
        this.setGoldPosui();
        this.setMoveBox(true);
    }

    /** 使用道具-连胜 */
    usePropWins() {
        if (this.isLock) {
            return;
        }
        let wins = DataManager.data.wins.count - DataManager.data.wins.start;
        if (wins < 1) {
            return;
        }
        this.isLock = true;

        kit.Audio.playEffect(CConst.sound_clickUI);

        // 删除磁铁
        let timeMagnet = 0.25;
        let timeMove = 0.25;
        let uiMagnet = this.node.getChildByName('uiMagnet');
        uiMagnet.active = true;
        uiMagnet.x = 0;
        let magnetIcon = uiMagnet.getChildByName('icon');
        magnetIcon.x = -cc.winSize.width * 0.6;
        magnetIcon.active = true;
        cc.tween(magnetIcon).to(timeMagnet, { x: 0 }).start();
        let magnetMain = uiMagnet.getChildByName('main');
        magnetMain.active = true;
        magnetMain.x = 0;

        let arrGoods: cc.Node[] = [];
        let specialKey = [9001, 9002];
        let moveGroup = () => {
            let enough = false;
            let needKey = 0;
            let arrSign: { keyA: string, keyB: string }[] = [];
            for (const keyA in this.objGame) {
                if (!Object.prototype.hasOwnProperty.call(this.objGame, keyA)) {
                    continue;
                }
                const boxParam: BoxParam = this.objGame[keyA];
                for (const keyB in boxParam.goods) {
                    if (Object.prototype.hasOwnProperty.call(boxParam.goods, keyB)) {
                        continue;
                    }
                    let goodParam: GoodParam = boxParam.goods[keyB];
                    if (needKey <= 0 && specialKey.indexOf(goodParam.keyGood) < 0) {
                        needKey = goodParam.keyGood;
                    }
                    if (goodParam.keyGood == needKey) {
                        arrSign.push({ keyA: keyA, keyB: keyB });
                        enough = arrSign.length >= 3;
                        if (enough) {
                            break;
                        }
                    }
                }
                if (enough) {
                    break;
                }
            }
            for (let index = arrSign.length - 1; index >= 0; index--) {
                let midGood = this.removeMidParam(arrSign[index].keyA, arrSign[index].keyB, magnetMain);
                arrGoods.push(midGood);
            }
        };
        for (let index = 0; index < wins; index++) {
            moveGroup();
        }
        Common.log('道具 磁铁 连胜 wins: ', wins, '; goods: ', arrGoods.length);
        // 移动物品
        let effectExpMain = this.effectExp.getChildByName('main');
        arrGoods.forEach((good, index) => {
            good.active = true;
            let scale = 1.0;
            let script = good.getComponent(ItemGood);
            let first = Math.floor(script.param.keyGood * 0.001);
            if (first == 2) {
                scale = 0.9;
            }
            else if (first == 3) {
                scale = 0.85;
            }
            else if (first == 4) {
                scale = 0.8;
            }
            let x = Math.random() * 20 - 10;
            if (index % 3 == 0) {
                x = -25 + Math.random() * 20 - 10;
            }
            else if (index % 3 == 2) {
                x = 25 + Math.random() * 20 - 10;
            }
            let y = index % 3 == 1 ? 10 : -10;
            let angle = Math.random() * 30 - 15;
            cc.tween(good).parallel(
                cc.tween().to(timeMove, { position: cc.v3(x, y) }),
                cc.tween().to(timeMove, { angle: angle }),
                cc.tween().to(timeMove, { scale: scale }),
            ).delay(0.55).call(() => {
                let point = Common.getLocalPos(good.parent, good.position, effectExpMain);
                this.effectExpShow(cc.v3(point.x, point.y));
            }).start();
        });

        uiMagnet.active = true;
        uiMagnet.position = cc.v3();
        cc.tween(uiMagnet).delay(1.0)
            .to(0.1, { x: -cc.winSize.width * 0.1 }, cc.easeSineOut())
            .to(0.35, { x: cc.winSize.width * 0.6 }, cc.easeSineIn()).call(() => {
                uiMagnet.active = false;
                uiMagnet.position = cc.v3();
                magnetMain.removeAllChildren();

                // 更新ui
                this.isLock = false;
                this.goodsCount += 3 * wins;
                this.setUIProcess();
            }).start();

        this.setMoveGood(true);
        this.setMoveBox(true);
    }

    removeMidParam(keyA: string, keyB: string, parent: cc.Node) {
        let boxParam = this.objGame[keyA];
        let box = this.nodeMain.getChildByName(boxParam.name);
        let boxScript = box.getComponent(ItemBox);
        let good = boxScript.nodeMain.getChildByName(boxParam.goods[keyB].name);
        let goodScript = good.getComponent(ItemGood);
        let goodParam = Common.clone(goodScript.param);
        this.playAniSuipian(good);

        let p1 = Common.getLocalPos(good.parent, good.position, parent);
        let copyNode: cc.Node = null;
        copyNode = cc.instantiate(good);
        copyNode.position = p1;
        copyNode.getComponent(ItemGood).param = Common.clone(good.getComponent(ItemGood).param);
        copyNode.parent = parent;

        // 删除物品ui
        DataManager.poolPut(good, DataManager.objPool.good);
        // 删除物品数据
        this.removeGoodParam(goodParam);
        // 特殊箱子 重新排布
        boxScript.sortGood();
        return copyNode;
    };

    /** 道具 按钮事件 上一步 */
    returnGoods(): Promise<void> {
        return new Promise((res) => {
            let numGoodArr = this.bottomParamArr.length;
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
                    scriptBox.sortGood();
                    good.getComponent(ItemGood).resetParams(goodParam);
                    this.objGame[scriptBox.param.index] = Common.clone(scriptBox.param);

                    res();
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

                // 拿到原箱子
                let boxParamNew: BoxParam = Common.clone(this.objGameCopy[goodParam.box.key]);
                boxParamNew.goods = {};
                this.addBox(boxParamNew);
                this.objGame[boxParamNew.index] = boxParamNew;
                for (const key in this.objGame) {
                    if (!Object.prototype.hasOwnProperty.call(this.objGame, key)) {
                        continue;
                    }
                    const boxParam: BoxParam = this.objGame[key];
                    boxParam.y = this.objGameCopy[boxParam.index].y;
                }

                // 重置箱子位置
                let arrGame = this.sortArrByXY(Object.values(this.objGame));
                for (let index = 0, length = arrGame.length; index < length; index++) {
                    let boxParam = arrGame[index];
                    // 框不移动
                    if (boxParam.isFrame) {
                        continue;
                    }
                    if (index == 0) {
                        boxParam.y = 0;
                    }
                    else {
                        boxParam.y = this.getBoxPositionY(boxParam, this.sortArrByXY(arrGame.slice(0, index)));
                    }
                    let box = this.nodeMain.getChildByName(boxParam.name);
                    let y1 = box.y;
                    let y2 = boxParam.y;
                    let timeY = 0.15;
                    if (boxParam.index == boxParamNew.index) {
                        box.y = y2;
                        // 箱子高度变化+物品移动
                        let boxH = boxParamNew.h;
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
                                this.objGame[scriptBox.param.index] = Common.clone(scriptBox.param);

                                res();
                            }).start();
                        }).start();
                    }
                    else {
                        box.y = y1;
                        cc.tween(box).to(timeY, { y: y2 }).call(() => {
                            box.getComponent(ItemBox).refreshParams(boxParam.y);
                        }).start();
                    }
                }
            }
        });
    }

    getBoxPositionY(boxParam: BoxParam, arrBottom: BoxParam[]) {
        let boxY = 0;
        let disX = 1;
        let a1 = boxParam.x - boxParam.w * 0.5 + disX * 0.5;
        let a2 = boxParam.x + boxParam.w * 0.5 - disX * 0.5;
        let key = -1;
        if (boxParam.index == key) {
            console.log('a key: ', key, '; a1: ', a1, '; a2: ', a2);
        }
        for (let index = arrBottom.length - 1; index >= 0; index--) {
            let boxParamB = arrBottom[index];
            if (boxParamB.isFrame) {
                continue;
            }
            let b1 = boxParamB.x - boxParamB.w * 0.5 + disX * 0.5;
            let b2 = boxParamB.x + boxParamB.w * 0.5 - disX * 0.5;
            if (a1 <= b2 && b2 <= a2 || a1 <= b1 && b1 <= a2 || a1 >= b1 && a2 <= b2) {
                boxY = boxParamB.y + boxParamB.h;
                if (boxParam.index == key) {
                    console.log('c key: ', boxParamB.index, '; b1: ', b1, '; b2: ', b2);
                }
                break;
            }
            else {
                if (boxParam.index == key) {
                    console.log('b key: ', boxParamB.index, '; b1: ', b1, '; b2: ', b2);
                }
            }
        }
        return boxY;
    };

    setIceShow() {
        let itemTime = this.uiTop.getChildByName('time');
        let itemIce = itemTime.getChildByName('ice');
        itemIce.active = true;
        this.effectIce.active = true;
    }

    setIceHide() {
        let itemTime = this.uiTop.getChildByName('time');
        let itemIce = itemTime.getChildByName('ice');
        itemIce.active = false;
        this.effectIce.active = false;
    }

    setIsLock(isLock) {
        this.isLock = isLock;
    }

    /** 播放动画（游戏显隐） */
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

    /** 播放动画（新增碎片） */
    playAniSuipian(good: cc.Node) {
        let scriptGood = good.getComponent(ItemGood);
        if (scriptGood.param.gold.isGold) {
            this.objData.numSuipian++;
            DataManager.setData();

            // 碎片开始移动
            let nodeParent = this.node.getChildByName('uiElse');
            let suipian = this.uiTopSuipian.getChildByName('icon');
            let copy = cc.instantiate(suipian);
            copy.parent = nodeParent;
            copy.position = cc.v3();
            let pGood = cc.v3(good.x, good.y + scriptGood.param.h * 0.4 * this.mainScale);
            copy.position = Common.getLocalPos(good.parent, pGood, copy.parent);
            let p1 = cc.v3(copy.x, copy.y - 50);
            let p2 = Common.getLocalPos(suipian.parent, suipian.position, copy.parent);
            let obj = {
                p1: cc.v2(p1.x, p1.y),
                p2: cc.v2(p2.x, p1.y),
                pTo: cc.v2(p2.x, p2.y),
                time: Common.getMoveTime(p1, p2, 1, 2000),
                scale: copy.scale,
            };
            copy.scale = obj.scale * 0.75;
            cc.tween(copy).to(0.25, { position: p1 }, cc.easeSineInOut()).parallel(
                cc.tween().bezierTo(obj.time, obj.p1, obj.p2, obj.pTo),
                cc.tween().to(obj.time * 0.4, { scale: obj.scale }),
            ).call(() => {
                copy.removeFromParent(true);
                this.setUISuipian();
            }).start();
        }
        scriptGood.hideGold();
    };

    /** 播放动画（移动物品） */
    playAniRemoveGoods(arrGoodParam: GoodParam[]) {
        // 1 设置粒子动画
        this.uiParticle.active = true;
        this.uiParticle.position = this.uiBottom.position;
        let main = this.uiParticle.getChildByName('main');
        main.removeAllChildren(true);
        let xing = this.uiParticle.getChildByName('xing');
        xing.active = false;
        let yezi = this.uiParticle.getChildByName('yezi');
        yezi.active = false;

        // 2 中间物品复制
        let goodParam = arrGoodParam[1];
        let good = this.uiBottomMain.getChildByName(goodParam.name);
        good.active = false;
        let goodMid = cc.instantiate(good);
        goodMid.parent = main;
        goodMid.active = true;
        goodMid.position = good.position;
        goodMid.zIndex = 1;

        // 3 设置粒子位置
        let pGoal = Common.getLocalPos(goodMid.parent, goodMid.position, this.uiParticle)
        xing.position = pGoal;
        xing.y += 30;
        yezi.position = pGoal;
        yezi.y += 30;

        // 5 播放粒子特效 并 延时移除复制的物品
        let funcHide = () => {
            kit.Audio.playEffect(CConst.sound_removeGood);
            xing.active = true;
            xing.getComponent(cc.ParticleSystem).resetSystem();
            yezi.active = true;
            yezi.getComponent(cc.ParticleSystem).resetSystem();
            cc.tween(main).to(0.1, { opacity: 0 }).call(() => {
                main.removeAllChildren(true);
                main.opacity = 255;
            }).start();

            kit.Audio.playShake(20, 50);
        };

        // 4 剩余物品复制 并 移动
        let count = 0;
        let total = 2;
        let effectExpMain = this.effectExp.getChildByName('main');
        let pointMid = Common.getLocalPos(goodMid.parent, goodMid.position, effectExpMain);
        for (let index = 0, length = arrGoodParam.length; index < length; index++) {
            this.effectExpShow(cc.v3(pointMid.x, pointMid.y));
        }
        for (let index = 0, length = arrGoodParam.length; index < length; index++) {
            let param = arrGoodParam[index];
            let good = this.uiBottomMain.getChildByName(param.name);
            if (index == 1) {
                continue;
            }
            good.active = false;
            let goodElse = cc.instantiate(good);
            goodElse.parent = main;
            goodElse.active = true;
            goodElse.position = good.position;
            cc.tween(goodElse).to(0.15, { position: goodMid.position }).call(() => {
                count++;
                if (count >= total) {
                    funcHide();
                }
            }).start();
        }
    };

    /** 播放动画（游戏结束） */
    playAniGameOver(type: FinishType) {
        this.isLock = true;
        this.objData.isFinish = true;
        switch (type) {
            case FinishType.win:
                this.gameStageWin();
                break;
            case FinishType.failSpace:
            case FinishType.failTime:
                let params: FailParam = {
                    type: type,
                    numSuipian: this.objData.numSuipian,
                    numStrength: 1,
                    numMagnet: DataManager.data.wins.count - DataManager.data.wins.start,
                };
                // 打点 失败
                NativeCall.logEventOne(ConfigDot.dot_challenge_fail);
                kit.Popup.show(CConst.popup_path_gameFail, params, { mode: PopupCacheMode.Frequent });
                break;
            default:
                break;
        }
    };

    async gameStageWin() {
        this.setIsLock(true);
        // 打点
        NativeCall.sTsEvent();

        let stageLevel = this.objData.level;
        // 打点 过关
        NativeCall.logEventOne(ConfigDot.dot_challenge_win);
        let dot = ConfigDot['dot_pass_level_' + stageLevel];
        if (dot) {
            let passTime = Math.floor((new Date().getTime() - this.objData.passTime) * 0.001); //通关时间
            NativeCall.logEventFore(dot, String(stageLevel), String(passTime), String(this.objData.stepCount));
        }

        let nodeSuipian = this.uiTop.getChildByName('suipian');
        let pointWorld = this.uiTop.convertToWorldSpaceAR(nodeSuipian.position);
        // 更新数据
        let params: WinParam = {
            tCount: this.timeGame.count,
            disBoxGood: 1,
            disBoxLevel: 1,
            disBoxSuipian: this.objData.numSuipian,
            disBoxXingxing: this.getXingxingNum(),
            objCoin: {
                position: { x: pointWorld.x, y: pointWorld.y },
                scale: nodeSuipian.scale,
            },
        };
        DataManager.refreshDataAfterWin(params);
        DataManager.setData();

        // 物品宝箱判断
        let config = DataManager.getRewardBoxGood();
        if (config.goods.length > 0) {
            let boxGood = DataManager.data.boxGood;
            if (boxGood.count + boxGood.add >= config.total) {
                // 开启宝箱
                await kit.Popup.show(CConst.popup_path_boxGood, {}, { mode: PopupCacheMode.Frequent });
            }
        }

        kit.Popup.show(CConst.popup_path_gameWin, params, { mode: PopupCacheMode.Frequent });
    };

    /** 添加 箱子 */
    addBox(param: BoxParam): cc.Node {
        let node = DataManager.poolGet(this.preBox, DataManager.objPool.box);
        node.parent = this.nodeMain;
        node.getComponent(ItemBox).init(param);
        return node;
    };

    /** 添加 物品 */
    addGood(box: cc.Node, param: GoodParam): cc.Node {
        let node = DataManager.poolGet(this.preGood, DataManager.objPool.good);
        node.parent = box.getComponent(ItemBox).nodeMain;
        node.getComponent(ItemGood).init(param);
        return node;
    };

    /** 获取星星数量（根据剩余时间获取） */
    getXingxingNum() {
        let xingNum = 1;
        let ratio = 100 * this.timeGame.count / this.timeGame.total;
        if (ratio > 60) {
            xingNum = 3;
        }
        else if (ratio > 20) {
            xingNum = 2;
        }
        return xingNum;
    }

    removeGoodToBottom() {
        // 获取 箱子数据 并 更改
        let arrGame = this.sortArrByXY(Object.values(this.objGame));
        let boxParam: BoxParam = arrGame[0];
        let keys = Object.keys(boxParam.goods);
        let goodParam: GoodParam = Common.clone(boxParam.goods[keys[0]]);
        delete boxParam.goods[keys[0]];
        // 同步 箱子数据
        let box = this.nodeMain.getChildByName(boxParam.name);
        let scriptBox = box.getComponent(ItemBox);
        scriptBox.param = Common.clone(boxParam);

        // 获取 物品 并 转移
        this.goodParamsInsert(goodParam);
        let good = scriptBox.nodeMain.getChildByName(goodParam.name);
        good.parent = this.uiBottomMain;
        good.scale = this.goodScaleBottom[Number(String(goodParam.keyGood).substring(0, 1))];
        good.x = this.bottomPosArr[0].x;
        good.y = this.bottomPosArr[0].y;
        good.active = true;
    };

    /** 移除数据（箱子内物品） */
    removeGoodParam(goodParam: GoodParam) {
        let box = this.nodeMain.getChildByName(goodParam.box.name);
        if (!box) {
            return;
        }
        let boxParam = box.getComponent(ItemBox).param;
        delete boxParam.goods[goodParam.index];
        this.objGame[boxParam.index] = Common.clone(boxParam);

        // 框 不消除
        if (!boxParam.isFrame) {
            if (Object.keys(boxParam.goods).length < 1) {
                DataManager.poolPut(box, DataManager.objPool.box);
                delete this.objGame[boxParam.index];
            }
        }
    };

    /** 游戏开始 */
    gameStart() {
        this.playAniShow(true, () => {
            // 新手引导 返回道具 移除一个物品到检测区
            if (DataManager.checkNewPlayerGame()) {
                this.gamePause();
                kit.Event.emit(CConst.event_guide_game);
            }
            else {
                this.gameResume();
            }
            this.usePropWins();
        });
    };

    /** 暂停 */
    gamePause() {
        Common.log('功能：游戏暂停');
        this.setIsLock(true);
    };

    /** 恢复 */
    gameResume() {
        Common.log('功能：游戏恢复');
        this.setIsLock(false);
    };

    /** 复活 */
    async gameRevive(type: FinishType) {
        Common.log('功能：游戏复活');
        switch (type) {
            case FinishType.failTime:// 超时复活 +60s
                this.timeGame.count += 60;
                break;
            case FinishType.failSpace:// 无移动空间 回退3个物品
                await this.returnGoods();
                await this.returnGoods();
                await this.returnGoods();
                break;
            default:
                break;
        }
        this.objData.isFinish = false;
        this.setIsLock(false);
    };

    eventBackRefreshProp() {
        this.setUIProp(PropType.ice);
        this.setUIProp(PropType.tip);
        this.setUIProp(PropType.back);
        this.setUIProp(PropType.refresh);
    };

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_game_load, this.gameLoad.bind(this, false), this);
        kit.Event.on(CConst.event_game_reload, this.gameLoad.bind(this, true), this);
        kit.Event.on(CConst.event_game_start, this.gameStart, this);
        kit.Event.on(CConst.event_game_resume, this.gameResume, this);
        kit.Event.on(CConst.event_game_revive, this.gameRevive, this);
        kit.Event.on(CConst.event_touch_show, this.eventTouchShow, this);
        kit.Event.on(CConst.event_touch_good, this.eventTouchGood, this);
        kit.Event.on(CConst.event_refresh_prop, this.eventBackRefreshProp, this);
        // 引导
        kit.Event.on(CConst.event_guide_3, () => {
            this.gameResume();
            this.eventBtnTip();
        }, this);
        kit.Event.on(CConst.event_guide_5, () => {
            this.gameResume();
            this.eventBtnBack();
        }, this);
        kit.Event.on(CConst.event_guide_7, () => {
            this.gameResume();
            this.eventBtnRefresh();
        }, this);
        kit.Event.on(CConst.event_guide_9, () => {
            this.gameResume();
            this.eventBtnTimeIce();
        }, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    }
}