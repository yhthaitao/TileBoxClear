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

        cc.macro.ENABLE_MULTI_TOUCH = true;//关闭多点触控
        this.listernerRegist();
    }

    protected start(): void {
        this.init();
    }

    async init() {
        kit.Event.emit(CConst.event_enter_loading);
        this.initData();
        this.initUI();
        // 应用内评价（启动游戏时调用）
        let funcEvaluate = () => {
            if (DataManager.data.isEvaluate) {
                return;
            }
            NativeCall.evaluateFirst();
        };
        funcEvaluate();
    }

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
        let boxData = DataManager.data.boxData;
        if (boxData.first) {
            boxData.first = false;
            DataManager.setData();
            
            kit.Event.emit(CConst.event_enter_game);
            script.playAniLeave(() => {
                this.nodeLoading.active = false;
                kit.Event.emit(CConst.event_game_start);
            });
        }
        else {
            kit.Event.emit(CConst.event_enter_menu);
            script.playAniLeave(() => {
                this.nodeLoading.active = false;
                kit.Event.emit(CConst.event_menu_start);
            });
        }
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
                // this.nodeLoading.active = false;
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
                this.nodeLoading.parent = this.node;
                this.nodeLoading.zIndex = CConst.zIndex_loading;
                this.nodeLoading.active = true;
                break;
            case StateGame.menu:
                if (this.NodeMenu) {
                    this.NodeMenu.active = true;
                }
                else {
                    this.NodeMenu = cc.instantiate(this.preMainMenu);
                    this.NodeMenu.parent = this.node;
                    this.NodeMenu.zIndex = CConst.zIndex_menu;
                    this.NodeMenu.active = true;
                }
                break;
            case StateGame.game:
                if (this.nodeGame) {
                    this.nodeGame.active = true;
                }
                else {
                    let pre: cc.Prefab = await kit.Resources.loadRes(CConst.bundlePrefabs, CConst.pathGame, cc.Prefab);
                    this.nodeGame = cc.instantiate(pre);
                    this.nodeGame.parent = this.node;
                    this.nodeGame.setContentSize(cc.winSize);
                    this.nodeGame.position = cc.v3();
                    this.nodeGame.zIndex = CConst.zIndex_game;
                    this.nodeGame.active = true;
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

    eventBack_enterLoading() {
        this.setGameState(StateGame.loading);
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
    eventBack_notice(key: string): void {
        DataManager.setString(LangChars[key], (chars: string) => {
            this.noVideoTip.getComponent(cc.Label).string = chars;
        });

        this.noVideoTip.opacity = 255;
        let anim = this.noVideoTip.getComponent(cc.Animation);
        anim.stop();
        anim.once(cc.Animation.EventType.FINISHED, () => {
            this.noVideoTip.opacity = 0;
        }, this);
        anim.play();
    }

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_enter_loading, this.eventBack_enterLoading, this);
        kit.Event.on(CConst.event_loading_complete, this.eventBack_loadingComplete, this);
        kit.Event.on(CConst.event_enter_menu, this.eventBack_enterMenu, this);
        kit.Event.on(CConst.event_enter_game, this.eventBack_enterGame, this);
        kit.Event.on(CConst.event_guide_game, this.eventBack_guide_game, this);
        kit.Event.on(CConst.event_guide_before, this.eventBack_guide_before, this);
        kit.Event.on(CConst.event_notice, this.eventBack_notice, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    };
}