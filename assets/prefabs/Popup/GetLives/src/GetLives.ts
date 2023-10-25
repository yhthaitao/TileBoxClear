import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import { ParamsWin, TypeBefore } from "../../../../src/config/ConfigCommon";
import NativeCall from "../../../../src/config/NativeCall";
import ConfigDot from "../../../../src/config/ConfigDot";

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
        NativeCall.logEventTwo(ConfigDot.dot_ads_video_getLife_show, String(DataManager.data.boxData.level));

        this.params = Common.clone(options);
        // 标题
        DataManager.setString(LangChars.addLife_title, (chars: string) => {
            let itemLabel = this.nodeTitle.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        // 描述
        let count = DataManager.data.boxData.timesLive.count;
        let total = DataManager.data.boxData.timesLive.total;
        let button = this.btnFree.getComponent(cc.Button);
        button.interactable = count > 0;
        this.btnFree.opacity = button.interactable ? 255 : 100;
        DataManager.setString(LangChars.addCoin_desc_0, (chars: string) => {
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
            let timeCur = Math.floor(new Date().getTime() * 0.001);
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
    eventBtnRefill() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        let strength = DataManager.data.strength;
        if (strength.count >= strength.total) {
            kit.Event.emit(CConst.event_notice, LangChars.notice_strengthFull);
            return;
        }
        if (DataManager.data.numCoin < 100) {
            kit.Event.emit(CConst.event_notice, LangChars.notice_noMoreGold);
            kit.Popup.show(CConst.popup_path_getCoins, { isGoShop: false }, { mode: PopupCacheMode.Frequent, isSoon: true });
            return;
        }
        DataManager.data.strength.count += 1;
        DataManager.data.numCoin -= 100;
        DataManager.setData();
        kit.Popup.hide();
        kit.Event.emit(CConst.event_refresh_top);
    };

    /** 按钮事件 免费获取体力 */
    eventBtnFree() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        if (DataManager.data.boxData.timesLive.count <= 0) {
            kit.Event.emit(CConst.event_notice, LangChars.notice_noTimesToday);
            return;
        }
        if (DataManager.data.strength.count >= DataManager.data.strength.total) {
            kit.Event.emit(CConst.event_notice, LangChars.notice_strengthFull);
            return;
        }
        let funcA = () => {
            NativeCall.logEventTwo(ConfigDot.dot_ads_video_getLife_succe, String(DataManager.data.boxData.level));
            DataManager.data.strength.count += 1;
            DataManager.data.boxData.timesLive.count -= 1;
            DataManager.setData();
            kit.Event.emit(CConst.event_refresh_strength);
            kit.Popup.hide();
        };
        let funcB = () => {
            kit.Event.emit(CConst.event_notice, LangChars.notice_adLoading);
        };
        DataManager.playVideo(funcA, funcB);
    };

    /** 按钮事件 退出 */
    eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        switch (this.params.type) {
            case TypeBefore.fromSettingGame:// 游戏中途设置
            case TypeBefore.fromGameFail:// 游戏失败
                let funcNext = () => {
                    // 打点 插屏播放成功（从游戏中返回首页）
                    NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_home, String(DataManager.data.boxData.level));
                    let obj = {
                        eventStart: CConst.event_enter_menu,
                        eventFinish: CConst.event_menu_start,
                    }
                    kit.Popup.hide();
                    kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
                };
                DataManager.playAdvert(funcNext);
                break;
            default:
                kit.Popup.hide();
                break;
        }
    };
}
