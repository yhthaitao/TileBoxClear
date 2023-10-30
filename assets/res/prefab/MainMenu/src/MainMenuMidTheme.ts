import { kit } from "../../../../src/kit/kit";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataManager from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";
import ConfigAchieve from "../../../../src/config/ConfigAchieve";

/** 主题类型 */
export enum StateTheme {
    areas = 0,// 主题栏
    commodity = 1,// 物品奖励栏
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuMidTheme extends cc.Component {

    @property({ type: cc.Node, tooltip: '主题-顶部' }) theme_top: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-主题栏' }) theme_mid_areas: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-主题栏-内容' }) theme_mid_areas_content: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-成就栏' }) theme_mid_commodity: cc.Node = null;
    @property({ type: cc.Node, tooltip: '主题-中部-成就栏-内容' }) theme_mid_commodity_content: cc.Node = null;

    // 主题状态
    stateTheme: StateTheme = StateTheme.areas;
    objTheme = {
        title: {
            color: {
                light: cc.color(184, 135, 84),
                dark: cc.color(108, 108, 108),
            },
        },
        areas: {
            title: {
                color: {
                    light: cc.color(253, 240, 224),
                    dark: cc.color(64, 64, 64),
                },
            },
            level: {
                color: {
                    light: cc.color(136, 64, 0),
                    dark: cc.color(64, 64, 64),
                },
            },
        },
        commodity: [
            {}, {}, {}, {}, {}, {},
            {}, {}, {}, {}, {}, {},
        ],
    };

    protected onLoad(): void {
        this.listernerRegist();
    }

    protected onEnable(): void {
        this.init();
    }

    init(): void {
        // theme
        this.initTheme();
    };

    /************************************************************************************************************************/
    /*********************************************************  theme  *******************************************************/
    /************************************************************************************************************************/
    /** 重置主题 */
    initTheme() {
        this.initAreasList();
        this.initCommodityList();
        this.initThemeButton();
    };

    /** 初始化 theme areas list */
    initAreasList() {
        let item = this.theme_mid_areas.getChildByName('item');
        let length = 15;
        // 主题节点高度
        this.theme_mid_areas.height = cc.winSize.height * 0.5 + this.theme_mid_areas.y;
        // 主题容器高度
        let layout = this.theme_mid_areas_content.getComponent(cc.Layout);
        let hElse = layout.paddingTop + layout.spacingY * (length - 1) + layout.paddingBottom;
        this.theme_mid_areas_content.height = item.height * length + hElse;
        // 配置主题内容
        this.theme_mid_areas_content.removeAllChildren();
        for (let index = 0; index < length; index++) {
            let name = 'cell' + index;
            let cell = this.theme_mid_areas_content.getChildByName(name);
            if (!cell) {
                cell = cc.instantiate(item);
                cell.name = name;
            }
            cell.active = true;
            cell.parent = this.theme_mid_areas_content;
            this.initAreasCell(index, cell);
        }
        this.refreshAreasLabel();
    };

    /** 初始化 theme areas cell */
    initAreasCell(index: number, cell: cc.Node) {
        let objAreas = this.objTheme.areas;
        let level = DataManager.data.boxData.level;
        let choseId = index + 1;
        let back = cell.getChildByName('back');
        let back2 = back.getChildByName('back2');
        let pathBack = '';
        let pathBack2 = '';
        back.active = false;
        back2.active = false;
        let icon = cell.getChildByName('icon');
        let pathIcon = '';
        icon.active = false;
        let labelTitle = cell.getChildByName('labelTitle');
        let labelLevel = cell.getChildByName('labelLevel');
        let right = cell.getChildByName('right');
        let lock = cell.getChildByName('lock');
        let levelAreas = DataManager.getLevelAreas(index);
        if (level > levelAreas.start - 1) {
            pathBack = CConst.pathThemeUnLock + 'back';
            pathBack2 = CConst.pathThemeUnLock + 'back2';
            pathIcon = CConst.pathThemeUnLock + (index + 1);
            labelTitle.color = objAreas.title.color.light;
            labelTitle.getComponent(cc.LabelOutline).width = 2;
            labelLevel.color = objAreas.level.color.light;
            right.active = choseId == DataManager.data.boxAreas.cur;
            lock.active = false;
            cell.getComponent(cc.Button).interactable = true;
        }
        else {
            pathBack = CConst.pathThemeLock + 'back';
            pathBack2 = CConst.pathThemeLock + 'back2';
            pathIcon = CConst.pathThemeLock + (index + 1);
            labelTitle.color = objAreas.title.color.dark;
            labelTitle.getComponent(cc.LabelOutline).width = 0;
            labelLevel.color = objAreas.level.color.dark;
            right.active = false;
            lock.active = true;
            cell.getComponent(cc.Button).interactable = false;
        }
        kit.Resources.loadRes(CConst.bundleCommon, pathBack, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 back: ', pathBack);
                return;
            }
            back.active = true;
            back.getComponent(cc.Sprite).spriteFrame = assets;
        });
        kit.Resources.loadRes(CConst.bundleCommon, pathBack2, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 back2: ', pathBack2);
                return;
            }
            back2.active = true;
            back2.getComponent(cc.Sprite).spriteFrame = assets;
        });
        kit.Resources.loadRes(CConst.bundleCommon, pathIcon, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 icon: ', pathIcon);
                return;
            }
            icon.active = true;
            icon.getComponent(cc.Sprite).spriteFrame = assets;
        });
    };

    /** 初始化 theme commodity list */
    initCommodityList() {
        let length = 12;
        let lenHeight = 6;
        let item = this.theme_mid_commodity.getChildByName('item');

        this.theme_mid_commodity.height = cc.winSize.height * 0.5 + this.theme_mid_commodity.y;

        let layout = this.theme_mid_commodity_content.getComponent(cc.Layout);
        let hElse = layout.paddingTop + layout.spacingY * (lenHeight - 1) + layout.paddingBottom;
        this.theme_mid_commodity_content.height = item.height * lenHeight + hElse;

        let objAllGoods = DataManager.getObjAllGoods();
        // 配置主题内容
        this.theme_mid_commodity_content.removeAllChildren();
        for (let index = 0; index < length; index++) {
            let name = 'cell' + index;
            let cell = this.theme_mid_commodity_content.getChildByName(name);
            if (!cell) {
                cell = cc.instantiate(item);
                cell.name = name;
            }
            cell.active = true;
            cell.parent = this.theme_mid_commodity_content;
            this.initCommodityCell(index, objAllGoods, cell);
        }
        this.resetPointAchieve();
        this.refreshCommodityLabel();
    };

    /** 初始化 theme commodity cell */
    initCommodityCell(index: number, objAllGoods: any, cell: cc.Node) {
        let colorId = 0;
        let achieveCur = DataManager.data.dataAchieve[index];
        let achieveCfg = ConfigAchieve[index];
        let nodeIcon = cell.getChildByName('nodeIcon');
        let lock = cell.getChildByName('lock');
        let process = cell.getChildByName('process');
        let reward = cell.getChildByName('reward');
        let right = cell.getChildByName('right');
        lock.active = false;
        process.active = false;
        reward.active = false;
        right.active = false;

        let lenCur = achieveCur.goods.length;
        let lenCfg = achieveCfg.goods.length;
        // 解锁物品为 全部
        if (lenCur >= lenCfg) {
            nodeIcon.active = true;
            cell.zIndex = 0;
            colorId = index % 8 + 1;
            // 奖品是否领取
            if (achieveCur.isGet) {
                right.active = true;
            }
            else {
                reward.active = true;
                reward.getChildByName('button').active = true;
                process.active = true;
                let bar = process.getChildByName('bar');
                bar.getComponent(cc.Sprite).fillRange = 1;
                let label = process.getChildByName('label');
                label.getComponent(cc.Label).string = '' + lenCur + '/' + lenCfg;
            }
        }
        // 解锁物品为 0
        else if (lenCur <= 0) {
            nodeIcon.active = false;
            cell.zIndex = 1;
            colorId = 0;
            lock.active = true;
        }
        // 其他情况
        else {
            nodeIcon.active = true;
            cell.zIndex = 0;
            colorId = index % 8 + 1;
            reward.active = true;
            reward.getChildByName('button').active = false;
            process.active = true;
            let bar = process.getChildByName('bar');
            bar.getComponent(cc.Sprite).fillRange = lenCur / lenCfg;
            let label = process.getChildByName('label');
            label.getComponent(cc.Label).string = '' + lenCur + '/' + lenCfg;
        }
        // back
        let pathBack = CConst.pathAchieve + 'color_' + colorId;
        kit.Resources.loadRes(CConst.bundleCommon, pathBack, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 initCommodityCell back: ', pathBack);
                return;
            }
            let back = cell.getChildByName('back');
            back.getComponent(cc.Sprite).spriteFrame = assets;
        });
        // icon
        if (nodeIcon.active) {
            let pathIcon = CConst.pathGameGood + objAllGoods[achieveCfg.icon].name;
            kit.Resources.loadRes(CConst.bundleCommon, pathIcon, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
                if (err) {
                    Common.log(' 资源加载异常 initCommodityCell icon: ', pathIcon);
                    return;
                }
                let icon = nodeIcon.getChildByName('icon');
                icon.getComponent(cc.Sprite).spriteFrame = assets;
                if (icon.width > icon.height) {
                    icon.scale = (icon.parent.width - 30) / icon.width;
                }
                else {
                    icon.scale = (icon.parent.height - 30) / icon.height;
                }
            });
        }

        // 保存数据(用于点击成就按钮)
        let keyTitle = 'achieve_' + (index + 1);
        let params = { keyTitle: keyTitle, achieveCur: achieveCur, achieveCfg: achieveCfg };
        this.objTheme.commodity[index] = params;
    };

    /** 初始化主题按钮 */
    initThemeButton() {
        let objColor = this.objTheme.title.color;
        let funcSet = (isLight: boolean, button: cc.Node) => {
            button.getChildByName('light').active = isLight;
            button.getChildByName('dark').active = !isLight;
            button.getChildByName('label').color = isLight ? objColor.light : objColor.dark;
        };

        // 主题界面按钮切换
        let btnAreas = this.theme_top.getChildByName('btnAreas');
        let btnCommodity = this.theme_top.getChildByName('btnCommodity');
        funcSet(this.stateTheme == StateTheme.areas, btnAreas);
        funcSet(this.stateTheme != StateTheme.areas, btnCommodity);
        // 主题栏和物品奖励栏切换
        if (this.stateTheme == StateTheme.areas) {
            this.theme_mid_areas.active = true;
            this.theme_mid_commodity.active = false;
        }
        else {
            this.theme_mid_areas.active = false;
            this.theme_mid_commodity.active = true;
        }
        this.resetPointCommodity();
        this.refreshThemeLabelTop();
    };

    resetPointCommodity() {
        let btnCommodity = this.theme_top.getChildByName('btnCommodity');
        let point = btnCommodity.getChildByName('point');
        if (point) {
            point.active = DataManager.data.boxData.point.commodity;
        }
    };

    resetPointAchieve() {
        this.theme_mid_commodity_content.children.forEach((cell) => {
            let index = Number(cell.name.substring(4));
            let reward = cell.getChildByName('reward');
            let point = reward.getChildByName('point');
            if (point) {
                point.active = DataManager.data.boxData.point.achieves[index];
            }
        });
    };

    /** 按钮事件 进入 主题 */
    eventBtnAreas() {
        if (this.stateTheme == StateTheme.areas) {
            return;
        }
        this.stateTheme = StateTheme.areas;
        this.resetThemeButton();
    };

    /** 按钮事件 进入 成就 */
    eventBtnCommodity() {
        if (this.stateTheme == StateTheme.commodity) {
            return;
        }
        this.stateTheme = StateTheme.commodity;
        this.resetThemeButton();

        DataManager.data.boxData.point.commodity = false;
        DataManager.setData();
        this.resetPointCommodity();
    };

    /** 重置主题按钮 */
    resetThemeButton() {
        let objColor = this.objTheme.title.color;
        let funcSet = (isLight: boolean, button: cc.Node) => {
            button.getChildByName('light').active = isLight;
            button.getChildByName('dark').active = !isLight;
            button.getChildByName('label').color = isLight ? objColor.light : objColor.dark;
        };

        let isAreas = this.stateTheme == StateTheme.areas;
        // 主题界面按钮切换
        let btnAreas = this.theme_top.getChildByName('btnAreas');
        let btnCommodity = this.theme_top.getChildByName('btnCommodity');
        funcSet(isAreas, btnAreas);
        funcSet(!isAreas, btnCommodity);
        // 主题栏和物品奖励栏切换
        if (isAreas) {
            this.theme_mid_areas.active = true;
            this.theme_mid_commodity.active = false;
            this.initAreasList();
        }
        else {
            this.theme_mid_areas.active = false;
            this.theme_mid_commodity.active = true;
            this.initCommodityList();
        }
    };

    /** 按钮事件 选择 主题 */
    eventAreasBtn(event: cc.Event.EventTouch) {
        let boxAreas = DataManager.data.boxAreas;
        let chose = Number(event.target.name.substring(4)) + 1;
        if (chose == boxAreas.cur) {
            return;
        }
        boxAreas.cur = chose;
        boxAreas.new = boxAreas.cur;
        DataManager.setData();

        kit.Event.emit(CConst.event_refresh_areas);
    };

    /** 事件 滑动 主题 */
    eventAreasScrollview(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
        switch (eventType) {
            case cc.ScrollView.EventType.SCROLL_BEGAN:
            case cc.ScrollView.EventType.SCROLLING:
            case cc.ScrollView.EventType.SCROLL_ENDED:
                DataManager.refreshScrollview(scrollview.content);
                break;
            default:
                break;
        }
    };

    /** 按钮事件 选择 成就 */
    eventCommodityBtn(event: cc.Event.EventTouch) {
        let index = Number(event.target.name.substring(4));

        DataManager.data.boxData.point.achieves[index] = false;
        DataManager.setData();
        this.resetPointAchieve();

        let params = Common.clone(this.objTheme.commodity[index]);
        kit.Popup.show(CConst.popup_path_achieve, params, { mode: PopupCacheMode.Frequent });
    };

    /** 按钮事件 成就 奖励*/
    eventCommodityReward(event: cc.Event.EventTouch) {
        let reward = event.target.parent;
        reward.active = false;
        let item = reward.parent;
        let process = item.getChildByName('process');
        process.active = false;
        let right = item.getChildByName('right');
        right.active = true;

        let index = Number(item.name.substring(4));
        DataManager.data.numCoin += 50;
        DataManager.data.dataAchieve[index].isGet = true;
        DataManager.setData();

        let point = Common.getLocalPos(item, reward.position, this.node);
        kit.Event.emit(CConst.event_scale_coin, point.x, point.y);
    };

    /** 事件 滑动 成就 */
    eventCommodityScrollview(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
        switch (eventType) {
            case cc.ScrollView.EventType.SCROLL_BEGAN:
            case cc.ScrollView.EventType.SCROLLING:
            case cc.ScrollView.EventType.SCROLL_ENDED:
                DataManager.refreshScrollview(scrollview.content);
                break;
            default:
                break;
        }
    };

    /************************************************************************************************************************/
    /*********************************************************  事件  *******************************************************/
    /************************************************************************************************************************/
    /** 更新语言 */
    eventBack_refreshLanguage() {
        this.refreshLanguage();
    };

    /** 更新主题 */
    eventBackRefreshAreas() {
        this.theme_mid_areas_content.children.forEach((cell) => {
            let id = Number(cell.name.substring(4)) + 1;
            let right = cell.getChildByName('right');
            right.active = id == DataManager.data.boxAreas.cur;
        });
    };

    /** 更新point提示 */
    eventBackRefreshPoint() {
        this.resetPointCommodity();
        this.resetPointAchieve();
    };

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_refresh_language, this.eventBack_refreshLanguage, this);
        kit.Event.on(CConst.event_refresh_areas, this.eventBackRefreshAreas, this);
        kit.Event.on(CConst.event_refresh_point, this.eventBackRefreshPoint, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    };

    /** 更新语言 */
    refreshLanguage() {
        this.refreshThemeLabelTop();
        this.refreshAreasLabel();
        this.refreshCommodityLabel();
    };

    /** label theme top */
    refreshThemeLabelTop() {
        // 主题界面按钮切换
        let btnAreas = this.theme_top.getChildByName('btnAreas');
        DataManager.setString(LangChars.Areas, (chars: string) => {
            let itemLabel = btnAreas.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
        let btnCommodity = this.theme_top.getChildByName('btnCommodity');
        DataManager.setString(LangChars.Commodity, (chars: string) => {
            let itemLabel = btnCommodity.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });
    };

    /** label theme areas */
    refreshAreasLabel() {
        this.theme_mid_areas_content.children.forEach((cell) => {
            let index = Number(cell.name.substring(4));
            DataManager.setString(LangChars['areas_' + (index + 1)], (chars: string) => {
                if (chars) {
                    let labelTitle = cell.getChildByName('labelTitle');
                    labelTitle.getComponent(cc.Label).string = chars;
                }
            });
            let levelAreas = DataManager.getLevelAreas(index);
            DataManager.setString(LangChars.Level, (chars: string) => {
                let labelLevel = cell.getChildByName('labelLevel');
                labelLevel.getComponent(cc.Label).string = chars + '  ' + levelAreas.start + '-' + levelAreas.finish;
            });
        });
    };

    /** label theme commodity */
    refreshCommodityLabel() {
        this.theme_mid_commodity_content.children.forEach((cell) => {
            let index = Number(cell.name.substring(4));
            DataManager.setString(LangChars['achieve_' + (index + 1)], (chars: string) => {
                if (chars) {
                    let labelTitle = cell.getChildByName('labelTitle');
                    labelTitle.getComponent(cc.Label).string = chars;
                }
            });
        });
    };
}

