import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Challenge extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelMid: cc.Node = null;
    @property(cc.Node) itemLabelPlay: cc.Node = null;

    protected showBefore(options: any): void {
        Common.log('弹窗 银行页面 showBefore()');

    }

    eventBtnHome() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }

    eventBtnPlay() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }
}
