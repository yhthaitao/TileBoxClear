import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ActPass extends PopupBase {

    protected showBefore(options: any): void {
        Common.log('弹窗 过度 showBefore()');
        kit.Audio.playEffect(CConst.sound_actPass);
    }

    protected showAfter(): void {
        this.scheduleOnce(()=>{ kit.Popup.hide(); }, 0.5);
    }
}
