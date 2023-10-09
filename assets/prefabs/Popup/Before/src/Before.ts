import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager, { ParamsWin, StateBeforeProp, StateGame, TypeBefore, TypeFinish, TypeProp } from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Before extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
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
            light: [{ x: -140, w: 110 }, { x: -10, w: 120 }, { x: 135, w: 120 },],
            process: [{ w: 108 }, { w: 244 }, { w: 384 },],
        },
        pos: {
            unlock: { win: { y: 140 }, chose: { y: 5 }, prop: { y: -100 }, play: { y: -230 }, },
            lock: { win: { y: 130 }, chose: { y: 150 }, prop: { y: 0 }, play: { y: -180 }, },
        },
    };

    params: {
        type: TypeBefore,
        paramWin?: ParamsWin,
    };

    protected showBefore(options: any): void {
        Common.log('弹窗 游戏开始前页面 showBefore()');
        this.params = Common.clone(options);
        this.resetLabel();
        this.resetContent();
        this.resetProp();
    }

    resetLabel() {
        // 标题
        let labelTitle = this.nodeTitle.getChildByName('label');
        labelTitle.opacity = 0;
        DataManager.setString(LangChars.gameBefore_level, (chars: string) => {
            let _string = chars + '  ' + DataManager.data.boxData.level;
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
        let isRestart = this.params.type == TypeBefore.fromSettingGame
            || this.params.type == TypeBefore.fromGameFail;
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
        this.winLight.opacity = 0;
        this.winProcess.opacity = 0;
        this.arrNodeWin.forEach((win) => { win.opacity = this.obj.win.opaFalse });
        let wins = DataManager.data.wins.count - DataManager.data.wins.start;
        if (wins > 0) {
            let index = wins - 1;
            // 连胜光罩
            let light = this.obj.win.light[index]
            this.winLight.opacity = 255;
            this.winLight.x = light.x;
            this.winLight.width = light.w;
            // 连胜进度
            let process = this.obj.win.process[index];
            this.winProcess.opacity = 255;
            this.winProcess.getChildByName('bar').width = process.w;
            console.log('wins: ', wins, '; index: ', index, '; x: ', light.x, '; width: ', process.w);
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
            let labelNum = prop.getChildByName('label');
            let right = prop.getChildByName('right');
            labelNum.getComponent(cc.Label).string = String(arrProp[index].count);
            backY.active = false;
            backN.active = false;
            backLock.active = false;
            signAdd.active = false;
            labelNum.active = false;
            button.active = false;
            right.active = false;
            let objState = DataManager.data.beforeProp[index];
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
                    labelNum.active = true;
                    button.active = true;
                    break;
                case StateBeforeProp.choose:// 解锁 有道具 选中
                    backY.active = true;
                    labelNum.active = false;
                    button.active = true;
                    right.active = true;
                    break;
                default:
                    break;
            }
        }
    }

    /** 按钮事件 游戏开始 */
    async eventBtnSure() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        switch (this.params.type) {
            case TypeBefore.fromMenu:
                if (DataManager.data.strength.count > 0) {
                    let funcNext = async () => {
                        await kit.Popup.show(CConst.popup_path_actPass, {}, { mode: PopupCacheMode.Frequent });
                        kit.Event.emit(CConst.event_enter_game);
                    };
                    DataManager.playAdvert(funcNext);
                }
                else {
                    kit.Popup.show(CConst.popup_path_getLives, this.params, { mode: PopupCacheMode.Frequent });
                }
                break;
            case TypeBefore.fromSettingGame:// 游戏中途设置
            case TypeBefore.fromGameFail:// 游戏失败
                if (DataManager.data.strength.count > 0) {
                    let funcNext = async () => {
                        // 重新开始游戏 中断连胜
                        DataManager.data.wins.count = 0;
                        DataManager.setData();
                        await kit.Popup.show(CConst.popup_path_actPass, {}, { mode: PopupCacheMode.Frequent });
                        kit.Event.emit(CConst.event_game_restart);
                    };
                    DataManager.playAdvert(funcNext);
                }
                else {
                    kit.Popup.show(CConst.popup_path_getLives, this.params, { mode: PopupCacheMode.Frequent });
                }
                break;
            case TypeBefore.fromGameWin:// 游戏胜利后
                await kit.Popup.show(CConst.popup_path_actPass, {}, { mode: PopupCacheMode.Frequent });
                kit.Event.emit(CConst.event_game_start);
                break;
            default:
                break;
        }
    }

    /** 按钮事件 退出 */
    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        switch (this.params.type) {
            case TypeBefore.fromSettingGame:// 游戏中途设置 进入重新开始界面 点击退出
            case TypeBefore.fromGameFail:// 游戏失败 进入重新开始界面 点击退出
                let funcNext = async () => {
                    // 游戏失败 中断连胜
                    DataManager.data.wins.count = 0;
                    DataManager.setData();
                    await kit.Popup.show(CConst.popup_path_actPass, {}, { mode: PopupCacheMode.Frequent });
                    kit.Event.emit(CConst.event_enter_menu);
                };
                DataManager.playAdvert(funcNext);
                break;
            case TypeBefore.fromGameWin:// 胜利界面 进入菜单页（恢复消除的体力）
                kit.Event.emit(CConst.event_enter_menu);
                break;
            default:
                break;
        }
    }

    /** 按钮事件 道具选择 */
    eventBtnPropChose(event: cc.Event.EventTouch, custom: string) {
        kit.Audio.playEffect(CConst.sound_clickUI);

        let index = Number(custom);
        let objState = DataManager.data.beforeProp[index];
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
}
