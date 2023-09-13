import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager, { StateGame } from "../../../../src/config/DataManager";
import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import { ParamsWin } from "../../../games/GameBox/src/GameBox";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ActPass extends PopupBase {

    params: ParamsWin = null;

    protected showBefore(options: any): void {
        this.params = Common.clone(options);
    }

    protected showAfter(): void {
        this.scheduleOnce(()=>{ kit.Popup.hide(); }, 2.0);
    }

    protected hideAfter(suspended: boolean): void {
        if (DataManager.stateCur == StateGame.game) {
            if (this.params.level) {
                DataManager.data.boxLevel.count += 1;
            }
            if (this.params.star) {
                DataManager.data.boxXingxing.count += this.params.star;
            }
            if (this.params.suipian) {
                DataManager.data.boxSuipian.count += this.params.suipian;
            }
            DataManager.setData();
            kit.Event.emit(CConst.event_enter_menu);
        }
        else if(DataManager.stateCur == StateGame.menu){
            kit.Event.emit(CConst.event_enter_game);
        }
    }
}
