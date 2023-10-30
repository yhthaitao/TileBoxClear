import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { TypeProp } from "../../../../src/config/ConfigCommon";
import { BuyCfg } from "../../../../src/config/ConfigBuyItem";
import CConst from "../../../../src/config/CConst";

const { ccclass, property } = cc._decorator;
@ccclass
export default class OpenBoxShop extends PopupBase {

    @property(cc.Node) nodeBox: cc.Node = null;
    @property(cc.Node) nodeGift: cc.Node = null;
    @property(cc.Node) nodeCoin: cc.Node = null;
    @property(cc.Node) nodeNoads: cc.Node = null;

    winH = cc.winSize.height * 0.5;
    obj = {
        open: {
            armatureName: 'xiangzidakai', animationName: 'dakai',
        },
        icon: {
            y: { bottom: 0, mid: this.winH * 0.5, top: this.winH * 0.75 },
            scale: { bottom: 0.25, mid: 1.0 },
            opacity: { bottom: 0, mid: 255, top: 0 },
        },
        isAddCoin: false,
        isAddProp: false,
    };
    produceCfg: BuyCfg = null;
    nodeReward: cc.Node = null;

    protected showBefore(options: any): void {
        this.produceCfg = Common.clone(options);
        Common.log('弹窗 开启商店宝箱 showBefore()');
        this.initData();
        this.initUI();
    }

    initData() {
        // 去除广告
        if (this.produceCfg.name == 'noads') {
            DataManager.data.advert.isRemove = true;
        }
        else {
            if (this.produceCfg.isLimit) {
                let idx = DataManager.data.shopLimit.indexOf(this.produceCfg.name);
                if (idx < 0) {
                    DataManager.data.shopLimit.push(this.produceCfg.name);
                }
            }
            for (let index = 0, length = this.produceCfg.props.length; index < length; index++) {
                let prop = this.produceCfg.props[index];
                switch (prop.typeProp) {
                    case TypeProp.coin:
                        this.obj.isAddCoin = true;
                        DataManager.data.numCoin += prop.count;
                        break;
                    case TypeProp.ice:
                        this.obj.isAddProp = true;
                        DataManager.data.prop.ice.count += prop.count;
                        break;
                    case TypeProp.refresh:
                        this.obj.isAddProp = true;
                        DataManager.data.prop.refresh.count += prop.count;
                        break;
                    case TypeProp.back:
                        this.obj.isAddProp = true;
                        DataManager.data.prop.back.count += prop.count;
                        break;
                    case TypeProp.tStrengthInfinite:
                        let time = Math.floor(new Date().getTime() * 0.001);
                        if (DataManager.data.strength.tInfinite < time) {
                            DataManager.data.strength.tInfinite = time + prop.count * 3600;
                        }
                        else {
                            DataManager.data.strength.tInfinite += prop.count * 3600;
                        }
                        break;
                    case TypeProp.tip:
                        this.obj.isAddProp = true;
                        DataManager.data.prop.tip.count += prop.count;
                        break;
                    case TypeProp.clock:
                        DataManager.data.prop.clock.count += prop.count;
                        break;
                    case TypeProp.magnet:
                        DataManager.data.prop.magnet.count += prop.count;
                        break;
                    default:
                        break;
                }
            }
        }
        DataManager.setData();
    };

    initUI() {
        this.nodeBox.active = false;
        this.nodeBox.getChildByName('particle').active = false;

        this.nodeGift.active = false;
        this.nodeCoin.active = false;
        this.nodeNoads.active = false;
    };

    public show(options?: any): Promise<void> {
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

            // 箱子开启
            this.nodeBox.active = true;
            let dragon = this.nodeBox.getChildByName('dragon');
            DataManager.playAniDragon(dragon, this.obj.open.armatureName, this.obj.open.animationName);

            this.setReward();
            this.nodeReward.active = true;
            this.nodeReward.y = this.obj.icon.y.bottom;
            this.nodeReward.scale = this.obj.icon.scale.bottom;
            this.nodeReward.opacity = this.obj.icon.opacity.bottom;
            let nodeIcon = this.nodeReward.getChildByName('nodeIcon');
            nodeIcon.getComponent(cc.Animation).stop();
            cc.tween(this.nodeReward).delay(1.35).call(() => {
                this.nodeReward.opacity = this.obj.icon.opacity.mid;
                // 粒子
                let particle = this.nodeBox.getChildByName('particle');
                particle.active = true;
                particle.getComponent(cc.ParticleSystem).resetSystem();
            }).parallel(
                cc.tween().to(0.25, { y: this.obj.icon.y.mid }),
                cc.tween().to(0.25, { scale: this.obj.icon.scale.mid }).call(() => {
                    nodeIcon.getComponent(cc.Animation).play();
                }),
            ).delay(1.5).parallel(
                cc.tween().to(0.5, { y: this.obj.icon.y.top }),
                cc.tween().to(0.5, { opacity: this.obj.icon.opacity.top }),
            ).call(() => {
                if (this.obj.isAddCoin) {
                    kit.Event.emit(CConst.event_refresh_coin);
                }
                if (this.obj.isAddProp) {
                    kit.Event.emit(CConst.event_refresh_prop);
                }
                kit.Event.emit(CConst.event_refresh_shop, this.produceCfg);
                // 弹窗已完全展示
                this.showAfter && this.showAfter();
                // Done
                res();
            }).call(() => {
                kit.Popup.hide();
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
            this.nodeBox.active = false;
            let nodeIcon = this.nodeReward.getChildByName('nodeIcon');
            nodeIcon.getComponent(cc.Animation).stop();
            nodeIcon.y = 0;
            // 开启拦截
            this.maskUp.active = true;
            // 关闭前
            this.hideBefore();
            // 播放背景遮罩动画
            cc.tween(this.maskDown).delay(0.2).to(0.233, { opacity: 0 }, { easing: 'sineInOut' }).start();
            // 延迟一会儿
            await new Promise((_res) => {
                cc.Canvas.instance.scheduleOnce(_res, 0.75);
            });
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
        if (this.produceCfg.name.includes('package')) {
            this.nodeReward = this.nodeGift;
            let itemArr = Common.getArrByName(this.nodeReward.getChildByName('nodeIcon'), 'prop');
            let itemLen = itemArr.length;
            for (let index = 0, length = this.produceCfg.props.length; index < length; index++) {
                let obj = this.produceCfg.props[index];
                if (index < itemLen) {
                    let propOne = itemArr[index];
                    if (propOne) {
                        let _string = '' + obj.count;
                        if (obj.typeProp == TypeProp.tStrengthInfinite) {
                            _string += 'h';
                        }
                        let labelProp = propOne.getChildByName('label');
                        labelProp.getComponent(cc.Label).string = _string;
                    }
                }
            }
        }
        else if (this.produceCfg.name.includes('gold')) {
            this.nodeReward = this.nodeCoin;
            let itemArr = Common.getArrByName(this.nodeReward.getChildByName('nodeIcon'), 'prop');
            let itemLen = itemArr.length;
            for (let index = 0, length = this.produceCfg.props.length; index < length; index++) {
                let obj = this.produceCfg.props[index];
                if (index < itemLen) {
                    let propOne = itemArr[index];
                    if (propOne) {
                        let _string = '' + obj.count;
                        let labelProp = propOne.getChildByName('label');
                        labelProp.getComponent(cc.Label).string = _string;
                    }
                }
            }
        }
        else if (this.produceCfg.name == 'noads') {
            this.nodeReward = this.nodeNoads;
        }
    };
}
