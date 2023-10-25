import { kit } from "../kit/kit";
import { PopupCacheMode } from "../kit/manager/popupManager/PopupManager";
import CConst from "./CConst";
import Common from "./Common";
import ConfigBuyItem, { BuyCfg, BuyKey } from "./ConfigBuyItem";
import ConfigDot from "./ConfigDot";
import { LangChars } from "./ConfigLang";
import DataManager from "./DataManager";

/** 原生交互 */
class NativeCall {
    private static _instance: NativeCall;
    public static get instance(): NativeCall {
        if (!this._instance) {
            this._instance = new NativeCall();
            cc["NativeCall"] = NativeCall;
        }
        return this._instance;
    };

    /** 云加载 开始 */
    public cloudLoadStart(): void {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: cloudLoadStart() 云加载 开始 ');
        let methodName = "loadGame";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature);
    }

    /** 云加载 成功 */
    public cloudLoadSucce(data: string) {
        Common.log(' 未实现 javaToCocos cocos method: cloudLoadSucce() ');
        DataManager.isCloudLoad = true;
        if (data.length <= 0) {
            return;
        }
    }

    /** 云加载 失败 */
    public cloudLoadError() {
        Common.log(' javaToCocos cocos method: cloudLoadError() ');
        DataManager.isCloudLoad = false;
    }

    /** 分享 */
    public share(level: string): void {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: share() 分享 ');
        this.logEventOne(CConst.event_log_share_click);
        let methodName = "share";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature, level);
    }

    /** 显示banner */
    public showBanner() {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        if (!DataManager.checkBanner()) {
            return;
        }
        Common.log(' cocosToJava cocos method: showBanner() 显示banner ');
        let methodName = "showBanner";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature);
    };

    /** 隐藏banner */
    public closeBanner = function () {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: closeBanner() 隐藏banner ');
        let methodName = "closeBanner";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature);
    };

    /** 视频 检测 */
    public videoCheck(): boolean {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return false;
        let methodName = "checkMopubRewardVideo";
        let methodSignature = "()Z";
        let isReady = jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature);
        Common.log(' cocosToJava cocos method: videoCheck() 视频 检测 ready：', isReady);
        return isReady;
    }

    funcVideoSuccess: Function = null;
    funcVideoFail: Function = null;
    /** 视频 播放 */
    public videoShow(funcA: Function, funcB: Function): void {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;

        this.funcVideoSuccess = funcA;
        this.funcVideoFail = funcB;
        Common.log(' cocosToJava cocos method: videoShow() 视频 播放 ');
        let methodName = "showMopubRewardVideo";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature);
        this.logEventOne(ConfigDot.dot_ads_request_video);
        this.logEventOne(ConfigDot.dot_ads_request_all);
    }

    public videoStart() {
        Common.log(' javaToCocos cocos method: videoStart() 视频 播放 开始 ');
    }

    /** 视频 播放完成 */
    public videoFinish() {
        Common.log(' javaToCocos cocos method: videoFinish() 视频 播放 完成 ');
        // 看完视频
        this.funcVideoSuccess && this.funcVideoSuccess();
        DataManager.updateAdCount();
        this.sTsEvent();
    }

    /** 视频 播放失败 */
    public videoFailClosed() {
        Common.log(' javaToCocos cocos method: videoFailClosed() 视频 播放 被关闭 ');
        this.funcVideoFail && this.funcVideoFail();
    }

    /** 视频 播放失败 */
    public videoFailLoad() {
        Common.log(' javaToCocos cocos method: videoFailLoad() 视频 播放 加载失败 ');
        this.funcVideoFail && this.funcVideoFail();
    }

    /** 视频 播放失败 */
    public videoFailError() {
        Common.log(' javaToCocos cocos method: videoFailError() 视频 播放 出错 ');
        this.funcVideoFail && this.funcVideoFail();
    }

    /** 插屏广告 检测 */
    public advertCheck(): boolean {
        if (DataManager.data.advert.isRemove) {
            return false;
        }

        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return false;
        let methodName = "interAdReady";
        let methodSignature = "()Z";
        let isReady = jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature);
        Common.log(' cocosToJava cocos method: advertCheck() ready：', isReady);
        return isReady;
    }

    funcAdvertSuccess: Function = null;
    funcAdvertFail: Function = null;
    /** 插屏广告 播放 */
    public advertShow(funcA: Function, funcB: Function) {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;

        this.funcAdvertSuccess = funcA;
        this.funcAdvertFail = funcB;
        Common.log(' cocosToJava cocos method: advertShow() 广告 播放 ');
        let methodName = "showInterstitial";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature);
        this.logEventOne(ConfigDot.dot_ads_request_advert);
        this.logEventOne(ConfigDot.dot_ads_request_all);
    }

    /** 插屏广告 播放完成 */
    public advertFinish() {
        Common.log(' javaToCocos cocos method: advertFinish() 广告 播放完成 ');
        this.funcAdvertSuccess && this.funcAdvertSuccess();
        DataManager.updateAdCount();
        this.sTsEvent();
    }

    /** 游戏从后台返回的调用 */
    public adsTimeTrue() {
        Common.log(' javaToCocos cocos method: adsTimeTrue() ');
        // 去广告
        if (DataManager.data.advert.isRemove) {
            Common.log('adsTimeTrue() 已去广告');
            return;
        }
        // 用户首日 不播
        let adsDays = ((new Date().valueOf() - DataManager.data.installtime) * 0.001);
        if (adsDays <= 86400) {
            Common.log('adsTimeTrue() 用户首日 不播 adsDays: ', adsDays);
            return
        }

        // 关卡等级小于13 不播
        if (DataManager.data.boxData.level <= DataManager.adStartLevel) {
            Common.log('adsTimeTrue() 关卡等级小于13 不播 boxDataLevel: ', DataManager.data.boxData.level);
            return;
        }

        // 同一关不会出现2次
        if (DataManager.backGameAdsLevel == DataManager.data.boxData.level) {
            Common.log('adsTimeTrue() 同一关 不播 backGameAdsLevel: ', DataManager.backGameAdsLevel);
            return;
        }

        let timeNow = Math.floor(new Date().getTime() * 0.001);//当前时间戳
        let timeDis = timeNow - DataManager.backGameAdsTime;
        if (timeDis < DataManager.backGameNoAdsTime) {
            Common.log('adsTimeTrue() 时间不够 不播 timeDis: ', timeDis, '; timeNeed: ', DataManager.backGameNoAdsTime);
            return;
        }

        let isReady = this.advertCheck();
        if (isReady) {
            //成功播放，才记录一下这次播放的关卡，下一次不播放。
            DataManager.backGameAdsLevel = DataManager.data.boxData.level;
            // 第一次是30s  第二次是1分钟  第三次是6分钟
            if (DataManager.backGameNoAdsTime == 30) DataManager.backGameNoAdsTime = 60;
            else if (DataManager.backGameNoAdsTime == 60) DataManager.backGameNoAdsTime = 600;

            let funcA = () => {
                // 打点 插屏播放成功（游戏从后台返回）
                this.logEventTwo(ConfigDot.dot_ads_advert_succe_back, String(DataManager.data.boxData.level));
            };
            let funcB = (err: any) => { };
            DataManager.startAdvert(funcA, funcB);
        }
    }

    public advertFail() {
        Common.log(' javaToCocos cocos method: advertFail() 广告 播放失败 ');
        this.funcAdvertFail && this.funcAdvertFail();
    }

    public outGameSaveTime() {
        Common.log(' javaToCocos cocos method: outGameSaveTime() ');
        DataManager.backGameAdsTime = Math.floor(new Date().getTime() * 0.001);//切出去后，记录一下当前时间戳
    }

    /** 无视频 */
    public NoVideo() {
        Common.log(' javaToCocos cocos method: NoVideo() 无视频 ');
        kit.Event.emit(CConst.event_notice, LangChars.notice_adLoading);
    }

    public NoNetwork() {
        Common.log(' javaToCocos cocos method: NoNetwork() 无网络 ');
        kit.Event.emit(CConst.event_notice, LangChars.notice_noNetwork);
    }

    /** 打点 回传计数 */
    public sTsEvent() {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        let count = DataManager.updateS2SCount();
        Common.log(' cocosToJava cocos method: sTsEvent() count: ', count);
        let methodName = "reportInstall2";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature, String(count));
    }

    /** 打点 带一个 字符串类型参数 */
    public logEventOne(param1: string): void {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: logEventOne() 打点（1个参数） ');
        let methodName = "facebookLogEvent";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature, param1);
    }

    /** 打点 带两个 字符串类型参数 */
    public logEventTwo(param1: string, param2: string): void {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: logEventTwo() 打点（2个参数） ');
        let methodName = "valueLogEvent";
        let methodSignature = "(Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature, param1, param2);
    }

    /** 打点 带三个 字符串类型参数 */
    public logEventThree(param1: string, param2: string, param3: string): void {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: logEventThree() 打点（3个参数） ');
        let methodName = "reqLogEvent";
        let methodSignature = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature, param1, param2, param3);
    }

    /** 打点 带四个 字符串类型参数 */
    public logEventFore(param1: string, param2: string, param3: string, param4: string): void {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: logEventFore() 打点（4个参数） ');
        let methodName = "passLevelLogEvent";
        let methodSignature = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature, param1, param2, param3, param4);
    }

    /** 应用内评价 */
    public evaluateFirst() {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: evaluateFirst() 进入游戏时调用 ');
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCreateReview", "()V");
    }

    /** 评价 */
    public evaluateShow() {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: evaluateShow() 用户评价');
        let methodName = "showComment";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature);
    }

    /** 收入设置 */
    public setRevenue(revenue: string) {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: setRevenue() ');
        let methodName = "setAdRevenue";
        let methodSignature = "(F)V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature, parseFloat(revenue));
    }

    /** 收入增加 */
    public adRevenueAdd(revenue: string) {
        Common.log(' javaToCocos cocos method: adRevenueAdd() revenue: ', revenue);
        DataManager.data.advert.revenue = revenue;
        DataManager.setData();
    }

    /**
     * 检测 本地语言
     * @param langDefault 默认语言
     * @returns 
     */
    public checkLang(langDefault: string) {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return langDefault;
        Common.log(' cocosToJava cocos method: checkLang() ');
        let language = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLanguage", "()Ljava/lang/String;");
        return language;
    }

    /*************************************************  暂无  *************************************************/
    /** 购买道具 */
    public buyItem(buyCfg: BuyCfg) {
        if (typeof (jsb) == "undefined" || cc.sys.os == cc.sys.OS_IOS) return;
        Common.log(' cocosToJava cocos method: buyItem() params: ', buyCfg);
        let methodName = "buyItem";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(CConst.javaClassName, methodName, methodSignature, buyCfg.name);
    }

    /** 购买成功 */
    public buySucc(keyString: string) {
        Common.log(' 未实现 javaToCocos cocos method: buySucc() params: ', keyString);
        let keyNumber = BuyKey[keyString];
        let produceCfg: BuyCfg = ConfigBuyItem[keyNumber];
        kit.Popup.show(CConst.popup_path_openBoxShop, produceCfg, { mode: PopupCacheMode.Frequent, isSoon: true });
        // 购买成功打点
        switch (keyNumber) {
            case BuyKey.package1:
                this.logEventTwo(ConfigDot.dot_package_005, String(DataManager.data.boxData.level));
                break;
            case BuyKey.package2:
                this.logEventTwo(ConfigDot.dot_package_009, String(DataManager.data.boxData.level));
                break;
            case BuyKey.package3:
                this.logEventTwo(ConfigDot.dot_package_018, String(DataManager.data.boxData.level));
                break;
            case BuyKey.package4:
                this.logEventTwo(ConfigDot.dot_package_040, String(DataManager.data.boxData.level));
                break;
            case BuyKey.package5:
                this.logEventTwo(ConfigDot.dot_package_070, String(DataManager.data.boxData.level));
                break;
            case BuyKey.package6:
                this.logEventTwo(ConfigDot.dot_package_100, String(DataManager.data.boxData.level));
                break;
            case BuyKey.noads:
                this.logEventTwo(ConfigDot.dot_buy_succ_noads, String(DataManager.data.boxData.level));
                break;
            case BuyKey.gold1:
                this.logEventTwo(ConfigDot.dot_buy_succ_coin_0199, String(DataManager.data.boxData.level));
                break;
            case BuyKey.gold2:
                this.logEventTwo(ConfigDot.dot_buy_succ_coin_0799, String(DataManager.data.boxData.level));
                break;
            case BuyKey.gold3:
                this.logEventTwo(ConfigDot.dot_buy_succ_coin_1399, String(DataManager.data.boxData.level));
                break;
            case BuyKey.gold4:
                this.logEventTwo(ConfigDot.dot_buy_succ_coin_2999, String(DataManager.data.boxData.level));
                break;
            case BuyKey.gold5:
                this.logEventTwo(ConfigDot.dot_buy_succ_coin_5499, String(DataManager.data.boxData.level));
                break;
            case BuyKey.gold6:
                this.logEventTwo(ConfigDot.dot_buy_succ_coin_9999, String(DataManager.data.boxData.level));
                break;
            default:
                break;
        }
    }

    /** 购买失败 */
    public buyFail(...params: any[]) {
        // Notifier.emit('BuyFailTips');
        Common.log(' 未实现 javaToCocos cocos method: buyFail() params: ', params);
        kit.Event.emit(CConst.event_notice, LangChars.notice_buyFail);
    }

    /** 购买失败 */
    public buyCancle(...params: any[]) {
        // Notifier.emit('BuyFailTips');
        Common.log(' 未实现 javaToCocos cocos method: buyCancle() params: ', params);
        kit.Event.emit(CConst.event_notice, LangChars.notice_buyCancal);
    }

    /** 设置更新 */
    public outGamePage() {
        Common.log(' 未实现 javaToCocos cocos method: outGamePage() ');
    }

    /** 加载云数据 */
    public loadGameDataDone() {
        Common.log(' 未实现 javaToCocos cocos method: loadGameDataDone() ');
    }
};
export default NativeCall.instance;