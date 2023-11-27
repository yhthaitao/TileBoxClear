import Common from "../../../../src/config/Common";
import { BoxParam } from "../../../../src/config/ConfigCommon";
import ItemGood from "./ItemGood";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemBox extends cc.Component {

    @property({ type: cc.Node, tooltip: '箱子节点-图-普通' }) itemIcon: cc.Node = null;
    @property({ type: cc.Node, tooltip: '箱子节点-框' }) itemKuang: cc.Node = null;
    @property({ type: [cc.Node], tooltip: '箱子节点-图数组-框' }) arrKuang: cc.Node[] = [];
    @property({ type: cc.Node, tooltip: '物品父节点' }) nodeMain: cc.Node = null;

    obj = {
        dress: {// 5: 挂着的衣服  6：叠着的衣服
            start_6: 19,
            start_10_5: 125,
            start_11_5: 165,
            dis_5: -12,
            dis_6: 10,
        }
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

    sortGood(isInit: boolean = false){
        if (this.param.isFrame) {
            this.sortBoxFrame(isInit);
            return;
        }
        // 叠着的衣服6
        let sortBoxDress = (arrGoods, xStart: number, xDis: number)=>{
            let length = arrGoods.length;
            arrGoods.sort((a: cc.Node, b: cc.Node) => {
                return a.getComponent(ItemGood).param.index - b.getComponent(ItemGood).param.index;
            });
            arrGoods.forEach((good: cc.Node, index: number)=>{
                good.y = xStart + xDis * index;
                let script = good.getComponent(ItemGood);
                script.nodeIcon.getComponent(cc.Button).interactable = index == length - 1;
            });
        };
        let dress = this.obj.dress;
        // 叠着的衣服6
        if (this.param.boxType == 9) {
            sortBoxDress(this.nodeMain.children, dress.start_6, dress.dis_6);
        }
        // 挂着的衣服5
        else if (this.param.boxType == 10) {
            sortBoxDress(this.nodeMain.children, dress.start_10_5, dress.dis_5);
        }
        // 叠着的衣服6 + 挂着的衣服5
        else if (this.param.boxType == 11) {
            let arrGood5 = this.nodeMain.children.filter((good: cc.Node)=>{
                return Math.floor(good.getComponent(ItemGood).param.keyGood * 0.001) == 5;
            });
            let arrGood6 = this.nodeMain.children.filter((good: cc.Node)=>{
                return Math.floor(good.getComponent(ItemGood).param.keyGood * 0.001) == 6;
            });
            sortBoxDress(arrGood5, dress.start_11_5, dress.dis_5);
            sortBoxDress(arrGood6, dress.start_6, dress.dis_6);
        }
    };

    sortBoxFrame(isInit: boolean) {
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
            this.nodeMain.children.forEach((good: cc.Node, index: number) => {
                good.x = 0;
                good.active = index == 0;
            });
        }
        else {
            let process = this.itemKuang.getChildByName('process');
            let bar = process.getChildByName('bar');
            bar.getComponent(cc.Sprite).fillRange = goodNum / this.total;
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
        let itemLabel = this.itemKuang.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = '' + goodNum;
    };

    refreshCloseY(){

    };

    refreshParams(y: number) {
        this.param.y = y;
        this.node.y = this.param.y;
    }
}