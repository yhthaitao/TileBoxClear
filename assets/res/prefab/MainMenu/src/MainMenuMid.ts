import { kit } from "../../../../src/kit/kit";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataManager, { TypeReward } from "../../../../src/config/DataManager";
import ConfigBoxSuipian from "../../../../src/config/ConfigBoxSuipian";
import ConfigBoxXingxing from "../../../../src/config/ConfigBoxXingxing";
import ConfigBoxLevel from "../../../../src/config/ConfigBoxLevel";

/** 主题类型 */
export enum StateTheme {
    areas = 0,// 主题栏
    commodity = 1,// 物品奖励栏
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuMid extends cc.Component {

    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片进度' }) home_top_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片时间' }) home_top_time: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-底部-开始按钮' }) home_bottom_start: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-星星宝箱进度' }) home_left_boxXing_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-右侧-等级宝箱进度' }) home_right_boxLevel_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-顶部' }) theme_top: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-主题栏' }) theme_mid_areas: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-主题栏-内同' }) theme_mid_areas_content: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-物品奖励栏' }) theme_mid_commodity: cc.Node = null;

    tElseSuipian: number = 0;
    wProcessSuipian: number = 615;// 进度条宽度（碎片宝箱）
    wProcessXingxing: number = 110;// 进度条宽度（星星宝箱）
    wProcessLevel: number = 110;// 进度条宽度（关卡等级宝箱）

    // 主题状态
    stateTheme: StateTheme = StateTheme.areas;
    objTheme = {
        title: {
            color: {
                light: cc.color(184, 135, 84),
                dark: cc.color(108, 108, 108),
            },
        },
        areas: {
            color: {
                light: cc.color(136, 64, 0),
                dark: cc.color(64, 64, 64),
            },
            config: [
                { start: 1, finish: 20 },
                { start: 21, finish: 40 },
                { start: 41, finish: 80 },
                { start: 81, finish: 120 },
                { start: 121, finish: 160 },
            ],
        },
    };

    protected onLoad(): void {
        console.log('MainMenuMid onLoad()');

        this.listernerRegist();
    }

    protected start(): void {
        this.init();
    }

    init() {
        // menu
        this.initHome();
        // theme
        this.initTheme();
    };

    /************************************************************************************************************************/
    /*********************************************************  home  *******************************************************/
    /************************************************************************************************************************/
    /** 初始化主页面 */
    initHome() {
        this.resetBoxSuipian();
        this.resetLevelStage();
        this.resetBoxXingxingProcess();
        this.resetBoxLevelProcess();
    };

    /** 刷新-碎片进度 */
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

    /** 刷新-碎片-进度条 */
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

    /** 刷新-碎片-时间 */
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
    eventBtnHomeStart() {
        console.log('点击按钮: 游戏开始');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_before, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 星星宝箱 */
    eventBtnHomeBoxXing() {
        console.log('点击按钮: 星星宝箱');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_boxXingxing, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 每日签到 */
    eventBtnHomeDaily() {
        console.log('点击按钮: 每日签到');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 等级宝箱 */
    eventBtnHomeBoxLevel() {
        console.log('点击按钮: 等级宝箱');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_boxLevel, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 银行 */
    eventBtnHomeBank() {
        console.log('点击按钮: 银行');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_bank, {}, { mode: PopupCacheMode.Frequent });
    };

    /************************************************************************************************************************/
    /*********************************************************  theme  *******************************************************/
    /************************************************************************************************************************/
    /** 重置主题 */
    initTheme() {
        this.initThemeAreas();
        this.initThemeCommodity();
        this.resetThemeButton();
    };

    initThemeAreas() {
        let item = this.theme_mid_areas.getChildByName('item');
        let objAreas = this.objTheme.areas;
        let length = objAreas.config.length;
        // 主题节点高度
        this.theme_mid_areas.height = cc.winSize.height * 0.5 + this.theme_mid_areas.y;
        // 主题容器高度
        let layout = this.theme_mid_areas_content.getComponent(cc.Layout);
        let hElse = layout.paddingTop + layout.spacingY * (length - 1) + layout.paddingBottom;
        this.theme_mid_areas_content.height = item.height * length + hElse;
        // 配置主题内容
        for (let index = 0; index < length; index++) {
            let cell = cc.instantiate(item);
            this.initThemeAreasCell(index, cell);
            cell.parent = this.theme_mid_areas_content;
        }
    };

    /** 初始化 theme areas cell */
    initThemeAreasCell(index: number, cell: cc.Node) {
        let objAreas = this.objTheme.areas;
        let level = DataManager.data.boxData.level;
        let areas = DataManager.data.boxData.areas;
        let param = objAreas.config[index];
        cell.active = true;
        cell.name = 'cell' + index;
        let backLight = cell.getChildByName('backLight');
        let backDark = cell.getChildByName('backDark');
        let labelTitle = cell.getChildByName('labelTitle');
        let labelLevel = cell.getChildByName('labelLevel');
        let right = cell.getChildByName('right');
        let lock = cell.getChildByName('lock');
        if (level > param.start - 1) {
            backLight.active = true;
            backDark.active = false;
            labelTitle.color = objAreas.color.light;
            labelLevel.color = objAreas.color.light;
            right.active = index == areas;
            lock.active = false;
        }
        else {
            backLight.active = false;
            backDark.active = true;
            labelTitle.color = objAreas.color.dark;
            labelLevel.color = objAreas.color.dark;
            right.active = false;
            lock.active = true;
        }
    };

    initThemeCommodity() {

    };

    /** 重置主题按钮 */
    resetThemeButton() {
        let objColor = this.objTheme.title.color;
        let funcSet = (isLight: boolean, button: cc.Node) => {
            button.getChildByName('light').active = isLight;
            button.getChildByName('dark').active = !isLight;
            button.getChildByName('label').color = isLight ? objColor.light : objColor.dark;
        };

        let isAreas = this.stateTheme == StateTheme.areas;
        // 主题界面按钮切换
        let btnAreas = this.theme_top.getChildByName('btnAreas');
        let btnCommodity = this.theme_top.getChildByName('btnCommodity');
        funcSet(isAreas, btnAreas);
        funcSet(!isAreas, btnCommodity);
        // 主题栏和物品奖励栏切换
        if (isAreas) {
            this.theme_mid_areas.active = true;
            this.theme_mid_commodity.active = false;
        }
        else {
            this.theme_mid_areas.active = false;
            this.theme_mid_commodity.active = true;
        }
    };

    /** 按钮事件 主题栏 */
    eventBtnThemeAreas() {
        console.log('点击按钮: 进入主题栏');
        if (this.stateTheme == StateTheme.areas) {
            return;
        }
        this.stateTheme = StateTheme.areas;
        this.resetThemeButton();
    };

    /** 按钮事件 主题选择 */
    eventBtnThemeAreasItem() {
        console.log('点击按钮: 主题栏内部选择');
    };

    /** 事件 theme-areas-scrollview */
    eventThemeAreasScrollview(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
        if (eventType == cc.ScrollView.EventType.SCROLLING) {
            this.theme_mid_areas_content.children.forEach((item) => {
                let itemY = Common.getLocalPos(item.parent, item.position, this.node).y;
                let topY = itemY + item.height * 0.5;
                let bottomY = itemY - item.height * 0.5;
                // 选项底部 超出 屏幕顶
                if (bottomY > cc.winSize.height * 0.5) {
                    item.opacity = 0;
                }
                // 选项顶部 超出 屏幕底
                else if (topY < -cc.winSize.height * 0.5) {
                    item.opacity = 0;
                }
                else {
                    item.opacity = 255;
                }
            });
        }
    };

    /** 按钮事件 物品奖励栏 */
    eventBtnThemeCommodity() {
        console.log('点击按钮: 进入物品奖励栏');
        if (this.stateTheme == StateTheme.commodity) {
            return;
        }
        this.stateTheme = StateTheme.commodity;
        this.resetThemeButton();
    };

    /************************************************************************************************************************/
    /*********************************************************  事件  *******************************************************/
    /************************************************************************************************************************/
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
