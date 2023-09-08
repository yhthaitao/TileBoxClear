import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import NativeCall from "../../../../src/config/NativeCall";
import DataManager from "../../../../src/config/DataManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SpecialQuit extends PopupBase {

    @property(cc.Node) nodeXing: cc.Node = null;
    @property(cc.Node) labelTitle: cc.Node = null;

    xingNum: number = 0;
    xingMax: number = 5;

    protected onLoad(): void {
        this.initUI();
        this.initLabel();
    }

    initUI() {
        this.refreshXingxing();
    }

    initLabel() {
        // DataManager.setString(LangChars.REVIEW, (chars: string)=>{
        //     this.labelTitle.getComponent(cc.Label).string = chars;
        // });
    }

    /** 按钮事件 星星 */
    eventBtnXing(event: cc.Event.EventTouch) {
        let arrXing = Common.getArrByName(this.nodeXing, 'xing');
        let btnIndex = arrXing.indexOf(event.target.parent);
        if (btnIndex < 0) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.xingNum = btnIndex + 1;
        this.refreshXingxing();
    }

    /** 按钮事件 确定 */
    eventBtnSure() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        if (this.xingNum > this.xingMax - 1) {
            DataManager.data.isEvaluate = true;
            DataManager.setData();
            NativeCall.evaluateShow();
        }
        kit.Popup.hide();
    }

    /** 按钮事件 退出 */
    eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }

    /** 星星刷新 */
    refreshXingxing() {
        let arrXing = Common.getArrByName(this.nodeXing, 'xing');
        arrXing.forEach((xing, index) => {
            xing.getChildByName('light').opacity = index < this.xingNum ? 255 : 0;
        });
    }
}
