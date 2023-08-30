import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import Common from "../../../../src/config/Common";
import CConst from "../../../../src/config/CConst";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuTop extends cc.Component {

    @property(cc.Node) mask: cc.Node = null;
    @property(cc.Node) content: cc.Node = null;

    async init(callback: Function = null) {
        Common.log('MainMenu init()');
    }

    /** 按钮事件 设置 */
    eventBtnSet() {
        kit.Audio.playEffect(CConst.sound_path_click);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    }

    /** 按钮事件 进入游戏sort */
    eventBtnStart() {
        kit.Audio.playEffect(CConst.sound_path_click);
        kit.Event.emit(CConst.event_enter_gameSort);
    }
}
