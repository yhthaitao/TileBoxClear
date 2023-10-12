import Common from "../../../../src/config/Common";
import { BoxParam } from "./GameBox";
import ItemGood from "./ItemGood";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemBox extends cc.Component {

    @property({ type: cc.Node, tooltip: '箱子节点-图-普通' }) itemIcon: cc.Node = null;
    @property({ type: cc.Node, tooltip: '箱子节点-框' }) itemKuang: cc.Node = null;
    @property({ type: [cc.Node], tooltip: '箱子节点-图数组-框' }) arrKuang: cc.Node[] = [];
    @property({ type: cc.Node, tooltip: '物品父节点' }) nodeMain: cc.Node = null;

    objSpeed = {
        speedCur: 0, speedDis: 1, speedInit: 0, speedMax: 20, isMove: false,
    };
    param: BoxParam = null;
    total: number = 0;
    init(param: BoxParam) {
        this.param = Common.clone(param);
        this.node.x = this.param.x;
        this.node.y = this.param.y;
        this.node.name = this.param.name;

        let layer = this.node.getChildByName('layer');
        layer.getComponent(cc.Label).string = String(this.param.index);
        layer.active = false;

        // 特殊箱子
        if (this.param.isFrame) {
            this.itemIcon.active = false;
            this.arrKuang.forEach((item) => { item.active = true; });
        }
        // 普通箱子
        else {
            this.itemIcon.active = true;
            this.itemIcon.width = this.param.w;
            this.itemIcon.height = this.param.h;
            this.arrKuang.forEach((item) => { item.active = false; });
        }
        this.nodeMain.removeAllChildren(true);
    };

    sortGood(isInit: boolean = false) {
        this.nodeMain.children.sort((a: cc.Node, b: cc.Node) => {
            return a.getComponent(ItemGood).param.index - b.getComponent(ItemGood).param.index;
        });
        // 特殊框更新
        let goodNum = this.nodeMain.childrenCount;
        if (isInit) {
            this.total = goodNum;
            let nodeLine = this.itemKuang.getChildByName('line');
            let widthTotal = nodeLine.width;
            let widthDistance = widthTotal / this.total;
            let arrLine = Common.getArrByName(nodeLine, 'line');
            arrLine.forEach((line: cc.Node, index: number) => {
                line.active = index < this.total - 1;
                line.x = (index + 1) * widthDistance - widthTotal * 0.5;
            });

            let process = this.itemKuang.getChildByName('process');
            let bar = process.getChildByName('bar');
            bar.getComponent(cc.Sprite).fillRange = 1;
            this.initGoods();
        }
        else {
            let process = this.itemKuang.getChildByName('process');
            let bar = process.getChildByName('bar');
            bar.getComponent(cc.Sprite).fillRange = goodNum / this.total;
            this.refreshGoods();
        }
        let itemLabel = this.itemKuang.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = '' + goodNum;
    };

    initGoods(){
        this.nodeMain.children.forEach((good: cc.Node, index: number) => {
            good.x = 0;
            good.active = index == 0;
        });
    }

    refreshGoods() {
        this.nodeMain.children.forEach((good: cc.Node, index: number) => {
            if (index == 0) {
                if (!good.active) {
                    good.active = true;
                    good.scale = 0;
                    cc.tween(good).to(0.2, { scale: 1.1 }).to(0.15, { scale: 1.0 }).start();
                }
            }
            else{
                good.active = false;
            }
        });
    }

    refreshParams(y: number) {
        this.param.y = y;
        this.node.y = this.param.y;
    }
}