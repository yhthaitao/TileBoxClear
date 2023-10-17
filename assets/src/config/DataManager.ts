import { kit } from "../kit/kit";
import CConst from "./CConst";
import Common from "./Common";
import ConfigDot from "./ConfigDot";
import { LangFile, LangImg } from "./ConfigLang";
import NativeCall from "./NativeCall";
import ConfigBoxLevel from "./ConfigBoxLevel";
import ConfigBoxSuipian from "./ConfigBoxSuipian";
import ConfigBoxXingxing from "./ConfigBoxXingxing";
import ConfigGood from "./ConfigGood";
import ConfigUnlock from "./ConfigUnlock";
import { LevelParam, ParamsWin, StateBeforeProp, TypeProp, TypeReward } from "./ConfigCommon";

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
    adStartLevel: number = 12;
    /** 关卡数据 */
    levelData: { data0: LevelParam[], data1: LevelParam[] } = { data0: null, data1: null };
    /** 广告回来延迟时间（秒） */
    interval: number = 0.02;

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
        shopLimit: [],// 购买限制
        day: 0,
        isEvaluate: false,// 是否已经评价
        installtime: new Date().valueOf(),
        numCoin: 100,// 金币数量
        numReplay: 1,// 可以重玩的次数，限30关之前
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
            ice: { type: TypeProp.ice, count: 3 },// 冰冻
            tip: { type: TypeProp.tip, count: 3 },// 提示
            back: { type: TypeProp.back, count: 3 },// 返回上一步
            refresh: { type: TypeProp.refresh, count: 3 },// 刷新
            magnet: { type: TypeProp.magnet, count: 3, tInfinite: 0, state: StateBeforeProp.lock, unlock: 12 },// 磁铁
            clock: { type: TypeProp.clock, count: 3, tInfinite: 0, state: StateBeforeProp.lock, unlock: 15 },// 时钟
        },
        wins: {
            count: 0, start: 1, unlock: 25
        },
        // 宝箱相关参数（碎片宝箱）
        boxSuipian: {
            level: 1, count: 0, add: 0, startLevel: 19,
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
        // 12个成就
        boxAchieve: [
            false, false, false, false,
            false, false, false, false,
            false, false, false, false,
        ],
        // 关卡数据 基础
        boxData: {
            level: 1,// 当前关卡====添加粒子效果 后面的
            areasId: 1,// 当前主题
            timesCoin: { count: 20, total: 20 },
            timesLive: { count: 20, total: 20 },
            newTip: {
                cur: 0,
                max: 3,
            },
            levelPass: [],// 已通过的关卡
            // 解锁的物品
            goodUnlock: {
                1: [1001, 1002, 1003, 1007, 1008, 1011],
                2: [2001, 2002, 2003, 2009, 2017, 2018],
                3: [3001, 3008, 3009, 3010, 3011, 3012],
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
        // 初始化时间
        this.initDay();
        /** 初始化关卡数据 */
        this.initLevelData();
        // 初始化语言
        this.initLanguage();
        // 初始化物品池子
        this.initGoodStore();
        // 初始化磁铁和时钟状态
        this.initPropState();
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

    /** 初始化时间 */
    public initDay() {
        let resume = () => {
            this.data.boxSuipian.level = 1;
            this.data.boxSuipian.count = 0;
            this.data.boxSuipian.add = 0;
            this.data.boxData.timesCoin.count = this.data.boxData.timesCoin.total;
            this.data.boxData.timesLive.count = this.data.boxData.timesLive.total;
        };
        let day = Math.floor(new Date().getTime() / 86400000);
        if (this.data.day == 0 || this.data.day != day) {
            this.data.day = day;
            resume();
        }
    }

    /** 初始化关卡数据 */
    public async initLevelData() {
        let path = CConst.pathLevelData;
        if (!this.levelData.data0) {
            kit.Resources.loadRes(CConst.bundlePrefabs, path + 'level0', cc.JsonAsset, (e: any, asset: any) => {
                if (asset) {
                    this.levelData.data0 = asset.json;
                }
                else {
                    Common.log('加载关卡数据 level0 出错');
                }
            });

        }
        if (!this.levelData.data1) {
            kit.Resources.loadRes(CConst.bundlePrefabs, path + 'level1', cc.JsonAsset, (e: any, asset: any) => {
                if (asset) {
                    this.levelData.data1 = asset.json;
                }
                else {
                    Common.log('加载关卡数据 level1 出错');
                }
            });
        }
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
                if (arrUnlock.indexOf(goodId) < 0) {
                    this.data.boxData.goodStore.push(goodId);
                }
            });
        }
    }

    public initPropState() {
        let time = Math.floor(new Date().getTime() / 1000);
        let level = this.data.boxData.level;
        let beforeProp = [this.data.prop.magnet, this.data.prop.clock];
        beforeProp.forEach((obj) => {
            if (level > obj.unlock) {
                // 状态：锁定 转 无道具
                if (obj.state == StateBeforeProp.lock) {
                    obj.state = StateBeforeProp.noProp;
                }
                // 磁铁
                if (obj.type == TypeProp.magnet) {
                    // 无限 状态：转 锁定
                    if (this.data.prop.magnet.tInfinite - time > 0) {
                        obj.state = StateBeforeProp.infinite;
                    }
                    else {
                        // 有道具 
                        if (this.data.prop.magnet.count > 0) {
                            // 状态：无道具 转 未选择
                            if (obj.state == StateBeforeProp.noProp) {
                                obj.state = StateBeforeProp.unChoose;
                            }
                            else if (obj.state == StateBeforeProp.infinite) {
                                obj.state = StateBeforeProp.unChoose;
                            }
                        }
                        else {
                            obj.state = StateBeforeProp.noProp
                        }
                    }
                }
                // 时钟
                if (obj.type == TypeProp.clock) {
                    // 无限 状态：转 锁定
                    if (this.data.prop.clock.tInfinite - time > 0) {
                        obj.state = StateBeforeProp.infinite;
                    }
                    else {
                        // 有道具 
                        if (this.data.prop.clock.count > 0) {
                            // 状态：无道具 转 未选择
                            if (obj.state == StateBeforeProp.noProp) {
                                obj.state = StateBeforeProp.unChoose;
                            }
                            else if (obj.state == StateBeforeProp.infinite) {
                                obj.state = StateBeforeProp.unChoose;
                            }
                        }
                        else {
                            obj.state = StateBeforeProp.noProp
                        }
                    }
                }
            }
        });
    };

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
                let stateMagnet = this.data.prop.magnet;
                if (stateMagnet.state == StateBeforeProp.infinite) {
                    propNum = this.data.prop.magnet.count;
                }
                else if (stateMagnet.state == StateBeforeProp.choose) {
                    this.data.prop.magnet.count -= 1;
                    propNum = this.data.prop.magnet.count;
                }
                break;
            case TypeProp.clock:
                // 时钟选中
                let stateClock = this.data.prop.clock;
                if (stateClock.state == StateBeforeProp.infinite) {
                    propNum = this.data.prop.clock.count;
                }
                else if (stateClock.state == StateBeforeProp.choose) {
                    this.data.prop.clock.count -= 1;
                    propNum = this.data.prop.clock.count;
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
        // 主题变化
        if (this.data.boxData.level == 21) {
            this.data.boxData.areasId = 2;
        }
        else if (this.data.boxData.level == 41) {
            this.data.boxData.areasId = 3;
        }
        else if (this.data.boxData.level > 41) {
            if ((this.data.boxData.level - 41) % 40 == 0) {
                this.data.boxData.areasId = 3 + Math.floor((this.data.boxData.level - 41) / 40);
            }
        }
        // 过关数据变更 物品宝箱
        if (params.disBoxGood && params.disBoxGood > 0) {
            this.data.boxGood.add += params.disBoxGood;
        }
        // 过关数据变更 关卡宝箱
        if (params.disBoxLevel && params.disBoxLevel > 0) {
            this.data.boxLevel.add += params.disBoxLevel;
        }
        // 过关数据变更 碎片宝箱
        if (params.disBoxSuipian && params.disBoxSuipian > 0) {
            this.data.boxSuipian.add += params.disBoxSuipian;
        }
        // 过关数据变更 星星宝箱
        if (params.disBoxXingxing && params.disBoxXingxing > 0) {
            this.data.boxXingxing.add += params.disBoxXingxing;
        }

        // 道具解锁（游戏开始前界面）
        let beforeProp = [this.data.prop.magnet, this.data.prop.clock];
        beforeProp.forEach((prop) => {
            if (prop.state == StateBeforeProp.lock) {
                if (this.data.boxData.level >= prop.unlock) {
                    prop.state = StateBeforeProp.unChoose;
                }
            }
            // 连胜奖励在25关之后开启
            if (this.data.boxData.level > 25 && prop.type == TypeProp.magnet && prop.state != StateBeforeProp.lock) {
                let wins = this.data.wins.count - this.data.wins.start;
                if (wins < 3) {
                    this.data.wins.count++;
                }
            }
        });
    }

    /** 数据更新（开启宝箱后） */
    public refreshDataAfterUnlockReward(params: TypeReward) {
        params.reward.forEach((reward) => {
            switch (reward.type) {
                case TypeProp.coin:
                    this.data.numCoin += reward.number;
                    break;
                case TypeProp.ice:
                    this.data.prop.ice.count += reward.number;
                    break;
                case TypeProp.tip:
                    this.data.prop.tip.count += reward.number;
                    break;
                case TypeProp.back:
                    this.data.prop.back.count += reward.number;
                    break;
                case TypeProp.refresh:
                    this.data.prop.refresh.count += reward.number;
                    break;
                case TypeProp.magnet:
                    this.data.prop.magnet.count += reward.number;
                    let stateMagnet = this.data.prop.magnet;
                    if (stateMagnet.state == StateBeforeProp.noProp) {
                        stateMagnet.state = StateBeforeProp.unChoose;
                    }
                    break;
                case TypeProp.clock:
                    this.data.prop.clock.count += reward.number;
                    let stateClock = this.data.prop.clock;
                    if (stateClock.state == StateBeforeProp.noProp) {
                        stateClock.state = StateBeforeProp.unChoose;
                    }
                    break;
                case TypeProp.tMagnetInfinite:
                case TypeProp.tClockInfinite:
                case TypeProp.tStrengthInfinite:
                    // 没有无限时间 or 有无限时间
                    let time = Math.floor(new Date().getTime() / 1000);
                    if (reward.type == TypeProp.tMagnetInfinite) {
                        if (this.data.prop.magnet.tInfinite < time) {
                            this.data.prop.magnet.tInfinite = time + reward.number;
                        }
                        else {
                            this.data.prop.magnet.tInfinite += reward.number;
                        }
                    }
                    else if (reward.type == TypeProp.tClockInfinite) {
                        if (this.data.prop.clock.tInfinite < time) {
                            this.data.prop.clock.tInfinite = time + reward.number;
                        }
                        else {
                            this.data.prop.clock.tInfinite += reward.number;
                        }
                    }
                    else if (reward.type == TypeProp.tStrengthInfinite) {
                        if (this.data.strength.tInfinite < time) {
                            this.data.strength.tInfinite = time + reward.number;
                        }
                        else {
                            this.data.strength.tInfinite += reward.number;
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
     * 检测是否播放插屏
     *      可：判断插屏是否准备好
     *          准备好：播放funA
     *          为准备：播放funB
     *      否：执行funcN
     * @param funcN 
     */
    public playAdvert(funcN: Function) {
        let level = this.data.boxData.level;
        let isAdvert = this.checkIsPlayAdvert(level);
        if (isAdvert) {
            // 打点 插屏广告请求（过关）
            NativeCall.logEventThree(ConfigDot.dot_ad_req, "inter_nextlevel", "Interstital");
            let funcA = () => {
                // 打点 插屏播放完成
                NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_win, String(level));
                funcN();
                // 广告计时
                this.data.advert.record.time = Math.floor(new Date().getTime() * 0.001);
                this.data.advert.record.level = level;
                this.setData();
            };
            let funcB = () => {
                funcN();
            };
            // 先判断是否准备好
            let isReady = NativeCall.advertCheck();
            if (isReady) {
                this.startAdvert(funcA, funcB);
            }
            else {
                funcB();
            }
        }
        else {
            funcN();
        }
    };

    /**
     * 检测插屏是否开启(针对游戏结束自动弹出的广告)
     * @param level 检测时的关卡 
     * @returns 
     */
    public checkIsPlayAdvert(level: number) {
        Common.log(' 插屏广告检测 cocos checkIsPlayAds()  levelNow: ', level, '; adStartLevel: ', this.adStartLevel);
        if (level <= this.adStartLevel) {
            return false;
        }

        let timeNow = Math.floor(new Date().getTime() * 0.001);
        let timeRecord = this.data.advert.record.time;
        let timeLast = timeNow - timeRecord;
        // let levelRecord = this.data.advert.record.level;
        // let levelLast = level - levelRecord;
        Common.log(' 检测 时间 timeLast: ', timeLast, '; timeNow: ', timeNow, '; timeRecord: ', timeRecord);
        return timeLast >= 30;
    };

    /**
     * 播放视频广告
     * 1.先检测视频广告
     * 2.再检测插屏广告
     * @param funcA 
     * @param funcB 
     * @returns 
     */
    playVideo(funcA, funcB): void {
        let isReady = NativeCall.videoCheck();
        if (isReady) {
            this.startVideo(funcA, funcB);
            return;
        }
        isReady = NativeCall.advertCheck();
        if (isReady) {
            this.startAdvert(funcA, funcB);
            return;
        }
        funcB();
    };

    /**
     * 播放奖励视频
     * @param funcA 
     * @param funcB 
     * @returns
     */
    public startVideo(funcA: Function, funcB: Function): void {
        NativeCall.closeBanner();
        this.adAnimPlay(NativeCall.videoShow.bind(NativeCall, async () => {
            // 延迟一会儿
            await new Promise((_res) => {
                cc.Canvas.instance.scheduleOnce(_res, this.interval);
            });
            funcA();
        }, funcB));
    };

    /**
     * 播放广告视频
     * @param funcA 
     * @param funcB 
     * @returns 
     */
    public startAdvert(funcA: Function, funcB: Function): void {
        NativeCall.closeBanner();
        this.adAnimPlay(NativeCall.advertShow.bind(NativeCall, async () => {
            // 延迟一会儿
            await new Promise((_res) => {
                cc.Canvas.instance.scheduleOnce(_res, this.interval);
            });
            funcA();
        }, funcB));
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

    /** 缓冲池 放入 */
    public poolPut(node: cc.Node, objPool: { pool: cc.NodePool, max: number }) {
        if (objPool.pool.size() <= objPool.max) {
            objPool.pool.put(node);
        } else {
            node.destroy();
        }
    };

    /** 缓冲池 取出 */
    public poolGet(node: any, objPool: { pool: cc.NodePool, max: number }): cc.Node{
        return objPool.pool.size() > 0 ? objPool.pool.get() : cc.instantiate(node);
    };

    /** titleY */
    public getTitlePosY() {
        let heightMax = cc.winSize.height * 0.5;
        return heightMax * 0.25;
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
                .call(() => {
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

    public getLevelData(): LevelParam {
        let lens = [100, 174];
        let level = this.data.boxData.level;
        let index = 0;
        if (level <= 100) {
            index = level - 1;
            return this.levelData.data0[index];
        }
        else {
            index = (level - lens[0]) % lens[1] - 1;
            return this.levelData.data1[index];
        }
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
