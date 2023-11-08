import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";
import { ParamsWin, TypeBefore } from "../../../../src/config/ConfigCommon";
import GameManager from "../../../../src/config/GameManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameWin<Options = any> extends PopupBase {

    @property(cc.Node) nodeXing: cc.Node = null;
    @property(cc.Node) nodeClock: cc.Node = null;
    @property(cc.Node) nodeBox: cc.Node = null;
    @property(cc.Node) nodeCoin: cc.Node = null;
    @property(cc.Node) nodeLine: cc.Node = null;
    @property(cc.Node) btnVideo: cc.Node = null;
    @property(cc.Node) btnNext: cc.Node = null;
    @property(cc.Node) itemCoinArrow: cc.Node = null;
    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelNext: cc.Node = null;
    @property(cc.Node) itemLabelTime: cc.Node = null;
    @property([cc.Node]) arrNodeXingxing: cc.Node[] = [];
    @property(cc.Node) nodeReward: cc.Node = null;

    params: ParamsWin = null;
    isNext: boolean = false;
    islock: boolean = false;
    obj = {
        isShowLine: false,
        show: {
            xing: { y: 190 }, box: { y: 5 }, coin: { y: -70 }, line: { y: -145 }, video: { y: -245 }, next: { y: -400 }
        },
        hide: {
            xing: { y: 190 }, box: { y: -15 }, coin: { y: -120 }, line: { y: -145 }, video: { y: -245 }, next: { y: -240 }
        },
        aniBox: { isPlay: false, count: 0, total: 0, goods: [0] },
        line: {
            isMove: false,
            base: 10,
            speed: { init: 0, cur: 0, max: 5, add: 0.06 },
            radio: { init: 2, cur: 2, max: 5 },
            arrow: { dir: 1, left: -90, right: 165, mid: [-9.5, 73.5, 138.5] },
        },
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

    protected update(dt: number): void {
        if (!this.obj.isShowLine) {
            return;
        }
        if (!this.obj.line.isMove) {
            return;
        }
        this.obj.line.speed.cur += this.obj.line.speed.add;
        if (this.obj.line.speed.cur > this.obj.line.speed.max) {
            this.obj.line.speed.cur = this.obj.line.speed.max;
        }
        this.itemCoinArrow.x += this.obj.line.speed.cur * this.obj.line.arrow.dir;
        // 方向变化
        if (this.itemCoinArrow.x > this.obj.line.arrow.right) {
            this.itemCoinArrow.x = this.obj.line.arrow.right;
            this.obj.line.arrow.dir = -1;
            this.obj.line.speed.cur = this.obj.line.speed.init;
        }
        else if (this.itemCoinArrow.x < this.obj.line.arrow.left) {
            this.itemCoinArrow.x = this.obj.line.arrow.left;
            this.obj.line.arrow.dir = 1;
            this.obj.line.speed.cur = this.obj.line.speed.init;
        }
        // 倍数变化
        if (this.itemCoinArrow.x < this.obj.line.arrow.mid[0]) {
            this.obj.line.radio.cur = 2;

        }
        else if (this.itemCoinArrow.x < this.obj.line.arrow.mid[1]) {
            this.obj.line.radio.cur = 3;
        }
        else if (this.itemCoinArrow.x < this.obj.line.arrow.mid[2]) {
            this.obj.line.radio.cur = 4;
        }
        else {
            this.obj.line.radio.cur = 5;
        }
        let coinLabel = this.nodeCoin.getChildByName('label');
        coinLabel.getComponent(cc.Label).string = 'x' + this.obj.line.radio.cur * this.obj.line.base;
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
        this.nodeReward.setContentSize(cc.winSize);
        this.nodeReward.scale = 1 / 1.2;

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
                this.playAniLine();
                this.showAfter && this.showAfter();
                // Done
                res();
            }).start();
        });
    }

    /** 刷新ui */
    resetContent() {
        // 从第六关开始 结算可以看视频翻倍
        this.obj.isShowLine = DataManager.data.boxData.level > 6;
        this.obj.line.isMove = false;
        this.obj.line.speed.cur = this.obj.line.speed.init;
        this.obj.line.radio.cur = this.obj.line.radio.init;
        this.itemCoinArrow.x = this.obj.line.arrow.left;
        this.nodeReward.active = false;
        let rewardCoinLabel = this.nodeReward.getChildByName('nodeCoin').getChildByName('label');
        rewardCoinLabel.getComponent(cc.Label).string = '' + DataManager.data.numCoin;
        DataManager.data.numCoin += this.obj.line.base;
        DataManager.setData();

        // 显示金币倍数
        this.nodeLine.active = true;
        this.nodeCoin.active = true;
        this.btnVideo.active = true;
        if (this.obj.isShowLine) {
            this.nodeXing.y = this.obj.show.xing.y;
            this.nodeBox.y = this.obj.show.box.y;
            this.nodeCoin.y = this.obj.show.coin.y;
            this.nodeLine.y = this.obj.show.line.y;
            this.btnVideo.y = this.obj.show.video.y;
            this.btnNext.y = this.obj.show.next.y;
            let nextBack = this.btnNext.getChildByName('back');
            nextBack.active = false;
        }
        else {
            this.nodeLine.active = false;
            this.btnVideo.active = false;
            this.nodeXing.y = this.obj.hide.xing.y;
            this.nodeBox.y = this.obj.hide.box.y;
            this.nodeCoin.y = this.obj.hide.coin.y;
            this.nodeLine.y = this.obj.hide.line.y;
            this.btnVideo.y = this.obj.hide.video.y;
            this.btnNext.y = this.obj.hide.next.y;
            let nextBack = this.btnNext.getChildByName('back');
            nextBack.active = true;
        }

        this.obj.aniBox.isPlay = false;
        let config = DataManager.getRewardBoxGood();
        if (config.goods.length > 0) {
            this.nodeBox.active = true;
            this.resetBoxProcess(config);
        }
        else {
            this.nodeBox.active = false;
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
                    cc.tween().to(time, { fillRange: boxGood.count / total }),
                    cc.tween().delay(time * 0.5).call(() => {
                        itemLabel.getComponent(cc.Label).string = boxGood.count + '/' + total;
                    }),
                ).start();
            }
        }
    }

    /** 播放动画 金币变动 */
    playAniLine() {
        this.obj.line.isMove = true;
    }

    /**
     * 播放动画 金币获取
     * @param coinRadio 金币倍数
     * @param callBack 回调
     */
    playAniGetCoin(coinRadio: number, callBack: Function) {
        // 金币加倍
        if (coinRadio > 1) {
            let coinNum = this.obj.line.radio.cur * this.obj.line.base;
            DataManager.data.numCoin += (coinNum - this.obj.line.base);
            DataManager.setData();
        }

        this.nodeReward.active = true;
        this.nodeReward.opacity = 0;
        let nodeRewardCoin = this.nodeReward.getChildByName('nodeCoin');
        let pWorld = cc.v3(this.params.objCoin.position.x, this.params.objCoin.position.y);
        nodeRewardCoin.position = this.nodeReward.convertToNodeSpaceAR(pWorld);
        nodeRewardCoin.scale = this.params.objCoin.scale;
        cc.tween(this.nodeReward).to(0.5, { opacity: 255 }).call(() => {
            let nodeCoin = this.nodeReward.getChildByName('nodeCoin');
            DataManager.playAniGetCoin(nodeCoin, cc.v3(cc.winSize.width * 0.5, cc.winSize.height * 0.5), callBack);
        }).start();
    }

    setIsLock(islock) {
        this.islock = islock;
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
            else {
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
        this.obj.isShowLine = false;
        this.obj.line.isMove = false;
    }

    /** 按钮事件 视频 */
    eventBtnVideo() {
        let funcA = () => {
            this.obj.line.isMove = false;
            let funcDelay = () => {
                this.nodeReward.opacity = 255;
                cc.tween(this.nodeReward).delay(1.0).to(0.5, { opacity: 0 }).delay(0.5).call(() => {
                    this.nodeReward.active = false;
                    if (this.isNext) {
                        GameManager.gameWin_startGame(TypeBefore.fromWin);
                    }
                    else {
                        let obj = {
                            level: DataManager.data.boxData.level - 1,
                            eventStart: CConst.event_enter_menu,
                            eventFinish: CConst.event_menu_start,
                        }
                        kit.Popup.hide();
                        kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
                    }
                }).start();
            }
            this.playAniGetCoin(this.obj.line.radio.cur, funcDelay);
        };
        let funcB = () => {
            kit.Event.emit(CConst.event_notice, LangChars.notice_adLoading);
        };
        DataManager.playVideo(funcA, funcB);
    }

    /** 按钮事件 确定 */
    eventBtnNext() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.obj.line.isMove = false;
        let funcDelay = () => {
            this.nodeReward.opacity = 255;
            cc.tween(this.nodeReward).delay(1.0).to(0.5, { opacity: 0 }).delay(0.5).call(() => {
                this.nodeReward.active = false;
                if (this.isNext) {
                    GameManager.gameWin_startGame(TypeBefore.fromWin);
                }
                else {
                    let obj = {
                        level: DataManager.data.boxData.level - 1,
                        eventStart: CConst.event_enter_menu,
                        eventFinish: CConst.event_menu_start,
                    }
                    kit.Popup.hide();
                    kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
                }
            }).start();
        }
        this.playAniGetCoin(1, funcDelay);
    }

    /** 按钮事件 退出 */
    eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);

        this.obj.line.isMove = false;
        let funcDelay = () => {
            this.nodeReward.opacity = 255;
            cc.tween(this.nodeReward).delay(1.0).to(0.5, { opacity: 0 }).delay(0.5).call(() => {
                this.nodeReward.active = false;
                let obj = {
                    level: DataManager.data.boxData.level - 1,
                    eventStart: CConst.event_enter_menu,
                    eventFinish: CConst.event_menu_start,
                }
                kit.Popup.hide();
                kit.Popup.show(CConst.popup_path_actPass, obj, { mode: PopupCacheMode.Frequent });
            }).start();
        }
        this.playAniGetCoin(1, funcDelay);
    }
}
