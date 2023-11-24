import { kit } from "../kit/kit";
import { PopupCacheMode } from "../kit/manager/popupManager/PopupManager";
import CConst from "./CConst";
import { ActPassParam, FromState, StateGame } from "./ConfigCommon";
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
    mainMenu_startGame(fromState: FromState) {
        let isEnterBefore = this.checkIsEnterBefore();
        if (isEnterBefore) {
            kit.Popup.show(CConst.popup_path_before, { type: fromState }, { mode: PopupCacheMode.Frequent });
        }
        else {
            let data = DataManager.data;
            let time = Math.floor(new Date().getTime() * 0.001);
            if (data.strength.tInfinite > time || data.strength.count > 0) {
                this.enterGameFromMenu(fromState);
            }
            else {
                kit.Popup.show(CConst.popup_path_getLives, { type: fromState }, { mode: PopupCacheMode.Frequent });
            }
        }
    };

    /**
     * 游戏胜利-开始游戏
     */
    gameWin_startGame(fromState: FromState) {
        let isEnterBefore = this.checkIsEnterBefore();
        if (isEnterBefore) {
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_before, { type: fromState }, { mode: PopupCacheMode.Frequent });
        }
        else {
            this.enterGameFromWin(fromState);
        }
    };

    /**
     * 游戏失败-放弃复活
     */
    gameFail_giveUp(fromState: FromState) {
        let isEnterBefore = this.checkIsEnterBefore();
        if (isEnterBefore) {
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_before, { type: fromState }, { mode: PopupCacheMode.Frequent });
        }
        else {
            this.backMenuFromGame(fromState);
        }
    };

    /**
     * 设置界面-开始游戏
     */
    setting_startGame(fromState: FromState) {
        let data = DataManager.data;
        let time = Math.floor(new Date().getTime() * 0.001);
        if (data.strength.tInfinite > time || data.strength.count > 1) {
            DataManager.data.wins.count = 0;
            DataManager.strengthReduce();
            DataManager.setData();

            let isEnterBefore = this.checkIsEnterBefore();
            if (isEnterBefore) {
                kit.Popup.hide();
                kit.Popup.show(CConst.popup_path_before, { type: fromState }, { mode: PopupCacheMode.Frequent });
            }
            else {
                this.enterGameFromSetting(fromState);
            }
        }
        else {
            kit.Popup.show(CConst.popup_path_getLives, { type: fromState }, { mode: PopupCacheMode.Frequent, isSoon: true });
        }
    };

    /**
     * 从菜单界面进入游戏界面
     * 1.检测是否需要播放插屏
     *      是：播放插屏
     *      否：进入游戏
     * @param level 
     */
    enterGameFromMenu(fromState: FromState) {
        let level = DataManager.data.boxData.level;
        let levelParam = DataManager.getCommonLevelData(level);
        let message = ConfigDot.dot_ads_advert_succe_next;
        // 进入游戏逻辑
        let funcEnterGame = () => {
            let param: ActPassParam = {
                level: level,
                difficulty: levelParam.difficulty ? 1 : 0,
                eventStart: CConst.event_enter_game,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.show(CConst.popup_path_actPass, param, { mode: PopupCacheMode.Frequent });
        };

        let funcSucces = () => {
            NativeCall.logEventTwo(message, String(level));
            funcEnterGame();
        };
        let funcFail = () => {
            funcEnterGame();
        };
        DataManager.playAdvert(funcSucces, funcFail);
    };

    /**
     * 从胜利界面进入游戏界面
     * @param level 
     */
    enterGameFromWin(fromState: FromState) {
        let level = DataManager.data.boxData.level;
        let levelParam = DataManager.getCommonLevelData(level);
        let message = ConfigDot.dot_ads_advert_succe_next;

        // 进入游戏逻辑
        let funcEnterGame = () => {
            let param: ActPassParam = {
                level: level,
                difficulty: levelParam.difficulty ? 1 : 0,
                eventStart: CConst.event_game_load,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, param, { mode: PopupCacheMode.Frequent });
        };

        let funcSucces = () => {
            NativeCall.logEventTwo(message, String(level));
            funcEnterGame();
        };
        let funcFail = () => {
            funcEnterGame();
        };
        DataManager.playAdvert(funcSucces, funcFail);
    };

    /** 从失败界面进入游戏界面 */
    enterGameFromFail(fromState: FromState) {
        let level: number;
        let levelParam: any;
        let message: string;
        if (DataManager.stateCur == StateGame.challenge) {
            level = DataManager.data.challengeData.level;
            levelParam = DataManager.getChallengeLevelData(level);
            message = ConfigDot.dot_ads_advert_succe_challenge_replay;
        }
        else {
            level = DataManager.data.boxData.level;
            levelParam = DataManager.getCommonLevelData(level);
            message = ConfigDot.dot_ads_advert_succe_rePlay;
        }
        NativeCall.logEventTwo(ConfigDot.dot_gameover_restart, String(level));
        // 进入游戏逻辑
        let funcEnterGame = () => {
            let param: ActPassParam = {
                level: level,
                difficulty: levelParam.difficulty ? 1 : 0,
                eventStart: CConst.event_game_reload,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, param, { mode: PopupCacheMode.Frequent });
        };

        let funcSucces = () => {
            NativeCall.logEventTwo(message, String(level));
            funcEnterGame();
        };
        let funcFail = () => {
            funcEnterGame();
        };
        DataManager.playAdvert(funcSucces, funcFail);
    };

    /** 从设置界面进入游戏界面 */
    enterGameFromSetting(fromState: FromState) {
        let level: number;
        let levelParam: any;
        let message: string;
        if (DataManager.stateCur == StateGame.challenge) {
            level = DataManager.data.challengeData.level;
            levelParam = DataManager.getChallengeLevelData(level);
            message = ConfigDot.dot_ads_advert_succe_challenge_replay;
        }
        else {
            level = DataManager.data.boxData.level;
            levelParam = DataManager.getCommonLevelData(level);
            message = ConfigDot.dot_ads_advert_succe_rePlay;
        }

        // 进入游戏逻辑
        let funcEnterGame = () => {
            let param: ActPassParam = {
                level: level,
                difficulty: levelParam.difficulty ? 1 : 0,
                eventStart: CConst.event_game_reload,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, param, { mode: PopupCacheMode.Frequent });
        };

        let funcSucces = () => {
            NativeCall.logEventTwo(message, String(level));
            funcEnterGame();
        };
        let funcFail = () => {
            funcEnterGame();
        };
        DataManager.playAdvert(funcSucces, funcFail);
    };

    /** 从挑战界面进入游戏界面 */
    enterGameFromChallenge(isVideo: boolean) {
        let level = DataManager.data.challengeData.level;
        let levelParam = DataManager.getChallengeLevelData(level);
        let message = ConfigDot.dot_ads_advert_succe_challenge_replay;

        // 进入游戏逻辑
        let funcEnterGame = () => {
            let param: ActPassParam = {
                level: level,
                difficulty: levelParam.difficulty ? 1 : 0,
                eventStart: CConst.event_enter_challenge,
                eventFinish: CConst.event_game_start,
            }
            kit.Popup.show(CConst.popup_path_actPass, param, { mode: PopupCacheMode.Frequent });
        };
        // 插屏关卡
        if (isVideo) {
            let funcSucces = () => {
                NativeCall.logEventTwo(message, String(level));
                funcEnterGame();
            };
            let funcFail = () => {
                funcEnterGame();
            };
            DataManager.playVideo(funcSucces, funcSucces);
        }
        else {
            funcEnterGame();
        }
    };

    /** 从游戏界面进入菜单界面(设置/胜利/失败) */
    backMenuFromGame(fromState: FromState) {
        let level: number;
        let levelParam: any;
        let message: string;
        if (DataManager.stateCur == StateGame.challenge) {
            level = DataManager.data.challengeData.level;
            message = ConfigDot.dot_ads_advert_succe_challenge_home;
            if (fromState == FromState.fromWin) {
                level -= 1;
                message = ConfigDot.dot_ads_advert_succe_challenge_win;
            }
            levelParam = DataManager.getChallengeLevelData(level);
        }
        else {
            level = DataManager.data.boxData.level;
            message = ConfigDot.dot_ads_advert_succe_home;
            if (fromState == FromState.fromWin) {
                level -= 1;
            }
            levelParam = DataManager.getCommonLevelData(level);
        }

        // 返回菜单逻辑
        let funcBackMenu = () => {
            let param: ActPassParam = {
                level: level,
                difficulty: levelParam.difficulty ? 1 : 0,
                eventStart: CConst.event_enter_menu,
                eventFinish: CConst.event_menu_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, param, { mode: PopupCacheMode.Frequent });
        };

        let funcSucces = () => {
            NativeCall.logEventTwo(message, String(level));
            funcBackMenu();
        };
        let funcFail = () => {
            funcBackMenu();
        };
        DataManager.playAdvert(funcSucces, funcFail);
    };

    /** 检测是否进入before页面 */
    checkIsEnterBefore(): boolean {
        // 游戏内 挑战模式 不显示（before）界面
        if (DataManager.stateCur == StateGame.challenge) {
            return false;
        }
        return DataManager.data.boxData.level >= this.levelEnterBefore;
    };
};
export default GameManager.instance;
