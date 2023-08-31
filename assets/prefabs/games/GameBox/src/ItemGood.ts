import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { kit } from "../../../../src/kit/kit";
import GameBox, { GoodParam } from "./GameBox";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemGood extends cc.Component {

    @property(cc.Node) nodeIcon: cc.Node = null;
    @property(cc.Node) nodeGold: cc.Node = null;
    @property(cc.Node) nodeDragon: cc.Node = null;

    state: number = 0;
    isChose: boolean = false;
    param: GoodParam = null;
    resPath = { bundle: 'prefabs', path: './games/GameBox/res/img/good/' };

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

        let path = this.resPath.path + this.param.nameRes;
        kit.Resources.loadRes(this.resPath.bundle, path, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 good_path: ', path);
                return;
            }
            this.nodeIcon.getComponent(cc.Sprite).spriteFrame = assets;
            this.nodeIcon.width = this.param.w;
            this.nodeIcon.height = this.param.h;
            this.node.opacity = 255;
        });
    };

    refreshRes(param: GoodParam) {
        let timeOpa = 0.3;
        this.param = param;
        this.param.w = param.w;
        this.param.h = param.h;
        this.param.nameRes = param.nameRes;
        this.param.keyGood = param.keyGood;
        this.param.gold = param.gold;
        this.node.getChildByName('label').getComponent(cc.Label).string = String(this.param.keyGood);

        cc.tween(this.node).to(timeOpa, { opacity: 0 }).call(async () => {
            this.initGold();
            let path = this.resPath.path + this.param.nameRes;
            await kit.Resources.loadRes(this.resPath.bundle, path, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
                if (err) {
                    Common.log(' 资源加载异常 good_path: ', path);
                    return;
                }
                this.nodeIcon.getComponent(cc.Sprite).spriteFrame = assets;
                this.nodeIcon.width = this.param.w;
                this.nodeIcon.height = this.param.h;
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
            arrGold.forEach((item, index) => { item.active = index == this.param.gold.count });

            this.nodeDragon.active = true;
            this.nodeDragon.y = this.param.h * 0.5;
            // 光
            let lightNode = this.nodeDragon.getChildByName('light');
            lightNode.active = true;
            let lightDragon = lightNode.getComponent(dragonBones.ArmatureDisplay);
            lightDragon.playAnimation('newAnimation', 0);
            // 破碎
            let posuiNode = this.nodeDragon.getChildByName('posui');
            posuiNode.active = false;
        }
        else {
            this.nodeGold.active = false;
            this.nodeDragon.active = false;
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

        this.nodeDragon.active = true;
        // 破碎
        let posuiNode = this.nodeDragon.getChildByName('posui');
        posuiNode.active = true;
        let posuiDragon = posuiNode.getComponent(dragonBones.ArmatureDisplay)
        posuiDragon.once(dragonBones.EventObject.COMPLETE, () => {
            posuiNode.active = false;
            // 金币脱落
            if (!this.param.gold.isGold) {
                this.nodeGold.active = false;
                this.nodeDragon.active = false;
            }
        })
        posuiDragon.playAnimation('newAnimation', 1);
    };

    hideGold(){
        this.param.gold.isGold = false;
        this.nodeGold.active = false;
        this.nodeDragon.active = false;
    };

    /** 点击事件 */
    eventBtn() {
        if (this.state > 0) {
            return;
        }
        this.state++;

        let scriptMain = this.getScriptMain();
        if (scriptMain) {
            scriptMain.eventTouch(this.node);
        }
        else {
            Common.log(' 异常 找不到脚本 scriptMain ');
            return;
        }
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