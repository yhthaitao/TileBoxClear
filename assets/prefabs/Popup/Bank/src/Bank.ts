import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager, { LangChars } from "../../../../src/config/DataManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Bank extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelMid: cc.Node = null;
    @property(cc.Node) itemLabelPlay: cc.Node = null;

    protected onLoad(): void {
        this.initLabel();
    }

    initLabel(){
        // DataManager.setString(LangChars.QUIT, (chars: string)=>{
        //     this.itemLabelMid.getComponent(cc.Label).string = chars + '?';
        // });
        // DataManager.setString(LangChars.OK, (chars: string)=>{
        //     this.itemLabelPlay.getComponent(cc.Label).string = chars;
        // });
    }

    eventBtnSure() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }

    eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }
}
