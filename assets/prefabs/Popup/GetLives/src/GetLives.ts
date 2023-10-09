import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager, { ParamsWin, TypeBefore } from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GetLives extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) nodeProp: cc.Node = null;
    @property(cc.Node) nodeDesc: cc.Node = null;
    @property(cc.Node) nodeClock: cc.Node = null;
    @property(cc.Node) btnRestart: cc.Node = null;
    @property(cc.Node) btnFree: cc.Node = null;

    params: {
        type: TypeBefore,
        paramWin?: ParamsWin,
    };

    protected showBefore(options: any): void {
        Common.log('弹窗 获取体力 showBefore()');
        this.params = Common.clone(options);
        // 标题
        DataManager.setString(LangChars.addLife_title, (chars: string) => {
            let itemLabel = this.nodeTitle.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        // 描述
        DataManager.setString(LangChars.addCoin_desc_0, (chars: string) => {
            let count = DataManager.data.boxData.timesLive.count;
            let total = DataManager.data.boxData.timesLive.total;
            let itemLabel = this.nodeProp.getChildByName('labelDesc');
            itemLabel.getComponent(cc.Label).string = count + '/' + total + chars;
        });
        // 描述
        DataManager.setString(LangChars.addLife_nextFill, (chars: string) => {
            let itemLabel = this.nodeDesc.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars + ':';
        });
        // 购买
        DataManager.setString(LangChars.addLife_reFill, (chars: string) => {
            let itemLabel = this.btnRestart.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        // 免费
        DataManager.setString(LangChars.addCoin_watch, (chars: string) => {
            let itemLabel = this.btnFree.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        // 时间
        this.refreshStrength();
    }

    /** 刷新体力 */
    refreshStrength() {
        let count = DataManager.data.strength.count;
        let itemLabel = this.nodeProp.getChildByName('labelNum');
        itemLabel.getComponent(cc.Label).string = '' + count;
        if (count < DataManager.data.strength.total) {
            this.updateStrength();
            this.schedule(this.updateStrength, 1.0);
        }
        else {
            let itemLabel = this.nodeClock.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = 'Max';
        }
    };

    /** 时间-更新 */
    updateStrength() {
        // 更新ui
        let count = DataManager.data.strength.count;
        let itemLabel = this.nodeProp.getChildByName('labelNum');
        itemLabel.getComponent(cc.Label).string = '' + count;

        if (count < DataManager.data.strength.total) {
            let timeCur = Math.floor(new Date().getTime() / 1000);
            let timeDis = timeCur - DataManager.data.strength.tCount;
            timeDis = timeDis % DataManager.data.strength.tTotal;
            let tCount = DataManager.data.strength.tTotal - timeDis;
            let m = Math.floor(tCount / 60);
            let s = Math.floor(tCount % 60);
            let itemTime = this.nodeClock.getChildByName('label');
            itemTime.getComponent(cc.Label).string = m + ':' + s;
        }
        else {
            this.unschedule(this.updateStrength);
            let itemTime = this.nodeClock.getChildByName('label');
            itemTime.getComponent(cc.Label).string = 'Max';
        }
    };

    /** 按钮事件 购买体力 */
    async eventBtnRefill() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        if (DataManager.data.numCoin >= 100) {
            DataManager.data.numCoin -= 100;
            DataManager.strengthResume();
            DataManager.setData();
            await kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_before, { type: this.params.type }, { mode: PopupCacheMode.Frequent });
        }
        else {
            kit.Popup.show(CConst.popup_path_getCoins, {}, { mode: PopupCacheMode.Frequent });
        }
    };

    /** 按钮事件 免费获取体力 */
    eventBtnFree() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Event.emit(CConst.event_notice, '功能暂无');
    };

    /** 按钮事件 退出 */
    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
        switch (this.params.type) {
            case TypeBefore.fromSettingGame:// 游戏中途设置
                kit.Event.emit(CConst.event_game_resume);
                break;
            case TypeBefore.fromGameFail:// 游戏失败
                await kit.Popup.show(CConst.popup_path_actPass, {}, { mode: PopupCacheMode.Frequent });
                kit.Event.emit(CConst.event_enter_menu);
                break;
            default:
                break;
        }
    };
}
