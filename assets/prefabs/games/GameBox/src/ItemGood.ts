import Common from "../../../../src/config/Common";
import { kit } from "../../../../src/kit/kit";
import GameBox, { GoodParam } from "./GameBox";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemGood extends cc.Component {

    @property(cc.Node) itemIcon: cc.Node = null;

    state: number = 0;
    isChose: boolean = false;
    param: GoodParam = null;
    resPath = { bundle: 'prefabs', path: './games/GameBox/res/img/goods/' };

    init(param: GoodParam) {
        this.state = 0;
        this.param = Common.clone(param);
        this.node.scale = 1;
        this.node.opacity = 0;
        this.node.position = cc.v3(this.param.x, this.param.y);
        this.node.name = this.param.name;
        this.node.getChildByName('label').getComponent(cc.Label).string = String(this.param.keyGood);
        this.node.active = true;
        
        let path = this.resPath.path + this.param.nameRes;
        kit.Resources.loadRes(this.resPath.bundle, path, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 good_path: ', path);
                return;
            }
            this.itemIcon.getComponent(cc.Sprite).spriteFrame = assets;
            this.itemIcon.width = this.param.w;
            this.itemIcon.height = this.param.h;
            this.node.opacity = 255;
        });
    };

    refreshRes(param: GoodParam) {
        let timeOpa = 0.3;
        this.param.w = param.w;
        this.param.h = param.h;
        this.param.nameRes = param.nameRes;
        this.param.keyGood = param.keyGood;
        this.node.getChildByName('label').getComponent(cc.Label).string = String(this.param.keyGood);
        cc.tween(this.node).to(timeOpa, { opacity: 0 }).call(async () => {
            let path = this.resPath.path + this.param.nameRes;
            await kit.Resources.loadRes(this.resPath.bundle, path, cc.SpriteFrame, (err, assets: cc.SpriteFrame) => {
                if (err) {
                    Common.log(' 资源加载异常 good_path: ', path);
                    return;
                }
                this.itemIcon.getComponent(cc.Sprite).spriteFrame = assets;
                this.itemIcon.width = this.param.w;
                this.itemIcon.height = this.param.h;
            });
        }).to(timeOpa, {opacity: 255}).start();
    }

    refreshParams(pos: cc.Vec3) {
        this.param.x = pos.x;
        this.param.y = pos.y;
        this.node.x = this.param.x;
        this.node.y = this.param.y;
    }

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

    resetParams(param: GoodParam){
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