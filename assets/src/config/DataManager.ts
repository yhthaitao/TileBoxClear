import CConst from "./CConst";
import Common from "./Common";
import ConfigDot from "./ConfigDot";
import NativeCall from "./NativeCall";

/** 设计分辨率 */
export const Design = {
    width: 720,
    height: 1560,
}

/** 游戏状态 */
export const GameState = {
    stateLoading: 1,
    stateMainMenu: 1 << 1,
    stateGame: 1 << 2,
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
    Loading: "Loading",
    sort1: "sort1",
    sort2: "sort2",
    sort3: "sort3",
    SPECIAL: "SPECIAL",
    REVIEW: "REVIEW",
    PleaseRateUs: "PleaseRateUs",// 未使用
    CannotWatchAds: "CannotWatchAds",
    LEVEL: "LEVEL",
    QUIT: "QUIT",
    OK: "OK",
    SETTING: "SETTING",
    ON: "ON",
    OFF: "OFF",
    SPECIALLEVEL: "SPECIALLEVEL",
    PLAY: "PLAY",
    SKIP: "SKIP"
};

/** 本地化 资源类型 */
export const ResType = {
    PNG: "png",
    DRAGON: "dragon",
};

/** 本地化 图片 名字 */
export const LangImg = {
    word_logo_title: "word_logo_title",
    word_win_title: "word_win_title",
};

/** 道具 */
export enum PropType {
    /** 道具 返回步数 */
    propBack = 'back',
    /** 道具 瓶子 */
    propTube = 'tube',
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
    /** 资源 */
    objResources: any = {};
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
        adsRemove: false,// 是否去除广告
        adRecord: { time: 0, level: 0 },// 上一次广告计时
        adCount: 0,// 广告计数
        s2sCount: 0,// 回传计数
        checkAdCpe: true,// 打点记录 只打一次
        isAllreadyEvaluate: false,// 是否已经评价
        installtime: new Date().valueOf(),
        revenue: '0',// 收入
        propAddTupe: 2,// 初始有两个加瓶子的道具
        // 体力参数
        strength: {
            num: 5,// 当前体力值
            tCur: 0, // 恢复体力计时
            tNeed: 900,// 900秒恢复1体力
            coin: 100,// 100金币购买1体力
        },
        numCoin: 300,// 金币数量
        numSuipian: 0,// 碎片数量
        numXingxing: 0,// 星星数量
        numReplay: 1,// 可以重玩的次数，限30关之前
        // 关卡数据 基础
        boxData: {
            level: 1,// 当前关卡====添加粒子效果 后面的
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
        let _data = JSON.parse(cc.sys.localStorage.getItem('gameData'));
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
            cc.sys.localStorage.setItem('gameData', JSON.stringify(this.data));
        }
        
        // 初始化收入
        NativeCall.setRevenue(this.data.revenue);
        // 初始化语言
        this.initLanguage();
        // 提前加载 本地化 文本
        await this.getResources('./language/text/' + this.langCur);
        // 提前加载 本地化 图片
        let arrName = Object.keys(LangImg);
        for (let index = 0, length = arrName.length; index < length; index++) {
            const element = arrName[index];
            await this.getResources('./language/img/' + this.langCur + '/' + element);
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
        cc.sys.localStorage.setItem('gameData', dataString);
        if (typeof (jsb) === 'undefined' || !isSaveCloud) {
            return;
        }
    }

    /** 检测是否有banner */
    public checkBanner() {
        if (this.data.adsRemove) {
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
        let timeRecord = this.data.adRecord.time;
        let timeLast = timeNow - timeRecord;
        let levelRecord = this.data.adRecord.level;
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
        this.data.adCount++;
        let dot = ConfigDot['dot_ad_revenue_track_flag_' + this.data.adCount];
        dot && NativeCall.logEventOne(dot);
        // 过完35关、看广告次数达到50次打点，只记一次；
        if (this.data.checkAdCpe && this.data.boxData.level > 35 && this.data.adCount >= 50) {
            this.data.checkAdCpe = false;
            NativeCall.logEventOne(ConfigDot.dot_applovin_cpe);
        }
        this.setData(false);
    };

    /** 更新回传计数 */
    public updateS2SCount(): number {
        this.data.s2sCount++;
        this.setData(false);
        return this.data.s2sCount;
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
    public async getString(key: string): Promise<string> {
        let assetJson: cc.JsonAsset = await this.getResources('./language/text/' + this.langCur);
        return assetJson.json[key];
    };

    /** 获取资源 */
    public async getResources(path: string): Promise<any> {
        if (!this.objResources[path]) {
            let asset = await this.loadResLoacl(path);
            this.objResources[path] = asset;
        }
        return this.objResources[path];
    };

    /**
     * 加载resource资源
     * @param path 
     * @returns 
     */
    public loadResLoacl(path): Promise<any> {
        return new Promise((resolve) => {
            cc.resources.load(path, function (err, asset) {
                if (err) {
                    Common.log("加载失败：", path);
                }
                else {
                    Common.log("加载资源：", path);
                    resolve(asset);
                }
            });
        });
    }
};
export default DataManager.instance;
