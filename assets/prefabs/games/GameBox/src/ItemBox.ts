import Common from "../../../../src/config/Common";
import { BoxParams } from "./GameBox";
import ItemGood from "./ItemGood";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemBox extends cc.Component {

    @property(cc.Node) itemIcon: cc.Node = null;
    @property(cc.Node) nodeMain: cc.Node = null;

    objSpeed = {
        speedCur: 0, speedDis: 1, speedInit: 0, speedMax: 20, isMove: false,
    };
    params: BoxParams = null;
    rect: cc.Rect = cc.rect();
    init(params: BoxParams) {
        this.params = params;
        this.node.x = this.params.x;
        this.node.y = this.params.y;
        this.node.name = this.params.nameNode;
        let layer = this.node.getChildByName('layer');
        layer.getComponent(cc.Label).string = String(this.params.index);
        this.itemIcon.width = this.params.w;
        this.itemIcon.height = this.params.h;
        this.rect = cc.rect(this.params.x - this.params.w * 0.5, this.params.y, this.params.w, this.params.h);
        let collider = this.node.getComponent(cc.BoxCollider);
        Common.refreshCollider(collider, 0, this.params.h * 0.5, this.params.w - 1, this.params.h - 2);
    };

    sortGood(){
        this.nodeMain.children.sort((a: cc.Node, b: cc.Node)=>{
            return a.getComponent(ItemGood).params.index - b.getComponent(ItemGood).params.index;
        });
        this.refreshGoods();
    };

    refreshGoods(){
        this.nodeMain.children.forEach((good: cc.Node, index: number)=>{
            good.active = index == 0;
        });
    }

    refreshParams(y: number){
        this.params.y = y;
        this.node.y = this.params.y;
    }

    moveStart() {
        this.objSpeed.speedCur = this.objSpeed.speedInit;
        this.objSpeed.isMove = true;
    }

    moveStop() {
        this.objSpeed.speedCur = this.objSpeed.speedInit;
        this.objSpeed.isMove = false;
    }

    moveEnd() {
        if (!this.objSpeed.isMove) {
            return;
        }
        this.moveStop();
        this.playAniEnd();
    }

    playAniEnd() {
        let y = this.node.y - this.params.yBottom;
        if (y < 0) {
            this.node.y = this.params.yBottom
        }
        else{
            let disY = this.params.h - y % this.params.h;
            this.node.y += disY;
        }
    }
}