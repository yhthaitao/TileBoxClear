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

    }

    protected onEnable(): void {
        this.init();
    }

    protected onDisable(): void {
        this.unscheduleAllCallbacks();
    }

    init() {
        this.initStrength();
        this.refreshStrength();
        this.refreshCoin();
    };

    /**
     * 初始化体力相关：　
     * 检测体力值是否满值？
     *      满值：重置时间计数为0；
     *      未满：检测时间参数是否赋值？
     *          已赋值：计算已经过去了多久　并　检测是否积累了体力？
     *              已积累体力：更新体力值，检测体力值是否已满？
     *                  已满：重置时间计数为0；
     *                  未满：重置时间计数为更新体力值后的时间；
     *          未赋值：赋值时间参数；
     */
    initStrength() {
        let count = DataManager.data.strength.count;
        if (count < DataManager.data.strength.total) {
            let timeCur = Math.floor(new Date().getTime() / 1000);
            if (DataManager.data.strength.tCount > 0) {
                let timeDis = timeCur - DataManager.data.strength.tCount;
                if (timeDis >= timeDis / DataManager.data.strength.tTotal) {
                    let strengthDis = Math.floor(timeDis / DataManager.data.strength.tTotal);
                    DataManager.data.strength.count += strengthDis;
                    if (DataManager.data.strength.count < DataManager.data.strength.total) {
                        DataManager.data.strength.tCount += strengthDis * DataManager.data.strength.tTotal;
                    }
                    else {
                        DataManager.data.strength.count = DataManager.data.strength.total;
                        DataManager.data.strength.tCount = 0;
                    }
                }
            }
            else {
                DataManager.data.strength.tCount = timeCur;
            }
        }
        else {
            DataManager.data.strength.tCount = 0;
        }
        DataManager.setData();// 更新数据
    };

    /** 刷新体力 */
    refreshStrength() {
        let count = DataManager.data.strength.count;
        this.labelStrengthNum.getComponent(cc.Label).string = '' + count;
        if (count >= DataManager.data.strength.total) {
            this.labelStrengthTime.active = false;
            this.labelStrengthMax.active = true;
        }
        else {
            this.labelStrengthMax.active = false;
            this.labelStrengthTime.active = true;
            this.updateStrength();
            this.schedule(this.updateStrength, 1.0);
        }
    };

    /** 时间-更新 */
    updateStrength() {
        let count = 0;
        let timeCur = Math.floor(new Date().getTime() / 1000);
        let timeDis = timeCur - DataManager.data.strength.tCount;
        if (timeDis < DataManager.data.strength.tTotal) {
            count = DataManager.data.strength.tTotal - timeDis;
            this.refreshTime(count);
        }
        else {
            // 更新体力
            DataManager.data.strength.tCount += DataManager.data.strength.tTotal;
            DataManager.data.strength.count++;
            if (DataManager.data.strength.count >= DataManager.data.strength.total) {
                DataManager.data.strength.count = DataManager.data.strength.total;
            }
            DataManager.setData();// 更新数据

            // 更新ui
            this.labelStrengthNum.getComponent(cc.Label).string = '' + DataManager.data.strength.count;
            timeDis = timeCur - DataManager.data.strength.tCount;
            count = DataManager.data.strength.tTotal - timeDis;
            this.refreshTime(count);
            
            // 计时结束
            if (DataManager.data.strength.count >= DataManager.data.strength.total) {
                this.labelStrengthTime.active = false;
                this.labelStrengthMax.active = true;
                this.unschedule(this.updateStrength);
            }
        }
    };

    /** 时间-设置 */
    refreshTime(count: number) {
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
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_settingHome, {}, { mode: PopupCacheMode.Frequent });
    };
}
