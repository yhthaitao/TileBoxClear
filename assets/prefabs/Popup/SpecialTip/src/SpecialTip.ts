import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager, { LangChars } from "../../../../src/config/DataManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SpecialTip extends PopupBase {

    @property(cc.Node) btnSkip: cc.Node = null;
    @property(cc.Node) iconHand: cc.Node = null;
    @property(cc.Node) labelTitle: cc.Node = null;
    @property(cc.Node) labelPlay: cc.Node = null;
    @property(cc.Node) labelSkip: cc.Node = null;

    isSpecial: boolean = false;

    protected onLoad(): void {
        this.initLabel();
    }

    async initLabel(){
        let charsTitle = await DataManager.getString(LangChars.SPECIALLEVEL);
        this.labelTitle.getComponent(cc.Label).string = charsTitle;

        let charsPlay = await DataManager.getString(LangChars.PLAY);
        this.labelPlay.getComponent(cc.Label).string = charsPlay;

        let charsSkip = await DataManager.getString(LangChars.SKIP);
        this.labelSkip.getComponent(cc.Label).string = charsSkip;
    }

    protected init(options: any): void {
        this.btnSkip.active = false;
        this.iconHand.active = false;
    }

    protected onShow(): void {
        if (DataManager.data.specialData.isFirst) {
            DataManager.data.specialData.isFirst = false;
            this.iconHand.active = true;
            this.iconHand.opacity = 0;
            cc.tween(this.iconHand).to(0.4, { opacity: 255 }).start();
        }
        this.btnSkip.active = true;
        this.btnSkip.opacity = 0;
        cc.tween(this.btnSkip).delay(2.0).to(0.4, { opacity: 255 }).start();
    }

    protected onHide(suspended: boolean): void {
        if (this.isSpecial) {
            kit.Event.emit(CConst.event_enter_nextLevel, true, false);
        }
    }

    eventBtnPlay() {
        kit.Audio.playEffect(CConst.sound_path_click);
        this.isSpecial = true;
        kit.Popup.hide();
    }

    eventBtnSkip() {
        kit.Audio.playEffect(CConst.sound_path_click);
        this.isSpecial = false;
        kit.Popup.hide();
    }
}
