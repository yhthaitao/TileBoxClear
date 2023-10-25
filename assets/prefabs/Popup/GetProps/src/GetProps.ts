import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import { StateGame, TypeProp, coinsBuyMagnet, coinsBuyClock } from "../../../../src/config/ConfigCommon";
import NativeCall from "../../../../src/config/NativeCall";
import ConfigDot from "../../../../src/config/ConfigDot";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GetProps extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) nodeDesc: cc.Node = null;
    @property(cc.Node) nodeProp: cc.Node = null;
    @property([cc.SpriteFrame]) spriteFrames: cc.SpriteFrame[] = [];

    options: {
        prop: TypeProp,
    } = null;

    protected showBefore(options: any): void {
        this.options = Common.clone(options);
        Common.log('弹窗 获取道具 showBefore()');
        let funcMagnet = () => {
            // 标题
            DataManager.setString(LangChars.addMagnet_title, (chars: string) => {
                let itemLabel = this.nodeTitle.getChildByName('label');
                itemLabel.getComponent(cc.Label).string = chars;
            });
            // 描述
            DataManager.setString(LangChars.addMagnet_desc, (chars: string) => {
                let itemLabel = this.nodeDesc.getChildByName('label');
                itemLabel.getComponent(cc.Label).string = chars;
            });
            let icon = this.nodeProp.getChildByName('icon');
            icon.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[0];
        };
        let funcClock = () => {
            // 标题
            DataManager.setString(LangChars.addClock_title, (chars: string) => {
                let itemLabel = this.nodeTitle.getChildByName('label');
                itemLabel.getComponent(cc.Label).string = chars;
            });
            // 描述
            DataManager.setString(LangChars.addClock_desc, (chars: string) => {
                let itemLabel = this.nodeDesc.getChildByName('label');
                itemLabel.getComponent(cc.Label).string = chars;
            });
            let icon = this.nodeProp.getChildByName('icon');
            icon.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[1];
        };

        switch (this.options.prop) {
            case TypeProp.magnet:
                funcMagnet();
                break;
            case TypeProp.clock:
                funcClock();
                break;
            default:
                break;
        }
    }

    /** 按钮事件 免费获取 */
    eventBtnBuy() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        let coins = 0;
        switch (this.options.prop) {
            case TypeProp.magnet:
                coins = coinsBuyMagnet;
                break;
            case TypeProp.clock:
                coins = coinsBuyClock;
                break;
            default:
                break;
        }
        if (DataManager.data.numCoin < coins) {
            kit.Event.emit(CConst.event_notice, LangChars.notice_noMoreGold);
            kit.Popup.show(CConst.popup_path_getCoins, { isGoShop: false }, { mode: PopupCacheMode.Frequent, isSoon: true, });
            return;
        }

        switch (this.options.prop) {
            case TypeProp.magnet:
                NativeCall.logEventTwo(ConfigDot.dot_buy_succ_magnet, String(DataManager.data.boxData.level));
                DataManager.data.prop.magnet.count += 3;
                kit.Event.emit(CConst.event_notice, LangChars.notice_buySuccess);
                break;
            case TypeProp.clock:
                NativeCall.logEventTwo(ConfigDot.dot_buy_succ_clock, String(DataManager.data.boxData.level));
                DataManager.data.prop.clock.count += 3;
                kit.Event.emit(CConst.event_notice, LangChars.notice_buySuccess);
                break;
            default:
                break;
        }
        DataManager.data.numCoin -= coins;
        DataManager.setData();
        kit.Popup.hide();
        kit.Event.emit(CConst.event_refresh_coin);
    };

    /** 按钮事件 退出 */
    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
    };
}
