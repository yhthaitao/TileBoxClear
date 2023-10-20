import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import { ParamsWin, TypeBefore } from "../../../../src/config/ConfigCommon";

/** 动作参数（宝箱相关） */
interface ParamsAniBox {
    objBar: { node: cc.Node, time: number, goal: number },
    objLabel: { node: cc.Node, desc: string },
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameWin<Options = any> extends PopupBase {

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
        if (this.isNext) {
            if (_data.boxAreas.new > _data.boxAreas.cur) {
                this.isNext = false;
            }
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

    /**
     * 展示弹窗
     * @param options 弹窗选项
     * @param duration 动画时长
     */
    public show(options?: Options) {
        this.node.scale = 1.2;
        this.maskDown.setContentSize(cc.winSize);
        this.maskUp.setContentSize(cc.winSize);

        return new Promise<void>(res => {
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
            this.content.scale = 0.5;
            this.content.opacity = 0;
            cc.tween(this.content).parallel(
                cc.tween().to(this.popupShowTime.scale0, { scale: 1.05 }, { easing: 'cubicOut' })
                    .to(this.popupShowTime.scale1, { scale: 0.98 }, { easing: 'sineInOut' })
                    .to(this.popupShowTime.scale2, { scale: 1 }, { easing: 'sineInOut' }),
                cc.tween().to(this.popupShowTime.opacity, { opacity: 255 }),
            ).call(() => {
                // 关闭拦截
                this.maskUp.active = false;
                // 弹窗已完全展示
                this.playAniBoxGood();
                this.showAfter && this.showAfter();
                // Done
                res();
            }).start();
        });
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
            let boxGood = DataManager.data.boxGood;
            let count = boxGood.count;
            let reward = DataManager.getRewardBoxGood();
            let total = reward.total;
            
            let process = this.nodeBox.getChildByName('process');
            let itemBar = process.getChildByName('bar');
            itemBar.getComponent(cc.Sprite).fillRange = count / total;
            let itemLabel = process.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = count + '/' + total;

            if (boxGood.add > 0) {
                boxGood.count += boxGood.add;
                boxGood.add = 0;
                DataManager.setData();

                let time = 0.5;
                cc.tween(itemBar.getComponent(cc.Sprite)).parallel(
                    cc.tween().to(time, { fillRange: boxGood.count/total }),
                    cc.tween().delay(time * 0.5).call(() => {
                        itemLabel.getComponent(cc.Label).string = boxGood.count + '/' + total;
                    }),
                ).start();
            }
        }
        
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
        let total = this.params.disBoxXingxing;
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
            else{
                this.setIsLock(false);
            }
        };
        funcXing();
    }

    protected hideBefore(): void {
        this.arrNodeXingxing.forEach((xing, index) => {
            let icon = xing.getChildByName('icon');
            cc.Tween.stopAllByTarget(icon);
            if (index < this.params.disBoxXingxing) {
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
