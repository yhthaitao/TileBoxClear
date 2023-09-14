import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars, LangFile } from "../../../../src/config/ConfigLang";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SettingHome extends PopupBase {

    @property(cc.Node) nodeSetting: cc.Node = null;
    @property(cc.Node) settingNodeTitle: cc.Node = null;
    @property(cc.Node) settingNodeLanguage: cc.Node = null;
    @property(cc.Node) settingNodeEffect: cc.Node = null;
    @property(cc.Node) settingNodeMusic: cc.Node = null;
    @property(cc.Node) settingNodeShake: cc.Node = null;

    @property(cc.Node) nodeLanguage: cc.Node = null;
    @property(cc.Node) languageNodeTitle: cc.Node = null;
    @property([cc.Node]) arrLanguageNode: cc.Node[] = [];

    obj = {
        setting: {
            left: { w: 183 },
            right: { w: 183 },
            piece: { left: -54, right: 54 },
        },
        setLanguage: {

        },
    };
    isLock: boolean = false;

    protected onLoad(): void {
        super.onLoad();
        this.listernerRegist();
    }

    protected showBefore(options: any): void {
        Common.log('弹窗 设置页面 主页内 showBefore()');
        this.setIsLock(false);

        this.refreshLanguage();
        this.settingUI();
    }

    setIsLock(isLock) {
        this.isLock = isLock;
    };

    /************************************************************************************************************************/
    /******************************************************** setting *******************************************************/
    /************************************************************************************************************************/
    settingUI() {
        this.nodeSetting.active = true;
        this.nodeLanguage.active = false;
        // ui设置
        let funcProcess = (node: cc.Node, isPlay) => {
            let process = node.getChildByName('process');
            let back = process.getChildByName('back');
            let bar = process.getChildByName('bar');
            let piece = process.getChildByName('piece');
            if (isPlay) {
                back.active = false;
                bar.active = true;
                piece.active = true;
                piece.x = this.obj.setting.piece.right;
            }
            else {
                back.active = true;
                bar.active = false;
                piece.active = true;
                piece.x = this.obj.setting.piece.left;
            }
        };
        let config = kit.Audio.config;
        funcProcess(this.settingNodeEffect, config.isPlayEffect);
        funcProcess(this.settingNodeMusic, config.isPlayMusic);
        funcProcess(this.settingNodeShake, config.isPlayShake);
    };

    /** 播放动画（设置按钮） */
    playAniSetting(node: cc.Node, isPlay: boolean) {
        let tMove = 0.1;
        let process = node.getChildByName('process');
        let back = process.getChildByName('back');
        let bar = process.getChildByName('bar');
        let piece = process.getChildByName('piece');
        back.active = true;
        bar.active = true;
        piece.active = true;
        if (isPlay) {
            // 精灵填充
            let sprite = bar.getComponent(cc.Sprite);
            sprite.fillStart = 0;
            sprite.fillRange = 0;
            cc.tween(sprite).to(tMove, { fillRange: 1 }).call(() => {
                back.active = false;
            }).start();
            // 滑块
            piece.x = this.obj.setting.piece.left;
            cc.tween(piece).to(tMove, { x: this.obj.setting.piece.right }).call(() => {
                this.setIsLock(false);
            }).start();
        }
        else {
            // 精灵填充
            let sprite = bar.getComponent(cc.Sprite);
            sprite.fillStart = 0;
            sprite.fillRange = 1;
            cc.tween(sprite).to(tMove, { fillRange: 0 }).start();
            // 滑块
            piece.x = this.obj.setting.piece.right;
            cc.tween(piece).to(tMove, { x: this.obj.setting.piece.left }).call(() => {
                this.setIsLock(false);
            }).start();
        }
    };

    /** 按钮事件 音效 */
    eventSettingBtnEffect() {
        if (this.isLock) {
            return;
        }
        this.setIsLock(true);

        kit.Audio.playEffect(CConst.sound_clickUI);
        let config = kit.Audio.config;
        if (config.isPlayEffect) {
            kit.Audio.setIsPLayEffect(false);
        }
        else {
            kit.Audio.setIsPLayEffect(true);
        }
        this.playAniSetting(this.settingNodeEffect, config.isPlayEffect);
    };

    /** 按钮事件 音乐 */
    eventSettingBtnMusic() {
        if (this.isLock) {
            return;
        }
        this.setIsLock(true);

        kit.Audio.playEffect(CConst.sound_clickUI);
        let config = kit.Audio.config;
        if (config.isPlayMusic) {
            kit.Audio.setIsPlayMusic(false);
        }
        else {
            kit.Audio.setIsPlayMusic(true);
            kit.Audio.playMusic(CConst.sound_music);
        }
        this.playAniSetting(this.settingNodeMusic, config.isPlayMusic);
    };

    /** 按钮事件 震动 */
    eventSettingBtnShake() {
        if (this.isLock) {
            return;
        }
        this.setIsLock(true);
        kit.Audio.playEffect(CConst.sound_clickUI);
        let config = kit.Audio.config;
        if (config.isPlayShake) {
            kit.Audio.setIsPlayShake(false);
        }
        else {
            kit.Audio.setIsPlayShake(true);
        }
        this.playAniSetting(this.settingNodeShake, config.isPlayShake);
    };

    /** 按钮事件 语言 */
    eventSettingBtnLanguage() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.setLanguageUI();
    };

    /** 按钮事件 退出 */
    eventSettingBtnExit() {
        if (this.isLock) {
            return;
        }

        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    };

    /************************************************************************************************************************/
    /****************************************************** setLanguage *****************************************************/
    /************************************************************************************************************************/
    setLanguageUI() {
        this.nodeSetting.active = false;
        this.nodeLanguage.active = true;
        let arrLang = [LangFile.en, LangFile.jp, LangFile.kr, LangFile.zh];
        this.arrLanguageNode.forEach((item, index) => {
            if (DataManager.data.langCur == arrLang[index]) {
                item.getChildByName('backY').active = true;
                item.getChildByName('backN').active = false;
            }
            else {
                item.getChildByName('backY').active = false;
                item.getChildByName('backN').active = true;
            }
        });
    };

    /** 按钮事件 英文 */
    eventLanguageBtnEN() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.changeLanguage(LangFile.en);
    };

    /** 按钮事件 日文 */
    eventLanguageBtnJP() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.changeLanguage(LangFile.jp);
    };

    /** 按钮事件 韩文 */
    eventLanguageBtnKR() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.changeLanguage(LangFile.kr);
    };

    /** 按钮事件 繁文 */
    eventLanguageBtnZH() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.changeLanguage(LangFile.zh);
    };

    /** 按钮事件 退出 */
    eventLanguageBtnExit() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.settingUI();
    };

    /** 更新语言 */
    changeLanguage(type: LangFile){
        DataManager.data.langCur = type;
        DataManager.setData();
        this.setLanguageUI();
        kit.Event.emit(CConst.event_refresh_language);
    };

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_refresh_language, this.eventBack_refreshLanguage, this);
    }

    /** 事件回调： */
    eventBack_refreshLanguage() {
        this.refreshLanguage();

    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    }

    refreshLanguage(){
        this.refreshLabel_setting();
        this.refreshLabel_setLanguage();
    };

    refreshLabel_setting(){
        DataManager.setString(LangChars.setting_title, (chars: string) => {
            let itemLabel = this.settingNodeTitle.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.setting_language, (chars: string) => {
            let itemLabel = this.settingNodeLanguage.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };

    refreshLabel_setLanguage(){
        DataManager.setString(LangChars.setting_language, (chars: string) => {
            let itemLabel = this.languageNodeTitle.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };
}
