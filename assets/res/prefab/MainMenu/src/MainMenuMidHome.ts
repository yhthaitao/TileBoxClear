import { kit } from "../../../../src/kit/kit";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataManager from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";
import { StateGame, FromState, PropType } from "../../../../src/config/ConfigCommon";
import GameManager from "../../../../src/config/GameManager";

/** 动作参数（宝箱相关） */
interface ParamsAniBox {
    objBar: { node: cc.Node, time: number, goal: number },
    objLabel: { node: cc.Node, desc: string },
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuMidHome extends cc.Component {

    @property({ type: cc.Node, tooltip: '内容' }) content: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-金币图标' }) uiTop_coin_sign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-体力图标' }) uiTop_strength_sign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-背景' }) home_bg: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片icon' }) home_top_icon: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片图标' }) home_top_sign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片进度' }) home_top_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-碎片时间' }) home_top_time: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-奖励道具' }) home_top_prop: cc.Node = null;
    @property({ type: [cc.SpriteFrame], tooltip: '主菜单-顶部-奖励道具' }) arr_home_top_prop: cc.SpriteFrame[] = [];
    @property({ type: cc.Node, tooltip: '主菜单-底部-开始按钮' }) home_bottom_button: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-底部-开始按钮' }) home_bottom_btnSign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-星星宝箱' }) home_left_boxXing: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-挑战按钮' }) home_left_challenge: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-顶部-星星宝箱图标' }) home_left_boxXing_sign: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-星星宝箱进度' }) home_left_boxXing_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-每日签到进度' }) home_left_challenge_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-右侧-等级宝箱进度' }) home_right_boxLevel_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主菜单-左侧-银行进度' }) home_right_bank_process: cc.Node = null;
    @property({ type: cc.Node, tooltip: '拦截' }) menu_mask_bottom: cc.Node = null;

    obj = {
        ani: { boxLevel: false, boxSuipian: false, boxXingxing: false, time: 0.5 },
    };
    tElseSuipian: number = 0;

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
        this.setIsLock(true);
        // menu
        this.initHome();
    };

    /************************************************************************************************************************/
    /*********************************************************  home  *******************************************************/
    /************************************************************************************************************************/
    /** 初始化主页面 */
    initHome() {
        this.resetBg();
        this.resetHard();
        this.resetLevelStage();
        this.resetBoxSuipian();
        this.resetBoxXingxing();
        this.resetBoxLevel();

        this.resetCalendar();
        this.resetBank();
    };

    async homeStart() {
        await this.resetBoxSuipianProcess();
        await this.resetBoxXingxingProcess();
        await this.resetBoxLevelProcess();
        await this.resetBoxAreas();
        this.resetChallenge();
        this.scheduleOnce(()=>{
            this.setIsLock(false);
        }, 0.25);
    };

    resetBg() {
        let pathBg = CConst.pathThemeBg + DataManager.data.boxAreas.cur;
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

    resetHard() {
        let level = DataManager.data.boxData.level;
        let levelParam = DataManager.getCommonLevelData(level);
        // 标签
        let easy = this.home_bottom_button.getChildByName('easy');
        let hard = this.home_bottom_button.getChildByName('hard');
        if (levelParam.difficulty) {
            easy.active = false;
            hard.active = true;
            this.home_bottom_btnSign.active = true;
        }
        else {
            easy.active = true;
            hard.active = false;
            this.home_bottom_btnSign.active = false;
        }
    };

    /** 刷新-碎片进度 */
    resetBoxSuipian() {
        let boxReward = DataManager.getRewardBoxSuipian();
        // 进度条
        let count = DataManager.data.boxSuipian.count;
        let total = boxReward.total;
        let bar = this.home_top_process.getChildByName('bar');
        bar.getComponent(cc.Sprite).fillRange = count / total;
        let label = this.home_top_process.getChildByName('label');
        label.getComponent(cc.Label).string = count + '/' + total;

        // 奖励
        let types = [
            PropType.coin,
            PropType.ice, PropType.tip, PropType.back, PropType.refresh, PropType.magnet, PropType.clock,
            PropType.tStrengthInfinite,
        ];
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
        itemIcon.scale = Math.min(this.home_top_prop.width / itemIcon.width, this.home_top_prop.height / itemIcon.height);

        let str = '+' + reward.number;
        if (reward.type == PropType.tStrengthInfinite) {
            str = '+' + Math.floor(reward.number / 60) + 'm';
        }
        let propLabel = this.home_top_prop.getChildByName('label');
        propLabel.getComponent(cc.Label).string = str;

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
                boxReward.reward.forEach((reward) => {
                    DataManager.refreshDataByReward(reward);
                });
            }
            DataManager.setData();

            // 进度条
            let itemBar = this.home_top_process.getChildByName('bar');
            itemBar.getComponent(cc.Sprite).fillRange = boxCount / total;
            // 文本
            let itemLabel = this.home_top_process.getChildByName('label');
            // 进度条刷新
            for (let index = 0; index < boxAdd; index++) {
                boxCount++;
                let params: ParamsAniBox = {
                    objBar: { node: itemBar, time: this.obj.ani.time / boxAdd, goal: boxCount / total },
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
                let pButton = Common.getLocalPos(this.home_bottom_button.parent, this.home_bottom_button.position, this.node);
                pButton.y += this.home_bottom_button.height;
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
                itemBar.getComponent(cc.Sprite).fillRange = 0;
                itemLabel.getComponent(cc.Label).string = 0 + '/' + total;
                for (let index = 0; index < boxAddElse; index++) {
                    boxCount++;
                    let params: ParamsAniBox = {
                        objBar: { node: itemBar, time: this.obj.ani.time / boxAddElse, goal: boxCount / total },
                        objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                    };
                    await this.playAniBox(params);
                }

                await new Promise((_res) => {
                    cc.Canvas.instance.scheduleOnce(_res, 0.75);
                });
            }
        }

        this.obj.ani.boxSuipian = true;
    };

    /** 刷新-碎片-时间 */
    refreshBoxSuipianTime() {
        let timeCur = Math.floor(new Date().getTime() * 0.001);
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
            sign.getChildByName('label').getComponent(cc.Label).string = '+' + boxData.add;
            sign.parent = this.content;
            sign.active = true;
            let pGoal = Common.getLocalPos(this.home_left_boxXing_sign.parent, this.home_left_boxXing_sign.position, this.content);
            let pStart = cc.v3(pGoal.x + 150, pGoal.y);
            await DataManager.playAniXingxing(sign, pStart, pGoal);
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
            }
            DataManager.setData();

            // 进度条
            let itemBar = this.home_left_boxXing_process.getChildByName('bar');
            itemBar.getComponent(cc.Sprite).fillRange = boxCount / total;
            // 文本
            let itemLabel = this.home_left_boxXing_process.getChildByName('label');
            // 进度条刷新
            for (let index = 0; index < boxAdd; index++) {
                boxCount++;
                let params: ParamsAniBox = {
                    objBar: { node: itemBar, time: this.obj.ani.time / boxAdd, goal: boxCount / total },
                    objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                };
                await this.playAniBox(params);
            }

            // 进度条再次刷新
            if (boxAddElse >= 0) {
                // 开启宝箱
                let pStrength = Common.getLocalPos(this.uiTop_strength_sign.parent, this.uiTop_strength_sign.position, this.node);
                let pCoin = Common.getLocalPos(this.uiTop_coin_sign.parent, this.uiTop_coin_sign.position, this.node);
                let pButton = Common.getLocalPos(this.home_bottom_button.parent, this.home_bottom_button.position, this.node);
                pButton.y += this.home_bottom_button.height;
                let param = {
                    pStrength: { x: pStrength.x, y: pStrength.y },
                    pCoin: { x: pCoin.x, y: pCoin.y },
                    pProp: { x: pButton.x, y: pButton.y },
                    rewards: boxReward
                };
                await kit.Popup.show(CConst.popup_path_openBoxXingxing, param, { mode: PopupCacheMode.Frequent });
                // 进度条再次刷新
                boxCount = 0;
                total = DataManager.getRewardBoxXinging().total;
                itemBar.getComponent(cc.Sprite).fillRange = 0;
                itemLabel.getComponent(cc.Label).string = 0 + '/' + total;
                for (let index = 0; index < boxAddElse; index++) {
                    boxCount++;
                    let params: ParamsAniBox = {
                        objBar: { node: itemBar, time: this.obj.ani.time / boxAddElse, goal: boxCount / total },
                        objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                    };
                    await this.playAniBox(params);
                }

                await new Promise((_res) => {
                    cc.Canvas.instance.scheduleOnce(_res, 0.75);
                });
            }
        }

        this.obj.ani.boxXingxing = true;
    };

    resetBoxLevel() {
        let boxReward = DataManager.getRewardBoxLevel();
        let count = DataManager.data.boxLevel.count;
        let total = boxReward.total;

        // 进度条
        let itemBar = this.home_right_boxLevel_process.getChildByName('bar');
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
            let isBoxLevelFirst = false;
            boxData.count += boxData.add;
            boxData.add = 0;
            if (boxData.count >= total) {
                boxData.count -= total;
                if (boxData.level == 1) {
                    isBoxLevelFirst = true;
                }
                boxData.level += 1;
            }
            DataManager.setData();

            // 进度条
            let itemBar = this.home_right_boxLevel_process.getChildByName('bar');
            itemBar.getComponent(cc.Sprite).fillRange = boxCount / total;
            // 文本
            let itemLabel = this.home_right_boxLevel_process.getChildByName('label');
            // 进度条刷新
            for (let index = 0; index < boxAdd; index++) {
                boxCount++;
                let params: ParamsAniBox = {
                    objBar: { node: itemBar, time: this.obj.ani.time / boxAdd, goal: boxCount / total },
                    objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                };
                await this.playAniBox(params);
            }

            // 进度条再次刷新
            if (boxAddElse >= 0) {
                // 开启宝箱
                let pStrength = Common.getLocalPos(this.uiTop_strength_sign.parent, this.uiTop_strength_sign.position, this.node);
                let pCoin = Common.getLocalPos(this.uiTop_coin_sign.parent, this.uiTop_coin_sign.position, this.node);
                let pButton = Common.getLocalPos(this.home_bottom_button.parent, this.home_bottom_button.position, this.node);
                pButton.y += this.home_bottom_button.height;
                let param = {
                    pStrength: { x: pStrength.x, y: pStrength.y },
                    pCoin: { x: pCoin.x, y: pCoin.y },
                    pProp: { x: pButton.x, y: pButton.y },
                    rewards: boxReward
                };
                await kit.Popup.show(CConst.popup_path_openBoxLevel, param, { mode: PopupCacheMode.Frequent });

                // 进度条再次刷新
                boxCount = 0;
                total = DataManager.getRewardBoxLevel().total;
                itemBar.getComponent(cc.Sprite).fillRange = boxCount / total;
                itemLabel.getComponent(cc.Label).string = 0 + '/' + total;
                for (let index = 0; index < boxAddElse; index++) {
                    boxCount++;
                    let params: ParamsAniBox = {
                        objBar: { node: itemBar, time: this.obj.ani.time / boxAddElse, goal: boxCount / total },
                        objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                    };
                    await this.playAniBox(params);
                }

                await new Promise((_res) => {
                    cc.Canvas.instance.scheduleOnce(_res, 0.75);
                });

                if (isBoxLevelFirst && !DataManager.data.isEvaluate) {
                    await kit.Popup.show(CConst.popup_path_evaluate);
                }
            }
        }

        this.obj.ani.boxLevel = true;
    };

    /** 刷新挑战按钮 */
    resetCalendar() {
        this.home_left_challenge.active = DataManager.data.boxData.level > 20;
        this.refreshHomeLabelLeft();
    };

    /** 刷新银行 */
    resetBank() {
        this.refreshHomeLabelRight();
    };

    async resetBoxAreas() {
        let boxAreas = DataManager.data.boxAreas;
        if (boxAreas.new > boxAreas.cur) {
            await kit.Popup.show(CConst.popup_path_openBoxAreas, {}, { mode: PopupCacheMode.Frequent });
        }
    }

    resetChallenge() {
        if (DataManager.stateLast == StateGame.game) {
            let data = DataManager.data;
            if (data.boxData.level > 20 && data.challengeData.guide.isTouchChallenge) {
                data.challengeData.guide.isTouchChallenge = false;
                DataManager.setData();
                // 挑战引导
                let point = Common.getLocalPos(this.home_left_challenge.parent, this.home_left_challenge.position, this.node);
                let params = {
                    name: 'challenge1',
                    itemPosition: { x: point.x, y: point.y, },
                    handPosition: { x: point.x + 220, y: point.y, },
                    descPosition: { x: 0, y: 0, },
                };
                kit.Event.emit(CConst.event_guide_challenge, params);
            }
        }
        else if (DataManager.stateLast == StateGame.challenge) {
            kit.Popup.show(CConst.popup_path_challenge, {}, { mode: PopupCacheMode.Frequent });
        }
    }

    setIsLock(isLock): void {
        if (isLock) {
            this.obj.ani.boxLevel = false;
            this.obj.ani.boxSuipian = false;
            this.obj.ani.boxXingxing = false;
            this.menu_mask_bottom.active = true;
            Common.log('功能：菜单界面 锁屏');
        }
        else {
            if (this.obj.ani.boxLevel && this.obj.ani.boxSuipian && this.obj.ani.boxXingxing) {
                this.menu_mask_bottom.active = false;
                Common.log('功能：菜单界面 解除锁屏');
            }
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

    playAniScaleBtnstart() {
        this.home_bottom_button.getComponent(cc.Animation).play();
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
            PropType.coin,
            PropType.ice, PropType.tip, PropType.back, PropType.refresh, PropType.magnet, PropType.clock,
            PropType.tStrengthInfinite,
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
        itemIcon.scale = Math.min(this.home_top_prop.width / itemIcon.width, this.home_top_prop.height / itemIcon.height);

        let str = '+' + reward.number;
        if (reward.type == PropType.tStrengthInfinite) {
            str = '+' + Math.floor(reward.number / 60) + 'm';
        }
        let itemLabel = this.home_top_prop.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = str;

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
        cc.tween(this.home_top_prop).to(0.15, { scale: scale1 }).delay(1.0).parallel(
            cc.tween().bezierTo(time, obj.p1, obj.p2, obj.pT0),
            cc.tween().to(time, { scale: scale0 }),
        ).start();
    };

    /** 按钮事件 开始 */
    eventBtnHomeStart() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        GameManager.mainMenu_startGame(FromState.fromMenu);
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

    /** 按钮事件 挑战 */
    eventBtnHomeChallenge() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_challenge, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 银行 */
    eventBtnHomeBank() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_bank, {}, { mode: PopupCacheMode.Frequent });
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
        kit.Event.on(CConst.event_menu_start, this.homeStart, this);
        kit.Event.on(CConst.event_refresh_areas, this.resetBg, this);
        kit.Event.on(CConst.event_refresh_language, this.eventBack_refreshLanguage, this);
        kit.Event.on(CConst.event_scale_prop, this.playAniScaleBtnstart, this);
        kit.Event.on(CConst.event_scale_suipian, this.playAniScaleSuipian, this);
        kit.Event.on(CConst.event_scale_xingxingBox, this.playAniScaleXingxing, this);
        kit.Event.on(CConst.event_menu_updateSuipianReward, this.playAniReviveSuipianReward, this);
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
    };

    /** label home bottom */
    refreshHomeLabelBottom() {
        DataManager.setString(LangChars.Level, (chars: string) => {
            let level = DataManager.data.boxData.level;
            let itemLabel = this.home_bottom_button.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars + '  ' + level;
        });
    };

    /** label home left */
    refreshHomeLabelLeft() {
        DataManager.setString(LangChars.Daily, (chars: string) => {
            let itemLabel = this.home_left_challenge_process.getChildByName('label');
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
}

