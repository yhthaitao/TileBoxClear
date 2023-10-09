import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import ConfigGood from "../../../../src/config/ConfigGood";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Achieve<Options = any> extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemProcess: cc.Node = null;
    @property(cc.Node) itemLayout: cc.Node = null;
    @property(cc.Node) itemCell: cc.Node = null;

    params: {
        keyTitle: string,
        arrGoods: number[],
        objAchieve: {
            goods: number[],
            icon: number,
            length: number,
            coin: number
        }
    } = null;

    protected showBefore(options: any): void {
        Common.log('弹窗 成就页面 showBefore()');
        this.params = Common.clone(options);
        DataManager.setString(LangChars[this.params.keyTitle], (chars: string) => {
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });
        this.initLayout();
    }

    /** 初始化 layout */
    initLayout() {
        // 进度
        let lenArr = this.params.arrGoods.length;
        let lenObj = this.params.objAchieve.goods.length;
        let bar = this.itemProcess.getChildByName('bar');
        bar.getComponent(cc.Sprite).fillRange = lenArr / lenObj;
        let label = this.itemProcess.getChildByName('label');
        label.getComponent(cc.Label).string = '' + lenArr + '/' + lenObj;
        // 所有物品
        let allGoods = {};
        ConfigGood.goodsConf.forEach((obj) => { allGoods[obj.id] = obj; });
        // 配置主题内容
        this.itemLayout.removeAllChildren();
        let goods = this.params.objAchieve.goods;
        for (let index = 0, length = goods.length; index < length; index++) {
            let cell = cc.instantiate(this.itemCell);
            cell.name = 'cell' + index;
            cell.active = true;
            cell.parent = this.itemLayout;
            this.initCell(goods[index], allGoods, cell);
        }
    };

    /** 初始化 cell */
    initCell(goodId: number, allGoods: any, cell: cc.Node) {
        let icon = cell.getChildByName('icon');
        let lock = cell.getChildByName('lock');
        icon.active = false;
        lock.active = false;

        let isLock = this.params.arrGoods.indexOf(goodId) < 0;
        if (isLock) {
            lock.active = true;
        }
        else {
            let pathIcon = CConst.pathGameGood + allGoods[goodId].name;
            kit.Resources.loadRes(CConst.bundleCommon, pathIcon, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
                if (err) {
                    Common.log(' 资源加载异常 Achieve icon: ', pathIcon);
                    return;
                }
                icon.active = true;
                icon.getComponent(cc.Sprite).spriteFrame = assets;
                if (icon.width > icon.height) {
                    icon.scale = (icon.parent.width - 30) / icon.width;
                }
                else {
                    icon.scale = (icon.parent.height - 30) / icon.height;
                }
            });
        }
    };

    eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }
}
