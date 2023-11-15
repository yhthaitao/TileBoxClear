import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import { ParamsWin, StateBeforeProp, TypeBefore } from "../../../../src/config/ConfigCommon";
import GameManager from "../../../../src/config/GameManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Before extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) nodeBg: cc.Node = null;
    @property(cc.Node) nodeHard: cc.Node = null;
    @property(cc.Node) nodeWin: cc.Node = null;
    @property(cc.Node) winLight: cc.Node = null;
    @property(cc.Node) winProcess: cc.Node = null;
    @property([cc.Node]) arrNodeWin: cc.Node[] = [];
    @property(cc.Node) nodeChose: cc.Node = null;
    @property(cc.Node) nodeProp: cc.Node = null;
    @property([cc.Node]) arrNodeProp: cc.Node[] = [];
    @property(cc.Node) nodePlay: cc.Node = null;
    @property(cc.Node) nodeButton: cc.Node = null;

    obj = {
        win: {
            opaTrue: 255,
            opaFalse: 125,
            process: [{ w: 119 }, { w: 252 }, { w: 384 },],
        },
        pos: {
            unlock: { win: { y: 140 }, chose: { y: 5 }, prop: { y: -100 }, play: { y: -230 }, },
            lock: { win: { y: 130 }, chose: { y: 150 }, prop: { y: 0 }, play: { y: -180 }, },
        },
        color: {
            easy: cc.color(38, 138, 94),
            hard: cc.color(135, 51, 171),
        },
    };

    params: {
        type: TypeBefore,
        paramWin?: ParamsWin,
    };

    protected showBefore(options: any): void {
        this.listernerRegist();
        Common.log('弹窗 游戏开始前页面 showBefore()');
        this.params = Common.clone(options);
        // 初始化道具状态
        DataManager.initPropState();
        // 道具默认未选中
        let beforeProp = [DataManager.data.prop.magnet, DataManager.data.prop.clock];
        beforeProp.forEach((obj) => {
            if (obj.state == StateBeforeProp.choose) {
                obj.state = StateBeforeProp.unChoose;
            }
        });
        DataManager.setData();

        this.resetLabel();
        this.resetContent();
        this.resetProp();
    }

    protected showAfter(): void {
        // 新手引导
        let isGuide = DataManager.checkNewPlayerBefore();
        if (isGuide) {
            kit.Event.emit(CConst.event_guide_before);
        }
    }

    protected hideAfter(suspended: boolean): void {
        this.listernerIgnore();
    }

    resetLabel() {
        let level = DataManager.data.boxData.level;
        let levelParam = DataManager.getLevelData(level);
        // 困难标签
        if (levelParam.difficulty) {
            this.nodeBg.active = false;
            this.nodeHard.active = true;
        }
        else {
            this.nodeBg.active = true;
            this.nodeHard.active = false;
        }
        // 标题
        let labelTitle = this.nodeTitle.getChildByName('label');
        labelTitle.opacity = 0;
        let colorTitle = levelParam.difficulty ? this.obj.color.hard : this.obj.color.easy;
        labelTitle.getComponent(cc.LabelOutline).color = colorTitle;
        DataManager.setString(LangChars.gameBefore_level, (chars: string) => {
            let _string = chars + '  ' + level;
            labelTitle.getComponent(cc.Label).string = _string;
            labelTitle.opacity = 255;
        });
        // 选择道具
        let labelChose = this.nodeChose.getChildByName('label');
        labelChose.opacity = 0;
        DataManager.setString(LangChars.gameBefore_chose, (chars: string) => {
            let _string = chars;
            labelChose.getComponent(cc.Label).string = _string;
            labelChose.opacity = 255;
        });
        // 开始游戏
        let labelPLay = this.nodePlay.getChildByName('label');
        labelPLay.opacity = 0;
        let isRestart = this.params.type == TypeBefore.fromSetting
            || this.params.type == TypeBefore.fromFail;
        let playString = isRestart ? LangChars.exit_confirm_restart : LangChars.gameBefore_play;
        DataManager.setString(playString, (chars: string) => {
            let _string = chars;
            labelPLay.getComponent(cc.Label).string = _string;
            labelPLay.opacity = 255;
        });
        // 连胜奖励
        for (let index = 0, length = this.arrNodeWin.length; index < length; index++) {
            let labelWin = this.arrNodeWin[index].getChildByName('label');
            labelWin.opacity = 0;
            DataManager.setString(LangChars.gameBefore_wins, (chars: string) => {
                let _string = chars + (index + 1);
                labelWin.getComponent(cc.Label).string = _string;
                labelWin.opacity = 255;
            });
        }
    }

    /** 刷新节点内容 */
    resetContent() {
        // 连胜是否锁定
        let isWinsLock = DataManager.data.boxData.level < DataManager.data.wins.unlock;
        if (isWinsLock) {
            this.nodeWin.active = false;

            this.nodeChose.active = true;
            this.nodeChose.y = this.obj.pos.lock.chose.y;
            this.nodeProp.active = true;
            this.nodeProp.y = this.obj.pos.lock.prop.y;
            this.nodeButton.active = true;
            this.nodeButton.y = this.obj.pos.lock.play.y;
        }
        else {
            this.nodeWin.active = true;

            this.nodeChose.active = true;
            this.nodeChose.y = this.obj.pos.unlock.chose.y;
            this.nodeProp.active = true;
            this.nodeProp.y = this.obj.pos.unlock.prop.y;
            this.nodeButton.active = true;
            this.nodeButton.y = this.obj.pos.unlock.play.y;
        }
        if (this.nodeWin.active) {
            this.resetWins();
        }
    };

    /** 重置节点（连胜） */
    resetWins() {
        let arrLight = ['l', 'm', 'r'];
        this.winLight.opacity = 0;
        this.winProcess.opacity = 0;
        this.arrNodeWin.forEach((win) => { win.opacity = this.obj.win.opaFalse });
        let wins = DataManager.data.wins.count - DataManager.data.wins.start;
        if (wins > 0) {
            let index = wins - 1;
            // 连胜光罩
            this.winLight.opacity = 255;
            arrLight.forEach((name, id) => {
                let item = this.winLight.getChildByName(name);
                item.active = id == index;
            });
            // 连胜进度
            let process = this.obj.win.process[index];
            this.winProcess.opacity = 255;
            this.winProcess.getChildByName('bar').width = process.w;
            // 连胜节点
            this.arrNodeWin[index].opacity = this.obj.win.opaTrue;
        }
    };

    /** 重置节点（道具） */
    resetProp() {
        let _data = DataManager.data;
        let arrProp = [_data.prop.magnet, _data.prop.clock];
        for (let index = 0, length = this.arrNodeProp.length; index < length; index++) {
            let prop = this.arrNodeProp[index];
            let backY = prop.getChildByName('backY');
            let backN = prop.getChildByName('backN');
            let backLock = prop.getChildByName('backLock');
            let signAdd = prop.getChildByName('add');
            let button = prop.getChildByName('button');
            let label = prop.getChildByName('label');
            let right = prop.getChildByName('right');
            let tInfinite = prop.getChildByName('tInfinite');
            label.getComponent(cc.Label).string = String(arrProp[index].count);
            backY.active = false;
            backN.active = false;
            backLock.active = false;
            signAdd.active = false;
            label.active = false;
            button.active = false;
            right.active = false;
            tInfinite.active = false;
            let objState = arrProp[index];
            // 道具状态
            switch (objState.state) {
                case StateBeforeProp.lock:// 未解锁
                    backLock.active = true;
                    break;
                case StateBeforeProp.noProp:// 解锁 无道具
                    backN.active = true;
                    signAdd.active = true;
                    button.active = true;
                    break;
                case StateBeforeProp.unChoose:// 解锁 有道具 未选中
                    backN.active = true;
                    label.active = true;
                    button.active = true;
                    break;
                case StateBeforeProp.choose:// 解锁 有道具 选中
                    backY.active = true;
                    label.active = false;
                    button.active = true;
                    right.active = true;
                    break;
                case StateBeforeProp.infinite:
                    backY.active = true;
                    label.active = false;
                    button.active = false;
                    right.active = false;
                    tInfinite.active = true;
                    if (index == 0) {
                        this.updateMagnet();
                        this.unschedule(this.updateMagnet);
                        this.schedule(this.updateMagnet, 1.0);
                    }
                    else {
                        this.updateClock();
                        this.unschedule(this.updateClock);
                        this.schedule(this.updateClock, 1.0);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    /** 刷新-磁铁 */
    updateMagnet() {
        let tCur = Math.floor(new Date().getTime() * 0.001);
        let tCount = DataManager.data.prop.magnet.tInfinite;
        if (tCount > tCur) {
            let prop = this.arrNodeProp[0];
            let tInfinite = prop.getChildByName('tInfinite');
            this.refreshProp(tInfinite, tCount - tCur);
        }
        else {
            this.unschedule(this.updateMagnet);
            DataManager.initPropState();
            DataManager.setData();
            this.resetProp();
        }
    };

    /** 刷新-时钟 */
    updateClock() {
        let tCur = Math.floor(new Date().getTime() * 0.001);
        let tCount = DataManager.data.prop.clock.tInfinite;
        if (tCount > tCur) {
            let prop = this.arrNodeProp[1];
            let tInfinite = prop.getChildByName('tInfinite');
            this.refreshProp(tInfinite, tCount - tCur);
        }
        else {
            this.unschedule(this.updateClock);
            DataManager.initPropState();
            DataManager.setData();
            this.resetProp();
        }
    };

    refreshProp(tInfinite: cc.Node, count: number) {
        if (count >= 0) {
            tInfinite.active = true;
            let tLabel = tInfinite.getChildByName('label');
            let m = Math.floor(count / 60);
            let s = Math.floor(count % 60);
            let mm = m < 10 ? '0' + m : '' + m;
            let ss = s < 10 ? '0' + s : '' + s;
            tLabel.getComponent(cc.Label).string = mm + ':' + ss;
        }
    };

    /** 按钮事件 道具选择 */
    eventBtnPropChose(event: any, custom: string) {
        kit.Audio.playEffect(CConst.sound_clickUI);

        let index = Number(custom);
        let prop = DataManager.data.prop;
        let arrProp = [prop.magnet, prop.clock];
        let objState = arrProp[index];
        if (!objState) {
            return;
        }
        // 未解锁 返回
        if (objState.state == StateBeforeProp.lock) {
            return;
        }
        switch (objState.state) {
            case StateBeforeProp.unChoose:// 解锁 有道具 未选中
                objState.state = StateBeforeProp.choose;
                this.resetProp();
                break;
            case StateBeforeProp.choose:// 解锁 有道具 选中
                objState.state = StateBeforeProp.unChoose;
                this.resetProp();
                break;
            default:
                break;
        }
        DataManager.setData();
    }

    /** 按钮事件 添加选择 */
    eventBtnPropAdd(event: cc.Event.EventTouch, custom: string) {
        kit.Audio.playEffect(CConst.sound_clickUI);

        let index = Number(custom);
        let prop = DataManager.data.prop;
        let arrProp = [prop.magnet, prop.clock];
        let objState = arrProp[index];
        if (!objState) {
            return;
        }
        kit.Popup.show(CConst.popup_path_getProps, { prop: objState.type }, { mode: PopupCacheMode.Frequent, isSoon: true, });
    }

    /** 按钮事件 游戏开始 */
    eventBtnSure() {
        this.unschedule(this.updateMagnet);
        this.unschedule(this.updateClock);
        kit.Audio.playEffect(CConst.sound_clickUI);

        let data = DataManager.data;
        let time = Math.floor(new Date().getTime() * 0.001);
        switch (this.params.type) {
            case TypeBefore.fromMenu:// 菜单界面
                if (data.strength.tInfinite > time || data.strength.count > 0) {
                    kit.Popup.hide();
                    GameManager.enterGameFromMenu(data.boxData.level);
                }
                else {
                    kit.Popup.show(CConst.popup_path_getLives, this.params, { mode: PopupCacheMode.Frequent, isSoon: true });
                }
                break;
            case TypeBefore.fromSetting:// 游戏设置
                if (data.strength.tInfinite > time || data.strength.count > 0) {
                    GameManager.enterGameFromSetting(data.boxData.level);
                }
                else {
                    kit.Popup.show(CConst.popup_path_getLives, this.params, { mode: PopupCacheMode.Frequent, isSoon: true });
                }
                break;
            case TypeBefore.fromFail:// 游戏失败
                if (data.strength.tInfinite > time || data.strength.count > 0) {
                    GameManager.enterGameFromFail(data.boxData.level);
                }
                else {
                    kit.Popup.show(CConst.popup_path_getLives, this.params, { mode: PopupCacheMode.Frequent, isSoon: true });
                }
                break;
            case TypeBefore.fromWin:// 游戏胜利后
                GameManager.enterGameFromWin(data.boxData.level);
                break;
            default:
                kit.Popup.hide();
                break;
        }
    }

    /** 按钮事件 退出 */
    eventBtnExit() {
        this.unschedule(this.updateMagnet);
        this.unschedule(this.updateClock);
        kit.Audio.playEffect(CConst.sound_clickUI);

        switch (this.params.type) {
            case TypeBefore.fromMenu:
                kit.Popup.hide();
                break;
            default:
                GameManager.backMenuFromGame(DataManager.data.boxData.level);
                break;
        }
    }

    /** 监听-注册 */
    listernerRegist(): void {
        // 引导
        kit.Event.on(CConst.event_guide_12, this.eventBtnPropChose.bind(this, {}, '0'), this);
        kit.Event.on(CConst.event_guide_15, this.eventBtnPropChose.bind(this, {}, '1'), this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };
}
