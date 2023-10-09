import { kit } from "../../../../src/kit/kit";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataManager, { TypeBefore, TypeProp } from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";
import ConfigAchieve from "../../../../src/config/ConfigAchieve";
import ConfigGood from "../../../../src/config/ConfigGood";

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

    @property({ type: cc.Node, tooltip: '主菜单-顶部-金币图标' }) uiTop_coin_sign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-体力图标' }) uiTop_strength_sign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-背景' }) home_bg: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片icon' }) home_top_icon: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片图标' }) home_top_sign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片进度' }) home_top_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片时间' }) home_top_time: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-奖励道具' }) home_top_prop: cc.Node = null;
    @property({ type: [cc.SpriteFrame], tooltip: '主菜单-顶部-奖励道具' }) arr_home_top_prop: cc.SpriteFrame[] = [];
    @property({ type: cc.Node, tooltip: '主菜单-底部-开始按钮' }) home_bottom_start: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-星星宝箱' }) home_left_boxXing: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-星星宝箱图标' }) home_left_boxXing_sign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-星星宝箱进度' }) home_left_boxXing_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-每日签到进度' }) home_left_calendar_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-右侧-等级宝箱进度' }) home_right_boxLevel_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-银行进度' }) home_right_bank_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-顶部' }) theme_top: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-主题栏' }) theme_mid_areas: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-主题栏-内容' }) theme_mid_areas_content: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-成就栏' }) theme_mid_commodity: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-成就栏-内容' }) theme_mid_commodity_content: cc.Node = null;
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
            title: {
                color: {
                    light: cc.color(253, 240, 224),
                    dark: cc.color(64, 64, 64),
                },
            },
            level: {
                color: {
                    light: cc.color(136, 64, 0),
                    dark: cc.color(64, 64, 64),
                },
            },
        },
        commodity: [
            {}, {}, {}, {}, {}, {}, 
            {}, {}, {}, {}, {}, {},
        ],
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

    init(): void {
        this.setIsLock(false);
        // menu
        this.initHome();
        // theme
        this.initTheme();
    };

    setIsLock(isLock): void {
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
    async initHome() {
        this.resetBg();
        this.resetLevelStage();
        this.resetBoxSuipian();
        this.resetBoxXingxing();
        this.resetBoxLevel();

        this.resetCalendar();
        this.resetBank();

        await this.resetBoxSuipianProcess();
        await this.resetBoxXingxingProcess();
        await this.resetBoxLevelProcess();
    };

    resetBg() {
        let pathBg = CConst.pathThemeBg + DataManager.data.boxData.areasId;
        kit.Resources.loadRes(CConst.bundleCommon, pathBg, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 bg: ', pathBg);
                return;
            }
            this.home_bg.active = true;
            this.home_bg.getComponent(cc.Sprite).spriteFrame = assets;
            this.home_bg.opacity = 0;
            cc.tween(this.home_bg).to(0.5, { opacity: 255 }).start();
        });
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
        if (boxData.timeLunch <= 0) {// 第一次启动游戏
            funcInit();
        }
        else {// 时间来到另一天
            let timeCur = Math.floor(new Date().getTime() / 1000);
            if (timeCur >= boxData.timeLunch) {
                funcInit();
            }
        }

        let boxReward = DataManager.getRewardBoxSuipian();
        // 进度条
        let count = boxData.count;
        let total = boxReward.total;
        let processBar = this.home_top_process.getChildByName('bar');
        processBar.getComponent(cc.Sprite).fillStart = 0;
        processBar.getComponent(cc.Sprite).fillRange = count / total;
        let processLabel = this.home_top_process.getChildByName('label');
        processLabel.getComponent(cc.Label).string = count + '/' + total;

        // 奖励
        let types = [
            TypeProp.coin,
            TypeProp.ice, TypeProp.tip, TypeProp.back, TypeProp.refresh, TypeProp.magnet, TypeProp.clock,
            TypeProp.tStrengthInfinite,
        ];
        let reward = boxReward.reward[0];
        let index = types.indexOf(reward.type);
        if (index < 0) {
            index = 0;
        }
        else if (index > types.length - 1) {
            index = types.length - 1;
        }
        let propIcon = this.home_top_prop.getChildByName('icon');
        propIcon.getComponent(cc.Sprite).spriteFrame = this.arr_home_top_prop[index];
        let num = reward.type == TypeProp.tStrengthInfinite ? Math.floor(reward.number / 60) : reward.number;
        let propLabel = this.home_top_prop.getChildByName('label');
        propLabel.getComponent(cc.Label).string = '+' + num;

        this.refreshBoxSuipianTime();
    };

    /** 刷新-碎片-进度条 */
    async resetBoxSuipianProcess() {
        // 进度变更
        let boxData = DataManager.data.boxSuipian;
        if (boxData.add > 0) {
            // 增加碎片
            let sign = cc.instantiate(this.home_top_sign);
            let signLabel = sign.getChildByName('label');
            signLabel.getComponent(cc.Label).string = '+' + boxData.add;
            sign.parent = this.node;
            sign.active = true;
            sign.position = cc.v3();
            let pGoal = Common.getLocalPos(this.home_top_sign.parent, this.home_top_sign.position, this.node);
            let obj = {
                p1: cc.v2(sign.x, sign.y),
                p2: cc.v2(pGoal.x, sign.y),
                pTo: cc.v2(pGoal.x, pGoal.y),
                time: Common.getMoveTime(sign.position, pGoal, 1, 1500),
            };
            await DataManager.playAniReward(sign, obj);
            kit.Event.emit(CConst.event_scale_suipian);

            let boxReward = DataManager.getRewardBoxSuipian();
            let total = boxReward.total;

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
            }
            DataManager.setData();

            // 进度条
            let itemBar = this.home_top_process.getChildByName('bar');
            // 文本
            let itemLabel = this.home_top_process.getChildByName('label');
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
                let pStart = Common.getLocalPos(this.home_top_prop.parent, this.home_top_prop.position, this.node);
                let pStrength = Common.getLocalPos(this.uiTop_strength_sign.parent, this.uiTop_strength_sign.position, this.node);
                let pCoin = Common.getLocalPos(this.uiTop_coin_sign.parent, this.uiTop_coin_sign.position, this.node);
                let pButton = Common.getLocalPos(this.home_bottom_start.parent, this.home_bottom_start.position, this.node);
                let param = {
                    pStart: { x: pStart.x, y: pStart.y },
                    pStrength: { x: pStrength.x, y: pStrength.y },
                    pCoin: { x: pCoin.x, y: pCoin.y },
                    pButton: { x: pButton.x, y: pButton.y },
                    rewards: boxReward
                };
                this.home_top_prop.active = false;
                await kit.Popup.show(CConst.popup_path_openBoxSuipian, param, { mode: PopupCacheMode.Frequent });

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
        this.refreshHomeLabelBottom();
    };

    resetBoxXingxing() {
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
    };

    /** 刷新-星星宝箱进度 */
    async resetBoxXingxingProcess() {
        // 进度变更
        let boxData = DataManager.data.boxXingxing;
        if (boxData.add > 0) {
            // 增加星星
            let sign = cc.instantiate(this.home_left_boxXing_sign);
            let signLabel = sign.getChildByName('label');
            signLabel.getComponent(cc.Label).string = '+' + boxData.add;
            sign.parent = this.home_left_boxXing_sign.parent;
            sign.active = true;
            let pGoal = this.home_left_boxXing_sign.position;
            let pStart = cc.v3(pGoal.x + 150, pGoal.y);
            sign.position = pStart;
            let obj = {
                p1: cc.v2(sign.x, sign.y),
                p2: cc.v2((sign.x + pGoal.x) * 0.5, sign.y + 100),
                pTo: cc.v2(pGoal.x, pGoal.y),
                time: Common.getMoveTime(sign.position, pGoal, 1, 1500),
            };
            await DataManager.playAniReward(sign, obj);
            kit.Event.emit(CConst.event_scale_xingxingBox);

            let boxReward = DataManager.getRewardBoxXinging();
            let total = boxReward.total;

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
            }
            DataManager.setData();

            // 进度条
            let itemBar = this.home_left_boxXing_process.getChildByName('bar');
            // 文本
            let itemLabel = this.home_left_boxXing_process.getChildByName('label');
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
                let pCoin = Common.getLocalPos(this.uiTop_coin_sign.parent, this.uiTop_coin_sign.position, this.node);
                let pProp = Common.getLocalPos(this.home_bottom_start.parent, this.home_bottom_start.position, this.node);
                let param = { pCoin: { x: pCoin.x, y: pCoin.y }, pProp: { x: pProp.x, y: pProp.y }, rewards: boxReward };
                await kit.Popup.show(CConst.popup_path_openBoxXingxing, param, { mode: PopupCacheMode.Frequent });
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

    resetBoxLevel() {
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
    };

    /** 刷新-等级宝箱进度 */
    async resetBoxLevelProcess() {
        // 进度变更
        let boxData = DataManager.data.boxLevel;
        if (boxData.add > 0) {
            let boxReward = DataManager.getRewardBoxLevel();
            let total = boxReward.total;

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
            }
            DataManager.setData();

            // 进度条
            let itemBar = this.home_right_boxLevel_process.getChildByName('bar');
            // 文本
            let itemLabel = this.home_right_boxLevel_process.getChildByName('label');
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
                let pStrength = Common.getLocalPos(this.uiTop_strength_sign.parent, this.uiTop_strength_sign.position, this.node);
                let pBtnStart = Common.getLocalPos(this.home_bottom_start.parent, this.home_bottom_start.position, this.node);
                let param = { pStrength: { x: pStrength.x, y: pStrength.y }, pBtnStart: { x: pBtnStart.x, y: pBtnStart.y }, rewards: boxReward };
                await kit.Popup.show(CConst.popup_path_openBoxLevel, param, { mode: PopupCacheMode.Frequent });

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

    /** 刷新日历 */
    resetCalendar() {
        this.refreshHomeLabelLeft();
    };

    /** 刷新银行 */
    resetBank() {
        this.refreshHomeLabelRight();
    };

    playAniScaleBtnstart() {
        this.home_bottom_start.getComponent(cc.Animation).play();
    };

    playAniScaleSuipian() {
        this.home_top_icon.getComponent(cc.Animation).play();
    };

    playAniScaleXingxing() {
        let button = this.home_left_boxXing.getChildByName('button');
        let sign = button.getChildByName('sign');
        sign.getComponent(cc.Animation).play();
    };

    playAniReviveSuipianReward(x: number, y: number, scale0: number, scale1: number) {
        this.home_top_prop.active = true;
        // 刷新道具
        let types = [
            TypeProp.coin,
            TypeProp.ice, TypeProp.tip, TypeProp.back, TypeProp.refresh, TypeProp.magnet, TypeProp.clock,
            TypeProp.tStrengthInfinite,
        ];
        let boxReward = DataManager.getRewardBoxSuipian();
        let reward = boxReward.reward[0];
        let index = types.indexOf(reward.type);
        if (index < 0) {
            index = 0;
        }
        else if (index > types.length - 1) {
            index = types.length - 1;
        }
        let itemIcon = this.home_top_prop.getChildByName('icon');
        itemIcon.getComponent(cc.Sprite).spriteFrame = this.arr_home_top_prop[index];

        let itemLabel = this.home_top_prop.getChildByName('label');
        let num = reward.type == TypeProp.tStrengthInfinite ? Math.floor(reward.number / 60) : reward.number;
        itemLabel.getComponent(cc.Label).string = '+' + num;

        let p1 = Common.getLocalPos(this.node, cc.v3(x, y), this.home_top_prop.parent);
        let p2 = this.home_top_prop.position;
        let time = Common.getMoveTime(p1, p2, 1, 1500);
        this.home_top_prop.position = p1;
        this.home_top_prop.scale = 0;
        let obj = {
            p1: cc.v2(p1.x, p1.y),
            p2: cc.v2(p2.x, p1.y),
            pT0: cc.v2(p2.x, p2.y),
        };
        cc.tween(this.home_top_prop).to(0.3, { scale: scale1 }).delay(1.0).parallel(
            cc.tween().bezierTo(time, obj.p1, obj.p2, obj.pT0),
            cc.tween().to(time, { scale: scale0 }),
        ).start();
    };

    /** 按钮事件 开始 */
    eventBtnHomeStart() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_before, { type: TypeBefore.fromMenu }, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 开始 */
    eventBtnHomeBoxSuipian() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_boxSuipian, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 星星宝箱 */
    eventBtnHomeBoxXing() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_boxXingxing, {}, { mode: PopupCacheMode.Frequent });
    };


    /** 按钮事件 等级宝箱 */
    eventBtnHomeBoxLevel() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_boxLevel, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 每日签到 */
    eventBtnHomeDaily() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_daily, {}, { mode: PopupCacheMode.Frequent });
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
        this.initAreasList();
        this.initCommodityList();
        this.initThemeButton();
    };

    /** 初始化 theme areas list */
    initAreasList() {
        let item = this.theme_mid_areas.getChildByName('item');
        let length = 15;
        // 主题节点高度
        this.theme_mid_areas.height = cc.winSize.height * 0.5 + this.theme_mid_areas.y;
        // 主题容器高度
        let layout = this.theme_mid_areas_content.getComponent(cc.Layout);
        let hElse = layout.paddingTop + layout.spacingY * (length - 1) + layout.paddingBottom;
        this.theme_mid_areas_content.height = item.height * length + hElse;
        // 配置主题内容
        for (let index = 0; index < length; index++) {
            let name = 'cell' + index;
            let cell = this.theme_mid_areas_content.getChildByName(name);
            if (!cell) {
                cell = cc.instantiate(item);
                cell.name = name;
            }
            cell.active = true;
            cell.parent = this.theme_mid_areas_content;
            this.initAreasCell(index, cell);
        }
        this.refreshAreasItem();
        this.refreshAreasLabel();
    };

    /** 初始化 theme areas cell */
    initAreasCell(index: number, cell: cc.Node) {
        let objAreas = this.objTheme.areas;
        let level = DataManager.data.boxData.level;
        let areasId = DataManager.data.boxData.areasId;
        let choseId = index + 1;
        let back = cell.getChildByName('back');
        let pathBack = '';
        back.active = false;
        let icon = cell.getChildByName('icon');
        let pathIcon = '';
        icon.active = false;
        let labelTitle = cell.getChildByName('labelTitle');
        let labelLevel = cell.getChildByName('labelLevel');
        let right = cell.getChildByName('right');
        let lock = cell.getChildByName('lock');
        let levelAreas = this.getLevelAreas(index);
        if (level > levelAreas.start - 1) {
            pathBack = CConst.pathThemeUnLock + 'back';
            pathIcon = CConst.pathThemeUnLock + (index + 1);
            labelTitle.color = objAreas.title.color.light;
            labelTitle.getComponent(cc.LabelOutline).width = 2;
            labelLevel.color = objAreas.level.color.light;
            right.active = choseId == areasId;
            lock.active = false;
            cell.getComponent(cc.Button).interactable = true;
        }
        else {
            pathBack = CConst.pathThemeLock + 'back';
            pathIcon = CConst.pathThemeLock + (index + 1);
            labelTitle.color = objAreas.title.color.dark;
            labelTitle.getComponent(cc.LabelOutline).width = 0;
            labelLevel.color = objAreas.level.color.dark;
            right.active = false;
            lock.active = true;
            cell.getComponent(cc.Button).interactable = false;
        }
        kit.Resources.loadRes(CConst.bundleCommon, pathBack, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 back: ', pathBack);
                return;
            }
            back.active = true;
            back.getComponent(cc.Sprite).spriteFrame = assets;
        });
        kit.Resources.loadRes(CConst.bundleCommon, pathIcon, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 icon: ', pathBack);
                return;
            }
            icon.active = true;
            icon.getComponent(cc.Sprite).spriteFrame = assets;
        });
    };

    /** 初始化 theme commodity list */
    initCommodityList() {
        let length = 12;
        let lenHeight = 6;
        let item = this.theme_mid_commodity.getChildByName('item');
        let layout = this.theme_mid_commodity_content.getComponent(cc.Layout);
        let hElse = layout.paddingTop + layout.spacingY * (lenHeight - 1) + layout.paddingBottom;
        this.theme_mid_commodity_content.height = item.height * lenHeight + hElse;
        // 所有物品
        let objGoods = {};
        ConfigGood.goodsConf.forEach((obj) => { objGoods[obj.id] = obj; });
        // 组合物品
        let arrGoods = [];
        let goodUnlock = DataManager.data.boxData.goodUnlock;
        for (const key in goodUnlock) {
            if (Object.prototype.hasOwnProperty.call(goodUnlock, key)) {
                const element = goodUnlock[key];
                arrGoods = arrGoods.concat(element);
            }
        }
        // 组合成就
        let arrAchieve = [
            [], [], [], [],
            [], [], [], [],
            [], [], [], []
        ];
        arrGoods.forEach((goodId: number) => {
            ConfigAchieve.forEach((achieve, index) => {
                // 成就内包含该物品
                if (achieve.goods.indexOf(goodId) >= 0) {
                    if (arrAchieve[index]) {
                        arrAchieve[index].push(goodId);
                    }
                }
            });
        });

        // 配置主题内容
        for (let index = 0; index < length; index++) {
            let name = 'cell' + index;
            let cell = this.theme_mid_commodity_content.getChildByName(name);
            if (!cell) {
                cell = cc.instantiate(item);
                cell.name = name;
            }
            cell.active = true;
            cell.parent = this.theme_mid_commodity_content;
            this.initCommodityCell(index, arrAchieve[index], objGoods, cell);
        }
        this.refreshCommodityItem();
        this.refreshCommodityLabel();
    };

    /** 初始化 theme commodity cell */
    initCommodityCell(index: number, arrGoods: number[], objGoods: any, cell: cc.Node) {
        let colorId = 0;
        let objAchieve = ConfigAchieve[index];
        let nodeIcon = cell.getChildByName('nodeIcon');
        let lock = cell.getChildByName('lock');
        let process = cell.getChildByName('process');
        let reward = cell.getChildByName('reward');
        let right = cell.getChildByName('right');
        lock.active = false;
        process.active = false;
        reward.active = false;
        right.active = false;
        let lenArr = arrGoods.length;
        let lenObj = objAchieve.goods.length;
        // 解锁物品为 全部
        if (lenArr >= lenObj) {
            nodeIcon.active = true;
            cell.zIndex = 0;
            colorId = index % 8 + 1;
            // 奖品是否领取
            let isGet = DataManager.data.boxAchieve[index];
            if (isGet) {
                right.active = true;
            }
            else {
                reward.active = true;
                process.active = true;
                let bar = process.getChildByName('bar');
                bar.getComponent(cc.Sprite).fillRange = 1;
                let label = process.getChildByName('label');
                label.getComponent(cc.Label).string = '' + lenArr + '/' + lenObj;
            }
        }
        // 解锁物品为 0
        else if (lenArr <= 0) {
            nodeIcon.active = false;
            cell.zIndex = 1;
            colorId = 0;
            lock.active = true;
        }
        // 其他情况
        else {
            nodeIcon.active = true;
            cell.zIndex = 0;
            colorId = index % 8 + 1;
            reward.active = true;
            process.active = true;
            let bar = process.getChildByName('bar');
            bar.getComponent(cc.Sprite).fillRange = lenArr / lenObj;
            let label = process.getChildByName('label');
            label.getComponent(cc.Label).string = '' + lenArr + '/' + lenObj;
        }
        // back
        let pathBack = CConst.pathAchieve + 'color_' + colorId;
        kit.Resources.loadRes(CConst.bundleCommon, pathBack, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 initCommodityCell back: ', pathBack);
                return;
            }
            let back = cell.getChildByName('back');
            back.getComponent(cc.Sprite).spriteFrame = assets;
        });
        // icon
        if (nodeIcon.active) {
            let pathIcon = CConst.pathGameGood + objGoods[objAchieve.icon].name;
            kit.Resources.loadRes(CConst.bundleCommon, pathIcon, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
                if (err) {
                    Common.log(' 资源加载异常 initCommodityCell icon: ', pathIcon);
                    return;
                }
                let icon = nodeIcon.getChildByName('icon');
                icon.getComponent(cc.Sprite).spriteFrame = assets;
                if (icon.width > icon.height) {
                    icon.scale = (icon.parent.width - 30) / icon.width;
                }
                else {
                    icon.scale = (icon.parent.height - 30) / icon.height;
                }
            });
        }

        // 保存数据(用于点击成就按钮)
        let keyTitle = 'achieve_' + (index + 1);
        let params = { keyTitle: keyTitle, arrGoods: arrGoods, objAchieve: objAchieve };
        this.objTheme.commodity[index] = params;
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
        this.refreshThemeLabelTop();
    };

    /** 按钮事件 进入 主题 */
    eventBtnAreas() {
        if (this.stateTheme == StateTheme.areas) {
            return;
        }
        this.stateTheme = StateTheme.areas;
        this.resetThemeButton();
    };

    /** 按钮事件 进入 成就 */
    eventBtnCommodity() {
        if (this.stateTheme == StateTheme.commodity) {
            return;
        }
        this.stateTheme = StateTheme.commodity;
        this.resetThemeButton();
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

    /** 获取主题关卡范围 */
    getLevelAreas(index: number): { start: number, finish: number } {
        let start = 1;
        let finish = 1;
        let length = 1;
        if (index < 2) {
            length = 20;
            start = index * length + 1;
            finish = start + length - 1;
        }
        else {
            length = 40;
            start = (index - 1) * length + 1;
            finish = start + length - 1;
        }
        return { start: start, finish: finish };
    }

    /** 按钮事件 选择 主题 */
    eventAreasBtn(event: cc.Event.EventTouch) {
        let areasId = DataManager.data.boxData.areasId;
        let chodsId = Number(event.target.name.substring(4)) + 1;
        if (chodsId == areasId) {
            return;
        }
        DataManager.data.boxData.areasId = chodsId;
        DataManager.setData();
        kit.Event.emit(CConst.event_menu_updateTheme);

        // 更新主题
        this.theme_mid_areas_content.children.forEach((cell) => {
            let id = Number(cell.name.substring(4)) + 1;
            let right = cell.getChildByName('right');
            right.active = id == DataManager.data.boxData.areasId;
            if (right.active) {

            }
        });
    };

    /** 事件 滑动 主题 */
    eventAreasScrollview(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
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

    /** 事件 刷新 主题 */
    refreshAreasItem(){
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
    };

    /** 按钮事件 选择 成就 */
    eventCommodityBtn(event: cc.Event.EventTouch) {
        let index = Number(event.target.name.substring(4));
        let params = Common.clone(this.objTheme.commodity[index]);
        kit.Popup.show(CConst.popup_path_achieve, params, { mode: PopupCacheMode.Frequent });
    };

    /** 事件 滑动 成就 */
    eventCommodityScrollview(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
        if (eventType == cc.ScrollView.EventType.SCROLLING) {
            this.refreshCommodityItem();
        }
    };

    /** 刷新 成就 */
    refreshCommodityItem(){
        this.theme_mid_commodity_content.children.forEach((item) => {
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
    };
    /************************************************************************************************************************/
    /*********************************************************  事件  *******************************************************/
    /************************************************************************************************************************/
    /** 更新语言 */
    eventBack_refreshLanguage() {
        this.refreshLanguage();
    };

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_refresh_language, this.eventBack_refreshLanguage, this);
        kit.Event.on(CConst.event_scale_prop, this.playAniScaleBtnstart, this);
        kit.Event.on(CConst.event_scale_suipian, this.playAniScaleSuipian, this);
        kit.Event.on(CConst.event_scale_xingxingBox, this.playAniScaleXingxing, this);
        kit.Event.on(CConst.event_menu_updateSuipianReward, this.playAniReviveSuipianReward, this);
        kit.Event.on(CConst.event_menu_updateTheme, this.resetBg, this);
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
        this.refreshHomeLabelBottom();
        this.refreshHomeLabelLeft();
        this.refreshHomeLabelRight();
        this.refreshThemeLabelTop();
        this.refreshAreasLabel();
        this.refreshCommodityLabel();
    };

    /** label home bottom */
    refreshHomeLabelBottom() {
        DataManager.setString(LangChars.Level, (chars: string) => {
            let level = DataManager.data.boxData.level;
            let itemLabel = this.home_bottom_start.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars + '  ' + level;
        });
    };

    /** label home left */
    refreshHomeLabelLeft() {
        DataManager.setString(LangChars.Daily, (chars: string) => {
            let itemLabel = this.home_left_calendar_process.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };

    /** label home right */
    refreshHomeLabelRight() {
        DataManager.setString(LangChars.Bank, (chars: string) => {
            let itemLabel = this.home_right_bank_process.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };

    /** label theme top */
    refreshThemeLabelTop() {
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
    refreshAreasLabel() {
        this.theme_mid_areas_content.children.forEach((cell) => {
            let index = Number(cell.name.substring(4));
            DataManager.setString(LangChars['areas_' + (index + 1)], (chars: string) => {
                if (chars) {
                    let labelTitle = cell.getChildByName('labelTitle');
                    labelTitle.getComponent(cc.Label).string = chars;
                }
            });
            let levelAreas = this.getLevelAreas(index);
            DataManager.setString(LangChars.Level, (chars: string) => {
                let labelLevel = cell.getChildByName('labelLevel');
                labelLevel.getComponent(cc.Label).string = chars + '  ' + levelAreas.start + '-' + levelAreas.finish;
            });
        });
    };

    /** label theme commodity */
    refreshCommodityLabel() {
        this.theme_mid_commodity_content.children.forEach((cell) => {
            let index = Number(cell.name.substring(4));
            DataManager.setString(LangChars['achieve_' + (index + 1)], (chars: string) => {
                if (chars) {
                    let labelTitle = cell.getChildByName('labelTitle');
                    labelTitle.getComponent(cc.Label).string = chars;
                }
            });
        });
    };
}

