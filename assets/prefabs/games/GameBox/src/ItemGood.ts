import Common from "../../../../src/config/Common";
import { kit } from "../../../../src/kit/kit";
import GameBox, { GoodParams } from "./GameBox";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemGood extends cc.Component {

    @property(cc.Node) itemIcon: cc.Node = null;

    state: number = 0;
    isChose: boolean = false;
    params: GoodParams = null;
    resPath = { bundle: 'prefabs', path: './games/GameBox/res/img/goods/' };

    init(params: GoodParams) {
        this.params = Common.clone(params);
        
        this.node.opacity = 0;
        this.node.position = cc.v3(this.params.x, this.params.y);
        this.node.name = this.params.nameNode;
        this.node.getChildByName('label').getComponent(cc.Label).string = this.node.name;

        let path = this.resPath.path + this.params.nameRes;
        kit.Resources.loadRes(this.resPath.bundle, path, cc.SpriteFrame, (err, assets: cc.SpriteFrame)=>{
            if (err) {
                Common.log(' 资源加载异常 good_path: ', path);
                return;
            }
            this.itemIcon.getComponent(cc.Sprite).spriteFrame = assets;
            this.itemIcon.width = this.params.w;
            this.itemIcon.height = this.params.h;
            this.node.opacity = 255;
        });
    };

    refreshParams(pos: cc.Vec3){
        this.params.x = pos.x;
        this.params.y = pos.y;
        this.node.x = this.params.x;
        this.node.y = this.params.y;
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

    getScriptMain(): GameBox {
        let game = cc.find('Canvas/GameBox');
        if (game) {
            return game.getComponent(GameBox);
        }
        return null;
    }
}