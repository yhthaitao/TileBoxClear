import { kit } from "../../../../src/kit/kit";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GuideChallenge extends cc.Component {

    @property(cc.Node) maskDown: cc.Node = null;
    @property(cc.Node) maskUp: cc.Node = null;
    @property(cc.Node) content: cc.Node = null;
    @property(cc.Node) challenge1: cc.Node = null;
    @property(cc.Node) challenge2: cc.Node = null;

    params: {
        name: string,
        itemPosition: { x: number, y: number, },
        handPosition: { x: number, y: number, },
        descPosition: { x: number, y: number, },
    } = null;

    /**
     * 展示弹窗
     * @param options 弹窗选项
     * @param duration 动画时长
     */
    public show(params: any) {
        return new Promise<void>(res => {
            this.node.active = true;
            // 开启拦截
            this.maskUp.active = true;

            this.params = Common.clone(params);

            let timeMackOpa = 0.5;
            let timeIconOpa = 0.5;
            // 播放背景遮罩动画
            this.maskDown.active = true;
            this.maskDown.opacity = 0;
            cc.tween(this.maskDown).to(timeMackOpa, { opacity: 200 }).start();

            // 播放弹窗主体动画
            let funcShow = (node: cc.Node)=>{
                let item = node.getChildByName('item');
                item.x = this.params.itemPosition.x;
                item.y = this.params.itemPosition.y;

                let hand = node.getChildByName('hand');
                hand.x = this.params.handPosition.x;
                hand.y = this.params.handPosition.y;

                let desc = node.getChildByName('desc');
                if (desc) {
                    desc.x = this.params.descPosition.x;
                    desc.y = this.params.descPosition.y;
                }

                let icon = hand.getChildByName('icon');
                icon.active = true;
                icon.opacity = 0;
                cc.tween(icon).to(timeIconOpa, {opacity: 255}).call(()=>{
                    let animation = icon.getComponent(cc.Animation);
                    animation.stop();
                    animation.play();
                }).start();
            };
            this.content.active = true;
            this.content.children.forEach((item)=>{
                item.active = item.name == this.params.name;
                if (item.active) {
                    funcShow(item);
                }
            });

            cc.tween(this.content).delay(Math.max(timeMackOpa, timeIconOpa)).call(() => {
                // 关闭拦截
                this.maskUp.active = false;
                // Done
                res();
            }).start();
        });
    }

    /** 点击 挑战 */
    eventBtnChallenge() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.node.removeFromParent();
        kit.Popup.show(CConst.popup_path_challenge, {}, { mode: PopupCacheMode.Frequent });
    }

    /** 点击 礼包 */
    eventBtnGift() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.node.removeFromParent();
    }
}