import CConst from "../../../../src/config/CConst";
import ConfigDot from "../../../../src/config/ConfigDot";
import NativeCall from "../../../../src/config/NativeCall";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewPlayer extends cc.Component {

    @property(cc.Node) mask: cc.Node = null;
    @property(cc.Node) content: cc.Node = null;
    @property(cc.Node) hand: cc.Node = null;
    @property(cc.Node) sign: cc.Node = null;
    @property(cc.Node) btnExit: cc.Node = null;

    guideType: string = '';

    async show(type: string) {
        this.guideType = type;
        let label = this.sign.getChildByName('label');
        switch (type) {
            case CConst.newPlayer_guide_sort_1:
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_01);
                this.scheduleOnce(() => {
                    this.hand.getChildByName("icon").getComponent(cc.Animation).play("handSort1");
                }, .383)
                break;
            case CConst.newPlayer_guide_sort_2:
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_02);
                NativeCall.logEventTwo('sortFirstPlay', String(2));
                this.hand.x = -290;
                break;
            case CConst.newPlayer_guide_sort_3:
                NativeCall.logEventOne(ConfigDot.dot_guide_adventure_03);
                NativeCall.logEventTwo('sortFirstPlay', String(3));
                this.sign.y = -400
                break;
            default:
                break;
        }
        this.content.opacity = 0;
        cc.tween(this.content).to(0.383, { opacity: 255 }).start();
    }

    button() {
        switch (this.guideType) {
            case CConst.newPlayer_guide_sort_1:
                break;
            case CConst.newPlayer_guide_sort_2:
                break;
            case CConst.newPlayer_guide_sort_3:
                break;
            default:
                break;
        }
        this.node.removeFromParent();
    }
}
