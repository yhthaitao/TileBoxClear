import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";

/** 参数枚举（游戏失败） */
export interface ParamsFail {
    numStrength: number;
    numSuipian: number;
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameFail extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelDesc: cc.Node = null;
    @property(cc.Node) itemLabelPLayOn: cc.Node = null;
    @property(cc.Node) itemLabelGiveUp: cc.Node = null;
    @property([cc.Node]) arrNodeLose: cc.Node[] = [];// 0: 碎片  1: 体力

    params: ParamsFail = null;

    protected showBefore(options: any): void {
        Common.log('GameFail showBefore()');
        this.params = Common.clone(options);

        // 碎片数量
        if (this.params.numSuipian > 0) {
            let itemX = 80;
            
            let itemStrength = this.arrNodeLose[0];
            itemStrength.active = true;
            itemStrength.x = -itemX;
            let itemLabelStrength = itemStrength.getChildByName('label');
            itemLabelStrength.getComponent(cc.Label).string = 'x' + this.params.numStrength;
            // 碎片节点
            let itemSuipian = this.arrNodeLose[1];
            itemSuipian.active = true;
            itemSuipian.x = itemX;
            let itemLabelSuipian = itemSuipian.getChildByName('label');
            itemLabelSuipian.getComponent(cc.Label).string = 'x' + this.params.numSuipian;
        }
        else{
            // 体力节点
            let item = this.arrNodeLose[0];
            item.active = true;
            item.x = 0;
            let itemLabel = item.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = 'x' + this.params.numStrength;
            // 碎片节点
            this.arrNodeLose[1].active = false;
        }

        // 多语言
        DataManager.setString(LangChars.over_timeout_title, (chars: string) => {
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.over_timeout_desc, (chars: string) => {
            this.itemLabelDesc.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.over_timeout_playon, (chars: string) => {
            this.itemLabelPLayOn.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.over_timeout_giveup, (chars: string) => {
            this.itemLabelGiveUp.getComponent(cc.Label).string = chars;
        });
    }

    async eventBtnPlayOn() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        let count = DataManager.data.strength.count;
        if (count > 0) {
            DataManager.data.strength.count--;
            await this.hide();
            kit.Event.emit(CConst.event_enter_nextLevel);
        }
        else{
            kit.Event.emit(CConst.event_notice, '没体力了');
        }
    }

    async eventBtnGiveUp() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await this.hide();
        kit.Event.emit(CConst.event_enter_nextLevel);
    }

    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await this.hide();
        kit.Event.emit(CConst.event_enter_menu);
    }
}
