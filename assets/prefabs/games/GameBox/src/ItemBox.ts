import { BoxParam } from "./GameBox";
import ItemGood from "./ItemGood";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemBox extends cc.Component {

    @property(cc.Node) itemIcon: cc.Node = null;
    @property([cc.Node]) arrKuang: cc.Node[] = [];
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
        layer.active = false;
        
        // 特殊箱子
        if (this.param.isFrame) {
            this.itemIcon.active = false;
            this.arrKuang.forEach((item)=>{ item.active = true; });
        }
        // 普通箱子
        else{
            this.itemIcon.active = true;
            this.itemIcon.width = this.param.w;
            this.itemIcon.height = this.param.h;
            this.arrKuang.forEach((item)=>{ item.active = false; });
        }
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
}