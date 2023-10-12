import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager, { TypeProp, TypeReward } from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";

const { ccclass, property } = cc._decorator;
@ccclass
export default class OpenBoxLevel extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) nodeBack: cc.Node = null;
    @property(cc.Node) nodeProp: cc.Node = null;
    @property(cc.Node) nodeLight: cc.Node = null;
    @property(cc.Node) nodeContinue: cc.Node = null;
    @property([cc.SpriteFrame]) iconTexture: cc.SpriteFrame[] = [];

    obj = {
        prop: { y: 100, scale0: 1, scale1: 1.50 },
    };
    params: {
        pStart: { x: number, y: number },
        pStrength: { x: number, y: number },
        pCoin: { x: number, y: number },
        pButton: { x: number, y: number },
        rewards: TypeReward
    } = null;
    pFinish: cc.Vec3 = cc.v3();

    protected showBefore(options: any): void {
        Common.log('弹窗 开启碎片宝箱 showBefore()');
        this.params = Common.clone(options);

        DataManager.setString(LangChars.Reward, (chars: string) => {
            let itemLabel = this.nodeTitle.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.tapToContinue, (chars: string) => {
            let itemLabel = this.nodeContinue.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });

        this.nodeTitle.active = false;
        this.nodeContinue.active = false;
        this.nodeBack.active = false;
        this.nodeProp.active = false;
        this.nodeLight.active = false;
    }

    public show(options?: any): Promise<void> {
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
            this.nodeTitle.active = true;
            this.nodeTitle.opacity = 0;
            cc.tween(this.nodeTitle).to(0.245, { opacity: 255 }).start();

            // 光效
            this.nodeBack.active = true;
            this.nodeBack.opacity = 0;
            cc.tween(this.nodeBack).to(0.35, { opacity: 255 }).start();
            this.nodeLight.active = true;
            this.nodeLight.opacity = 0;
            cc.tween(this.nodeLight).to(0.35, { opacity: 255 }).start();
            let dargon = this.nodeLight.getChildByName('dragon');
            dargon.getComponent(dragonBones.ArmatureDisplay).playAnimation('newAnimation', 0);

            this.setReward();
            cc.tween(this.nodeProp).parallel(
                cc.tween().to(0.35, { scale: this.obj.prop.scale1 }),
                cc.tween().to(0.35, { position: cc.v3(0, this.obj.prop.y) }),
            ).call(() => {
                // 取消拦截
                this.maskUp.active = false;
                // 弹窗已完全展示
                this.showAfter && this.showAfter();
                this.nodeContinue.active = true;
                this.nodeContinue.opacity = 0;
                cc.tween(this.nodeContinue).to(0.3, { opacity: 255 }).call(() => {
                    // Done
                    res();
                }).delay(2.0).call(() => {
                    this.nodeContinue.active = false;
                    kit.Popup.hide();
                }).start();
            }).start();
        });
    }

    /**
     * 隐藏弹窗
     * @param suspended 是否被挂起
     * @param duration 动画时长
     */
    public hide(suspended: boolean = false): Promise<void> {
        return new Promise<void>(async res => {
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
        let types = [
            TypeProp.coin,
            TypeProp.ice, TypeProp.tip, TypeProp.back, TypeProp.refresh,
            TypeProp.magnet, TypeProp.clock,
            TypeProp.tStrengthInfinite,
        ];
        let events = [
            this.params.pCoin,
            this.params.pButton, this.params.pButton, this.params.pButton, this.params.pButton,
            this.params.pButton, this.params.pButton,
            this.params.pStrength,
        ];
        let reward = this.params.rewards.reward[0];
        let index = types.indexOf(reward.type);
        if (index < 0) {
            index = 0;
        }
        else if (index > types.length - 1) {
            index = types.length - 1;
        }
        this.pFinish = cc.v3(events[index].x, events[index].y);

        this.nodeProp.active = true;
        this.nodeProp.position = cc.v3(this.params.pStart.x, this.params.pStart.y);
        this.nodeProp.scale = this.obj.prop.scale0;
        let itemIcon = this.nodeProp.getChildByName('icon');
        itemIcon.getComponent(cc.Sprite).spriteFrame = this.iconTexture[index];
    };

    playAniHide(): Promise<void> {
        return new Promise((res) => {
            // 光效
            this.nodeBack.active = true;
            this.nodeBack.opacity = 255;
            cc.tween(this.nodeBack).to(0.35, { opacity: 0 }).call(()=>{
                this.nodeBack.active = false;
            }).start();
            this.nodeLight.active = true;
            this.nodeLight.opacity = 255;
            cc.tween(this.nodeLight).to(0.35, { opacity: 0 }).call(()=>{
                this.nodeLight.active = false;
            }).start();

            let p1 = this.nodeProp.position;
            let time = Common.getMoveTime(p1, this.pFinish, 1, 1500);
            let reward = this.params.rewards.reward[0];
            if (reward.type == TypeProp.coin) {
                this.nodeProp.active = false;
                kit.Event.emit(CConst.event_scale_coin, p1.x, p1.y);
                this.scheduleOnce(() => {
                    kit.Event.emit(CConst.event_menu_updateSuipianReward, p1.x, p1.y, this.obj.prop.scale0, this.obj.prop.scale1);
                    res();
                }, 1.0);
            }
            else if (reward.type == TypeProp.tStrengthInfinite) {
                let opt = {
                    p1: cc.v2(p1.x, p1.y),
                    p2: cc.v2((p1.x + this.pFinish.x) * 0.5, p1.y),
                    pTo: cc.v2(this.pFinish.x, this.pFinish.y),
                };
                cc.tween(this.nodeProp).bezierTo(time, opt.p1, opt.p2, opt.pTo).call(() => {
                    this.nodeProp.active = false;
                    kit.Event.emit(CConst.event_scale_strength);
                    this.scheduleOnce(() => {
                        kit.Event.emit(CConst.event_menu_updateSuipianReward, p1.x, p1.y, this.obj.prop.scale0, this.obj.prop.scale1);
                        res();
                    }, 1.0);
                }).start();
            }
            else {
                cc.tween(this.nodeProp).to(time, { position: this.pFinish }).call(() => {
                    this.nodeProp.active = false;
                    kit.Event.emit(CConst.event_scale_prop);
                    this.scheduleOnce(() => {
                        kit.Event.emit(CConst.event_menu_updateSuipianReward, p1.x, p1.y, this.obj.prop.scale0, this.obj.prop.scale1);
                        res();
                    }, 1.0);
                }).start();
            }
        });
    };

    /** 获取物品 */
    eventBtnContinue() {
        this.nodeTitle.active = false;
        this.nodeContinue.active = false;
        this.unscheduleAllCallbacks();
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }
}
