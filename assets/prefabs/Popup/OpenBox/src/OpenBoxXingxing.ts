import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { Design, TypeProp, TypeReward } from "../../../../src/config/ConfigCommon";

const { ccclass, property } = cc._decorator;
@ccclass
export default class OpenBoxXingxing extends PopupBase {

    @property(cc.Node) nodeBox: cc.Node = null;
    @property(cc.Node) nodeOpen: cc.Node = null;
    @property(cc.Node) nodeContinue: cc.Node = null;
    @property(cc.Node) nodeReward: cc.Node = null;
    @property(cc.Node) btnClaim: cc.Node = null;
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
        icon: {
            y1: 50, y2: 320,
        },
        isVideo: false,
    };
    params: {
        pStrength: { x: number, y: number },
        pCoin: { x: number, y: number },
        pProp: { x: number, y: number },
        rewards: TypeReward
    } = null;

    protected showBefore(options: any): void {
        Common.log('弹窗 开启星星宝箱 showBefore()');
        this.params = Common.clone(options);

        DataManager.setString(LangChars.tapToClaim, (chars: string) => {
            let itemLabel = this.nodeOpen.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.logon_reward_claim, (chars: string) => {
            let itemLabel = this.btnClaim.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });

        this.nodeBox.active = false;
        this.nodeBox.getChildByName('particle').active = false;
        this.nodeOpen.active = false;
        this.nodeContinue.active = false;
        this.nodeReward.active = false;
        this.nodeReward.children.forEach((item) => { item.active = false });
        this.obj.isVideo = false;
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
                this.nodeOpen.active = true;
                this.nodeOpen.opacity = 0;
                cc.tween(this.nodeOpen).to(0.3, { opacity: 255 }).start();
                DataManager.playAniDragon(dragon, this.obj.wait.armatureName, this.obj.wait.animationName);
            }, timeDrop);
            // 点击继续
            this.scheduleOnce(() => {
                this.nodeOpen.active = false;
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
            this.nodeOpen.active = false;
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
            // 弹窗完成回调
            this.finishCallback && this.finishCallback(suspended);
            // Done
            res();
        });
    }

    setReward() {
        let rewards = this.params.rewards.reward;
        for (let index = 0, length = rewards.length; index < length; index++) {
            let prop = this.nodeReward.getChildByName('prop' + index);
            let itemIcon = prop.getChildByName('icon');
            let itemLabel = prop.getChildByName('label');
            prop.active = true;
            prop.scale = 0;
            prop.opacity = 255;
            prop.position = cc.v3();
            
            let reward = rewards[index];
            let config = this.getPropConfig(reward);
            itemIcon.getComponent(cc.Sprite).spriteFrame = this.iconTexture[config.frameId];
            itemLabel.getComponent(cc.Label).string = config.propChars;
        }
    };

    playAniOpen() {
        // 箱子开启
        let timeOpen = 2.919;
        let dragon = this.nodeBox.getChildByName('dragon');
        DataManager.playAniDragon(dragon, this.obj.open.armatureName, this.obj.open.animationName);
        // icon
        this.nodeReward.active = true;
        this.nodeReward.getComponent(cc.Animation).play();
        this.setReward();

        // 粒子
        cc.tween(this.nodeReward).delay(1.35).call(() => {
            // 粒子
            let particle = this.nodeBox.getChildByName('particle');
            particle.active = true;
            particle.getComponent(cc.ParticleSystem).resetSystem();
        }).call(() => {
            let disX = 200;
            let arrPos: cc.Vec3[] = [];
            let rewards = this.params.rewards.reward;
            let disWidth = (rewards.length - 1) * disX;
            // 缩放数据
            let winScaleByH = cc.winSize.height / Design.height;
            let y1 = this.obj.icon.y1 * winScaleByH;
            let y2 = this.obj.icon.y2 * winScaleByH;
            rewards.forEach((item, index) => {
                arrPos.push(cc.v3(index * disX - disWidth * 0.5, y2));
            });
            for (let index = 0, length = rewards.length; index < length; index++) {
                let prop = this.nodeReward.getChildByName('prop' + index);
                prop.position = cc.v3(0, y1);
                cc.tween(prop).parallel(
                    cc.tween().to(0.1, { scale: 1 }),
                    cc.tween().to(0.2, { position: arrPos[index] }),
                ).start();
            }
        }).start();

        // 点击继续
        this.scheduleOnce(() => {
            this.nodeContinue.active = true;
            this.nodeContinue.opacity = 0;
            cc.tween(this.nodeContinue).to(0.3, { opacity: 255 }).start();
        }, timeOpen);
    };

    playAniHide(): Promise<void> {
        this.nodeReward.getComponent(cc.Animation).stop();
        this.nodeReward.position = cc.v3();
        let rewards = this.params.rewards.reward;
        let count = 0;
        let total = rewards.length;
        return new Promise((res) => {

            // 看视频 奖励翻倍
            DataManager.refreshDataAfterUnlockReward(this.params.rewards, this.obj.isVideo ? 2 : 1);
            DataManager.setData();

            let funcCount = () => {
                count++;
                if (count > total - 1) {
                    res();
                }
            };

            for (let index = 0, length = rewards.length; index < length; index++) {
                let reward = rewards[index];
                let prop = this.nodeReward.getChildByName('prop' + index);
                prop.opacity = 255;
                let p1 = prop.position;
                let p2 = this.getPropConfig(reward).pFinish;
                let time = Common.getMoveTime(p1, p2, 1, 1250);
                if (reward.type == TypeProp.coin) {
                    prop.opacity = 0;
                    kit.Event.emit(CConst.event_scale_coin, p1.x, p1.y);
                    cc.tween(prop).delay(time).call(() => {
                        funcCount();
                    }).start();
                }
                else if (reward.type == TypeProp.strength || reward.type == TypeProp.tStrengthInfinite) {
                    let opt = {
                        p1: cc.v2(p1.x, p1.y),
                        p2: cc.v2((p1.x + p2.x) * 0.5, p1.y),
                        pTo: cc.v2(p2.x, p2.y),
                    };
                    cc.tween(prop).bezierTo(time, opt.p1, opt.p2, opt.pTo).call(() => {
                        funcCount();
                        kit.Event.emit(CConst.event_scale_strength);
                    }).start();
                }
                else {
                    let opt = {
                        p1: cc.v2(p1.x, p1.y),
                        p2: cc.v2((p1.x + p2.x) * 0.5, p1.y),
                        pTo: cc.v2(p2.x, p2.y),
                    };
                    cc.tween(prop).bezierTo(time, opt.p1, opt.p2, opt.pTo).call(() => {
                        funcCount();
                        kit.Event.emit(CConst.event_scale_prop);
                    }).start();
                }
            }
        });
    };

    getPropConfig(reward: {type: TypeProp, number: number}) {
        let frameId = 0;
        let propChars = '';
        let pFinish = cc.v3();
        switch (reward.type) {
            case TypeProp.coin:
                frameId = 0;
                propChars = 'x' + reward.number;
                pFinish = cc.v3(this.params.pCoin.x, this.params.pCoin.y);
                break;
            case TypeProp.ice:
                frameId = 1;
                propChars = 'x' + reward.number;
                pFinish = cc.v3(this.params.pProp.x, this.params.pProp.y);
                break;
            case TypeProp.tip:
                frameId = 2;
                propChars = 'x' + reward.number;
                pFinish = cc.v3(this.params.pProp.x, this.params.pProp.y);
                break;
            case TypeProp.back:
                frameId = 3;
                propChars = 'x' + reward.number;
                pFinish = cc.v3(this.params.pProp.x, this.params.pProp.y);
                break;
            case TypeProp.refresh:
                frameId = 4;
                propChars = 'x' + reward.number;
                pFinish = cc.v3(this.params.pProp.x, this.params.pProp.y);
                break;
            case TypeProp.magnet:
                frameId = 5;
                propChars = 'x' + reward.number;
                pFinish = cc.v3(this.params.pProp.x, this.params.pProp.y);
                break;
            case TypeProp.tMagnetInfinite:
                frameId = 6;
                propChars = '+' + Math.floor(reward.number/60) + 'm';
                pFinish = cc.v3(this.params.pProp.x, this.params.pProp.y);
                break;
            case TypeProp.clock:
                frameId = 7;
                propChars = 'x' + reward.number;
                pFinish = cc.v3(this.params.pProp.x, this.params.pProp.y);
                break;
            case TypeProp.tClockInfinite:
                frameId = 8;
                propChars = '+' + Math.floor(reward.number/60) + 'm';
                pFinish = cc.v3(this.params.pProp.x, this.params.pProp.y);
                break;
            case TypeProp.strength:
                frameId = 9;
                propChars = 'x' + reward.number;
                pFinish = cc.v3(this.params.pStrength.x, this.params.pStrength.y);
                break;
            case TypeProp.tStrengthInfinite:
                frameId = 10;
                propChars = '+' + Math.floor(reward.number/60) + 'm';
                pFinish = cc.v3(this.params.pStrength.x, this.params.pStrength.y);
                break;
            default:
                break;
        }
        return { frameId: frameId, propChars: propChars, pFinish: pFinish };
    }

    /** 开启箱子 */
    eventBtnOpen() {
        this.nodeOpen.active = false;
        this.unscheduleAllCallbacks();
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.playAniOpen();
    }

    /** 看视频 */
    eventBtnVideo() {
        let funcA = () => {
            this.obj.isVideo = true;
            this.nodeContinue.active = false;
            this.unscheduleAllCallbacks();
            kit.Audio.playEffect(CConst.sound_clickUI);
            kit.Popup.hide();
        };
        let funcB = () => {
            kit.Event.emit(CConst.event_notice, LangChars.notice_adLoading);
        };
        DataManager.playVideo(funcA, funcB);
    }

    /** 获取 */
    eventBtnClaim() {
        this.nodeContinue.active = false;
        this.unscheduleAllCallbacks();
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }
}
