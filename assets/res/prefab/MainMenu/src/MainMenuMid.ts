import { kit } from "../../../../src/kit/kit";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataManager, { TypeReward } from "../../../../src/config/DataManager";
import ConfigBoxSuipian from "../../../../src/config/ConfigBoxSuipian";
import ConfigBoxXingxing from "../../../../src/config/ConfigBoxXingxing";
import ConfigBoxLevel from "../../../../src/config/ConfigBoxLevel";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuMid extends cc.Component {

    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片进度' }) home_top_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片时间' }) home_top_time: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-底部-开始按钮' }) home_bottom_start: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-星星宝箱进度' }) home_left_boxXing_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-右侧-等级宝箱进度' }) home_right_boxLevel_process: cc.Node = null;

    tElseSuipian: number = 0;
    wProcessSuipian: number = 615;// 进度条宽度（碎片宝箱）
    wProcessXingxing: number = 110;// 进度条宽度（星星宝箱）
    wProcessLevel: number = 110;// 进度条宽度（关卡等级宝箱）

    protected onLoad(): void {
        console.log('MainMenuMid onLoad()');

        this.listernerRegist();
    }

    protected start(): void {
        this.init();
    }

    init() {
        this.resetBoxSuipian();
        this.resetLevelStage();
        this.resetBoxXingxingProcess();
        this.resetBoxLevelProcess();
    };

    resetBoxSuipian() {
        // 重置数据（碎片宝箱）
        let boxData = DataManager.data.boxSuipian;
        let funcInit = () => {
            boxData.level = 1;
            boxData.count = 0;
            boxData.timeLunch = Common.getTimeDayFinish();
        };
        // 第一次启动游戏
        if (boxData.timeLunch <= 0) {
            funcInit();
        }
        else {
            // 时间来到另一天
            let timeCur = Math.floor(new Date().getTime() / 1000);
            if (timeCur >= boxData.timeLunch) {
                funcInit();
            }
        }
        this.resetBoxSuipianProcess();
        this.refreshBoxSuipianTime();
    };

    /** 刷新-碎片进度 */
    resetBoxSuipianProcess() {
        let boxData = DataManager.data.boxSuipian;
        let count = boxData.count;
        // 查找对应奖励数据
        let index = boxData.level;
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
        let total = config.total;
        // 进度条
        let itemBar = this.home_top_process.getChildByName('bar');
        itemBar.width = this.wProcessSuipian * count / total;
        // 文本
        let itemLabel = this.home_top_process.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = count + '/' + total;
    };

    /** 刷新-碎片时间 */
    refreshBoxSuipianTime() {
        let timeCur = Math.floor(new Date().getTime() / 1000);
        this.tElseSuipian = Common.getTimeDayFinish() - timeCur;
        this.tElseSuipianUpdate();
        this.schedule(this.tElseSuipianUpdate, 1.0);
    };

    /** 时间-更新 */
    tElseSuipianUpdate() {
        let h = Math.floor(this.tElseSuipian / 3600);
        let mElse = this.tElseSuipian % 3600;
        let m = Math.floor(mElse / 60);
        let s = Math.floor(mElse % 60);
        // 文本
        let itemLabel = this.home_top_time.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = h + 'h:' + m + 'm:' + s + 's';
        this.tElseSuipian--;
        if (this.tElseSuipian < 0) {
            this.tElseSuipian = 0;
            this.unschedule(this.tElseSuipianUpdate);
            this.resetBoxSuipian();
        }
    };

    /** 刷新-关卡数 */
    resetLevelStage() {
        let level = DataManager.data.boxData.level;
        // 文本
        let itemLabel = this.home_bottom_start.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = 'Level  ' + level;
    };

    /** 刷新-星星宝箱进度 */
    resetBoxXingxingProcess() {
        let boxData = DataManager.data.boxXingxing;
        let count = boxData.count;
        // 查找对应奖励数据
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
        let total = config.total;
        // 进度条
        let itemBar = this.home_left_boxXing_process.getChildByName('bar');
        itemBar.width = this.wProcessXingxing * count / total;
        // 文本
        let itemLabel = this.home_left_boxXing_process.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = count + '/' + total;
    };

    /** 刷新-等级宝箱进度 */
    resetBoxLevelProcess() {
        let boxData = DataManager.data.boxLevel;
        let count = boxData.count;
        // 查找对应奖励数据
        let index = boxData.level;
        if (index < 1) {
            index = 1;
        }
        else {
            if (index > boxData.loop.start - 1) {
                index = boxData.loop.start + (index - boxData.loop.start) % boxData.loop.length;
            }
        }
        let config: TypeReward = ConfigBoxLevel[index];
        let total = config.total;
        // 进度条
        let itemBar = this.home_right_boxLevel_process.getChildByName('bar');
        itemBar.width = this.wProcessLevel * count / total;
        // 文本
        let itemLabel = this.home_right_boxLevel_process.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = count + '/' + total;
    };

    /** 按钮事件 开始 */
    eventBtnStart() {
        console.log('点击按钮: 游戏开始');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Event.emit(CConst.event_enter_game);
    };

    /** 按钮事件 星星宝箱 */
    eventBtnBoxXing() {
        console.log('点击按钮: 星星宝箱');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 每日签到 */
    eventBtnDaily() {
        console.log('点击按钮: 每日签到');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 等级宝箱 */
    eventBtnBoxLevel() {
        console.log('点击按钮: 等级宝箱');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 银行 */
    eventBtnBank() {
        console.log('点击按钮: 银行');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_reset_suipian, this.eventBack_resetSuipian, this);
        kit.Event.on(CConst.event_reset_xingxing, this.eventBack_resetXingxing, this);
        kit.Event.on(CConst.event_reset_level, this.eventBack_resetLevel, this);
    }

    eventBack_resetSuipian() {
        this.resetBoxSuipianProcess();
    }

    eventBack_resetXingxing() {
        this.resetBoxXingxingProcess();
    }

    eventBack_resetLevel() {
        this.resetBoxLevelProcess();
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    }
}
