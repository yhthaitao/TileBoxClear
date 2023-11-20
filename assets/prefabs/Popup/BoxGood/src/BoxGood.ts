import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import ConfigUnlock from "../../../../src/config/ConfigUnlock";
import ConfigGood from "../../../../src/config/ConfigGood";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BoxGood<Options = any> extends PopupBase {

    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelPlay: cc.Node = null;
    @property(cc.Node) itemLayout: cc.Node = null;
    @property(cc.Node) itemCell: cc.Node = null;
    @property(cc.Node) nodeOpen: cc.Node = null;

    obj = {
        layout: {
            2: { width: 348, height: 176, scale: 1.0 },
            3: { width: 348, height: 372, scale: 1.0 },
            4: { width: 348, height: 372, scale: 1.0 },
            5: { width: 532, height: 372, scale: 0.75 },
            6: { width: 532, height: 372, scale: 0.75 },
            7: { width: 532, height: 568, scale: 0.68 },
            8: { width: 532, height: 568, scale: 0.68 },
            9: { width: 532, height: 568, scale: 0.68 },
        },
    };

    protected showBefore(options: any): void {
        Common.log('弹窗 物品宝箱页面 showBefore()');

        DataManager.setString(LangChars.boxGood_title, (chars: string) => {
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.boxGood_button, (chars: string) => {
            this.itemLabelPlay.getComponent(cc.Label).string = chars;
        });

        this.initLayout();
    }

    /**
     * 展示弹窗
     * @param options 弹窗选项
     * @param duration 动画时长
     */
    public show(options?: Options) {
        this.node.scale = 1.2;
        this.maskDown.setContentSize(cc.winSize);
        this.maskUp.setContentSize(cc.winSize);
        
        return new Promise<void>(async res => {
            this.node.active = true;
            // 开启拦截
            this.maskUp.active = true;
            // 储存选项
            this.options = options;
            // 展示前
            this.showBefore(this.options);
            // 播放背景遮罩动画
            this.maskDown.active = true;
            this.maskDown.opacity = 0;
            cc.tween(this.maskDown).to(0.245, { opacity: 200 }).start();

            this.content.active = false;

            this.nodeOpen.active = true;
            let itemDragon = this.nodeOpen.getChildByName('dragon');
            await DataManager.playAniDragon(itemDragon, 'baoxiangdakai', 'dakai');
            this.nodeOpen.active = false;

            // 播放弹窗主体动画
            this.content.active = true;
            this.content.scale = 0.5;
            this.content.opacity = 0;
            cc.tween(this.content).parallel(
                cc.tween().to(this.popupShowTime.scale0, { scale: 1.05 }, { easing: 'cubicOut' })
                    .to(this.popupShowTime.scale1, { scale: 0.98 }, { easing: 'sineInOut' })
                    .to(this.popupShowTime.scale2, { scale: 1 }, { easing: 'sineInOut' }),
                cc.tween().to(this.popupShowTime.opacity, { opacity: 255 }),
            ).call(() => {
                // 关闭拦截
                this.maskUp.active = false;
                // 弹窗已完全展示
                this.showAfter && this.showAfter();
                // Done
                res();
            }).start();
        });
    }

    /** 初始化 layout */
    initLayout() {
        // 主题容器高度
        let levelReward = DataManager.data.boxGood.level;
        let boxGoods: number[] = ConfigUnlock[levelReward].goods;
        let obj: { width: number, height: number, scale: number } = this.obj.layout[boxGoods.length];
        this.itemLayout.width = obj.width;
        this.itemLayout.height = obj.height;
        this.itemLayout.scale = obj.scale;
        // 物品配置
        let objAllGoods = DataManager.getObjAllGoods();
        // 配置主题内容
        this.itemLayout.removeAllChildren();
        for (let index = 0, length = boxGoods.length; index < length; index++) {
            let cell = cc.instantiate(this.itemCell);
            cell.name = 'cell' + index;
            cell.active = true;
            cell.parent = this.itemLayout;
            let goodParam = objAllGoods[boxGoods[index]];
            this.initCell(cell, goodParam.name);
        }
    };

    /** 初始化 cell */
    initCell(cell: cc.Node, resName: string) {
        let icon = cell.getChildByName('icon');
        let path = CConst.pathGameGood + resName;
        kit.Resources.loadRes(CConst.bundleCommon, path, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 back: ', path);
                return;
            }
            icon.getComponent(cc.Sprite).spriteFrame = assets;
            if (icon.width > icon.height) {
                icon.scale = (cell.width - 30)/icon.width;
            }
            else{
                icon.scale = (cell.height - 30)/icon.height;
            }
        });
    };

    eventBtnSure() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
        
        // 更新数据
        let reward = DataManager.getRewardBoxGood();
        DataManager.refreshDataAfterUnlockGood(reward);

        let boxGood = DataManager.data.boxGood;
        boxGood.level++;
        boxGood.count = 0;
        boxGood.add = 0;
        DataManager.setData();
        
        kit.Event.emit(CConst.event_refresh_point);
    }
}
