import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import { TypeBefore } from "../../../../src/config/ConfigCommon";
import NativeCall from "../../../../src/config/NativeCall";
import ConfigDot from "../../../../src/config/ConfigDot";
import GameManager from "../../../../src/config/GameManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SettingGame extends PopupBase {

    @property(cc.Node) nodePause: cc.Node = null;
    @property(cc.Node) nodePauseTitle: cc.Node = null;
    @property(cc.Node) nodePauseEffect: cc.Node = null;
    @property(cc.Node) nodePauseMusic: cc.Node = null;
    @property(cc.Node) nodePauseShake: cc.Node = null;
    @property(cc.Node) nodePauseButton: cc.Node = null;

    @property(cc.Node) nodeQuit: cc.Node = null;
    @property(cc.Node) nodeQuitTitle: cc.Node = null;
    @property(cc.Node) nodeQuitDesc: cc.Node = null;
    @property(cc.Node) nodeQuitButton: cc.Node = null;
    @property([cc.Node]) arrQuitProp: cc.Node[] = [];

    obj = {
        setting: {
            left: { w: 183 },
            right: { w: 183 },
            piece: { left: -54, right: 54 },
        },
        quit: {
            prop: {
                arrX: [-75, 75]
            },
        }
    };
    isLock: boolean = false;

    protected showBefore(options: any): void {
        Common.log('弹窗 设置页面 游戏内 showBefore()');
        this.setIsLock(false);
        this.refreshLanguage();
        this.setPauseUI();
    }

    setIsLock(isLock) {
        this.isLock = isLock;
    };

    /************************************************************************************************************************/
    /********************************************************* pause ********************************************************/
    /************************************************************************************************************************/
    setPauseUI() {
        this.nodePause.active = true;
        this.nodeQuit.active = false;
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
        funcProcess(this.nodePauseEffect, config.isPlayEffect);
        funcProcess(this.nodePauseMusic, config.isPlayMusic);
        funcProcess(this.nodePauseShake, config.isPlayShake);
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
    eventPauseBtnEffect() {
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
        this.playAniSetting(this.nodePauseEffect, config.isPlayEffect);
    };

    /** 按钮事件 音乐 */
    eventPauseBtnMusic() {
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
        this.playAniSetting(this.nodePauseMusic, config.isPlayMusic);
    };

    /** 按钮事件 震动 */
    eventPauseBtnShake() {
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
        this.playAniSetting(this.nodePauseShake, config.isPlayShake);
    };

    /** 按钮事件 恢复 */
    async eventPauseBtnResume() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        kit.Event.emit(CConst.event_game_resume);
    };

    /** 按钮事件 退出 */
    eventPauseBtnQuit() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.setQuitUI();
    };

    /** 按钮事件 退出 */
    async eventPauseBtnExit() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        kit.Event.emit(CConst.event_game_resume);
    };

    /************************************************************************************************************************/
    /********************************************************** quit ********************************************************/
    /************************************************************************************************************************/
    setQuitUI() {
        this.nodePause.active = false;
        this.nodeQuit.active = true;
        let wins = DataManager.data.wins.count - DataManager.data.wins.start;
        if (wins < 1) {
            this.arrQuitProp.forEach((prop, index) => {
                prop.active = index == 0;
                if (prop.active) {
                    prop.x = 0;
                }
            });
        }
        else {
            this.arrQuitProp.forEach((prop, index) => {
                prop.active = true;
                prop.x = this.obj.quit.prop.arrX[index];
                if (index == 1) {
                    let label = prop.getChildByName('label');
                    label.getComponent(cc.Label).string = '' + wins;
                }
            });
        }
    };

    /** 按钮事件 重新开始 */
    async eventQuitBtnRestart() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        
        DataManager.data.wins.count = 0;
        DataManager.strengthReduce();
        DataManager.setData();
        GameManager.setting_startGame(TypeBefore.fromSetting);
    };

    /** 按钮事件 退出 */
    async eventQuitBtnQuit() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        let funcNext = async () => {
            // 进入菜单页
            DataManager.data.wins.count = 0;
            DataManager.strengthReduce();
            DataManager.setData();

            // 打点 插屏播放成功（从游戏中返回首页）
            let level = DataManager.data.boxData.level;
            NativeCall.logEventTwo(ConfigDot.dot_ads_advert_succe_home, String(level));
            let obj = {
                level: level,
                eventStart: CConst.event_enter_menu,
                eventFinish: CConst.event_menu_start,
            }
            kit.Popup.hide();
            kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
        };
        DataManager.playAdvert(funcNext);
    };

    /** 按钮事件 退出 */
    async eventQuitBtnExit() {
        if (this.isLock) {
            return;
        }
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        kit.Event.emit(CConst.event_game_resume);
    };

    /** 刷新 语言 */
    refreshLanguage() {
        this.refreshLabel_pause();
        this.refreshLabel_quit();
    };

    /** 刷新label 暂停界面 */
    refreshLabel_pause() {
        // 标题
        DataManager.setString(LangChars.pause_title, (chars: string) => {
            let itemLabel = this.nodePauseTitle.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        // 按钮
        let itemResume = this.nodePauseButton.getChildByName('btnResume');
        DataManager.setString(LangChars.pause_resume, (chars: string) => {
            let itemLabel = itemResume.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        let itemQuit = this.nodePauseButton.getChildByName('btnQuit');
        DataManager.setString(LangChars.pause_quit, (chars: string) => {
            let itemLabel = itemQuit.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };

    /** 刷新label 退出确认界面 */
    refreshLabel_quit() {
        // 标题
        DataManager.setString(LangChars.exit_title, (chars: string) => {
            let itemLabel = this.nodeQuitTitle.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        // 描述
        DataManager.setString(LangChars.exit_desc, (chars: string) => {
            let itemLabel = this.nodeQuitDesc.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        // 按钮
        let itemRestart = this.nodeQuitButton.getChildByName('btnRestart');
        DataManager.setString(LangChars.exit_confirm_restart, (chars: string) => {
            let itemLabel = itemRestart.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        let itemQuit = this.nodeQuitButton.getChildByName('btnQuit');
        DataManager.setString(LangChars.exit_quit, (chars: string) => {
            let itemLabel = itemQuit.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };
}
