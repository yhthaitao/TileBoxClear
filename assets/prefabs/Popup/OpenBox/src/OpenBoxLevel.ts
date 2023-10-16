import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { TypeProp, TypeReward } from "../../../../src/config/ConfigCommon";

const { ccclass, property } = cc._decorator;
@ccclass
export default class OpenBoxLevel extends PopupBase {

    @property(cc.Node) nodeBox: cc.Node = null;
    @property(cc.Node) nodeClaim: cc.Node = null;
    @property(cc.Node) nodeContinue: cc.Node = null;
    @property(cc.Node) nodeReward: cc.Node = null;
    @property([cc.SpriteFrame]) iconTexture: cc.SpriteFrame[] = [];

    obj = {
        drop: {
            armatureName: 'xiangziweikaiqi', animationName: 'diaoxialai',
        },
        wait: {
            armatureName: 'XZxialuohoudaiji', animationName: 'daiji',
        },
        open: {
            armatureName: 'xiangzidakai', animationName: 'dakai',
        },
        icon: { y: 320, },
    };
    params: { pStrength: { x: number, y: number }, pBtnStart: { x: number, y: number }, rewards: TypeReward } = null;
    pFinish: cc.Vec3 = cc.v3();

    protected showBefore(options: any): void {
        Common.log('弹窗 开启等级宝箱 showBefore()');
        this.params = Common.clone(options);

        DataManager.setString(LangChars.tapToClaim, (chars: string) => {
            let itemLabel = this.nodeClaim.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.tapToContinue, (chars: string) => {
            let itemLabel = this.nodeContinue.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });

        this.nodeBox.active = false;
        this.nodeBox.getChildByName('particle').active = false;
        this.nodeClaim.active = false;
        this.nodeContinue.active = false;
        this.nodeReward.active = false;
    }

    public show(options?: any): Promise<void> {
        this.maskDown.setContentSize(cc.winSize);
        this.maskUp.setContentSize(cc.winSize);

        return new Promise<void>(async res => {
            this.node.active = true;
            // 开启拦截
            this.maskUp.active = true;
            this.maskUp.active = false;
            // 储存选项
            this.options = options;
            // 展示前
            this.showBefore(this.options);
            // 弹窗已完全展示
            this.showAfter && this.showAfter();
            // Done
            res();

            // 播放背景遮罩动画
            this.maskDown.active = true;
            this.maskDown.opacity = 0;
            cc.tween(this.maskDown).to(0.245, { opacity: 200 }).start();

            let timeDrop = 0.73;
            let timeWait = 0.833 + 1.0;
            // 箱子下落
            this.nodeBox.active = true;
            let dragon = this.nodeBox.getChildByName('dragon');
            DataManager.playAniDragon(dragon, this.obj.drop.armatureName, this.obj.drop.animationName);
            this.scheduleOnce(() => {
                this.nodeClaim.active = true;
                this.nodeClaim.opacity = 0;
                cc.tween(this.nodeClaim).to(0.3, { opacity: 255 }).start();
                DataManager.playAniDragon(dragon, this.obj.wait.armatureName, this.obj.wait.animationName);
            }, timeDrop);
            // 点击继续
            this.scheduleOnce(() => {
                this.nodeClaim.active = false;
                this.playAniOpen();
            }, timeDrop + timeWait);
        });
    }

    /**
     * 隐藏弹窗
     * @param suspended 是否被挂起
     * @param duration 动画时长
     */
    public hide(suspended: boolean = false): Promise<void> {
        return new Promise<void>(async res => {
            this.nodeBox.active = false;
            this.nodeClaim.active = false;
            this.nodeContinue.active = false;

            // 开启拦截
            this.maskUp.active = true;
            // 关闭前
            this.hideBefore();
            // 播放背景遮罩动画
            cc.tween(this.maskDown).delay(0.2).to(0.233, { opacity: 0 }, { easing: 'sineInOut' }).start();
            // 获取
            await this.playAniHide();
            // 关闭拦截
            this.maskUp.active = false;
            // 关闭节点
            this.node.active = false;
            // 弹窗已完全隐藏（动画完毕）
            this.hideAfter && this.hideAfter(suspended);
            // 延迟一会儿
            await new Promise((_res) => {
                cc.Canvas.instance.scheduleOnce(_res, 0.75);
            });
            // 弹窗完成回调
            this.finishCallback && this.finishCallback(suspended);
            // Done
            res();
        });
    }

    setReward() {
        let index = 0;
        let reward = this.params.rewards.reward[0];
        if (reward.type == TypeProp.tStrengthInfinite) {
            index = 0;
            this.pFinish = cc.v3(this.params.pStrength.x, this.params.pStrength.y);
        }
        else if (reward.type == TypeProp.tMagnetInfinite) {
            index = 1;
            this.pFinish = cc.v3(this.params.pBtnStart.x, this.params.pBtnStart.y);
        }
        else if (reward.type == TypeProp.tClockInfinite) {
            index = 2;
            this.pFinish = cc.v3(this.params.pBtnStart.x, this.params.pBtnStart.y);
        }

        let nodeIcon = this.nodeReward.getChildByName('nodeIcon');
        nodeIcon.getComponent(cc.Animation).play();
        let itemIcon = nodeIcon.getChildByName('icon');
        itemIcon.getComponent(cc.Sprite).spriteFrame = this.iconTexture[index];
        let itemLabel = nodeIcon.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = Math.floor(reward.number / 60) + 'min';
    };

    playAniOpen() {
        // 箱子开启
        let timeOpen = 2.919;
        let dragon = this.nodeBox.getChildByName('dragon');
        DataManager.playAniDragon(dragon, this.obj.open.armatureName, this.obj.open.animationName);
        // icon
        this.nodeReward.active = true;
        this.nodeReward.position = cc.v3();
        this.nodeReward.scale = 0;
        this.setReward();
        cc.tween(this.nodeReward).delay(1.35).call(() => {
            // 粒子
            let particle = this.nodeBox.getChildByName('particle');
            particle.active = true;
            particle.getComponent(cc.ParticleSystem).resetSystem();
        }).parallel(
            cc.tween().to(0.1, { scale: 1 }),
            cc.tween().to(0.2, { y: this.obj.icon.y }),
        ).start();
        // 点击继续
        this.scheduleOnce(() => {
            this.nodeContinue.active = true;
            this.nodeContinue.opacity = 0;
            cc.tween(this.nodeContinue).to(0.3, { opacity: 255 }).start();
        }, timeOpen);
        // 获取物品
        this.scheduleOnce(() => {
            this.nodeContinue.active = false;
            kit.Popup.hide();
        }, timeOpen + 2);
    };

    playAniHide(): Promise<void> {
        let nodeIcon = this.nodeReward.getChildByName('nodeIcon');
        nodeIcon.getComponent(cc.Animation).stop();
        nodeIcon.y = 0;
        return new Promise((res) => {
            let p1 = this.nodeReward.position;
            let time = Common.getMoveTime(p1, this.pFinish, 1, 1250);
            let opt = {
                p1: cc.v2(p1.x, p1.y),
                p2: cc.v2((p1.x + this.pFinish.x) * 0.5, p1.y),
                pTo: cc.v2(this.pFinish.x, this.pFinish.y),
            };
            cc.tween(this.nodeReward).bezierTo(time, opt.p1, opt.p2, opt.pTo).call(() => {
                let reward = this.params.rewards.reward[0];
                let name = reward.type == TypeProp.tStrengthInfinite ? CConst.event_scale_strength : CConst.event_scale_prop;
                kit.Event.emit(name);
                res();
            }).start();
        });
    };

    /** 开启箱子 */
    eventBtnClaim() {
        this.nodeClaim.active = false;
        this.unscheduleAllCallbacks();
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.playAniOpen();
    }

    /** 获取物品 */
    eventBtnContinue() {
        this.nodeContinue.active = false;
        this.unscheduleAllCallbacks();
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }
}
