import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import ConfigBuyItem, { BuyCfg } from "../../../../src/config/ConfigBuyItem";
import NativeCall from "../../../../src/config/NativeCall";
import ConfigDot from "../../../../src/config/ConfigDot";
import { PropType } from "../../../../src/config/ConfigCommon";

/** 商店产品 */
interface Produce {
    type: number,
    frameId: number,
    keyCoinfg: number,
    keyString?: string,
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameShop<Options = any> extends PopupBase {

    @property({ type: cc.Node, tooltip: '标题' }) imgWord: cc.Node = null;
    @property({ type: cc.Node, tooltip: '顶部' }) uiTop: cc.Node = null;
    @property({ type: cc.Node, tooltip: '金币数' }) labelCoin: cc.Node = null;
    @property({ type: cc.Node, tooltip: '滑动区域-根节点' }) scroll: cc.Node = null;
    @property({ type: cc.Node, tooltip: '滑动区域-content' }) scrollContent: cc.Node = null;
    @property({ type: [cc.Node], tooltip: '礼包类型（多种）' }) gifts: cc.Node[] = [];
    @property([cc.SpriteFrame]) propFrames: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame]) iconFrames0: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame]) iconFrames1: cc.SpriteFrame[] = [];

    produceObj = {
        1: { type: 0, frameId: 0, keyCoinfg: 1, keyString: 'ShopBeginnersBundle', },
        2: { type: 0, frameId: 0, keyCoinfg: 2, keyString: 'ShopElfGiftBox', },
        3: { type: 0, frameId: 1, keyCoinfg: 3, keyString: 'ShopPrincessTreasure', },
        4: { type: 0, frameId: 2, keyCoinfg: 4, keyString: 'ShopShiningBundle', },
        5: { type: 0, frameId: 2, keyCoinfg: 5, keyString: 'ShopMikoGiftPack', },
        6: { type: 0, frameId: 3, keyCoinfg: 6, keyString: 'ShopQueenTreasure', },

        7: { type: 1, frameId: 0, keyCoinfg: 7, keyString: 'RemoveAds', },

        8: { type: 1, frameId: 1, keyCoinfg: 8, },
        9: { type: 1, frameId: 1, keyCoinfg: 9, },
        10: { type: 1, frameId: 2, keyCoinfg: 10, },
        11: { type: 1, frameId: 2, keyCoinfg: 11, },
        12: { type: 1, frameId: 3, keyCoinfg: 12, },
        13: { type: 1, frameId: 4, keyCoinfg: 13, },
    };

    protected onLoad(): void {
        this.uiTop.y = cc.winSize.height * 0.5 - this.uiTop.height * 0.5;
        this.scroll.y = cc.winSize.height * 0.5 - this.uiTop.height + 10;
    }

    protected showBefore(options: any): void {
        Common.log('弹窗 游戏商店页面 showBefore()');
        NativeCall.logEventTwo(ConfigDot.dot_store_show, String(DataManager.data.boxData.level));

        this.listernerRegist();
        // 金币数
        let coin = DataManager.data.numCoin;
        this.labelCoin.getComponent(cc.Label).string = '' + coin;
        // 初始化商店
        this.initShop();
    }

    /**
     * 展示弹窗
     * @param options 弹窗选项
     * @param duration 动画时长
     */
    public show(options?: Options) {
        this.maskDown.setContentSize(cc.winSize);
        this.maskUp.setContentSize(cc.winSize);

        return new Promise<void>(async res => {
            this.node.active = true;
            // 开启拦截
            this.maskUp.active = true;
            // 储存选项
            this.options = options;
            // 展示前
            this.showBefore(this.options);
            // 播放背景遮罩动画
            this.maskDown.active = true;
            this.maskDown.opacity = 0;
            cc.tween(this.maskDown).to(0.245, { opacity: 200 }).start();

            // 播放弹窗主体动画
            this.content.active = true;
            this.content.opacity = 0;
            cc.tween(this.content).to(0.215, { opacity: 255 }).call(() => {
                // 关闭拦截
                this.maskUp.active = false;
                // 弹窗已完全展示
                this.showAfter && this.showAfter();
                // Done
                res();
            }).start();
        });
    }

    /**
     * 隐藏弹窗
     * @param suspended 是否被挂起
     * @param duration 动画时长
     */
    public hide(suspended: boolean = false): Promise<void> {
        return new Promise<void>(res => {
            // 开启拦截
            this.maskUp.active = true;
            // 关闭前
            this.hideBefore();
            // 播放背景遮罩动画
            cc.tween(this.maskDown).to(0.233, { opacity: 0 },).start();
            // 播放弹窗主体动画
            cc.tween(this.content).to(0.233, { opacity: 0 }).call(() => {
                // 关闭拦截
                this.maskUp.active = false;
                // 关闭节点
                this.node.active = false;
                // 弹窗已完全隐藏（动画完毕）
                this.hideAfter && this.hideAfter(suspended);
                // 弹窗完成回调
                this.finishCallback && this.finishCallback(suspended);
                // Done
                res();
            }).start();
        });
    }

    protected hideAfter(suspended: boolean): void {
        this.listernerIgnore();
    }

    /************************************************************************************************************************/
    /*********************************************************  shop  *******************************************************/
    /************************************************************************************************************************/
    /** 重置主题 */
    initShop() {
        this.initList();
    };

    /** 初始化 list */
    initList() {
        let length = Object.keys(this.produceObj).length;
        // 节点高度
        this.scroll.height = cc.winSize.height * 0.5 + this.scroll.y;
        // 配置内容
        this.scrollContent.removeAllChildren();
        for (let index = 0; index < length; index++) {
            let produceId = index + 1;
            let produceCfg: Produce = this.produceObj[produceId];
            if (produceCfg) {
                if (produceCfg.type == 0) {
                    this.initCell0(produceCfg, this.gifts[produceCfg.type]);
                }
                else {
                    this.initCell1(produceCfg, this.gifts[produceCfg.type]);
                }
            }
        }
        this.refreshLabel();
    };

    initCell0(produceCfg: Produce, cell: cc.Node) {
        let buyCfg: BuyCfg = ConfigBuyItem[produceCfg.keyCoinfg];
        let itemName = 'cell' + produceCfg.keyCoinfg;
        let produceItem = this.scrollContent.getChildByName(itemName);
        if (!produceItem) {
            produceItem = cc.instantiate(cell);
            produceItem.active = true;
            produceItem.opacity = 255;
            produceItem.name = itemName;
            produceItem.parent = this.scrollContent;
            // limit
            let isLimit = buyCfg.isLimit;
            produceItem.getChildByName('limit').active = isLimit;
            // icon
            let icon = produceItem.getChildByName('icon');
            icon.getComponent(cc.Sprite).spriteFrame = this.iconFrames0[produceCfg.frameId];
            // isShow;
            if (isLimit && DataManager.data.shopLimit.indexOf(buyCfg.name) >= 0) {
                produceItem.active = false;
            }
            // prop
            let nodeProp = produceItem.getChildByName('prop');
            if (buyCfg.props) {
                nodeProp.active = true;
                for (let index = 0, length = buyCfg.props.length; index < length; index++) {
                    let obj = buyCfg.props[index];
                    let propOne = nodeProp.getChildByName('prop' + index);
                    if (propOne) {
                        let _string = '' + obj.count;
                        if (obj.typeProp == PropType.tStrengthInfinite) {
                            _string += 'h';
                        }
                        let labelProp = propOne.getChildByName('label');
                        labelProp.getComponent(cc.Label).string = _string;
                    }
                }
            }
            else {
                nodeProp.active = false;
            }
            // button
            let button = produceItem.getChildByName('button');
            let labelBtn = button.getChildByName('label');
            labelBtn.getComponent(cc.Label).string = buyCfg.money;
        }
    }

    initCell1(produceCfg: Produce, cell: cc.Node) {
        let buyCfg: BuyCfg = ConfigBuyItem[produceCfg.keyCoinfg];
        let itemName = 'cell' + produceCfg.keyCoinfg;
        let produceItem = this.scrollContent.getChildByName(itemName);
        if (!produceItem) {
            produceItem = cc.instantiate(cell);
            produceItem.active = true;
            produceItem.opacity = 255;
            produceItem.name = itemName;
            produceItem.parent = this.scrollContent;
            // icon
            let icon = produceItem.getChildByName('icon');
            icon.getComponent(cc.Sprite).spriteFrame = this.iconFrames1[produceCfg.frameId];
            // isShow;
            if (buyCfg.isLimit && DataManager.data.advert.isRemove) {
                produceItem.active = false;
            }
            // prop
            let nodeProp = produceItem.getChildByName('prop');
            if (buyCfg.props) {
                nodeProp.active = true;
                for (let index = 0, length = buyCfg.props.length; index < length; index++) {
                    let propOne = nodeProp.getChildByName('prop' + index);
                    if (propOne) {
                        let count = buyCfg.props[index].count;
                        let labelProp = propOne.getChildByName('label');
                        labelProp.getComponent(cc.Label).string = '' + count;
                    }
                }
            }
            else {
                nodeProp.active = false;
            }
            // button
            let button = produceItem.getChildByName('button');
            let labelBtn = button.getChildByName('label');
            labelBtn.getComponent(cc.Label).string = buyCfg.money;
        }
    }

    /** 事件 滑动 */
    eventScrollview(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
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

    /** label shop */
    refreshLabel() {
        DataManager.setLocalImg(this.imgWord);
        for (let key in this.produceObj) {
            if (Object.prototype.hasOwnProperty.call(this.produceObj, key)) {
                let produceCfg: Produce = this.produceObj[key];
                let itemName = 'cell' + produceCfg.keyCoinfg;
                let cell = this.scrollContent.getChildByName(itemName);
                if (cell) {
                    let itemLabel = cell.getChildByName('label');
                    itemLabel.active = false;
                    if (produceCfg.keyString) {
                        DataManager.setString(LangChars[produceCfg.keyString], (chars: string) => {
                            if (chars) {
                                itemLabel.active = true;
                                itemLabel.getComponent(cc.Label).string = chars;
                            }
                        });
                    }
                }
            }
        }
    };

    /** 按钮事件 商店 */
    eventCell(event: cc.Event.EventTouch) {
        kit.Audio.playEffect(CConst.sound_clickUI);

        let produceKey = event.target.name.substring(4);
        let produceCfg: Produce = this.produceObj[produceKey];
        let buyCfg: BuyCfg = ConfigBuyItem[produceCfg.keyCoinfg];
        NativeCall.buyItem(buyCfg);
    };

    eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }

    eventBack_refreshShop(buyCfg: BuyCfg) {
        if (buyCfg.isLimit) {
            this.initShop();
        }
    }

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_refresh_shop, this.eventBack_refreshShop, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };
}
