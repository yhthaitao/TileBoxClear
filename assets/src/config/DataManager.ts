import { kit } from "../kit/kit";
import CConst from "./CConst";
import Common from "./Common";
import ConfigDot from "./ConfigDot";
import { LangFile, LangImg } from "./ConfigLang";
import NativeCall from "./NativeCall";

/** 设计分辨率 */
export const Design = {
    width: 720,
    height: 1560,
}

/** 游戏状态 */
export enum StateGame {
    loading = 1,// 冰冻
    menu = 1 << 1,// 提示
    game = 1 << 2,// 返回上一步
}

/** 资源类型 */
export enum TypeRes {
    PNG = "png",// 图片
    DRAGON = "dragon", // 龙骨
};

/** 道具状态（游戏开始前的弹窗） */
export enum StateBeforeProp {
    lock = 1,// 未解锁
    noProp = 1 << 1,// 解锁 无道具
    unChoose = 1 << 2,// 解锁 有道具 未选中
    choose = 1 << 3,// 解锁 有道具 选中
};

/** 游戏结束枚举状态 */
export enum TypeFinish {
    win = 1,
    failSpace = 1 << 1,
    failTime = 1 << 2,
}

/** 弹窗枚举(游戏前弹窗类型) */
export enum TypeBefore {
    fromMenu = 1,
    fromSettingGame = 1 << 1,
    fromGameWin = 1 << 2,
    fromGameFail = 1 << 3,
}

/** 参数枚举（游戏胜利） */
export interface ParamsWin {
    tCount: number;
    level: number;
    suipian: number;
    xingxing: number;
}

/** 参数枚举（游戏失败） */
export interface ParamsFail {
    type: TypeFinish;
    numStrength: number;
    numSuipian: number;
    numMagnet: number;
}

/** 道具类型 */
export enum TypeProp {
    ice = 1,// 冰冻
    tip = 1 << 1,// 提示
    back = 1 << 2,// 返回上一步
    refresh = 1 << 3,// 刷新
    magnet = 1 << 4,// 磁铁
    clock = 1 << 5,// 时钟
    coin = 1 << 6,// 金币
    tStrengthInfinite = 1 << 7,// 无限时间-体力
    tMagnetInfinite = 1 << 8,// 无限时间-磁铁
    tClockInfinite = 1 << 9,// 无限时间-时钟
}
import ConfigBoxLevel from "./ConfigBoxLevel";
import ConfigBoxSuipian from "./ConfigBoxSuipian";
import ConfigBoxXingxing from "./ConfigBoxXingxing";
import ConfigGood from "./ConfigGood";
import ConfigUnlock from "./ConfigUnlock";

/** 数据类型（碎片宝箱奖励） */
export interface TypeReward {
    total: number, // 碎片数量
    reward: { type: TypeProp, number: number }[],// 奖励的类型和数量
}

/** 数据类型（资源） */
export interface TypeResource {
    bundle: string,
    resPath: string,
}

/** 数据管理类 */
class DataManager {
    private static _instance: DataManager;
    public static get instance(): DataManager {
        if (!this._instance) {
            this._instance = new DataManager();
        }
        return this._instance;
    };

    /** 当前状态 */
    stateCur: number = 0;
    /** 上一个状态 */
    stateLast: number = 0;
    /** 视频节点 */
    nodeVideo: cc.Node = null;
    /** 云加载 */
    isCloudLoad: boolean = false;
    /** 插屏广告开启关卡 */
    adStartLevel: number = 4;
    /** 游戏开始前界面状态 */
    beforeWins = { count: 0, magnet: [0, 1, 2, 3], unlock: 25 };

    /** 初始数据 */
    data = {
        langCur: LangFile.no,
        // 用户初始化数据
        userInfo: { id: 0, name: "Tony" },
        // 广告参数
        advert: {
            isRemove: false,// 是否去除广告
            record: { time: 0, level: 0 },// 广告计时
            count: 0,// 广告计数
            s2sCount: 0,// 回传计数
            isCpe: false,// 打点记录 只打一次
            revenue: '0',// 广告收入
        },
        isEvaluate: false,// 是否已经评价
        installtime: new Date().valueOf(),
        numCoin: 100,// 金币数量
        numReplay: 1,// 可以重玩的次数，限30关之前
        // 游戏开始前界面状态
        beforeProp: [
            { type: TypeProp.magnet, state: StateBeforeProp.lock, unlock: 12 },
            { type: TypeProp.clock, state: StateBeforeProp.lock, unlock: 15 },
        ],
        // 体力参数
        strength: {
            count: 5,// 当前体力值
            total: 5,// 最大体力值
            tCount: 0, // 恢复体力计时
            tTotal: 60,// 900秒恢复1体力
            buyCoin: 100,// 100金币购买1体力
            tInfinite: 0,// 无限时间
        },
        // 道具参数
        prop: {
            ice: { count: 3 },// 冰冻
            tip: { count: 3 },// 提示
            back: { count: 3 },// 返回上一步
            refresh: { count: 3 },// 刷新
            magnet: { count: 3, tInfinite: 0 },// 磁铁
            clock: { count: 3, tInfinite: 0 },// 时钟
        },
        // 宝箱相关参数（碎片宝箱）
        boxSuipian: {
            level: 1, count: 0, add: 0, timeLunch: 0,
        },
        // 宝箱相关参数（关卡等级宝箱）
        boxLevel: {
            level: 1, count: 0, add: 0, loop: { start: 6, length: 3, },
        },
        // 宝箱相关参数（星星宝箱）
        boxXingxing: {
            level: 1, count: 0, add: 0, loop: { start: 6, length: 16, },
        },
        // 宝箱相关参数（物品宝箱）
        boxGood: {
            level: 1, count: 0, add: 0, max: 12
        },
        // 关卡数据 基础
        boxData: {
            level: 1,// 当前关卡====添加粒子效果 后面的
            areasId: 1,// 当前主题
            newTip: {
                cur: 0,
                max: 3,
            },
            levelPass: [],// 已通过的关卡
            // 解锁的物品
            goodUnlock: {
                1: [1001, 1002, 1003, 1008],
                2: [2001, 2002, 2003, 2007, 2018, 2017],
                3: [3001, 3008, 3011, 3012],
                4: [4001, 4011, 4012, 4013, 4014, 4017],
            },
            goodStore: [],// 所有物品的池子
        },
    };

    /** 初始化数据 */
    public async initData(nodeAni: cc.Node) {
        let _data = JSON.parse(cc.sys.localStorage.getItem(CConst.localDataKey));
        if (_data) {
            let data = Common.clone(_data);
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    this.data[key] = data[key];
                }
            }
        }
        else {
            cc.sys.localStorage.setItem(CConst.localDataKey, JSON.stringify(this.data));
        }

        // 初始化收入
        NativeCall.setRevenue(this.data.advert.revenue);
        // 初始化语言
        this.initLanguage();
        // 初始化物品池子
        this.initGoodStore();
        // 初始化无线时间
        this.initTimeInfinite();
        // 提前加载 本地化 文本
        await kit.Resources.loadRes(CConst.bundleCommon, CConst.pathLanguage + this.data.langCur, cc.JsonAsset);
        // 提前加载 本地化 图片
        let arrName = Object.keys(LangImg);
        for (let index = 0, length = arrName.length; index < length; index++) {
            let resPath = CConst.pathImage + this.data.langCur + '/' + arrName[index];
            await kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.SpriteFrame);
        }
        // game bg
        for (let index = 1; index < 5; index++) {
            let resPath = CConst.pathGameBg + index;
            await kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.SpriteFrame);
        }
        // theme bg
        for (let index = 1; index < 16; index++) {
            let resPath = CConst.pathThemeBg + index;
            await kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.SpriteFrame);
        }

        // theme lock
        for (let index = 1; index < 16; index++) {
            let resPath = CConst.pathThemeLock + index;
            await kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.SpriteFrame);
        }
        // theme unlock
        for (let index = 1; index < 16; index++) {
            let resPath = CConst.pathThemeUnLock + index;
            await kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.SpriteFrame);
        }
        // 初始化视频动画
        this.nodeVideo = nodeAni;
        this.nodeVideo.zIndex = CConst.zIndex_video;
        this.nodeVideo.active = false;
        this.setData();
    }

    /** 多语言设置 */
    public initLanguage() {
        if (this.data.langCur != LangFile.no) {
            return;
        }
        let language = NativeCall.checkLang(LangFile.en);
        switch (language) {
            case 'cn':
            case 'CN':
            case 'zh':
            case 'ZH':
            case 'tw':
            case 'TW':
                this.data.langCur = LangFile.zh;
                break;
            case 'ja':
            case 'JA':
            case 'jp':
            case 'JP':
                this.data.langCur = LangFile.jp;
                break;
            case 'ko':
            case 'KO':
            case 'kr':
            case 'KR':
                this.data.langCur = LangFile.kr;
                break;
            default:
                this.data.langCur = LangFile.en;
                break;
        }
        Common.log(' 初始化语言：', this.data.langCur);
        this.setData();
    }

    /** 物品初始化 */
    public initGoodStore() {
        // 所有物品
        let arrGoods = [];
        ConfigGood.goodsConf.forEach((obj) => { arrGoods.push(obj.id); });
        // 解锁物品
        let goodUnlock = this.data.boxData.goodUnlock;
        let arrUnlock = [].concat(goodUnlock[1], goodUnlock[2], goodUnlock[3], goodUnlock[4]);
        // 物品全部解锁
        if (arrUnlock.length >= arrGoods.length) {
            this.data.boxData.goodStore = [];
            return;
        }
        // 存储物品
        if (this.data.boxData.goodStore.length == 0) {
            arrGoods.forEach((goodId) => {
                if (arrGoods.indexOf(goodId) < 0) {
                    this.data.boxData.goodStore.push(goodId);
                }
            });
        }
    }

    /** 初始化无限时间 */
    public initTimeInfinite() {
        let time = Math.floor(new Date().getTime() / 1000);
        if (this.data.strength.tInfinite <= 0) {
            this.data.strength.tInfinite = time;
        }
        if (this.data.prop.magnet.tInfinite <= 0) {
            this.data.prop.magnet.tInfinite = time;
        }
        if (this.data.prop.clock.tInfinite <= 0) {
            this.data.prop.clock.tInfinite = time;
        }
    }

    /** 设置游戏状态 */
    public setGameState(state: number) {
        this.stateLast = this.stateCur;
        this.stateCur = state;
    }

    /** 消耗体力 */
    public strengthReduce() {
        if (this.data.strength.count >= this.data.strength.total) {
            this.data.strength.tCount = Math.floor(new Date().getTime() / 1000);
        }
        this.data.strength.count--;
        Common.log('消耗体力 剩余strength: ', this.data.strength.count);
    }

    /** 恢复体力 */
    public strengthResume() {
        this.data.strength.count++;
        if (this.data.strength.count >= this.data.strength.total) {
            this.data.strength.count = this.data.strength.total;
            this.data.strength.tCount = 0;
        }
        Common.log('恢复体力 剩余strength: ', this.data.strength.count);
    }

    /** 使用道具 */
    public useProp(type: TypeProp) {
        let propNum = -1;
        switch (type) {
            case TypeProp.ice:
                if (this.data.prop.ice.count > 0) {
                    this.data.prop.ice.count -= 1;
                    propNum = this.data.prop.ice.count;
                }
                break;
            case TypeProp.tip:
                if (this.data.prop.tip.count > 0) {
                    this.data.prop.tip.count -= 1;
                    propNum = this.data.prop.tip.count;
                }
                break;
            case TypeProp.back:
                if (this.data.prop.back.count > 0) {
                    this.data.prop.back.count -= 1;
                    propNum = this.data.prop.back.count;
                }
                break;
            case TypeProp.refresh:
                if (this.data.prop.refresh.count > 0) {
                    this.data.prop.refresh.count -= 1;
                    propNum = this.data.prop.refresh.count;
                }
                break;
            case TypeProp.magnet:
                // 磁铁选中
                let stateMagnet = this.data.beforeProp[0];
                if (this.data.prop.magnet.tInfinite > 0) {
                    propNum = this.data.prop.magnet.count;
                    if (stateMagnet.state != StateBeforeProp.choose) {
                        stateMagnet.state = StateBeforeProp.choose;
                    }
                }
                else {
                    if (stateMagnet.state == StateBeforeProp.choose) {
                        if (this.data.prop.magnet.count > 0) {
                            this.data.prop.magnet.count -= 1;
                            propNum = this.data.prop.magnet.count;
                            if (this.data.prop.magnet.count <= 0) {
                                stateMagnet.state = StateBeforeProp.noProp;
                            }
                        }
                    }
                }
                break;
            case TypeProp.clock:
                // 时钟选中
                let stateClock = this.data.beforeProp[1];
                if (this.data.prop.clock.tInfinite > 0) {
                    propNum = this.data.prop.clock.count;
                    if (stateClock.state != StateBeforeProp.choose) {
                        stateClock.state = StateBeforeProp.choose;
                    }
                }
                else {
                    if (stateClock.state == StateBeforeProp.choose) {
                        if (this.data.prop.clock.count > 0) {
                            this.data.prop.clock.count -= 1;
                            propNum = this.data.prop.clock.count;
                            if (this.data.prop.clock.count <= 0) {
                                stateClock.state = StateBeforeProp.noProp;
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
        return propNum;
    }

    /** 数据更新（游戏胜利后） */
    public refreshDataAfterWin(params: ParamsWin) {
        // 等级变化
        this.data.boxData.level++;
        // 过关数据变更 关卡宝箱
        if (params.level && params.level > 0) {
            this.data.boxLevel.add += params.level;
        }
        // 过关数据变更 碎片宝箱
        if (params.suipian && params.suipian > 0) {
            this.data.boxSuipian.add += params.suipian;
        }
        // 过关数据变更 星星宝箱
        if (params.xingxing && params.xingxing > 0) {
            this.data.boxXingxing.add += params.xingxing;
        }
        // 过关数据变更 物品宝箱
        this.data.boxGood.add += 1;

        // 道具解锁（游戏开始前界面）
        this.data.beforeProp.forEach((obj: { type: TypeProp, state: StateBeforeProp, unlock: number }, index: number) => {
            if (obj.state == StateBeforeProp.lock) {
                if (this.data.boxData.level >= obj.unlock) {
                    obj.state = StateBeforeProp.unChoose;
                }
            }
            // 连胜奖励在25关之后开启
            if (this.data.boxData.level > 25 && obj.type == TypeProp.magnet && obj.state != StateBeforeProp.lock) {
                if (this.beforeWins.count < 3) {
                    this.beforeWins.count++;
                }
            }
        });
    }

    /** 数据更新（开启宝箱后） */
    public refreshDataAfterUnlockReward(params: TypeReward) {
        params.reward.forEach((record) => {
            switch (record.type) {
                case TypeProp.coin:
                    this.data.numCoin += record.number;
                    break;
                case TypeProp.ice:
                    this.data.prop.ice.count += record.number;
                    break;
                case TypeProp.tip:
                    this.data.prop.tip.count += record.number;
                    break;
                case TypeProp.back:
                    this.data.prop.back.count += record.number;
                    break;
                case TypeProp.refresh:
                    this.data.prop.refresh.count += record.number;
                    break;
                case TypeProp.magnet:
                    this.data.prop.magnet.count += record.number;
                    let stateMagnet = this.data.beforeProp[0];
                    if (stateMagnet.state == StateBeforeProp.noProp) {
                        stateMagnet.state = StateBeforeProp.unChoose;
                    }
                    break;
                case TypeProp.clock:
                    this.data.prop.clock.count += record.number;
                    let stateClock = this.data.beforeProp[0];
                    if (stateClock.state == StateBeforeProp.noProp) {
                        stateClock.state = StateBeforeProp.unChoose;
                    }
                    break;
                case TypeProp.tMagnetInfinite:
                case TypeProp.tClockInfinite:
                case TypeProp.tStrengthInfinite:
                    // 没有无限时间 or 有无限时间
                    let time = Math.floor(new Date().getTime() / 1000);
                    if (record.type == TypeProp.tMagnetInfinite) {
                        if (this.data.prop.magnet.tInfinite < time) {
                            this.data.prop.magnet.tInfinite = time + record.number;
                        }
                        else{
                            this.data.prop.magnet.tInfinite += record.number;
                        }
                    }
                    else if (record.type == TypeProp.tClockInfinite) {
                        if (this.data.prop.clock.tInfinite < time) {
                            this.data.prop.clock.tInfinite = time + record.number;
                        }
                        else{
                            this.data.prop.clock.tInfinite += record.number;
                        }
                    }
                    else if (record.type == TypeProp.tStrengthInfinite) {
                        if (this.data.strength.tInfinite < time) {
                            this.data.strength.tInfinite = time + record.number;
                        }
                        else{
                            this.data.strength.tInfinite += record.number;
                        }
                    }
                    break;
                default:
                    break;
            }
        });
    }

    /** 数据更新（解锁物品后） */
    public refreshDataAfterUnlockGood(params: { total: number, goods: number[] }) {
        params.goods.forEach((goodId) => {
            // 从未解锁物品池子内删除
            let index = this.data.boxData.goodStore.indexOf(goodId);
            if (index >= 0) {
                this.data.boxData.goodStore.splice(index, 1);
            }
            else {
                Common.log('error 解锁物品异常 goodId: ', goodId);
            }
            // 添加到已解锁物品池子
            let first = Math.floor(goodId * 0.001);
            if (this.data.boxData.goodUnlock[first]) {
                this.data.boxData.goodUnlock[first].push(goodId);
            }
        });
    }

    /** 获取奖励参数（等级宝箱） */
    public getRewardBoxLevel(): TypeReward {
        let boxData = this.data.boxLevel;
        let index = boxData.level;
        if (index < 1) {
            index = 1;
        }
        else {
            if (index > boxData.loop.start - 1) {
                index = boxData.loop.start + (index - boxData.loop.start) % boxData.loop.length;
            }
        }
        return ConfigBoxLevel[index];
    }

    /** 获取奖励参数（星星宝箱） */
    public getRewardBoxXinging(): TypeReward {
        let boxData = this.data.boxXingxing;
        let index = boxData.level;
        if (index < 1) {
            index = 1;
        }
        else {
            if (index > boxData.loop.start - 1) {
                index = boxData.loop.start + (index - boxData.loop.start) % boxData.loop.length;
            }
        }
        let config: TypeReward = ConfigBoxXingxing[index];
        return config;
    }

    /** 获取奖励参数（碎片宝箱） */
    public getRewardBoxSuipian(): TypeReward {
        let index = this.data.boxSuipian.level;
        if (index < 1) {
            index = 1;
        }
        else {
            let max = Number(Object.keys(ConfigBoxSuipian).pop());
            if (index > max) {
                index = max;
            }
        }
        let config: TypeReward = ConfigBoxSuipian[index];
        return config;
    }

    /** 获取奖励参数（物品宝箱） */
    public getRewardBoxGood(): { total: number, goods: number[] } {
        let index = this.data.boxGood.level;
        if (index <= this.data.boxGood.max) {
            if (index < 1) {
                index = 1;
            }
            return ConfigUnlock[index];
        }
        let config = { total: 10, goods: [] };
        let boxData = this.data.boxData.goodStore;
        if (boxData.length > 3) {
            let random = Math.floor(Math.random() * boxData.length);
            config.goods.concat(boxData.splice(random, 1));
            random = Math.floor(Math.random() * boxData.length);
            config.goods.concat(boxData.splice(random, 1));
            random = Math.floor(Math.random() * boxData.length);
            config.goods.concat(boxData.splice(random, 1));
        }
        else if (boxData.length > 0) {
            config.goods = Common.clone(boxData);
            boxData = [];
        }
        return config;
    }

    /**
     * 存储数据
     * @param isSaveCloud 是否存储到云端
     * @returns 
     */
    public setData(isSaveCloud = false) {
        let dataString = JSON.stringify(this.data);
        cc.sys.localStorage.setItem(CConst.localDataKey, dataString);
        if (typeof (jsb) === 'undefined' || !isSaveCloud) {
            return;
        }
    }

    /** 检测是否有banner */
    public checkBanner() {
        if (this.data.advert.isRemove) {
            return false;
        }
        return this.data.boxData.level > this.adStartLevel;
    }

    /**
     * 检测插屏是否开启(针对游戏结束自动弹出的广告)
     * @param levelNow 检测时的关卡 
     * @returns 
     */
    public checkIsPlayAdvert(levelNow: number) {
        let levelLimit = this.adStartLevel + 1;
        Common.log(' 广告检测 cocos checkIsPlayAds() 插屏检测 levelNow: ', levelNow, '; levelLimit: ', levelLimit);
        if (levelNow < levelLimit) {
            return false;
        }
        else if (levelNow == levelLimit) {
            return true;
        }

        let timeNow = Math.floor(new Date().getTime() * 0.001);
        let timeRecord = this.data.advert.record.time;
        let timeLast = timeNow - timeRecord;
        let levelRecord = this.data.advert.record.level;
        let levelLast = levelNow - levelRecord;
        Common.log(' 检测 时间 timeLast: ', timeLast, '; timeNow: ', timeNow, '; timeRecord: ', timeRecord);
        if (levelNow > 20) {
            return timeLast >= 30;
        }
        else {
            Common.log(' 检测 关卡 levelLast: ', levelLast, '; levelNow: ', levelNow, '; levelRecord: ', levelRecord);
            return timeLast >= 90 || levelLast >= 3;
        }
    };

    /**
     * 播放奖励视频
     * @param funcA 
     * @param funcB 
     * @returns
     */
    public playVideo(funcA: Function, funcB: Function): boolean {
        let isReady = NativeCall.videoCheck();
        if (isReady) {
            NativeCall.closeBanner();
            this.adAnimPlay(NativeCall.videoShow.bind(NativeCall, funcA, funcB));
        }
        return isReady;
    };

    /**
     * 播放广告视频
     * @param funcA 
     * @param funcB 
     * @returns 
     */
    public playAdvert(funcA: Function, funcB: Function): boolean {
        let isReady = NativeCall.advertCheck();
        if (isReady) {
            NativeCall.closeBanner();
            this.adAnimPlay(NativeCall.advertShow.bind(NativeCall, funcA, funcB));
        }
        return isReady;
    }

    /** 播放动画 */
    public adAnimPlay(callback: Function = null) {
        this.nodeVideo.active = true;
        let animation = this.nodeVideo.getChildByName("dragon").getComponent(dragonBones.ArmatureDisplay)
        animation.once(dragonBones.EventObject.COMPLETE, () => {
            this.nodeVideo.active = false;
            if (typeof callback == "function" && cc.isValid(callback)) callback();
        })
        animation.playAnimation('newAnimation', 1);
    };

    /** 更新广告计数 */
    public updateAdCount() {
        this.data.advert.count++;
        let dot = ConfigDot['dot_ad_revenue_track_flag_' + this.data.advert.count];
        dot && NativeCall.logEventOne(dot);
        // 过完35关、看广告次数达到50次打点，只记一次；
        if (!this.data.advert.isCpe && this.data.boxData.level > 35 && this.data.advert.count >= 50) {
            this.data.advert.isCpe = true;
            NativeCall.logEventOne(ConfigDot.dot_applovin_cpe);
        }
        this.setData(false);
    };

    /** 更新回传计数 */
    public updateS2SCount(): number {
        this.data.advert.s2sCount++;
        this.setData(false);
        return this.data.advert.s2sCount;
    };

    /** 缓冲池处理 */
    public poolPut(node: cc.Node, pool: cc.NodePool) {
        if (pool.size() <= 100) {
            pool.put(node);
        } else {
            node.destroy();
        }
    };

    /** titleY */
    public getTitlePosY() {
        let heightMax = cc.winSize.height * 0.5;
        return heightMax * 0.3 + 50;
    };

    /** 播放物品奖励动画（主界面） */
    public playAniReward(node: cc.Node, obj: { p1: cc.Vec2, p2: cc.Vec2, pTo: cc.Vec2, time: number }): Promise<void> {
        return new Promise((res) => {
            node.active = true;
            node.scale = 0;
            cc.tween(node)
                .to(0.2, { scale: 1.1 })
                .to(0.1, { scale: 1.0 })
                .delay(0.5)
                .bezierTo(obj.time, obj.p1, obj.p2, obj.pTo)
                .call(()=>{
                    node.removeFromParent();
                    res();
                })
                .start();
        });
    };

    /** 播放动画 */
    public playAniDragon(node: cc.Node, armatureName: string, animationName: string, cb: Function = null): Promise<void> {
        return new Promise((res) => {
            let dragon = node.getComponent(dragonBones.ArmatureDisplay);
            dragon.once(dragonBones.EventObject.COMPLETE, () => {
                cb && cb();
                res();
            });
            dragon.armatureName = armatureName;
            dragon.playAnimation(animationName, 1);
        });
    };

    /** 获取字符串 */
    public async getString(key: string): Promise<string> {
        let resPath = CConst.pathLanguage + this.data.langCur;
        let jsonAsset: cc.JsonAsset = await kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.JsonAsset);
        return jsonAsset.json[key];
    };

    /** 获取字符串 */
    public setString(key: string, callback) {
        let resPath = CConst.pathLanguage + this.data.langCur;
        kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.JsonAsset, (e: any, jsonAsset: cc.JsonAsset) => {
            if (jsonAsset) {
                callback && callback(jsonAsset.json[key]);
            }
        });
    };
};
export default DataManager.instance;
