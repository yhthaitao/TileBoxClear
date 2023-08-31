import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import Common from "../../../../src/config/Common";
import CConst from "../../../../src/config/CConst";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuTop extends cc.Component {

    @property(cc.Node) labelStrengthNum: cc.Node = null;
    @property(cc.Node) labelStrengthMax: cc.Node = null;
    @property(cc.Node) labelStrengthTime: cc.Node = null;
   
    @property(cc.Node) labelCoinNum: cc.Node = null;

    /** 刷新体力 */
    refreshStrength(){
        
    };

    /** 刷新金币 */
    refreshCoin(){

    };

    /** 按钮事件 设置 */
    eventBtnSet() {
        kit.Audio.playEffect(CConst.sound_path_click);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    };
}
