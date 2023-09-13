import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager, { StateBeforeProp, StateGame, TypeProp } from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Before extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) nodeChose: cc.Node = null;
    @property(cc.Node) winLight: cc.Node = null;
    @property(cc.Node) winProcess: cc.Node = null;
    @property([cc.Node]) arrNodeWin: cc.Node[] = [];
    @property([cc.Node]) arrNodeProp: cc.Node[] = [];
    @property(cc.Node) btnPlay: cc.Node = null;

    obj = {
        win: {
            opaTrue: 255,
            opaFalse: 125,
            light: [{ x: -140, w: 110 }, { x: -10, w: 120 }, { x: 135, w: 120 },],
            process: [{ w: 108 }, { w: 244 }, { w: 384 },],
        },
    };

    protected showBefore(options: any): void {
        Common.log('Before showBefore()');

        this.resetLabel();
        this.resetWins();
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
        let labelPLay = this.btnPlay.getChildByName('label');
        labelPLay.opacity = 0;
        DataManager.setString(LangChars.gameBefore_play, (chars: string) => {
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

    /** 重置节点（连胜） */
    resetWins() {
        this.winLight.opacity = 0;
        this.winProcess.opacity = 0;
        this.arrNodeWin.forEach((win) => { win.opacity = this.obj.win.opaFalse });
        let wins = DataManager.beforeWins;
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
            this.winProcess.width = process.w;
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
            labelNum.getComponent(cc.Label).string = String(arrProp[index].count);
            backY.active = false;
            backN.active = false;
            backLock.active = false;
            signAdd.active = false;
            labelNum.active = false;
            button.active = false;
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
                    labelNum.active = true;
                    button.active = true;
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
        if (DataManager.data.strength.count > 0) {
            kit.Audio.playEffect(CConst.sound_enterGame);
            DataManager.data.strength.count--;
            DataManager.data.strength.tCount = Math.floor(new Date().getTime() / 1000);
            DataManager.setData();

            if (DataManager.stateCur == StateGame.menu) {
                kit.Event.emit(CConst.event_enter_game);
            }
            else{
                kit.Event.emit(CConst.event_win_nextLevel);
            }
        }
        else{
            kit.Event.emit(CConst.event_notice, '没体力了');
        }
    }

    /** 按钮事件 退出 */
    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await this.hide();
        if (DataManager.stateCur == StateGame.game) {
            kit.Event.emit(CConst.event_enter_menu);
        }
    }

    /** 按钮事件 道具选择 */
    eventBtnPropChose(event: cc.Event.EventTouch, custom: string) {
        kit.Audio.playEffect(CConst.sound_clickUI);

        let index = Number(custom);
        let objState = DataManager.data.beforeProp[index];
        if (!objState) {
            Common.log('Before 点击异常 sortBtn: ', index);
            return;
        }
        if (objState.state == StateBeforeProp.lock) {
            Common.log('prop 未解锁 sortBtn: ', index);
            return;
        }
        switch (objState.state) {
            case StateBeforeProp.noProp:// 解锁 无道具
                Common.log('买不起');
                break;
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
