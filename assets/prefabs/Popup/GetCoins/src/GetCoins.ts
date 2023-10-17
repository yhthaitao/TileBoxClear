import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import { StateGame } from "../../../../src/config/ConfigCommon";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GetCoins extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) nodeProp: cc.Node = null;
    @property(cc.Node) nodeDesc: cc.Node = null;
    @property(cc.Node) btnFree: cc.Node = null;

    protected showBefore(options: any): void {
        Common.log('弹窗 获取体力 showBefore()');
        // 标题
        DataManager.setString(LangChars.addLife_title, (chars: string) => {
            let itemLabel = this.nodeTitle.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        // 描述
        let count = DataManager.data.boxData.timesCoin.count;
        let total = DataManager.data.boxData.timesCoin.total;
        let button = this.btnFree.getComponent(cc.Button);
        button.interactable = count > 0;
        this.btnFree.opacity = button.interactable ? 255 : 100;
        DataManager.setString(LangChars.addCoin_desc_0, (chars: string) => {
            let itemLabel = this.nodeProp.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = count + '/' + total + chars;
        });
        // 描述
        DataManager.setString(LangChars.addCoin_desc_1, (chars: string) => {
            let itemLabel = this.nodeDesc.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars + ':';
        });
        // 免费
        DataManager.setString(LangChars.addCoin_watch, (chars: string) => {
            let itemLabel = this.btnFree.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    }

    /** 按钮事件 免费获取 */
    eventBtnFree() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        let funcA = () => {
            DataManager.data.numCoin += 60;
            DataManager.data.boxData.timesCoin.count -= 1;
            DataManager.setData();
            kit.Event.emit(CConst.event_refresh_coin);
            kit.Popup.hide();
        };
        let funcB = () => {
            kit.Event.emit(CConst.event_notice, '视频未加载');
        };
        DataManager.playVideo(funcA, funcA);
    };

    /** 按钮事件 退出 */
    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        // 进入商城
        if (DataManager.stateCur == StateGame.game) {
            kit.Popup.show(CConst.popup_path_gameShop, {}, { mode: PopupCacheMode.Frequent });
        }
        else{
            kit.Event.emit(CConst.event_enter_menuShop);
        }
    };
}