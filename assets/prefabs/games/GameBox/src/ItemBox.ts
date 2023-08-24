import Common from "../../../../src/config/Common";
import { BoxParam } from "./GameBox";
import ItemGood from "./ItemGood";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemBox extends cc.Component {

    @property(cc.Node) itemIcon: cc.Node = null;
    @property(cc.Node) nodeMain: cc.Node = null;

    objSpeed = {
        speedCur: 0, speedDis: 1, speedInit: 0, speedMax: 20, isMove: false,
    };
    param: BoxParam = null;
    init(param: BoxParam) {
        this.param = param;
        this.node.x = this.param.x;
        this.node.y = this.param.y;
        this.node.name = this.param.name;
        let layer = this.node.getChildByName('layer');
        layer.getComponent(cc.Label).string = String(this.param.index);
        this.itemIcon.width = this.param.w;
        this.itemIcon.height = this.param.h;
    };

    sortGood(){
        this.nodeMain.children.sort((a: cc.Node, b: cc.Node)=>{
            return a.getComponent(ItemGood).param.index - b.getComponent(ItemGood).param.index;
        });
        this.refreshGoods();
    };

    refreshGoods(){
        this.nodeMain.children.forEach((good: cc.Node, index: number)=>{
            good.active = index == 0;
        });
    }

    refreshParams(y: number){
        this.param.y = y;
        this.node.y = this.param.y;
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
        let y = this.node.y - this.param.yBottom;
        if (y < 0) {
            this.node.y = this.param.yBottom
        }
        else{
            let disY = this.param.h - y % this.param.h;
            this.node.y += disY;
        }
    }
}