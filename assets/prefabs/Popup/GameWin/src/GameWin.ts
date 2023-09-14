import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager, { ParamsWin, TypeBefore } from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";

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
        Common.log('弹窗 过关页面 showBefore()');
        this.params = Common.clone(options);

        // 时间
        let m = Math.floor(this.params.tCount / 60);
        let s = Math.floor(this.params.tCount % 60);
        this.itemLabelTime.getComponent(cc.Label).string = m + ':' + s;

        DataManager.setString(LangChars.win_finish, (chars: string) => {
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });

        // next 或 continue
        this.isNext = true;
        let _data = DataManager.data;
        if (_data.boxLevel.count + _data.boxLevel.add >= DataManager.getRewardBoxLevel().total
            || _data.boxSuipian.count + _data.boxSuipian.add >= DataManager.getRewardBoxSuipian().total
            || _data.boxXingxing.count + _data.boxXingxing.add >= DataManager.getRewardBoxXinging().total) {
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
        let total = this.params.xingxing;
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
        this.arrNodeXingxing.forEach((xing, index) => {
            let icon = xing.getChildByName('icon');
            cc.Tween.stopAllByTarget(icon);
            if (index < this.params.xingxing) {
                icon.opacity = 255;
                icon.scale = 1.0;
            }
        });
    }

    /** 按钮事件 确定 */
    async eventBtnNext() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        if (this.isNext) {
            // next 游戏开始前页面
            kit.Popup.show(CConst.popup_path_before, { type: TypeBefore.fromGameWin }, { mode: PopupCacheMode.Frequent });
        }
        else {
            await kit.Popup.show(CConst.popup_path_actPass, this.params, { mode: PopupCacheMode.Frequent });
            // continue 进入菜单页（恢复消除的体力）
            DataManager.data.strength.count++;
            DataManager.setData();
            Common.log('恢复体力 剩余strength: ', DataManager.data.strength.count);
            kit.Event.emit(CConst.event_enter_menu);
        }
    }

    /** 按钮事件 退出 */
    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        await kit.Popup.show(CConst.popup_path_actPass, this.params, { mode: PopupCacheMode.Frequent });
        // 进入菜单页（恢复消除的体力）
        DataManager.data.strength.count++;
        DataManager.setData();
        Common.log('恢复体力 剩余strength: ', DataManager.data.strength.count);
        kit.Event.emit(CConst.event_enter_menu);
    }
}
