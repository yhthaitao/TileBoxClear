import { kit } from "../kit/kit";
import CConst from "./CConst";
import DataManager, { TypeRes } from "./DataManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LocalImg extends cc.Component {

    @property({displayName: '资源类型'}) 
    resType: string = '类型';

    @property({displayName: '资源名字'}) 
    resName: string = '名字';

    /** 资源路径 */
    path: string = './language/img/' + DataManager.langCur + '/';

    protected start(): void {
        this.initRes();
    }

    initRes(){
        kit.Resources.loadRes(CConst.bundleCommon, this.path + this.resName, cc.SpriteFrame, (e: any, asset: cc.SpriteFrame)=>{
            switch (this.resType) {
                case TypeRes.PNG:
                    this.setTexture(asset);
                    break;
                case TypeRes.DRAGON:
                    this.setDragon(asset);
                    break;
                default:
                    break;
            }
        });
    }

    /** 设置素材 sprite */
    setTexture(obj) {
        if (obj) {
            this.node.getComponent(cc.Sprite).spriteFrame = obj;
        }
    }

    /** 设置 素材 龙骨 */
    setDragon(obj) {
        if (obj && obj.asset && obj.atlasAsset) {
            let armatureDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);
            armatureDisplay.dragonAsset = obj.asset;
            armatureDisplay.dragonAtlasAsset = obj.atlasAsset;
            armatureDisplay.armatureName = obj.armatureName;
        }
    }
}
