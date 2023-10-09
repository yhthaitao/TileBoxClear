import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager, { ParamsWin, TypeBefore } from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";

/** 动作参数（宝箱相关） */
interface ParamsAniBox {
    objBar: { node: cc.Node, time: number, goal: number },
    objLabel: { node: cc.Node, desc: string },
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameWin extends PopupBase {

    @property(cc.Node) nodeXing: cc.Node = null;
    @property(cc.Node) nodeClock: cc.Node = null;
    @property(cc.Node) nodeBox: cc.Node = null;
    @property(cc.Node) nodeNext: cc.Node = null;
    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelNext: cc.Node = null;
    @property(cc.Node) itemLabelTime: cc.Node = null;
    @property([cc.Node]) arrNodeXingxing: cc.Node[] = [];
    @property(cc.Node) maskBottom: cc.Node = null;

    params: ParamsWin = null;
    isNext: boolean = false;
    islock: boolean = false;
    obj = {
        boxShow: {
            xing: { y: 160 }, clock: { y: -20 }, box: { y: -125 }, next: { y: -220 }
        },
        boxHide: {
            xing: { y: 140 }, clock: { y: -70 }, box: { y: 0 }, next: { y: -210 }
        },
        aniBox: { isPlay: false, count: 0, total: 0, goods: [0] },
    };

    protected showBefore(options: any): void {
        Common.log('弹窗 过关页面 showBefore()');
        this.params = Common.clone(options);

        // 时间
        let m = Math.floor(this.params.tCount / 60);
        let s = Math.floor(this.params.tCount % 60);
        let mm = m < 10 ? '0' + m : '' + m;
        let ss = s < 10 ? '0' + s : '' + s;
        this.itemLabelTime.getComponent(cc.Label).string = mm + ':' + ss;

        DataManager.setString(LangChars.win_finish, (chars: string) => {
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });

        // next 或 continue
        this.isNext = true;
        let _data = DataManager.data;
        if (_data.boxLevel.count + _data.boxLevel.add >= DataManager.getRewardBoxLevel().total
            || _data.boxSuipian.count + _data.boxSuipian.add >= DataManager.getRewardBoxSuipian().total
            || _data.boxXingxing.count + _data.boxXingxing.add >= DataManager.getRewardBoxXinging().total) {
            this.isNext = false;
        }
        DataManager.setString(this.isNext ? LangChars.win_next : LangChars.CONTINUE, (chars: string) => {
            this.itemLabelNext.getComponent(cc.Label).string = chars;
        });

        // 星星隐藏
        this.arrNodeXingxing.forEach((xing) => {
            let icon = xing.getChildByName('icon');
            icon.opacity = 0;
            cc.Tween.stopAllByTarget(icon);
        });

        // 刷新ui
        this.resetContent();

        this.setIsLock(true);
    }

    /** 刷新ui */
    resetContent() {
        this.obj.aniBox.isPlay = false;
        let config = DataManager.getRewardBoxGood();
        // 物品池子为空
        if (config.goods.length <= 0) {
            this.nodeXing.active = true;
            this.nodeXing.y = this.obj.boxHide.xing.y;
            this.nodeClock.active = true;
            this.nodeClock.y = this.obj.boxHide.clock.y;
            this.nodeBox.active = false;
            this.nodeNext.active = true;
            this.nodeNext.y = this.obj.boxHide.next.y;
        }
        else {
            this.nodeXing.active = true;
            this.nodeXing.y = this.obj.boxShow.xing.y;
            this.nodeClock.active = true;
            this.nodeClock.y = this.obj.boxShow.clock.y;
            this.nodeBox.active = true;
            this.nodeBox.y = this.obj.boxShow.box.y;
            this.nodeNext.active = true;
            this.nodeNext.y = this.obj.boxShow.next.y;

            this.resetBoxProcess(config);
        }
    }

    /** 刷新进度（物品宝箱） */
    resetBoxProcess(config: { total: number, goods: number[] }) {
        let count = DataManager.data.boxGood.count;
        let total = config.total;
        // 进度条
        let process = this.nodeBox.getChildByName('process');
        let itemBar = process.getChildByName('bar');
        itemBar.getComponent(cc.Sprite).fillStart = 0;
        itemBar.getComponent(cc.Sprite).fillRange = count / total;
        let itemLabel = process.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = count + '/' + total;

        // 参数赋值
        this.obj.aniBox.isPlay = true;
        this.obj.aniBox.count = count;
        this.obj.aniBox.total = total;
        this.obj.aniBox.goods = Common.clone(config.goods);
    }

    /**
     * 播放宝箱动画
     *      宝箱存在
     */
    async playAniBoxGood() {
        if (this.obj.aniBox.isPlay) {
            let boxData = DataManager.data.boxGood;
            // 其他数据
            let total = this.obj.aniBox.total;
            let boxCount = boxData.count;
            let boxAdd = boxData.add;
            let boxAddElse = -1;
            if (boxCount + boxAdd >= total) {
                boxAddElse = boxCount + boxAdd - total;
                boxAdd = boxAdd - boxAddElse;
            }

            // 数据变更
            boxData.count += boxData.add;
            boxData.add = 0;
            if (boxData.count >= total) {
                boxData.level += 1;
                boxData.count -= total;
                let params = { total: this.obj.aniBox.total, goods: this.obj.aniBox.goods };
                DataManager.refreshDataAfterUnlockGood(params);
                console.log(JSON.stringify({ name: '物品宝箱', param: params }, null, 4));
                kit.Event.emit(CConst.event_notice, '物品宝箱');
            }
            DataManager.setData();

            let process = this.nodeBox.getChildByName('process');
            let itemBar = process.getChildByName('bar');
            let itemLabel = process.getChildByName('label');
            let time = 0.25;
            // 进度条刷新
            for (let index = 0; index < boxAdd; index++) {
                boxCount++;
                let params: ParamsAniBox = {
                    objBar: { node: itemBar, time: time, goal: boxCount / total },
                    objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                };
                await this.playAniBoxOne(params);
            }

            // 进度条再次刷新
            if (boxAddElse >= 0) {
                // 开启宝箱
                await kit.Popup.show(CConst.popup_path_boxGood, {}, { mode: PopupCacheMode.Frequent });
                // 进度条再次刷新
                boxCount = 0;
                total = DataManager.getRewardBoxGood().total;
                itemBar.width = 0;
                itemLabel.getComponent(cc.Label).string = 0 + '/' + total;
                for (let index = 0; index < boxAddElse; index++) {
                    boxCount++;
                    let params: ParamsAniBox = {
                        objBar: { node: itemBar, time: time, goal: boxCount / total },
                        objLabel: { node: itemLabel, desc: boxCount + '/' + total },
                    };
                    await this.playAniBoxOne(params);
                }
            }
        }
        this.setIsLock(false);
    }

    playAniBoxOne(params: ParamsAniBox): Promise<void> {
        return new Promise(res => {
            cc.tween(params.objBar.node.getComponent(cc.Sprite)).parallel(
                cc.tween().to(params.objBar.time, { fillRange: params.objBar.goal }),
                cc.tween().delay(params.objBar.time * 0.5).call(() => {
                    params.objLabel.node.getComponent(cc.Label).string = params.objLabel.desc;
                }),
            ).call(() => {
                res();
            }).start();
        });
    }

    setIsLock(islock) {
        this.islock = islock;
        this.maskBottom.active = this.islock;
    }

    protected showAfter(): void {
        let total = this.params.xingxing;
        let funcXing = (index: number = 0) => {
            if (index < total) {
                let xing = this.arrNodeXingxing[index];
                let icon = xing.getChildByName('icon');
                icon.scale = 0;
                cc.tween(icon).parallel(
                    cc.tween().to(0.2, { scale: 1.0 }),
                    cc.tween().to(0.2, { opacity: 255 }),
                ).call(() => {
                    index++;
                    funcXing(index);
                }).start();
            }
        };
        funcXing();

        this.playAniBoxGood();
    }

    protected hideBefore(): void {
        this.arrNodeXingxing.forEach((xing, index) => {
            let icon = xing.getChildByName('icon');
            cc.Tween.stopAllByTarget(icon);
            if (index < this.params.xingxing) {
                icon.opacity = 255;
                icon.scale = 1.0;
            }
        });
    }

    /** 按钮事件 确定 */
    async eventBtnNext() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();
        if (this.isNext) {
            // next 游戏开始前页面
            kit.Popup.show(CConst.popup_path_before, { type: TypeBefore.fromGameWin }, { mode: PopupCacheMode.Frequent });
        }
        else {
            await kit.Popup.show(CConst.popup_path_actPass, this.params, { mode: PopupCacheMode.Frequent });
            kit.Event.emit(CConst.event_enter_menu);
        }
    }

    /** 按钮事件 退出 */
    async eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        let funcNext = async () => {
            await kit.Popup.hide();
            await kit.Popup.show(CConst.popup_path_actPass, this.params, { mode: PopupCacheMode.Frequent });
            kit.Event.emit(CConst.event_enter_menu);
        };
        DataManager.playAdvert(funcNext);
    }
}
