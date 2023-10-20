import CConst from "../../../../src/config/CConst";
import { Design } from "../../../../src/config/ConfigCommon";
import ConfigDot from "../../../../src/config/ConfigDot";
import { LangChars } from "../../../../src/config/ConfigLang";
import DataManager from "../../../../src/config/DataManager";
import NativeCall from "../../../../src/config/NativeCall";
import { kit } from "../../../../src/kit/kit";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewPlayer extends cc.Component {

    @property(cc.Node) mask: cc.Node = null;
    @property(cc.Node) content: cc.Node = null;
    @property(cc.Node) hand: cc.Node = null;
    @property(cc.Node) desc: cc.Node = null;
    @property(cc.Node) uiProp: cc.Node = null;
    @property([cc.Node]) arrProp: cc.Node[] = [];

    protected onEnable(): void {
        let winScaleByH = cc.winSize.height / Design.height;
        let disBackToProp = 60 * winScaleByH;

        this.uiProp.height *= winScaleByH;
        this.uiProp.children.forEach((item) => { item.scale = winScaleByH; });
        this.uiProp.y = -cc.winSize.height * 0.5 + this.uiProp.height * 0.5 + disBackToProp;

        this.show();
    }

    show() {
        let propId = 0;
        let number = 0;
        let arrKey = [LangChars.boxSort_3, LangChars.boxSort_5, LangChars.boxSort_7, LangChars.boxSort_9];
        switch (DataManager.data.boxData.level) {
            case 3:
                propId = 0;
                number = DataManager.data.prop.tip.count;
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_01);
                break;
            case 5:
                propId = 1;
                number = DataManager.data.prop.back.count;
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_02);
                break;
            case 7:
                propId = 2;
                number = DataManager.data.prop.refresh.count;
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_03);
                break;
            case 9:
                propId = 3;
                number = DataManager.data.prop.ice.count;
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_04);
                break;
            default:
                break;
        }

        DataManager.setString(arrKey[propId], (chars: string) => {
            let label = this.desc.getChildByName('label');
            label.getComponent(cc.Label).string = chars;
        });

        this.arrProp.forEach((item, index)=>{
            item.active = index == propId;
            if (item.active) {
                let label = item.getChildByName('label');
                label.getComponent(cc.Label).string = '' + number;
            }
        });

        this.content.opacity = 0;
        cc.tween(this.content).to(0.383, { opacity: 255 }).call(()=>{
            this.hand.x = this.arrProp[propId].x;
            this.hand.y = this.uiProp.y + 190;
            this.hand.opacity = 255;
            let ani = this.hand.getChildByName("icon").getComponent(cc.Animation);
            ani.stop();
            ani.play();
        }).start();
    }
    
    button() {
        switch (DataManager.data.boxData.level) {
            case 3:
                DataManager.data.prop.tip.isGuide = false;
                kit.Event.emit(CConst.event_guide_3);
                break;
            case 5:
                DataManager.data.prop.back.isGuide = false;
                kit.Event.emit(CConst.event_guide_5);
                break;
            case 7:
                DataManager.data.prop.refresh.isGuide = false;
                kit.Event.emit(CConst.event_guide_7);
                break;
            case 9:
                DataManager.data.prop.ice.isGuide = false;
                kit.Event.emit(CConst.event_guide_9);
                break;
            default:
                break;
        }
        this.node.removeFromParent();
    }
}
