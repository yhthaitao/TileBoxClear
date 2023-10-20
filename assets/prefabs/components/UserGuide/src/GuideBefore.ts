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
        this.show();
    }

    show() {
        let propId = 0;
        let number = 0;
        let arrKey = [LangChars.boxSort_12, LangChars.boxSort_15];
        switch (DataManager.data.boxData.level) {
            case 12:
                propId = 0;
                number = DataManager.data.prop.magnet.count;
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_05);
                break;
            case 15:
                propId = 1;
                number = DataManager.data.prop.clock.count;
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_06);
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

        this.content.opacity = 255;
        this.mask.opacity = 0;
        cc.tween(this.mask).to(0.383, { opacity: 150 }).call(()=>{
            this.hand.x = this.arrProp[propId].x;
            this.hand.y = this.uiProp.y -200;
            this.hand.opacity = 255;
            let ani = this.hand.getChildByName("icon").getComponent(cc.Animation);
            ani.stop();
            ani.play();
        }).start();
    }
    
    button() {
        switch (DataManager.data.boxData.level) {
            case 12:
                DataManager.data.prop.magnet.isGuide = false;
                kit.Event.emit(CConst.event_guide_12);
                break;
            case 15:
                DataManager.data.prop.clock.isGuide = false;
                kit.Event.emit(CConst.event_guide_15);
                break;
            default:
                break;
        }
        this.node.removeFromParent();
    }
}
