import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { ConfigGold, ConfigGoldPos } from "../../../../src/config/ConfigGold";
import { kit } from "../../../../src/kit/kit";
import GameBox, { GoodParam } from "./GameBox";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemGood extends cc.Component {

    @property({ type: cc.Node, tooltip: '物品节点-图' }) nodeIcon: cc.Node = null;
    @property({ type: cc.Node, tooltip: '碎片节点-图' }) nodeGold: cc.Node = null;
    @property({ type: cc.Node, tooltip: '碎片节点-动画' }) goldDragon: cc.Node = null;
    @property({ type: cc.Node, tooltip: '碎片节点-动画' }) propDragon: cc.Node = null;
    @property({ type: cc.Node, tooltip: '碎片节点-动画' }) propLight: cc.Node = null;

    state: number = 0;
    isChose: boolean = false;
    param: GoodParam = null;
    idClock: number = 9001;
    idMagnet: number = 9002;

    init(param: GoodParam) {
        this.state = 0;
        this.param = Common.clone(param);
        this.node.scale = 1;
        this.node.opacity = 0;
        this.node.position = cc.v3(this.param.x, this.param.y);

        this.node.name = this.param.name;

        let label = this.node.getChildByName('label');
        label.getComponent(cc.Label).string = String(this.param.keyGood);
        label.active = false;

        this.node.active = true;

        this.initGold();
        this.initPorp();

        let path = CConst.pathGameGood + this.param.nameRes;
        kit.Resources.loadRes(CConst.bundleCommon, path, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 good_path: ', path);
                return;
            }
            this.nodeIcon.getComponent(cc.Sprite).spriteFrame = assets;
            this.node.opacity = 255;
        });
    };

    refreshRes(param: GoodParam) {
        let timeOpa = 0.3;
        this.param = param;
        this.param.nameRes = param.nameRes;
        this.param.keyGood = param.keyGood;
        this.param.gold = param.gold;
        this.node.getChildByName('label').getComponent(cc.Label).string = String(this.param.keyGood);

        cc.tween(this.node).to(timeOpa, { opacity: 0 }).call(async () => {
            this.initGold();
            let path = CConst.pathGameGood + this.param.nameRes;
            await kit.Resources.loadRes(CConst.bundleCommon, path, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
                if (err) {
                    Common.log(' 资源加载异常 good_path: ', path);
                    return;
                }
                this.nodeIcon.getComponent(cc.Sprite).spriteFrame = assets;
            });
        }).to(timeOpa, { opacity: 255 }).start();
    }

    refreshParams(pos: cc.Vec3) {
        this.param.x = pos.x;
        this.param.y = pos.y;
        this.node.x = this.param.x;
        this.node.y = this.param.y;
    }

    initGold() {
        if (this.param.gold.isGold) {
            this.nodeGold.active = true;
            let arrGold = Common.getArrByName(this.nodeGold, 'gold');
            arrGold.forEach((item, index) => {
                item.active = index == this.param.gold.count;
                // 资源更新
                let nameGood = ConfigGold[this.param.keyGood];
                let path = CConst.pathGameGold + nameGood + '/' + index;
                kit.Resources.loadRes(CConst.bundleCommon, path, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
                    if (err) {
                        Common.log(' 资源加载异常 gold_path: ', path);
                        return;
                    }
                    item.getComponent(cc.Sprite).spriteFrame = assets;
                    let obj = ConfigGoldPos[nameGood]['gold' + index];
                    item.x = obj.x;
                    item.y = obj.y;
                });
            });

            this.goldDragon.active = true;
            this.goldDragon.y = this.param.h * 0.5;
            // 光
            let lightNode = this.goldDragon.getChildByName('light');
            lightNode.active = true;
            let lightDragon = lightNode.getComponent(dragonBones.ArmatureDisplay);
            lightDragon.playAnimation('newAnimation', 0);
            // 破碎
            let posuiNode = this.goldDragon.getChildByName('posui');
            posuiNode.active = false;
        }
        else {
            this.nodeGold.active = false;
            this.goldDragon.active = false;
        }
    };

    refreshGold() {
        if (!this.param.gold.isGold) {
            return;
        }
        this.param.gold.count++;
        if (this.param.gold.count > this.param.gold.total - 1) {
            this.param.gold.isGold = false;
        }
        this.nodeGold.active = true;
        let arrGold = Common.getArrByName(this.nodeGold, 'gold');
        arrGold.forEach((item, index) => { item.active = index == this.param.gold.count });

        this.goldDragon.active = true;
        // 破碎
        let posuiNode = this.goldDragon.getChildByName('posui');
        posuiNode.active = true;
        let posuiDragon = posuiNode.getComponent(dragonBones.ArmatureDisplay)
        posuiDragon.once(dragonBones.EventObject.COMPLETE, () => {
            posuiNode.active = false;
            // 金币脱落
            if (!this.param.gold.isGold) {
                this.nodeGold.active = false;
                this.goldDragon.active = false;
            }
        })
        posuiDragon.playAnimation('newAnimation', 1);
    };

    hideGold() {
        this.param.gold.isGold = false;
        this.nodeGold.active = false;
        this.goldDragon.active = false;
    };

    initPorp() {
        // 时钟
        if (this.param.keyGood == this.idClock) {
            this.propLight.active = true;
            this.propLight.children.forEach((item) => {
                item.active = item.name == 'clock';
                if (item.active) {
                    let time = 1;
                    let forever = cc.tween().parallel(
                        cc.tween().to(time, { scale: 1.1 }).to(time, { scale: 1.0 }),
                        cc.tween().to(time, { opacity: 200 }).to(time, { opacity: 255 }),
                    );
                    cc.tween(item).repeatForever(forever).start();
                }
            });
            this.propDragon.active = true;
            let itemDragon = this.propDragon.getChildByName('dragon');
            let dragon = itemDragon.getComponent(dragonBones.ArmatureDisplay);
            dragon.armatureName = 'shijianshanguan';
            dragon.playAnimation('newAnimation', 0);
        }
        // 磁铁
        else if (this.param.keyGood == this.idMagnet) {
            this.propLight.active = true;
            this.propLight.children.forEach((item) => {
                item.active = item.name == 'magnet';
                if (item.active) {
                    let time = 1;
                    let forever = cc.tween().parallel(
                        cc.tween().to(time, { scale: 1.1 }).to(time, { scale: 1.0 }),
                        cc.tween().to(time, { opacity: 200 }).to(time, { opacity: 255 }),
                    );
                    cc.tween(item).repeatForever(forever).start();
                }
            });
            this.propDragon.active = true;
            let itemDragon = this.propDragon.getChildByName('dragon');
            let dragon = itemDragon.getComponent(dragonBones.ArmatureDisplay);
            dragon.armatureName = 'xitieshishanguang';
            dragon.playAnimation('newAnimation', 0);
        }
        else {
            this.propLight.active = false;
            this.propDragon.active = false;
        }
    };

    /** 点击事件 */
    eventBtn(event: cc.Event.EventTouch) {
        let scriptMain = this.getScriptMain();
        if (!scriptMain) {
            Common.log(' 异常 找不到脚本 scriptMain ');
            return;
        }
        scriptMain.effectTouchShow(event);

        if (this.state > 0) {
            return;
        }
        this.state++;
        scriptMain.eventTouch(this.node);
    };

    resetParams(param: GoodParam) {
        this.state = 0;
        this.param.name = param.name;
        this.param.x = param.box.x;
        this.param.y = param.box.y;
        this.node.x = this.param.x;
        this.node.y = this.param.y;
        this.node.name = this.param.name;
    }

    getScriptMain(): GameBox {
        let game = cc.find('Canvas/GameBox');
        if (game) {
            return game.getComponent(GameBox);
        }
        return null;
    }
}