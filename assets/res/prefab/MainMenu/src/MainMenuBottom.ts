import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuBottom extends cc.Component {

    @property(cc.Node) labelStrengthNum: cc.Node = null;
    @property(cc.Node) labelStrengthMax: cc.Node = null;
    @property(cc.Node) labelStrengthTime: cc.Node = null;

    @property(cc.Node) labelCoinNum: cc.Node = null;

    init() {
        this.refreshStrength();
        this.refreshCoin();
    };

    /** 刷新体力 */
    refreshStrength() {
        let numCur = DataManager.data.strength.numCur;
        this.labelStrengthNum.getComponent(cc.Label).string = '' + numCur;
        if (numCur > DataManager.data.strength.numTotal - 1) {
            this.labelStrengthTime.active = false;
            this.labelStrengthMax.active = true;
        }
        else {
            this.labelStrengthMax.active = false;
            this.labelStrengthTime.active = true;
            if (DataManager.data.strength.timeCur <= 0) {
                DataManager.data.strength.timeCur = DataManager.data.strength.timeNeed;
            }
            this.timeRefresh();
            this.schedule(this.timeUpdate, 1.0);
        }
    };

    /** 时间-更新 */
    timeUpdate() {
        DataManager.data.strength.timeCur--;
        if (DataManager.data.strength.timeCur > 0) {
            this.timeRefresh();
        }
        else{
            this.unschedule(this.timeUpdate);
            DataManager.data.strength.numCur++;
            if (DataManager.data.strength.numCur > DataManager.data.strength.numTotal) {
                DataManager.data.strength.numCur = DataManager.data.strength.numTotal;
            }
            this.refreshStrength();
        }
        DataManager.setData();// 更新数据
    };

    /** 时间-设置 */
    timeRefresh() {
        let timeCur = DataManager.data.strength.timeCur;
        let m = Math.floor(timeCur / 60);
        let s = Math.floor(timeCur % 60);
        let strL = m < 10 ? '0' + m : '' + m;
        let strR = s < 10 ? '0' + s : '' + s;
        let strM = ':';
        this.labelStrengthTime.getComponent(cc.Label).string = strL + strM + strR;
    };

    /** 刷新金币 */
    refreshCoin() {
        let numCoin = DataManager.data.numCoin;
        this.labelCoinNum.getComponent(cc.Label).string = '' + numCoin;
    };

    /** 按钮事件 设置 */
    eventBtnSet() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    };
}
