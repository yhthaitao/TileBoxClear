import { kit } from "../../../../src/kit/kit";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataManager, { TypeBefore } from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";

/** 主题类型 */
export enum StateTheme {
    areas = 0,// 主题栏
    commodity = 1,// 物品奖励栏
}

/** 动作参数（宝箱相关） */
interface ParamsAniBox {
    objBar: { node: cc.Node, time: number, goal: number },
    objLabel: { node: cc.Node, desc: string },
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuMid extends cc.Component {

    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片进度' }) home_top_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片时间' }) home_top_time: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-底部-开始按钮' }) home_bottom_start: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-星星宝箱进度' }) home_left_boxXing_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-每日签到进度' }) home_left_calendar_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-右侧-等级宝箱进度' }) home_right_boxLevel_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-银行进度' }) home_right_bank_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-顶部' }) theme_top: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-主题栏' }) theme_mid_areas: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-主题栏-内同' }) theme_mid_areas_content: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-物品奖励栏' }) theme_mid_commodity: cc.Node = null;
    @property({ type: cc.Node, tooltip: '拦截' }) menu_mask_bottom: cc.Node = null;

    obj = {
        ani: { level: false, suipian: false, xingxing: false, time: 0.25 },
    };
    tElseSuipian: number = 0;

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
        this.listernerRegist();
    }

    protected onEnable(): void {
        this.init();
    }

    protected onDisable(): void {
        this.unscheduleAllCallbacks();
    }

    init() {
        this.setIsLock(false);
        // menu
        this.initHome();
        // theme
        this.initTheme();
    };

    setIsLock(isLock) {
        if (isLock) {
            if (this.obj.ani.level && this.obj.ani.suipian && this.obj.ani.xingxing) {
                this.menu_mask_bottom.active = false;
                Common.log('功能：菜单界面 解除锁屏');
            }
        }
        else {
            this.obj.ani.level = false;
            this.obj.ani.suipian = false;
            this.obj.ani.xingxing = false;
            this.menu_mask_bottom.active = true;
            Common.log('功能：菜单界面 锁屏');
        }
    };

    playAniBox(params: ParamsAniBox): Promise<void> {
        return new Promise(res => {
            cc.tween(params.objBar.node.getComponent(cc.Sprite)).parallel(
                cc.tween().to(params.objBar.time, { fillRange: params.objBar.goal }),
                cc.tween().delay(params.objBar.time * 0.5).call(() => {
                    params.objLabel.node.getComponent(cc.Label).string = params.objLabel.desc;
                }),
            ).call(() => {
                res();
            }).start();
        });
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
        this.resetCalendarProcess();
        this.resetBankProcess();
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
    async resetBoxSuipianProcess() {
        let boxReward = DataManager.getRewardBoxSuipian();
        let count = DataManager.data.boxSuipian.count;
        let total = boxReward.total;
        // 进度条
        let itemBar = this.home_top_process.getChildByName('bar');
        itemBar.getComponent(cc.Sprite).fillStart = 0;
        itemBar.getComponent(cc.Sprite).fillRange = count / total;
        // 文本
        let itemLabel = this.home_top_process.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = count + '/' + total;
        // 进度变更
        let boxData = DataManager.data.boxSuipian;
        if (boxData.add > 0) {
            let boxCount = boxData.count;
            let boxAdd = boxData.add;
            let boxAddElse = -1;
            if (boxCount + boxAdd >= total) {
                boxAddElse = boxCount + boxAdd - total;
                boxAdd = boxAdd - boxAddElse;
            }

            // 数据变更
            boxData.count += boxData.add;
            boxData.add = 0;
            if (boxData.count >= total) {
                boxData.count -= total;
                boxData.level += 1;
                DataManager.refreshDataAfterUnlockReward(boxReward);
                console.log(JSON.stringify({ name: '碎片宝箱', param: boxReward }, null, 4));
                kit.Event.emit(CConst.event_notice, '碎片宝箱');
            }
            DataManager.setData();

            // 进度条刷新
            for (let index = 0; index < boxAdd; index++) {
                boxCount++;
                let params: ParamsAniBox = {
                    objBar: { node: itemBar, time: this.obj.ani.time, goal: boxCount / total },
                    objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                };
                await this.playAniBox(params);
            }
            // 进度条再次刷新
            if (boxAddElse >= 0) {
                // 开启宝箱

                // 进度条再次刷新
                boxCount = 0;
                total = DataManager.getRewardBoxSuipian().total;
                itemBar.width = 0;
                itemLabel.getComponent(cc.Label).string = 0 + '/' + total;
                for (let index = 0; index < boxAddElse; index++) {
                    boxCount++;
                    let params: ParamsAniBox = {
                        objBar: { node: itemBar, time: this.obj.ani.time, goal: boxCount / total },
                        objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                    };
                    await this.playAniBox(params);
                }
            }
        }

        this.obj.ani.suipian = true;
        this.setIsLock(true);
    };

    /** 刷新-碎片-时间 */
    refreshBoxSuipianTime() {
        let timeCur = Math.floor(new Date().getTime() / 1000);
        this.tElseSuipian = Common.getTimeDayFinish() - timeCur;
        this.tElseSuipianUpdate();
        this.schedule(this.tElseSuipianUpdate, 1.0);
    };

    /** 时间-更新 */
    async tElseSuipianUpdate() {
        let h = Math.floor(this.tElseSuipian / 3600);
        let mElse = this.tElseSuipian % 3600;
        let m = Math.floor(mElse / 60);
        let s = Math.floor(mElse % 60);
        // 文本
        let valueH = await DataManager.getString(LangChars.hour);
        let valueM = await DataManager.getString(LangChars.minite);
        let valueS = await DataManager.getString(LangChars.second);
        let itemLabel = this.home_top_time.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = h + valueH + ':' + m + valueM + ':' + s + valueS;
        this.tElseSuipian--;
        if (this.tElseSuipian < 0) {
            this.tElseSuipian = 0;
            this.unschedule(this.tElseSuipianUpdate);
            this.resetBoxSuipian();
        }
    };

    /** 刷新-关卡数 */
    resetLevelStage() {
        this.refreshLabel_home_bottom();
    };

    /** 刷新-星星宝箱进度 */
    async resetBoxXingxingProcess() {
        let boxReward = DataManager.getRewardBoxXinging();
        let count = DataManager.data.boxXingxing.count;
        let total = boxReward.total;
        // 进度条
        let itemBar = this.home_left_boxXing_process.getChildByName('bar');
        itemBar.getComponent(cc.Sprite).fillStart = 0;
        itemBar.getComponent(cc.Sprite).fillRange = count / total;
        // 文本
        let itemLabel = this.home_left_boxXing_process.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = count + '/' + total;
        // 进度变更
        let boxData = DataManager.data.boxXingxing;
        if (boxData.add > 0) {
            let boxCount = boxData.count;
            let boxAdd = boxData.add;
            let boxAddElse = -1;
            if (boxCount + boxAdd >= total) {
                boxAddElse = boxCount + boxAdd - total;
                boxAdd = boxAdd - boxAddElse;
            }

            // 数据变更
            boxData.count += boxData.add;
            boxData.add = 0;
            if (boxData.count >= total) {
                boxData.count -= total;
                boxData.level += 1;
                DataManager.refreshDataAfterUnlockReward(boxReward);
                console.log(JSON.stringify({ name: '星星宝箱', param: boxReward }, null, 4));
                kit.Event.emit(CConst.event_notice, '星星宝箱');
            }
            DataManager.setData();

            // 进度条刷新
            for (let index = 0; index < boxAdd; index++) {
                boxCount++;
                let params: ParamsAniBox = {
                    objBar: { node: itemBar, time: this.obj.ani.time, goal: boxCount / total },
                    objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                };
                await this.playAniBox(params);
            }

            // 进度条再次刷新
            if (boxAddElse >= 0) {
                // 开启宝箱

                // 进度条再次刷新
                boxCount = 0;
                total = DataManager.getRewardBoxXinging().total;
                itemBar.width = 0;
                itemLabel.getComponent(cc.Label).string = 0 + '/' + total;
                for (let index = 0; index < boxAddElse; index++) {
                    boxCount++;
                    let params: ParamsAniBox = {
                        objBar: { node: itemBar, time: this.obj.ani.time, goal: boxCount / total },
                        objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                    };
                    await this.playAniBox(params);
                }
            }
        }

        this.obj.ani.xingxing = true;
        this.setIsLock(true);
    };

    /** 刷新-日历进度 */
    resetCalendarProcess() {
        this.refreshLabel_home_left();
    };

    /** 刷新-等级宝箱进度 */
    async resetBoxLevelProcess() {
        let boxReward = DataManager.getRewardBoxLevel();
        let count = DataManager.data.boxLevel.count;
        let total = boxReward.total;
        // 进度条
        let itemBar = this.home_right_boxLevel_process.getChildByName('bar');
        itemBar.getComponent(cc.Sprite).fillStart = 0;
        itemBar.getComponent(cc.Sprite).fillRange = count / total;
        // 文本
        let itemLabel = this.home_right_boxLevel_process.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = count + '/' + total;
        // 进度变更
        let boxData = DataManager.data.boxLevel;
        if (boxData.add > 0) {
            let boxCount = boxData.count;
            let boxAdd = boxData.add;
            let boxAddElse = -1;
            if (boxCount + boxAdd >= total) {
                boxAddElse = boxCount + boxAdd - total;
                boxAdd = boxAdd - boxAddElse;
            }

            // 数据变更
            boxData.count += boxData.add;
            boxData.add = 0;
            if (boxData.count >= total) {
                boxData.count -= total;
                boxData.level += 1;
                DataManager.refreshDataAfterUnlockReward(boxReward);
                console.log(JSON.stringify({ name: '关卡等级宝箱', param: boxReward }, null, 4));
                kit.Event.emit(CConst.event_notice, '关卡等级宝箱');
            }
            DataManager.setData();

            // 进度条刷新
            for (let index = 0; index < boxAdd; index++) {
                boxCount++;
                let params: ParamsAniBox = {
                    objBar: { node: itemBar, time: this.obj.ani.time, goal: boxCount / total },
                    objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                };
                await this.playAniBox(params);
            }

            // 进度条再次刷新
            if (boxAddElse >= 0) {
                // 开启宝箱

                // 进度条再次刷新
                boxCount = 0;
                total = DataManager.getRewardBoxLevel().total; 
                itemBar.width = 0;
                itemLabel.getComponent(cc.Label).string = 0 + '/' + total;
                for (let index = 0; index < boxAddElse; index++) {
                    boxCount++;
                    let params: ParamsAniBox = {
                        objBar: { node: itemBar, time: this.obj.ani.time, goal: boxCount / total },
                        objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                    };
                    await this.playAniBox(params);
                }
            }
        }

        this.obj.ani.level = true;
        this.setIsLock(true);
    };

    /** 刷新-日历进度 */
    resetBankProcess() {
        this.refreshLabel_home_right();
    };

    /** 按钮事件 开始 */
    eventBtnHomeStart() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_before, { type: TypeBefore.fromMenu }, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 星星宝箱 */
    eventBtnHomeBoxXing() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_boxXingxing, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 每日签到 */
    eventBtnHomeDaily() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_daily, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 等级宝箱 */
    eventBtnHomeBoxLevel() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_boxLevel, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 银行 */
    eventBtnHomeBank() {
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
        this.initThemeButton();
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
        this.refreshLabel_theme_areas();
    };

    /** 初始化 theme areas cell */
    initThemeAreasCell(index: number, cell: cc.Node) {
        let objAreas = this.objTheme.areas;
        let level = DataManager.data.boxData.level;
        let areasId = DataManager.data.boxData.areasId;
        let choseId = index + 1;
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
            right.active = choseId == areasId;
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

    /** 初始化主题按钮 */
    initThemeButton() {
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
        this.refreshLabel_theme_top();
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
        if (this.stateTheme == StateTheme.areas) {
            return;
        }
        this.stateTheme = StateTheme.areas;
        this.resetThemeButton();
    };

    /** 按钮事件 主题选择 */
    eventBtnThemeAreasItem(event: cc.Event.EventTouch) {
        let areasId = DataManager.data.boxData.areasId;
        let chodsId = Number(event.target.name.substring(4)) + 1;
        if (chodsId == areasId) {
            return;
        }
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
        if (this.stateTheme == StateTheme.commodity) {
            return;
        }
        this.stateTheme = StateTheme.commodity;
        this.resetThemeButton();
    };

    /************************************************************************************************************************/
    /*********************************************************  事件  *******************************************************/
    /************************************************************************************************************************/
    /** 更新语言 */
    eventBack_refreshLanguage() {
        this.refreshLanguage();
    };

    eventBack_resetSuipian() {
        this.resetBoxSuipianProcess();
    }

    eventBack_resetXingxing() {
        this.resetBoxXingxingProcess();
    }

    eventBack_resetLevel() {
        this.resetBoxLevelProcess();
    }

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_refresh_language, this.eventBack_refreshLanguage, this);
        kit.Event.on(CConst.event_reset_suipian, this.eventBack_resetSuipian, this);
        kit.Event.on(CConst.event_reset_xingxing, this.eventBack_resetXingxing, this);
        kit.Event.on(CConst.event_reset_level, this.eventBack_resetLevel, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    };

    /** 更新语言 */
    refreshLanguage() {
        this.refreshLabel_home_bottom();
        this.refreshLabel_home_left();
        this.refreshLabel_home_right();
        this.refreshLabel_theme_top();
        this.refreshLabel_theme_areas();
        this.refreshLabel_theme_commodity();
    };

    /** label home bottom */
    refreshLabel_home_bottom() {
        DataManager.setString(LangChars.Level, (chars: string) => {
            let level = DataManager.data.boxData.level;
            let itemLabel = this.home_bottom_start.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars + '  ' + level;
        });
    };

    /** label home left */
    refreshLabel_home_left() {
        DataManager.setString(LangChars.Daily, (chars: string) => {
            let itemLabel = this.home_left_calendar_process.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };

    /** label home right */
    refreshLabel_home_right() {
        DataManager.setString(LangChars.Bank, (chars: string) => {
            let itemLabel = this.home_right_bank_process.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };

    /** label theme top */
    refreshLabel_theme_top() {
        // 主题界面按钮切换
        let btnAreas = this.theme_top.getChildByName('btnAreas');
        DataManager.setString(LangChars.Areas, (chars: string) => {
            let itemLabel = btnAreas.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        let btnCommodity = this.theme_top.getChildByName('btnCommodity');
        DataManager.setString(LangChars.Commodity, (chars: string) => {
            let itemLabel = btnCommodity.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };

    /** label theme areas */
    refreshLabel_theme_areas() {
        let objAreas = this.objTheme.areas;
        this.theme_mid_areas_content.children.forEach((cell) => {
            DataManager.setString(LangChars.BreakTime, (chars: string) => {
                let labelTitle = cell.getChildByName('labelTitle');
                labelTitle.getComponent(cc.Label).string = chars;
            });
            let index = cell.name.substring(4);
            let param = objAreas.config[index];
            DataManager.setString(LangChars.Level, (chars: string) => {
                let labelLevel = cell.getChildByName('labelLevel');
                labelLevel.getComponent(cc.Label).string = chars + '  ' + param.start + '-' + param.finish;
            });
        });
    };

    /** label theme commodity */
    refreshLabel_theme_commodity() {

    };
}
