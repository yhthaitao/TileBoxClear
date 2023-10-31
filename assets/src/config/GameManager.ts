import { kit } from "../kit/kit";
import { PopupCacheMode } from "../kit/manager/popupManager/PopupManager";
import CConst from "./CConst";
import { TypeBefore } from "./ConfigCommon";
import ConfigDot from "./ConfigDot";
import DataManager from "./DataManager";
import NativeCall from "./NativeCall";

/** 数据管理类 */
class GameManager {
    private static _instance: GameManager;
    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    };

    /** 弹出before页面的关卡等级 */
    levelEnterBefore: number = 6;

    /**
     * 主菜单-开始游戏
     */
    mainMenu_startGame(typeBefore: TypeBefore) {
        let isEnterBefore = this.checkIsEnterBefore();
        if (isEnterBefore) {
            kit.Popup.show(CConst.popup_path_before, { type: typeBefore }, { mode: PopupCacheMode.Frequent });
        }
        else {
            let data = DataManager.data;
            let time = Math.floor(new Date().getTime() * 0.001);
            if (data.strength.tInfinite > time || data.strength.count > 0) {
                this.enterGameFromMenu(data.boxData.level);
            }
            else {
                kit.Popup.show(CConst.popup_path_getLives, { type: typeBefore }, { mode: PopupCacheMode.Frequent });
            }
        }
    };

    /**
     * 游戏胜利-开始游戏
     */
    gameWin_startGame(typeBefore: TypeBefore) {
        let isEnterBefore = this.checkIsEnterBefore();
        if (isEnterBefore) {
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_before, { type: typeBefore }, { mode: PopupCacheMode.Frequent });
        }
        else {
            this.enterGameFromWin(DataManager.data.boxData.level);
        }
    };

    /**
     * 游戏失败-放弃复活
     */
    gameFail_giveUp(typeBefore: TypeBefore) {
        let isEnterBefore = this.checkIsEnterBefore();
        if (isEnterBefore) {
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_before, { type: typeBefore }, { mode: PopupCacheMode.Frequent });
        }
        else {
            this.backMenuFromGame(DataManager.data.boxData.level);
        }
    };

    /**
     * 设置界面-开始游戏
     */
    setting_startGame(typeBefore: TypeBefore) {
        let isEnterBefore = this.checkIsEnterBefore();
        if (isEnterBefore) {
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_before, { type: typeBefore }, { mode: PopupCacheMode.Frequent });
        }
        else {
            let data = DataManager.data;
            let time = Math.floor(new Date().getTime() * 0.001);
            if (data.strength.tInfinite > time || data.strength.count > 0) {
                this.enterGameFromSetting(DataManager.data.boxData.level);
            }
            else {
                kit.Popup.show(CConst.popup_path_getLives, { type: typeBefore }, { mode: PopupCacheMode.Frequent });
            }
        }
    };

    /**
     * 从菜单界面进入游戏界面
     * 1.检测是否需要播放插屏
     *      是：播放插屏
     *      否：进入游戏
     * @param level 
     */
    enterGameFromMenu(level: number) {
        // 进入游戏逻辑
        let funcEnterGame = () => {
            let obj = {
                level: level,
                eventStart: CConst.event_enter_game,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
        };

        let isAdvert = DataManager.checkIsPlayAdvert(level);
        if (isAdvert) {
            DataManager.playAdvert(() => {
                // 打点 插屏播放成功（下关开始的插屏）
                NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_next, String(level));
                funcEnterGame();
            });
        }
        else {
            funcEnterGame();
        }
    };

    /**
     * 从胜利界面进入游戏界面
     * @param level 
     */
    enterGameFromWin(level: number) {
        // 进入游戏逻辑
        let funcEnterGame = () => {
            let obj = {
                level: level,
                eventStart: CConst.event_game_load,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
        };

        let isAdvert = DataManager.checkIsPlayAdvert(level);
        if (isAdvert) {
            DataManager.playAdvert(() => {
                // 打点 插屏播放成功（下关开始的插屏）
                NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_next, String(level));
                funcEnterGame();
            });
        }
        else {
            funcEnterGame();
        }
    };

    /**
     * 从失败界面进入游戏界面
     * @param level 
     */
    enterGameFromFail(level: number) {
        // 进入游戏逻辑
        let funcEnterGame = () => {
            let obj = {
                level: level,
                eventStart: CConst.event_game_reload,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
        };

        NativeCall.logEventTwo(ConfigDot.dot_gameover_restart, String(level));
        let isAdvert = DataManager.checkIsPlayAdvert(level);
        if (isAdvert) {
            DataManager.playAdvert(() => {
                // 打点 插屏播放成功（下关开始的插屏）
                NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_rePlay, String(level));
                funcEnterGame();
            });
        }
        else {
            funcEnterGame();
        }
    };

    /**
     * 从设置界面进入游戏界面
     * @param level 
     */
    enterGameFromSetting(level: number) {
        // 进入游戏逻辑
        let funcEnterGame = () => {
            let obj = {
                level: level,
                eventStart: CConst.event_game_reload,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
        };

        let isAdvert = DataManager.checkIsPlayAdvert(level);
        if (isAdvert) {
            DataManager.playAdvert(() => {
                // 打点 插屏播放成功（下关开始的插屏）
                NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_rePlay, String(level));
                funcEnterGame();
            });
        }
        else {
            funcEnterGame();
        }
    };

    /**
     * 从游戏界面进入菜单界面(设置/胜利/失败)
     * 1.检测是否需要播放插屏
     *      是：播放插屏
     *      否：进入菜单界面
     * @param level 
     */
    backMenuFromGame(level: number) {
        // 返回菜单逻辑
        let funcBackMenu = () => {
            let obj = {
                level: level,
                eventStart: CConst.event_enter_menu,
                eventFinish: CConst.event_menu_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
        };

        let isAdvert = DataManager.checkIsPlayAdvert(level);
        if (isAdvert) {
            DataManager.playAdvert(() => {
                // 打点 插屏播放成功（从游戏中返回首页）
                NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_home, String(level));
                funcBackMenu();
            });
        }
        else {
            funcBackMenu();
        }
    };

    /** 检测是否进入before页面 */
    checkIsEnterBefore(): boolean {
        return DataManager.data.boxData.level >= this.levelEnterBefore;
    };
};
export default GameManager.instance;
