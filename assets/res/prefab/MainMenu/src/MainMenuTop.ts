import CConst from "../../../../src/config/CConst";
import { kit } from "../../../../src/kit/kit";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import ConfigBuyItem from "../../../../src/config/ConfigBuyItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenuTop extends cc.Component {

    @property(cc.Node) iconStrengthMax: cc.Node = null;
    @property(cc.Node) iconCoin: cc.Node = null;

    @property(cc.Node) labelStrengthNum: cc.Node = null;
    @property(cc.Node) labelStrengthMax: cc.Node = null;
    @property(cc.Node) labelStrengthTime: cc.Node = null;

    @property(cc.Node) labelCoinNum: cc.Node = null;

    objTime = { count: 0, init: 0, total: 1.0 };

    protected onLoad(): void {
        this.listernerRegist();
    }

    protected onEnable(): void {
        this.refreshUI();
    }

    refreshUI() {
        this.refreshStrength();
        this.refreshCoin();
    };

    protected update(dt: number): void {
        this.objTime.count += dt;
        if (this.objTime.count < this.objTime.total) {
            return;
        }
        this.objTime.count = this.objTime.init;

        let strength = DataManager.data.strength;
        let timeCur = Math.floor(new Date().getTime() * 0.001);
        /********************************************* 体力-无限 **********************************************/
        let tInfinite = strength.tInfinite - timeCur;
        if (tInfinite > 0) {
            if (!this.iconStrengthMax.active) {
                this.iconStrengthMax.active = true;
            }
            if (this.labelStrengthMax.active) {
                this.labelStrengthMax.active = false;
            }
            if (!this.labelStrengthTime.active) {
                this.labelStrengthTime.active = true;
            }
            this.refreshStrengthInfinite(tInfinite);// 刷新无限体力时间
            return;
        }
        /********************************************* 体力-非无限-满 **********************************************/
        let entough = strength.count >= strength.total;
        if (entough) {
            if (this.iconStrengthMax.active) {
                this.iconStrengthMax.active = false;
            }
            if (!this.labelStrengthMax.active) {
                this.labelStrengthMax.active = true;
            }
            if (this.labelStrengthTime.active) {
                this.labelStrengthTime.active = false;
            }
            if (strength.tCount != 0) {
                strength.tCount = 0;
                DataManager.setData();
            }
            return;
        }
        /********************************************* 体力-非无限-不满 **********************************************/
        let isUpdate = false;
        if (this.iconStrengthMax.active) {
            this.iconStrengthMax.active = false;
        }
        if (this.labelStrengthMax.active) {
            this.labelStrengthMax.active = false;
        }
        if (!this.labelStrengthTime.active) {
            this.labelStrengthTime.active = true;
        }
        if (strength.tCount <= 0) {
            strength.tCount = timeCur;
            isUpdate = true;
        }
        let disTime = timeCur - strength.tCount;
        let disStrength = Math.floor(disTime / strength.tTotal);
        if (disStrength > 0) {
            strength.count += disStrength;
            if (strength.count > strength.total) {
                strength.count = strength.total;
            }
            strength.tCount = 0;
            isUpdate = true;
        }
        if (isUpdate) {
            DataManager.setData();
            this.refreshStrengthNum();
        }
        let elseTime = strength.tTotal - Math.floor(disTime % strength.tTotal);
        this.refreshStrengthTime(elseTime);
        if (isUpdate) {
            Common.log('update 体力不满 count: ', strength.count, '; elseTime: ', elseTime);
        }
    }

    /** 刷新体力 */
    refreshStrength() {
        let strength = DataManager.data.strength;
        let timeCur = Math.floor(new Date().getTime() * 0.001);
        /********************************************* 体力-无限 **********************************************/
        let tInfinite = strength.tInfinite - timeCur;
        if (tInfinite > 0) {
            Common.log('refreshStrength 无限体力 tInfinite: ', tInfinite);
            if (!this.iconStrengthMax.active) {
                this.iconStrengthMax.active = true;
            }
            if (this.labelStrengthMax.active) {
                this.labelStrengthMax.active = false;
            }
            if (!this.labelStrengthTime.active) {
                this.labelStrengthTime.active = true;
            }
            this.refreshStrengthInfinite(tInfinite);// 刷新无限体力时间
            return;
        }
        /********************************************* 体力-非无限-满 **********************************************/
        let entough = strength.count >= strength.total;
        if (entough) {
            Common.log('refreshStrength 体力满值 count: ', strength.count);
            if (this.iconStrengthMax.active) {
                this.iconStrengthMax.active = false;
            }
            if (!this.labelStrengthMax.active) {
                this.labelStrengthMax.active = true;
            }
            if (this.labelStrengthTime.active) {
                this.labelStrengthTime.active = false;
            }
            if (strength.tCount != 0) {
                strength.tCount = 0;
                DataManager.setData();
            }
            this.refreshStrengthNum();
            return;
        }
        /********************************************* 体力-非无限-不满 **********************************************/
        let isUpdate = false;
        if (this.iconStrengthMax.active) {
            this.iconStrengthMax.active = false;
        }
        if (this.labelStrengthMax.active) {
            this.labelStrengthMax.active = false;
        }
        if (!this.labelStrengthTime.active) {
            this.labelStrengthTime.active = true;
        }
        if (strength.tCount <= 0) {
            strength.tCount = timeCur;
            isUpdate = true;
        }
        let disTime = timeCur - strength.tCount;
        let disStrength = Math.floor(disTime / strength.tTotal);
        if (disStrength > 0) {
            strength.count += disStrength;
            if (strength.count > strength.total) {
                strength.count = strength.total;
            }
            strength.tCount = 0;
            isUpdate = true;
        }
        if (isUpdate) {
            DataManager.setData();
        }
        this.refreshStrengthNum();
        let elseTime = strength.tTotal - Math.floor(disTime % strength.tTotal);
        this.refreshStrengthTime(elseTime);
        Common.log('refreshStrength 体力不满 count: ', strength.count, '; elseTime: ', elseTime);
    };

    /** 刷新体力 */
    refreshStrengthNum() {
        let count = DataManager.data.strength.count;
        this.labelStrengthNum.getComponent(cc.Label).string = '' + count;
    };

    /** 刷新体力时间 */
    refreshStrengthTime(count: number) {
        let m = Math.floor(count / 60);
        let s = Math.floor(count % 60);
        let mm = m < 10 ? '0' + m : '' + m;
        let ss = s < 10 ? '0' + s : '' + s;
        this.labelStrengthTime.getComponent(cc.Label).string = mm + ':' + ss;
    };

    /** 刷新体力无限 */
    refreshStrengthInfinite(count: number) {
        let h = Math.floor(count / 3600);
        let countElse = count % 3600;
        let m = Math.floor(countElse / 60);
        let s = Math.floor(countElse % 60);
        let hh = h < 10 ? '0' + h : '' + h;
        let mm = m < 10 ? '0' + m : '' + m;
        let ss = s < 10 ? '0' + s : '' + s;
        this.labelStrengthTime.getComponent(cc.Label).string = hh + ':' + mm + ':' + ss;
    };

    /** 刷新金币 */
    refreshCoin() {
        let numCoin = DataManager.data.numCoin;
        this.labelCoinNum.getComponent(cc.Label).string = '' + numCoin;
    };

    playAniStrength() {
        let data = DataManager.data.strength;
        let time = Math.floor(new Date().getTime() * 0.001);
        let disT = data.tInfinite - time;
        this.iconStrengthMax.active = disT > 0;
        this.refreshStrength();
    };

    playAniGetCoin(x: number, y: number) {
        let coinCur = Number(this.labelCoinNum.getComponent(cc.Label).string);
        let coinNext = DataManager.data.numCoin;
        let coinDis = coinNext - coinCur;
        let count = 0;
        let total = 20;
        let pStart = Common.getLocalPos(this.node.parent, cc.v3(x, y), this.iconCoin.parent);
        let pFinish = this.iconCoin.position;
        for (let index = 0; index < total; index++) {
            let coin = cc.instantiate(this.iconCoin);
            coin.scale = 0.75;
            coin.active = true;
            coin.parent = this.iconCoin.parent;
            coin.position = pStart;
            let randomX = Math.floor(Math.random() * 100 - 50);
            let randomY = Math.floor(Math.random() * 50 - 50);
            let pMid = cc.v2(pStart.x + randomX, pStart.y + randomY);
            let bezier1 = { p1: cc.v2(pStart.x, pStart.y), p2: cc.v2(pMid.x, pStart.y), pTo: cc.v2(pMid.x, pMid.y), time: Math.random() * 0.2 + 0.1, };
            let bezier2 = { p1: cc.v2(pMid.x, pMid.y), p2: cc.v2(pFinish.x, pMid.y), pTo: cc.v2(pFinish.x, pFinish.y) };
            let time2 = Common.getMoveTime(cc.v3(bezier2.p1.x, bezier2.p1.y), cc.v3(bezier2.pTo.x, bezier2.pTo.y), 1, 1500);
            cc.tween(coin)
                .delay(Math.random() * 0.5)
                .bezierTo(bezier1.time, bezier1.p1, bezier1.p2, bezier1.pTo)
                .delay(Math.random() * 0.5)
                .parallel(
                    cc.tween().bezierTo(time2, bezier2.p1, bezier2.p2, bezier2.pTo),
                    cc.tween().to(time2, { scale: 1.0 }),
                )
                .call(() => {
                    coin.removeFromParent();
                    count++;
                    let number = coinCur + coinDis * count / total;
                    this.labelCoinNum.getComponent(cc.Label).string = '' + Math.floor(number);
                    this.iconCoin.getComponent(cc.Animation).play();
                })
                .start();
        }
    };

    /** 按钮事件 加体力 */
    eventBtnAddStrength() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_getLives, {}, { mode: PopupCacheMode.Frequent });
    }

    /** 按钮事件 加金币 */
    eventBtnAddCoin() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_getCoins, { isGoShop: false }, { mode: PopupCacheMode.Frequent});
    }

    /** 按钮事件 设置 */
    eventBtnSet() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.show(CConst.popup_path_settingHome, {}, { mode: PopupCacheMode.Frequent });
    };

    /** 监听-注册 */
    listernerRegist(): void {
        kit.Event.on(CConst.event_scale_strength, this.playAniStrength, this);
        kit.Event.on(CConst.event_scale_coin, this.playAniGetCoin, this);
        kit.Event.on(CConst.event_refresh_top, this.refreshUI, this);
        kit.Event.on(CConst.event_refresh_strength, this.refreshStrength, this);
        kit.Event.on(CConst.event_refresh_coin, this.refreshCoin, this);
    }

    /** 监听-取消 */
    listernerIgnore(): void {
        kit.Event.removeByTarget(this);
    };

    protected onDestroy(): void {
        this.listernerIgnore();
    };
}
