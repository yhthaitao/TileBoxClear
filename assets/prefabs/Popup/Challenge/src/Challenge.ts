import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { ChallengeDayParam, ChallengeMonthParam, ChallengeState, PropRewardType, FromState, PropType } from "../../../../src/config/ConfigCommon";
import { LangChars } from "../../../../src/config/ConfigLang";
import GameManager from "../../../../src/config/GameManager";
import { PopupCacheMode } from "../../../../src/kit/manager/popupManager/PopupManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Challenge<Options = any> extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) btnPlay: cc.Node = null;
    @property(cc.Node) btnLeft: cc.Node = null;
    @property(cc.Node) btnRight: cc.Node = null;
    @property(cc.Node) nodeGift: cc.Node = null;
    @property(cc.Node) nodeMain: cc.Node = null;
    @property(cc.Node) nodeReward: cc.Node = null;
    @property(cc.Node) itemDay: cc.Node = null;
    @property(cc.Material) materialNormal: cc.Material = null;
    @property(cc.Material) materialGray: cc.Material = null;

    obj = {
        isVideo: false,
        year: { cur: 0, init: 0 },
        month: { cur: 0, init: 0 },
        dayTotal: { cur: 0, init: 0 },
        side: { xDis: 58, xMin: -174, xMax: 174, yMin: -240, yMax: -40 },
        color: {
            notBefore: cc.color(255, 78, 24),
            notCurrent: cc.color(255, 255, 255),
            notAfter: cc.color(166, 143, 120),
            already: cc.color(83, 176, 253),
        },
        aniNames: {
            start: 'dacheng',
            enough: 'jingzhi',
            open: 'dakai',
            finish: 'kaiqijieshuhou',
        },
    };

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
            // 播放背景遮罩动画
            this.maskDown.active = true;
            this.maskDown.opacity = 0;
            cc.tween(this.maskDown).to(0.245, { opacity: 200 }).start();
            // 播放弹窗主体动画
            this.content.active = true;
            this.content.scale = 0.5;
            this.content.opacity = 0;
            cc.tween(this.content).call(() => {
                // 展示前
                this.showBefore(this.options);
            }).parallel(
                cc.tween().to(this.popupShowTime.scale0, { scale: 1.05 }, { easing: 'cubicOut' })
                    .to(this.popupShowTime.scale1, { scale: 0.98 }, { easing: 'sineInOut' })
                    .to(this.popupShowTime.scale2, { scale: 1 }, { easing: 'sineInOut' }),
                cc.tween().to(this.popupShowTime.opacity, { opacity: 255 }),
            ).call(() => {
                // 关闭拦截
                this.maskUp.active = false;
                // 弹窗已完全展示
                this.showAfter && this.showAfter();
                // Done
                res();
            }).start();
        });
    }

    protected showBefore(options: any): void {
        Common.log('弹窗 挑战页面 showBefore()');
        this.nodeReward.active = false;

        let date = new Date();
        this.obj.year.init = date.getFullYear();
        this.obj.month.init = date.getMonth();
        this.obj.dayTotal.init = DataManager.getDayTotalFromDate(date);

        let challenge = DataManager.data.challengeData;
        this.obj.year.cur = challenge.about.year;
        this.obj.month.cur = challenge.about.month;
        this.refreshUI();
    }

    protected showAfter(): void {
        if (DataManager.data.challengeData.guide.isTouchGift) {
            DataManager.data.challengeData.guide.isTouchGift = false;
            DataManager.setData();
            // 挑战引导
            let point = Common.getLocalPos(this.nodeGift.parent, this.nodeGift.position, this.node);
            point.y = point.y * 1.2;
            let params = {
                name: 'challenge2',
                itemPosition: { x: point.x, y: point.y, },
                handPosition: { x: point.x, y: 50, },
                descPosition: { x: point.x, y: -200, },
            };
            kit.Event.emit(CConst.event_guide_challenge, params);
        }
    }

    /** 刷新ui */
    refreshUI() {
        let year = this.obj.year;
        let month = this.obj.month;
        let dayTotal = this.obj.dayTotal;
        let objMonth: ChallengeMonthParam = DataManager.getChallengeData(year.cur, month.cur);
        this.obj.dayTotal.cur = DataManager.getDayTotalCur(objMonth, dayTotal.init);
        this.refreshTitle(year.cur, month.cur);
        this.refreshPlay(dayTotal);
        this.refreshGift(objMonth);
        this.refreshMonth(dayTotal, objMonth);
        this.refreshLeftAndRight();
    };

    async refreshTitle(year: number, month: number) {
        let charsMonth = await DataManager.getString(Common.getLangCharsKeyMonth(month));
        let itemTitle = this.nodeTitle.getChildByName('label');
        itemTitle.getComponent(cc.Label).string = charsMonth + ' ' + year;
    }

    async refreshPlay(dayTotal: { cur: number, init: number }) {
        let itemPlay = this.btnPlay.getChildByName('label');
        let itemBack = this.btnPlay.getChildByName('back');
        let itemSign = this.btnPlay.getChildByName('sign');
        if (dayTotal.cur > 0) {
            this.obj.isVideo = dayTotal.cur != dayTotal.init;
            let date = new Date();
            date.setTime(dayTotal.cur * 86400 * 1000);
            let charsPlay = await DataManager.getString(LangChars.gameBefore_play);
            let charsMonth = await DataManager.getString(Common.getLangCharsKeyMonth(date.getMonth()));
            let stringBtn = charsPlay + ' ' + charsMonth + ' ' + DataManager.getDayMonth(date);
            itemPlay.getComponent(cc.Label).string = stringBtn;
            itemBack.getComponent(cc.Sprite).setMaterial(0, this.materialNormal);
            itemSign.active = this.obj.isVideo;
            this.btnPlay.getComponent(cc.Button).interactable = true;
        }
        else {
            itemPlay.getComponent(cc.Label).string = 'Can Not Play!';
            itemBack.getComponent(cc.Sprite).setMaterial(0, this.materialGray);
            itemSign.active = false;
            this.btnPlay.getComponent(cc.Button).interactable = false;
        }
    }

    /** 刷新左右按钮 */
    refreshLeftAndRight() {
        let left = DataManager.data.challengeData.limit;
        let cur = this.obj.year.cur * 12 + this.obj.month.cur;
        let right = this.obj.year.init * 12 + this.obj.month.init;
        this.btnLeft.active = cur > left;
        this.btnRight.active = cur < right;
    }

    /** 刷新礼包 */
    refreshGift(objMonth: ChallengeMonthParam) {
        let count = objMonth.count;
        count = count > 28 ? 28 : count;
        // 进度
        let process = this.nodeGift.getChildByName('process');
        let bar = process.getChildByName('bar');
        let objRadio = { a: 0.325, b: 0.65, c: 1.0 };
        let objCount = { a: 5, b: 15, c: 28 };
        let radio = 0;
        if (count <= objCount.a) {
            radio = objRadio.a * count / objCount.a;
        }
        else if (count <= objCount.b) {
            radio = objRadio.a + (objRadio.b - objRadio.a) * (count - objCount.a) / (objCount.b - objCount.a);
        }
        else {
            radio = objRadio.b + (objRadio.c - objRadio.b) * (count - objCount.b) / (objCount.c - objCount.b);
        }
        bar.getComponent(cc.Sprite).fillRange = radio;
        // 标识
        let width = 340;
        let sign = this.nodeGift.getChildByName('sign');
        let label = sign.getChildByName('label');
        label.getComponent(cc.Label).string = '' + objMonth.count;
        sign.x = -width * 0.5 + width * radio;
        // 礼包
        let itemGift = this.nodeGift.getChildByName('gift');
        for (let index = 0, length = itemGift.children.length; index < length; index++) {
            let reward = objMonth.reward[index];
            let item = itemGift.getChildByName('item' + index);
            let itemDragon = item.getChildByName('dragon');
            let dragon = itemDragon.getComponent(dragonBones.ArmatureDisplay);
            let armatureName = (index + 1) + 'lihe';
            dragon.armatureName = armatureName;
            // 已获取
            if (reward.isGet) {
                dragon.playAnimation(this.obj.aniNames.finish, 0);
            }
            // 未获取
            else {
                if (objMonth.count > reward.total - 1) {
                    reward.isGet = true;
                    DataManager.playAniDragon(itemDragon, armatureName, this.obj.aniNames.open, () => {
                        dragon.playAnimation(this.obj.aniNames.finish, 0);
                    });
                    this.getReward(reward.props, item.convertToWorldSpaceAR(itemDragon.position));
                }
                else {
                    dragon.playAnimation(this.obj.aniNames.start, 0);
                }
            }
        }
    }

    async getReward(props: PropRewardType[], pWorld: cc.Vec3) {
        this.nodeReward.active = true;
        let mask = this.nodeReward.getChildByName('mask');
        mask.opacity = 0;
        let nodeIcon = this.nodeReward.getChildByName('nodeIcon');
        nodeIcon.opacity = 0;
        // 延迟一会儿
        await new Promise((_res) => {
            cc.Canvas.instance.scheduleOnce(_res, 1.0);
        });
        // back
        mask.opacity = 0;
        cc.tween(mask).to(0.25, { opacity: 180 }).start();
        // reward
        nodeIcon.opacity = 255;
        nodeIcon.children.forEach((item) => { item.active = false });
        let propLen = props.length;
        let propDis = 240;
        props.forEach((reward, index) => {
            let info = DataManager.getRewardInfo(reward);
            let item = nodeIcon.children[index];
            let icon = item.getChildByName('icon');
            icon.getComponent(cc.Sprite).spriteFrame = info.frame;
            let scaleX = item.width / icon.width;
            let scaleY = item.height / icon.height;
            icon.scale = scaleX < scaleY ? scaleX : scaleY;
            let label = item.getChildByName('label');
            label.getComponent(cc.Label).string = info.string;
            item.active = true;
            item.x = index * propDis - (propLen - 1) * propDis * 0.5;
        });
        let p1 = this.nodeReward.convertToNodeSpaceAR(pWorld);
        let p2 = cc.v3(0, 200);
        let p3 = cc.v3(0, 400);
        nodeIcon.scale = 0;
        nodeIcon.opacity = 255;
        nodeIcon.position = p1;
        nodeIcon.y += 100;
        cc.tween(nodeIcon).parallel(
            cc.tween().to(0.25, { position: p2 }),
            cc.tween().to(0.25, { scale: 1 }),
        ).delay(1.25).parallel(
            cc.tween().to(0.25, { position: p3 }),
            cc.tween().to(0.25, { opacity: 50 }),
        ).call(() => {
            props.forEach((reward) => {
                DataManager.refreshDataByReward(reward);
                switch (reward.type) {
                    case PropType.coin:
                        kit.Event.emit(CConst.event_refresh_coin);
                        break;
                    case PropType.magnet:
                    case PropType.tMagnetInfinite:
                        kit.Event.emit(CConst.event_refresh_strength);
                        break;
                    default:
                        break;
                }
                DataManager.setData();
            });
            this.nodeReward.active = false;
        }).start();
    };

    /** 刷新月份 */
    refreshMonth(dayTotal: { cur: number, init: number }, objMonth: ChallengeMonthParam) {
        // 删除挑战节点
        this.clearChallengeItem();
        let row = 0;
        let col = 0;
        let yDis = (this.obj.side.yMax - this.obj.side.yMin) / (DataManager.getWeekMax(objMonth) - 1);
        let days = Object.keys(objMonth.objDay);
        days.sort((a, b) => { return Number(a) - Number(b); });
        for (let index = 0, length = days.length; index < length; index++) {
            let key: string = days[index];
            let value: ChallengeDayParam = objMonth.objDay[key];
            if (index == 0) {
                row = 0;
            }
            else {
                if (value.dayWeek == 0) {
                    row++;
                }
            }
            col = value.dayWeek;
            // 添加节点
            let itemDay = cc.instantiate(this.itemDay);
            itemDay.active = true;
            let current = itemDay.getChildByName('current');
            current.active = false;
            let already = itemDay.getChildByName('already');
            already.active = false;
            let itemLabel = itemDay.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = '' + key;
            itemDay.x = this.obj.side.xMin + col * this.obj.side.xDis;
            itemDay.y = this.obj.side.yMax - row * yDis;
            itemDay.parent = this.nodeMain;
            // color 和 active
            if (value.state == ChallengeState.already) {
                already.active = true;
                itemLabel.color = this.obj.color.already;
            }
            else {
                if (value.dayTotal == dayTotal.cur) {
                    current.active = true;
                    itemLabel.color = this.obj.color.notCurrent;
                }
                else if (value.dayTotal < dayTotal.cur) {
                    itemLabel.color = this.obj.color.notBefore;
                }
                else {
                    itemLabel.color = this.obj.color.notAfter;
                }
            }
        }
    }

    /** 清楚挑战节点 */
    clearChallengeItem() {
        for (let index = this.nodeMain.childrenCount - 1; index >= 0; index--) {
            let itemDay = this.nodeMain.children[index];
            DataManager.poolPut(itemDay, DataManager.objPool.challengeDay);
        }
    }

    eventBtnLeft() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.obj.month.cur -= 1;
        if (this.obj.month.cur < 0) {
            this.obj.year.cur -= 1;
            this.obj.month.cur = 11;
        }
        this.refreshUI();
    }

    eventBtnRight() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        this.obj.month.cur += 1;
        if (this.obj.month.cur > 11) {
            this.obj.year.cur += 1;
            this.obj.month.cur = 0;
        }
        this.refreshUI();
    }

    eventBtnHome() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }

    eventBtnPlay(event: cc.Event.EventTouch) {
        kit.Audio.playEffect(CConst.sound_clickUI);
        let date = new Date();
        let time = Math.floor(date.getTime() * 0.001);
        let data = DataManager.data;
        if (data.strength.tInfinite > time || data.strength.count > 0) {
            date.setTime(this.obj.dayTotal.cur * 86400 * 1000);
            DataManager.data.challengeData.about.year = date.getFullYear();
            DataManager.data.challengeData.about.month = date.getMonth();
            DataManager.data.challengeData.about.dayMonth = DataManager.getDayMonth(date);
            DataManager.data.challengeData.about.dayTotal = DataManager.getDayTotalFromDate(date);
            kit.Popup.hide();
            GameManager.enterGameFromChallenge(this.obj.isVideo);
        }
        else {
            kit.Popup.show(CConst.popup_path_getLives, { type: FromState.fromMenu }, { mode: PopupCacheMode.Frequent, isSoon: true, });
        }
    }
}