import CConst from "../../../../src/config/CConst";
import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataManager from "../../../../src/config/DataManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuTop extends cc.Component {

    @property(cc.Node) labelStrengthNum: cc.Node = null;
    @property(cc.Node) labelStrengthMax: cc.Node = null;
    @property(cc.Node) labelStrengthTime: cc.Node = null;

    @property(cc.Node) labelCoinNum: cc.Node = null;

    protected onLoad(): void {
        console.log('MainMenuTop onLoad()');    
    }

    protected start(): void {
        this.init();
    }

    init() {
        this.refreshStrength();
        this.refreshCoin();
    };

    /** 刷新体力 */
    refreshStrength() {
        let count = DataManager.data.strength.count;
        this.labelStrengthNum.getComponent(cc.Label).string = '' + count;
        if (count > DataManager.data.strength.total - 1) {
            this.labelStrengthTime.active = false;
            this.labelStrengthMax.active = true;
        }
        else {
            this.labelStrengthMax.active = false;
            this.labelStrengthTime.active = true;
            if (DataManager.data.strength.tCount <= 0) {
                DataManager.data.strength.tCount = DataManager.data.strength.tTotal;
            }
            this.tStrengthRefresh();
            this.schedule(this.tStrengthUpdate, 1.0);
        }
    };

    /** 时间-更新 */
    tStrengthUpdate() {
        DataManager.data.strength.tCount--;
        if (DataManager.data.strength.tCount > 0) {
            this.tStrengthRefresh();
        }
        else {
            this.unschedule(this.tStrengthUpdate);
            DataManager.data.strength.count++;
            if (DataManager.data.strength.count > DataManager.data.strength.total) {
                DataManager.data.strength.count = DataManager.data.strength.total;
            }
            this.refreshStrength();
        }
        DataManager.setData();// 更新数据
    };

    /** 时间-设置 */
    tStrengthRefresh() {
        let count = DataManager.data.strength.tCount;
        let m = Math.floor(count / 60);
        let s = Math.floor(count % 60);
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
        console.log('点击按钮: 设置');
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_settingHome, {}, { mode: PopupCacheMode.Frequent });
    };
}
