import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ActPass<Options = any> extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) bg: cc.Node = null;
    @property(cc.Node) itemIcon: cc.Node = null;
    @property([cc.SpriteFrame]) bgFrames: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame]) roleFrames: cc.SpriteFrame[] = [];

    protected showBefore(options: any): void {
        Common.log('弹窗 过度 showBefore()');
        this.nodeTitle.active = false;
        // 特定背景
        let difficulty = DataManager.getLevelData().difficulty;
        this.bg.getComponent(cc.Sprite).spriteFrame = this.bgFrames[difficulty ? 1 : 0];
        // 随机头像
        let roleId = Math.floor(Math.random()*2);
        this.itemIcon.getComponent(cc.Sprite).spriteFrame = this.roleFrames[roleId];
        kit.Audio.playEffect(CConst.sound_actPass);
    }

    /**
     * 展示弹窗
     * @param options 弹窗选项
     * @param duration 动画时长
     */
    public show(options?: Options) {
        this.maskDown.setContentSize(cc.winSize);
        this.maskUp.setContentSize(cc.winSize);

        return new Promise<void>(res => {
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
            // 播放弹窗主体动画
            this.content.active = true;
            this.content.scale = 0.5;
            this.content.opacity = 0;
            cc.tween(this.content).parallel(
                cc.tween().to(0.233, { scale: 1.05 }, { easing: 'cubicOut' }).call(() => {
                    this.nodeTitle.active = true;
                    this.nodeTitle.opacity = 0;
                    cc.tween(this.nodeTitle).to(0.25, {opacity: 255}).start();
                }).to(0.233, { scale: 0.98 }, { easing: 'sineInOut' }).to(0.233, { scale: 1 }, { easing: 'sineInOut' }),
                cc.tween().to(0.215, { opacity: 255 }),
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

    protected showAfter(): void {
        this.scheduleOnce(() => { kit.Popup.hide(); }, 0.5);
    }
}
