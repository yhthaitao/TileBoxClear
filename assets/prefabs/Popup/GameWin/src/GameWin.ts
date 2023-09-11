import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";

/** 参数枚举（游戏胜利） */
export interface ParamsWin {
    star: number;
    tCount: number;
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameWin extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelNext: cc.Node = null;
    @property(cc.Node) itemLabelTime: cc.Node = null;
    @property([cc.Node]) arrNodeXingxing: cc.Node[] = [];

    params: ParamsWin = null;

    protected onLoad(): void {
        Common.log('GameWin onLoad()');
    }

    protected showBefore(options: any): void {
        Common.log('GameWin showBefore()');
        this.params = Common.clone(options);

        let m = Math.floor(this.params.tCount / 60);
        let s = Math.floor(this.params.tCount % 60);
        this.itemLabelTime.getComponent(cc.Label).string = m + ':' + s;

        DataManager.setString(LangChars.win_finish, (chars: string) => {
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.win_next, (chars: string) => {
            this.itemLabelNext.getComponent(cc.Label).string = chars;
        });
    }

    protected showAfter(): void {
        Common.log('GameWin showAfter()');
        this.arrNodeXingxing.forEach((xing) => {
            let icon = xing.getChildByName('icon');
            icon.opacity = 0;
            cc.Tween.stopAllByTarget(icon);
        });
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
        await this.hide();
        kit.Event.emit(CConst.event_win_nextLevel);
    }

    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await this.hide();
        kit.Event.emit(CConst.event_win_enterMenu);
    }
}
