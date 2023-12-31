import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode, PopupShowResult } from "../../../../src/kit/manager/popupManager/PopupManager";
import { FailParam, FromState, FinishType } from "../../../../src/config/ConfigCommon";
import NativeCall from "../../../../src/config/NativeCall";
import ConfigDot from "../../../../src/config/ConfigDot";
import GameManager from "../../../../src/config/GameManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameFail extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelDesc: cc.Node = null;
    @property(cc.Node) itemLabelPLayOn: cc.Node = null;
    @property(cc.Node) itemLabelGiveUp: cc.Node = null;
    @property(cc.Node) nodeClock: cc.Node = null;
    @property(cc.Node) nodeGoods: cc.Node = null;

    @property([cc.Node]) arrNodeLose: cc.Node[] = [];// 0: 碎片  1: 体力  2: 磁体

    params: FailParam = null;
    obj = {
        itemLoseX: {
            0: [],
            1: [0],
            2: [-80, 80],
            3: [-110, 0, 110],
        },
    };

    protected showBefore(options: any): void {
        Common.log('弹窗 失败页面 showBefore()');
        this.params = Common.clone(options);

        // 丢失物品
        this.arrNodeLose.forEach((item) => { item.active = false });
        let arrLose: { node: cc.Node, num: number }[] = [];
        if (this.params.numSuipian > 0) {
            arrLose.push({ node: this.arrNodeLose[0], num: this.params.numSuipian });
        }
        if (this.params.numStrength > 0) {
            arrLose.push({ node: this.arrNodeLose[1], num: this.params.numStrength });
        }
        if (this.params.numMagnet > 0) {
            arrLose.push({ node: this.arrNodeLose[2], num: this.params.numMagnet });
        }
        let arrItemX = this.obj.itemLoseX[arrLose.length];
        arrLose.forEach((obj: { node: cc.Node, num: number }, index: number) => {
            obj.node.active = true;
            obj.node.x = arrItemX[index];
            let itemLabel = obj.node.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = 'x' + obj.num;
        });

        // 多语言
        let keyTitle = LangChars.over_nospace_title;
        if (this.params.type == FinishType.failTime) {
            keyTitle = LangChars.over_timeout_title;
            this.nodeClock.active = true;
            this.nodeGoods.active = false;
            NativeCall.logEventTwo(ConfigDot.dot_gameover_outOFTime, String(DataManager.data.boxData.level));
        }
        else {
            this.nodeClock.active = false;
            this.nodeGoods.active = true;
            DataManager.setString(LangChars.over_nospace_gobackgood, (chars: string) => {
                let itemLabel = this.nodeGoods.getChildByName('label');
                itemLabel.getComponent(cc.Label).string = chars;
            });
            NativeCall.logEventTwo(ConfigDot.dot_gameover_outOfMove, String(DataManager.data.boxData.level));
        }
        DataManager.setString(keyTitle, (chars: string) => {
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

    /** 复活 */
    async eventBtnPlayOn() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        if (DataManager.data.numCoin < 60) {
            kit.Popup.show(CConst.popup_path_getCoins, { isGoShop: false }, { mode: PopupCacheMode.Frequent, isSoon: true, });
            return;
        }
        // 复活打点
        if (this.params.type == FinishType.failTime) {
            NativeCall.logEventTwo(ConfigDot.dot_buy_succ_fuhuo_noTime, String(DataManager.data.boxData.level));
        }
        else {
            NativeCall.logEventTwo(ConfigDot.dot_buy_succ_fuhuo_noSpace, String(DataManager.data.boxData.level));
        }
        // 60个金币 复活
        DataManager.data.numCoin -= 60;
        DataManager.setData();
        await kit.Popup.hide();
        kit.Event.emit(CConst.event_game_revive, this.params.type);
    }

    /** 放弃 */
    eventBtnGiveUp() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        DataManager.data.wins.count = 0;
        DataManager.strengthReduce();
        DataManager.setData();
        GameManager.gameFail_giveUp(FromState.fromFail);
    }
}
