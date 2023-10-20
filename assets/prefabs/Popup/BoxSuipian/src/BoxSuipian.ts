import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import { LangChars } from "../../../../src/config/ConfigLang";
import ConfigBoxSuipian from "../../../../src/config/ConfigBoxSuipian";
import { TypeProp, TypeReward } from "../../../../src/config/ConfigCommon";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BoxSuipian<Options = any> extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) nodeTime: cc.Node = null;
    @property(cc.Node) nodeProcess: cc.Node = null;
    @property(cc.Node) nodeListContent: cc.Node = null;
    @property(cc.Node) nodeListCell: cc.Node = null;
    @property([cc.SpriteFrame]) spriteFrames: cc.SpriteFrame[] = [];

    types = [
        TypeProp.coin,
        TypeProp.ice, TypeProp.tip, TypeProp.back, TypeProp.refresh, TypeProp.magnet, TypeProp.clock,
        TypeProp.tStrengthInfinite,
    ];

    protected showBefore(options: any): void {
        Common.log('弹窗 等级宝箱页面 showBefore()');

        DataManager.setString(LangChars.goldCollection, (chars: string) => {
            let itemLabel = this.nodeTime.getChildByName('label');
            itemLabel.getComponent(cc.Label).string = chars;
        });

        this.setProcess();
        this.setTime();
        this.setRewardList();
    }

    public show(options?: Options) {
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
                cc.tween().to(0.233, { scale: 1.05 }, { easing: 'cubicOut' })
                    .to(0.233, { scale: 0.98 }, { easing: 'sineInOut' })
                    .to(0.233, { scale: 1 }, { easing: 'sineInOut' }),
                cc.tween().to(0.215, { opacity: 255 }),
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

    /** 刷新-碎片进度 */
    setProcess() {
        let boxData = DataManager.data.boxSuipian;
        let boxReward = DataManager.getRewardBoxSuipian();
        // 进度条
        let count = boxData.count;
        let total = boxReward.total;
        let processBar = this.nodeProcess.getChildByName('bar');
        processBar.getComponent(cc.Sprite).fillStart = 0;
        processBar.getComponent(cc.Sprite).fillRange = count / total;
        let processLabel = this.nodeProcess.getChildByName('label');
        processLabel.getComponent(cc.Label).string = count + '/' + total;
    };

    /** 刷新-碎片-时间 */
    setTime() {
        this.updateSuipianTime();
        this.schedule(this.updateSuipianTime, 1.0);
    };

    /** 时间-更新 */
    async updateSuipianTime() {
        let tElseSuipian = Common.getTimeDayFinish() - Math.floor(new Date().getTime() / 1000);
        let h = Math.floor(tElseSuipian / 3600);
        let mElse = tElseSuipian % 3600;
        let m = Math.floor(mElse / 60);
        let s = Math.floor(mElse % 60);
        // 文本
        let valueH = await DataManager.getString(LangChars.hour);
        let valueM = await DataManager.getString(LangChars.minite);
        let valueS = await DataManager.getString(LangChars.second);
        let itemLabel = this.nodeTime.getChildByName('label');
        itemLabel.getComponent(cc.Label).string = h + valueH + ':' + m + valueM + ':' + s + valueS;
        if (tElseSuipian < 0) {
            this.unschedule(this.updateSuipianTime);
            this.setTime();
        }
    };

    setRewardList() {
        let length = Object.keys(ConfigBoxSuipian).length;
        // 主题容器高度
        let layout = this.nodeListContent.getComponent(cc.Layout);
        let hElse = layout.paddingBottom + layout.spacingY * (length - 1) + layout.paddingTop;
        this.nodeListContent.height = this.nodeListCell.height * length + hElse;
        // 配置内容 奖励等级从1开始
        for (let index = 1; index <= length; index++) {
            let name = 'cell' + index;
            let cell = this.nodeListContent.getChildByName(name);
            if (!cell) {
                cell = cc.instantiate(this.nodeListCell);
                cell.name = name;
                cell.parent = this.nodeListContent;
            }
            this.setRewardCell(index, cell);
        }
    };

    /**
     * 
     * @param rewardlevel 
     * @param cell 
     */
    setRewardCell(rewardlevel: number, cell: cc.Node) {
        cell.active = true;
        let boxData = DataManager.data.boxSuipian;
        let objReward = this.getRewardBoxSuipian(rewardlevel);
        // 标题
        let nodeTitle = cell.getChildByName('nodeTitle');
        let titleUnlock = nodeTitle.getChildByName('unlock');
        let titleLock = nodeTitle.getChildByName('lock');
        let titleChose = nodeTitle.getChildByName('chose');
        titleUnlock.active = false;
        titleLock.active = false;
        titleChose.active = false;
        // 奖励
        let nodeReward = cell.getChildByName('nodeReward');
        let rewardParticle = nodeReward.getChildByName('particle');
        let rewardUnlock = nodeReward.getChildByName('backUnlock');
        let rewardLock = nodeReward.getChildByName('backLock');
        let rewardSignlock = nodeReward.getChildByName('signLock');
        let rewardProp = nodeReward.getChildByName('nodeProp');
        rewardParticle.active = false;
        rewardUnlock.active = false;
        rewardLock.active = false;
        rewardSignlock.active = false;
        rewardProp.active = true;
        // 解锁
        if (boxData.level > rewardlevel) {
            titleUnlock.active = true;
            rewardUnlock.active = true;
        }
        // 锁定 选中
        else if (boxData.level == rewardlevel) {
            titleChose.active = true;
            rewardParticle.active = true;
            rewardSignlock.active = true;
            rewardLock.active = true;
        }
        // 锁定 未选中
        else {
            titleLock.active = true;
            rewardSignlock.active = true;
            rewardLock.active = true;
        }
        let titleLabel = nodeTitle.getChildByName('label');
        titleLabel.getComponent(cc.Label).string = '' + rewardlevel;

        let raward = objReward.reward[0];
        let spriteframeId = this.types.indexOf(raward.type);
        let rewardPropIcon = rewardProp.getChildByName('icon');
        rewardPropIcon.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[spriteframeId];
        if (raward.type == TypeProp.magnet) {
            rewardPropIcon.position = cc.v3(10, 2);
            rewardPropIcon.scale = 0.75;
        }
        else if (raward.type == TypeProp.clock) {
            rewardPropIcon.position = cc.v3(-10, 2);
            rewardPropIcon.scale = 0.75;
        }
        else {
            rewardPropIcon.position = cc.v3();
            rewardPropIcon.scale = 1.0;
        }
        let str = '' + raward.number;
        if (raward.type == TypeProp.tStrengthInfinite) {
            str = '' + Math.floor(raward.number / 60) + 'm';
        }
        let rewardPropLabel = rewardProp.getChildByName('label');
        rewardPropLabel.getComponent(cc.Label).string = str;
    };

    /**
     * 获取奖励参数（碎片宝箱）
     * @param rewardLevel 奖励等级
     * @returns 
     */
    public getRewardBoxSuipian(rewardLevel): TypeReward {
        let index = rewardLevel;
        if (index < 1) {
            index = 1;
        }
        else {
            let max = Number(Object.keys(ConfigBoxSuipian).pop());
            if (index > max) {
                index = max;
            }
        }
        let config: TypeReward = ConfigBoxSuipian[index];
        return config;
    }

    protected hideAfter(suspended: boolean): void {
        this.unschedule(this.updateSuipianTime);
    }

    eventScrollview(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
        if (eventType == cc.ScrollView.EventType.SCROLLING) {
            this.nodeListContent.children.forEach((item) => {
                let itemY = Common.getLocalPos(item.parent, item.position, this.node).y;
                let topY = itemY + item.height * 0.5;
                let bottomY = itemY - item.height * 0.5;
                // 选项底部 超出 屏幕顶
                if (bottomY > cc.winSize.height * 0.5) {
                    item.opacity = 0;
                }
                // 选项顶部 超出 屏幕底
                else if (topY < -cc.winSize.height * 0.5) {
                    item.opacity = 0;
                }
                else {
                    item.opacity = 255;
                }
            });
        }
    };

    eventBtnSure() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }

    eventBtnExit() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
    }
}
