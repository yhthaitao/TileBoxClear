import CConst from "../../../../src/config/CConst";
import { kit } from "../../../../src/kit/kit";
import DataManager from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuBottom extends cc.Component {

    @property(cc.Node) itemLabelShop: cc.Node = null;
    @property(cc.Node) itemLabelHome: cc.Node = null;
    @property(cc.Node) itemLabelTheme: cc.Node = null;

    protected onLoad(): void {
        this.listernerRegist();
    }

    protected start(): void {
        this.init();
    }

    protected onEnable(): void {
        console.log('MainMenuBottom onEnable()');
    }

    init() {
        this.refreshLabel_bottom();
    };

    /** 更新语言 */
    eventBack_refreshLanguage(){
        this.refreshLanguage();
    };

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_refresh_language, this.eventBack_refreshLanguage, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    };

    /** 刷新语言 */
    refreshLanguage(){
        this.refreshLabel_bottom();
    };

    /** label bottom */
    refreshLabel_bottom(){
        DataManager.setString(LangChars.Shop, (chars: string)=>{
            this.itemLabelShop.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.Home, (chars: string)=>{
            this.itemLabelHome.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.Theme, (chars: string)=>{
            this.itemLabelTheme.getComponent(cc.Label).string = chars;
        });
    };
}
