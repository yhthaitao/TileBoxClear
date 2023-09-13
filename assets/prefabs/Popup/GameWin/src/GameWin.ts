import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import { ParamsWin } from "../../../games/GameBox/src/GameBox";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameWin extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelNext: cc.Node = null;
    @property(cc.Node) itemLabelTime: cc.Node = null;
    @property([cc.Node]) arrNodeXingxing: cc.Node[] = [];

    params: ParamsWin = null;
    isNext: boolean = false;

    protected showBefore(options: any): void {
        Common.log('GameWin showBefore()');
        this.params = Common.clone(options);

        // 时间
        let m = Math.floor(this.params.tCount / 60);
        let s = Math.floor(this.params.tCount % 60);
        this.itemLabelTime.getComponent(cc.Label).string = m + ':' + s;

        DataManager.setString(LangChars.win_finish, (chars: string) => {
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });

        // continue 和 param
        this.isNext = true;
        let _data = DataManager.data;
        if (this.params.level && _data.boxLevel.count + this.params.level >= DataManager.getRewardBoxLevel().total
            || this.params.star && _data.boxXingxing.count + this.params.star >= DataManager.getRewardBoxXinging().total
            || this.params.suipian && _data.boxSuipian.count + this.params.suipian >= DataManager.getRewardBoxSuipian().total) {
            this.isNext = false;
        }
        DataManager.setString(this.isNext ? LangChars.win_next : LangChars.CONTINUE, (chars: string) => {
            this.itemLabelNext.getComponent(cc.Label).string = chars;
        });

        // 星星隐藏
        this.arrNodeXingxing.forEach((xing) => {
            let icon = xing.getChildByName('icon');
            icon.opacity = 0;
            cc.Tween.stopAllByTarget(icon);
        });
    }

    protected showAfter(): void {
        Common.log('GameWin showAfter()');
        let total = this.params.star;
        let funcXing = (index: number = 0) => {
            if (index < total) {
                let xing = this.arrNodeXingxing[index];
                let icon = xing.getChildByName('icon');
                icon.scale = 0;
                cc.tween(icon).parallel(
                    cc.tween().to(0.2, { scale: 1.0 }),
                    cc.tween().to(0.2, { opacity: 255 }),
                ).call(() => {
                    index++;
                    funcXing(index);
                }).start();
            }
        };
        funcXing();
    }

    protected hideBefore(): void {
        Common.log('GameWin hideBefore()');
        this.arrNodeXingxing.forEach((xing, index) => {
            let icon = xing.getChildByName('icon');
            cc.Tween.stopAllByTarget(icon);
            if (index < this.params.star) {
                icon.opacity = 255;
                icon.scale = 1.0;
            }
        });
    }

    async eventBtnNext() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
        kit.Popup.show(CConst.popup_path_before, this.params, { mode: PopupCacheMode.Frequent });
        if (this.isNext) {
            kit.Popup.show(CConst.popup_path_before, this.params, { mode: PopupCacheMode.Frequent });
        }
        else{
            kit.Popup.show(CConst.popup_path_before, this.params, { mode: PopupCacheMode.Frequent });
        }
    }

    eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
        kit.Popup.show(CConst.popup_path_actPass, this.params, { mode: PopupCacheMode.Frequent });
    }
}
