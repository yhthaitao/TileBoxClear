import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import Common from "../../../../src/config/Common";
import CConst from "../../../../src/config/CConst";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenu extends cc.Component {

    @property(cc.Node) mask: cc.Node = null;
    @property(cc.Node) content: cc.Node = null;
    
    // 顶部ui
    @property(cc.Node) uiTop: cc.Node = null;
    @property(cc.Node) topLabelStrengthNum: cc.Node = null;
    @property(cc.Node) topLabelStrengthMax: cc.Node = null;
    @property(cc.Node) topLabelStrengthTime: cc.Node = null;
    @property(cc.Node) topLabelCoinNum: cc.Node = null;
    
    // 底部ui
    @property(cc.Node) uiBottom: cc.Node = null;
    @property(cc.Node) bottomLight: cc.Node = null;
    @property(cc.Node) bottomShop: cc.Node = null;
    @property(cc.Node) bottomHome: cc.Node = null;
    @property(cc.Node) bottomTheme: cc.Node = null;
    
    // 中间ui
    @property(cc.Node) uiMid: cc.Node = null;
    // 中间ui--商店
    @property(cc.Node) midShop: cc.Node = null;
    // 中间ui--主菜单
    @property(cc.Node) midHome: cc.Node = null;
    // 中间ui--主菜单（顶部）
    @property(cc.Node) midHomeTop: cc.Node = null;
    @property(cc.Node) midHomeTopLabel: cc.Node = null;
    @property(cc.Node) midHomeTopProcess: cc.Node = null;
    @property(cc.Node) midHomeBottom: cc.Node = null;
    // 中间ui--主菜单（左侧）
    @property(cc.Node) midHomeLeft: cc.Node = null;
    @property(cc.Node) midHomeLeftBoxXing: cc.Node = null;
    @property(cc.Node) midHomeLeftBoxXingProcess: cc.Node = null;
    @property(cc.Node) midHomeLeftCalendar: cc.Node = null;
    // 中间ui--主菜单（右侧）
    @property(cc.Node) midHomeRight: cc.Node = null;
    @property(cc.Node) midHomeRightBoxLevel: cc.Node = null;
    @property(cc.Node) midHomeRightBoxLevelProcess: cc.Node = null;
    @property(cc.Node) midHomeRightBank: cc.Node = null;
    // 中间ui--主题
    @property(cc.Node) midTheme: cc.Node = null;

    async init(callback: Function = null) {
        Common.log('MainMenu init()');
    }

    /** 按钮事件 设置 */
    eventBtnSet() {
        kit.Audio.playEffect(CConst.sound_path_click);
        kit.Popup.show(CConst.popup_path_setting, {}, { mode: PopupCacheMode.Frequent });
    }

    /** 按钮事件 进入游戏sort */
    eventBtnStart() {
        kit.Audio.playEffect(CConst.sound_path_click);
        kit.Event.emit(CConst.event_enter_gameSort);
    }
}
