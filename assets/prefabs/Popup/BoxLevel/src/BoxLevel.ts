import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BoxLevel extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelMid: cc.Node = null;
    @property(cc.Node) itemLabelPlay: cc.Node = null;

    protected showBefore(options: any): void {
        Common.log('弹窗 等级宝箱页面 showBefore()');

        DataManager.setString(LangChars.boxLevel_title, (chars: string)=>{
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.boxLevel_desc, (chars: string)=>{
            this.itemLabelMid.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.CONTINUE, (chars: string)=>{
            this.itemLabelPlay.getComponent(cc.Label).string = chars;
        });
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
