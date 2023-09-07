import { kit } from "../kit/kit";
import CConst from "./CConst";
import Common from "./Common";
import ConfigDot from "./ConfigDot";
import NativeCall from "./NativeCall";

/** 设计分辨率 */
export const Design = {
    width: 720,
    height: 1560,
}

/** 本地化 文字 文件 */
export const LangFile = {
    en: 'en',// 英文
    zh: 'zh',// 繁体中文
    jp: 'jp',// 日文
    kr: 'kr',// 韩文
};

/** 本地化 文字 字段 */
export const LangChars = {
    loading: "loading",
    guide_tip: "guide_tip",
    guide_back: "guide_back",
    guide_refresh: "guide_refresh",
    guide_ice: "guide_ice",
    guide_magnet: "guide_magnet",
    guide_clock: "guide_clock",
    over_timeout_title: "over_timeout_title",
    over_timeout_desc: "over_timeout_desc",
    over_timeout_continue: "over_timeout_continue",
    over_timeout_giveup: "over_timeout_giveup",
    over_nospace_desc: "over_nospace_desc",
    over_nospace_gobackgood: "over_nospace_gobackgood",
    exit_confirm_desc: "exit_confirm_desc",
    exit_confirm_restart: "exit_confirm_restart",
    exit_confirm_giveup: "exit_confirm_giveup",
    pause_desc: "pause_desc",
    pause_resume: "pause_resume",
    pause_quit: "pause_quit",
    exit_title: "exit_title",
    exit_desc: "exit_desc",
    exit_resume: "exit_resume",
    exit_quit: "exit_quit",
    win_finish: "win_finish",
    win_next: "win_next",
    hour: "hour",
    minite: "minite",
    second: "second",
    Level: "Level",
    Bank: "Bank",
    Home: "Home",
    Shop: "Shop",
    Collection: "Collection",
    setting_title: "setting_title",
    setting_language: "setting_language",
    before_level: "before_level",
    gameBefore_wins: "gameBefore_wins",
    gameBefore_play: "gameBefore_play",
    gameBefore_chose: "gameBefore_chose",
    continuesChallenge_title: "continuesChallenge_title",
    continuesChallenge_desc: "continuesChallenge_desc",
    continuesChallenge_times: "continuesChallenge_times",
    boxLevel_title: "boxLevel_title",
    boxLevel_desc: "boxLevel_desc",
    boxLevel_continue: "boxLevel_continue",
    boxXingxing_title: "boxXingxing_title",
    boxXingxing_desc: "boxXingxing_desc",
    boxXingxing_continue: "boxXingxing_continue",
    tapToClaim: "tapToClaim",
    tapToContinue: "tapToContinue",
    goldCollection: "goldCollection",
    addCoin_title: "addCoin_title",
    addCoin_desc_0: "addCoin_desc_0",
    addCoin_desc_1: "addCoin_desc_1",
    addCoin_watch: "addCoin_watch",
    addLife_title: "addLife_title",
    addLife_desc: "addLife_desc",
    addLife_more: "addLife_more",
    addLife_nextFill: "addLife_nextFill",
    addLife_reFill: "addLife_reFill",
    bank_title: "bank_title",
    bank_desc: "bank_desc",
    SHOP: "SHOP",
    BeginnersBundle: "BeginnersBundle",
    ElfGiftBox: "ElfGiftBox",
    PrincessTreasure: "PrincessTreasure",
    ShiningBundle: "ShiningBundle",
    MikoGiftPack: "MikoGiftPack",
    QueenTreasure: "QueenTreasure",
    LimitedOffer: "LimitedOffer",
    RemoveAds: "RemoveAds",
    MostPopular: "MostPopular",
    BestPrice: "BestPrice",
    Goods: "Goods",
    Moment: "Moment",
    Doll: "Doll",
    Handbag: "Handbag",
    Satchel: "Satchel",
    Ball: "Ball",
    Christmas: "Christmas",
    shoes: "shoes",
    Cap: "Cap",
    Flower: "Flower",
    Electronics: "Electronics",
    GreenPlants: "GreenPlants",
    Toy: "Toy",
    adsNo: "adsNo",
    adsRemovePopup: "adsRemovePopup",
    adsNetworkNo: "adsNetworkNo",
    adsNetworkElse: "adsNetworkElse",
    adsNotReady: "adsNotReady",
    dailyChallenge_January: "dailyChallenge_January",
    dailyChallenge_February: "dailyChallenge_February",
    dailyChallenge_March: "dailyChallenge_March",
    dailyChallenge_April: "dailyChallenge_April",
    dailyChallenge_May: "dailyChallenge_May",
    dailyChallenge_June: "dailyChallenge_June",
    dailyChallenge_July: "dailyChallenge_July",
    dailyChallenge_August: "dailyChallenge_August",
    dailyChallenge_September: "dailyChallenge_September",
    dailyChallenge_October: "dailyChallenge_October",
    dailyChallenge_November: "dailyChallenge_November",
    dailyChallenge_December: "dailyChallenge_December",
    dailyChallenge_Monday: "dailyChallenge_Monday",
    dailyChallenge_Tuesday: "dailyChallenge_Tuesday",
    dailyChallenge_Wednesday: "dailyChallenge_Wednesday",
    dailyChallenge_Thursday: "dailyChallenge_Thursday",
    dailyChallenge_Friday: "dailyChallenge_Friday",
    dailyChallenge_Saturday: "dailyChallenge_Saturday",
    dailyChallenge_Sunday: "dailyChallenge_Sunday",
    dailyChallenge_play: "dailyChallenge_play",
    dailyChallenge_win_1: "dailyChallenge_win_1",
    dailyChallenge_win_3: "dailyChallenge_win_3",
    dailyChallenge_win_10: "dailyChallenge_win_10",
    dailyChallenge_win_28: "dailyChallenge_win_28",
    logon_reward_daily: "logon_reward_daily",
    logon_reward_claim: "logon_reward_claim",
    logon_reward_day_1: "logon_reward_day_1",
    logon_reward_day_2: "logon_reward_day_2",
    logon_reward_day_3: "logon_reward_day_3",
    logon_reward_day_4: "logon_reward_day_4",
    logon_reward_day_5: "logon_reward_day_5",
    logon_reward_day_6: "logon_reward_day_6",
    logon_reward_day_7: "logon_reward_day_7"
};

/** 本地化 图片 名字 */
export const LangImg = {
    word_logo_title: "word_logo_title",
    word_win_title: "word_win_title",
};

/** 资源类型 */
export enum TypeRes {
    PNG = "png",// 图片
    DRAGON = "dragon", // 龙骨
};

/** 游戏状态 */
export enum StateGame {
    loading = 1,// 冰冻
    menu = 1 << 1,// 提示
    game = 1 << 2,// 返回上一步
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
    /** 本地语言 */
    langCur: string = LangFile.en;
    /** 云加载 */
    isCloudLoad: boolean = false;
    /** 插屏广告开启关卡 */
    adStartLevel: number = 4;

    /** 初始数据 */
    data = {
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
        numCoin: 300,// 金币数量
        numReplay: 1,// 可以重玩的次数，限30关之前
        // 体力参数
        strength: {
            count: 5,// 当前体力值
            total: 5,// 最大体力值
            tCount: 0, // 恢复体力计时
            tTotal: 900,// 900秒恢复1体力
            buyCoin: 100,// 100金币购买1体力
            tInfinite: 0,// 无限时间
        },
        // 道具参数
        prop: {
            ice: { count: 5 },// 冰冻
            tip: { count: 5 },// 提示
            back: { count: 5 },// 返回上一步
            refresh: { count: 5 },// 刷新
            magnet: { count: 5, tInfinite: 0 },// 磁铁
            clock: { count: 5, tInfinite: 0 },// 时钟
        },
        // 宝箱相关参数（碎片宝箱）
        boxSuipian: {
            level: 1, count: 0, timeLunch: 0,
        },
        // 宝箱相关参数（关卡等级宝箱）
        boxLevel: {
            level: 1, count: 0, loop: { start: 6, length: 3, },
        },
        // 宝箱相关参数（星星宝箱）
        boxXingxing: {
            level: 1, count: 0, loop: { start: 6, length: 16, },
        },
        // 关卡数据 基础
        boxData: {
            level: 1,// 当前关卡====添加粒子效果 后面的
            areas: 1,// 当前主题
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
            // 有金币的物品
            goodGold: {
                1001: 1, 1002: 1, 1003: 1,
                // 1001: 1, 1002: 1, 1003: 1, 1004: 1, 1005: 1, 1006: 1, 1013: 1, 1014: 1, 1007: 1, 1011: 1, 1015: 1, 1010: 1,
                // 2001: 1, 2002: 1, 2003: 1, 2016: 1, 2017: 1, 2018: 1, 2022: 1, 2013: 1, 2014: 1, 2015: 1, 2021: 1, 2010: 1, 2023: 1, 2024: 1,
                // 3008: 1, 3009: 1, 3010: 1, 3013: 1, 3011: 1, 3014: 1, 3003: 1, 3015: 1, 3016: 1, 3001: 1, 3002: 1,
                // 4001: 1, 4011: 1, 4012: 1, 4013: 1, 4014: 1,
            },// 金色碎片
        },
    };

    /** 初始化数据 */
    public async initData(nodeAni: cc.Node) {
        let _data = JSON.parse(cc.sys.localStorage.getItem(CConst.localDataKey));
        if (_data) {
            // this.data = Common.clone(_data);
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
        // 提前加载 本地化 文本
        await kit.Resources.loadRes(CConst.bundleCommon, CConst.pathLanguage + this.langCur, cc.JsonAsset);
        // 提前加载 本地化 图片
        let arrName = Object.keys(LangImg);
        for (let index = 0, length = arrName.length; index < length; index++) {
            let resPath = CConst.pathImage + this.langCur + '/' + arrName[index];
            await kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.Texture2D);
        }
        // 初始化视频动画
        this.nodeVideo = nodeAni;
        this.nodeVideo.zIndex = CConst.zIndex_video;
        this.nodeVideo.active = false;
    }

    /** 多语言设置 */
    public initLanguage() {
        let language = NativeCall.checkLang(LangFile.en);
        switch (language) {
            case 'cn':
            case 'CN':
            case 'zh':
            case 'ZH':
            case 'tw':
            case 'TW':
                this.langCur = LangFile.zh;
                break;
            case 'ja':
            case 'JA':
            case 'jp':
            case 'JP':
                this.langCur = LangFile.jp;
                break;
            case 'ko':
            case 'KO':
            case 'kr':
            case 'KR':
                this.langCur = LangFile.kr;
                break;
            default:
                this.langCur = LangFile.en;
                break;
        }
        Common.log(' 初始化语言：', this.langCur);
        return this.langCur;
    }

    /** 设置游戏状态 */
    public setGameState(state: number) {
        this.stateLast = this.stateCur;
        this.stateCur = state;
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
        Common.log(' cocos checkIsPlayAds() 插屏检测 levelNow: ', levelNow, '; levelLimit: ', levelLimit);
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

    /** 获取字符串 */
    public setString(key: string, callback) {
        let resPath = CConst.pathLanguage + this.langCur;
        kit.Resources.loadRes(CConst.bundleCommon, resPath, cc.JsonAsset, (e: any, jsonAsset: cc.JsonAsset) => {
            if (jsonAsset) {
                callback && callback(jsonAsset.json[key]);
            }
        });
    };
};
export default DataManager.instance;
