import Common from "../src/config/Common";
import CConst from "../src/config/CConst";
import { kit } from "./../src/kit/kit";
import DataManager from "../src/config/DataManager";
import ConfigDot from "../src/config/ConfigDot";
import NativeCall from "../src/config/NativeCall";
import Loading from "../res/prefab/Loading/src/Loading";
import { LangChars } from "../src/config/ConfigLang";
import { StateGame } from "../src/config/ConfigCommon";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainScene extends cc.Component {

    /** loading */
    @property(cc.Prefab) preLoading: cc.Prefab = null;
    /** mainmenu */
    @property(cc.Prefab) preMainMenu: cc.Prefab = null;
    /** video */
    @property(cc.Node) nodeVideo: cc.Node = null;
    /** noVideoTip */
    @property(cc.Node) noVideoTip: cc.Node = null;

    // 不需要动态加载
    nodeLoading: cc.Node = null;
    NodeMenu: cc.Node = null;

    // 动态加载
    nodeGame: cc.Node = null;

    /** 节点-弹窗父节点 */
    nodePopup: cc.Node = null;
    /** 是否加载完成 */
    objComplete = { loading: false, data: false, ui: false };

    protected onLoad(): void {
        Common.log('页面 主菜单 onLoad()');

        cc.macro.ENABLE_MULTI_TOUCH = false;//关闭多点触控
        this.listernerRegist();
    }

    protected start(): void {
        this.init();
    }

    async init() {
        this.initLoading();
        this.initData();
        this.initUI();
        // 应用内评价（启动游戏时调用）
        let funcEvaluate = () => {
            let _data = DataManager.data;
            if (_data.isEvaluate) {
                return;
            }
            NativeCall.evaluateFirst();
        };
        funcEvaluate();
    }

    /** 加载界面 初始化 */
    initLoading(): void {
        this.setGameState(StateGame.loading);
    };

    /** 初始化 数据*/
    async initData() {
        // 初始化音频
        kit.Audio.initAudio();
        kit.Audio.playMusic(CConst.sound_music);
        // 初始化游戏数据
        await DataManager.initData(this.nodeVideo);
        this.objComplete.data = true;
        this.enterMenuLayer();
    };

    /** 初始化 ui */
    async initUI() {
        this.initNoVideo();
        this.initPopup();
        await this.loadComponents();
        this.objComplete.ui = true;
        this.enterMenuLayer();
    };

    /** 无视频提示 */
    async initNoVideo() {
        this.refreshLabel_noVideo();
        this.noVideoTip.zIndex = CConst.zIndex_noVideo;
        this.noVideoTip.opacity = 0;
    }

    /** 弹窗父节点 初始化 */
    initPopup(): void {
        this.nodePopup = new cc.Node();
        this.nodePopup.zIndex = CConst.zIndex_popup;
        this.nodePopup.parent = this.node;
        kit.Popup.container = this.nodePopup;
    };

    /** 加载公用资源 */
    async loadComponents() {
        await kit.Resources.loadRes(CConst.bundlePrefabs, CConst.pathGame, cc.Prefab);
        await kit.Resources.loadRes(CConst.bundlePrefabs, CConst.pathGuideGame, cc.Prefab);
        await kit.Resources.loadRes(CConst.bundlePrefabs, CConst.pathGuideBefore, cc.Prefab);

        NativeCall.logEventOne(ConfigDot.dot_resource_load_success);
    }

    /** 进入主菜单 */
    enterMenuLayer() {
        if (!this.objComplete.loading || !this.objComplete.data || !this.objComplete.ui) {
            return;
        }
        let script = this.nodeLoading.getComponent(Loading);
        script.playAniLeave(() => {
            let boxData = DataManager.data.boxData;
            let isNewPlayer = boxData.newTip.cur < boxData.newTip.max;
            isNewPlayer = false;
            if (isNewPlayer) {
                this.setGameState(StateGame.game);
            }
            else {
                this.setGameState(StateGame.menu);
            }
        });
    }

    /** 更新游戏状态 */
    async setGameState(state: StateGame) {
        if (state == DataManager.stateCur) {
            return;
        }
        // 设置游戏状态
        DataManager.setGameState(state);
        // 上一个游戏状态
        switch (DataManager.stateLast) {
            case StateGame.loading:
                this.nodeLoading.active = false;
                break;
            case StateGame.menu:
                this.NodeMenu.active = false;
                break;
            case StateGame.game:
                this.nodeGame.active = false;
                NativeCall.closeBanner();
                break;
            default:
                break;
        }

        // 当前游戏状态
        switch (DataManager.stateCur) {
            case StateGame.loading:
                this.nodeLoading = cc.instantiate(this.preLoading);
                this.nodeLoading.zIndex = CConst.zIndex_loading;
                this.nodeLoading.parent = this.node;
                break;
            case StateGame.menu:
                if (this.NodeMenu) {
                    this.NodeMenu.active = true;
                }
                else {
                    this.NodeMenu = cc.instantiate(this.preMainMenu);
                    this.NodeMenu.zIndex = CConst.zIndex_menu;
                    this.NodeMenu.active = true;
                    this.NodeMenu.parent = this.node;
                }
                break;
            case StateGame.game:
                if (this.nodeGame) {
                    this.nodeGame.active = true;
                    let script = this.nodeGame.getComponent('GameBox');
                    script.gameStart();
                }
                else {
                    let pre: cc.Prefab = await kit.Resources.loadRes(CConst.bundlePrefabs, CConst.pathGame, cc.Prefab);
                    this.nodeGame = cc.instantiate(pre);
                    this.nodeGame.setContentSize(cc.winSize);
                    this.nodeGame.position = cc.v3();
                    this.nodeGame.zIndex = CConst.zIndex_game;
                    this.nodeGame.parent = this.node;
                }
                break;
            default:
                break;
        }
    }

    /** 事件回调：loading完成 */
    eventBack_loadingComplete() {
        this.objComplete.loading = true;
        this.enterMenuLayer();
    };

    /** 更新语言 */
    eventBack_refreshLanguage() {
        this.refreshLanguage();
    };

    /** 事件回调：进入菜单 */
    eventBack_enterMenu() {
        this.setGameState(StateGame.menu);
    };

    /** 事件回调：进入游戏box */
    eventBack_enterGame() {
        this.setGameState(StateGame.game);
    }

    /** 事件回调：进入新手引导 */
    async eventBack_guide_game() {
        let pre: cc.Prefab = await kit.Resources.loadRes(CConst.bundlePrefabs, CConst.pathGuideGame, cc.Prefab);
        let guide = cc.instantiate(pre);
        guide.zIndex = CConst.zIndex_newPlayer;
        guide.parent = this.node;
    };

    /** 事件回调：进入新手引导 */
    async eventBack_guide_before() {
        let pre: cc.Prefab = await kit.Resources.loadRes(CConst.bundlePrefabs, CConst.pathGuideBefore, cc.Prefab);
        let guide = cc.instantiate(pre);
        guide.zIndex = CConst.zIndex_newPlayer;
        guide.parent = this.node;
    };

    /** 事件回调：提示 */
    eventBack_notice(msg: string): void {
        this.noVideoTip.opacity = 255;
        this.noVideoTip.getComponent(cc.Label).string = msg;
        let anim = this.noVideoTip.getComponent(cc.Animation);
        anim.stop();
        anim.once(cc.Animation.EventType.FINISHED, () => {
            this.noVideoTip.opacity = 0;
        }, this);
        anim.play();
    }

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_complete_loading, this.eventBack_loadingComplete, this);
        kit.Event.on(CConst.event_refresh_language, this.eventBack_refreshLanguage, this);
        kit.Event.on(CConst.event_enter_menu, this.eventBack_enterMenu, this);
        kit.Event.on(CConst.event_enter_game, this.eventBack_enterGame, this);
        kit.Event.on(CConst.event_notice, this.eventBack_notice, this);
        kit.Event.on(CConst.event_guide_game, this.eventBack_guide_game, this);
        kit.Event.on(CConst.event_guide_before, this.eventBack_guide_before, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    };

    refreshLanguage() {
        this.refreshLabel_noVideo();
    };

    refreshLabel_noVideo() {
        DataManager.setString(LangChars.adsNo, (chars: string) => {
            this.noVideoTip.getComponent(cc.Label).string = chars;
        });
    };
}