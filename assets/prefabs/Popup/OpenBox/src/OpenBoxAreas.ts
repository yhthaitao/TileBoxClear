import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import DataManager from "../../../../src/config/DataManager";
import Common from "../../../../src/config/Common";
import CConst from "../../../../src/config/CConst";
import { LangChars } from "../../../../src/config/ConfigLang";

const { ccclass, property } = cc._decorator;
@ccclass
export default class OpenBoxAreas<Options = any> extends PopupBase {

    @property(cc.Node) nodeAreas: cc.Node = null;
    @property(cc.Node) nodeParticle: cc.Node = null;
    @property(cc.Node) itemLabelTitle: cc.Node = null;
    @property(cc.Node) itemLabelPlay: cc.Node = null;
    @property(cc.Node) btnContinue: cc.Node = null;

    protected showBefore(options: any): void {
        Common.log('弹窗 主题解锁页面 showBefore()');
        this.initLabel();
        this.initUI();
    }

    initLabel(){
        DataManager.setString(LangChars['areas_' + DataManager.data.boxAreas.new], (chars: string) => {
            if (chars) {
                let Label = this.nodeAreas.getChildByName('label');
                Label.getComponent(cc.Label).string = chars;
            }
        });

        DataManager.setString(LangChars.AreasUnlocked, (chars: string) => {
            this.itemLabelTitle.getComponent(cc.Label).string = chars;
        });
        DataManager.setString(LangChars.CONTINUE, (chars: string) => {
            this.itemLabelPlay.getComponent(cc.Label).string = chars;
        });
    }

    initUI(){
        this.content.active = false;
        this.nodeParticle.active = false;
        this.btnContinue.active = false;

        let pathIcon = CConst.pathThemeUnLock + DataManager.data.boxAreas.new;
        kit.Resources.loadRes(CConst.bundleCommon, pathIcon, cc.SpriteFrame, (err: any, assets: cc.SpriteFrame) => {
            if (err) {
                Common.log(' 资源加载异常 icon: ', pathIcon);
                return;
            }
            let icon = this.nodeAreas.getChildByName('icon');
            icon.getComponent(cc.Sprite).spriteFrame = assets;
        });
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
            await new Promise((_res) => {
                this.content.active = true;
                this.content.scale = 0.5;
                this.content.opacity = 0;
                cc.tween(this.content).parallel(
                    cc.tween().to(this.popupShowTime.scale0, { scale: 1.05 }, { easing: 'cubicOut' })
                        .to(this.popupShowTime.scale1, { scale: 0.98 }, { easing: 'sineInOut' })
                        .to(this.popupShowTime.scale2, { scale: 1 }, { easing: 'sineInOut' }),
                    cc.tween().to(this.popupShowTime.opacity, { opacity: 255 }),
                ).call(() => {
                    // 粒子出现
                    this.nodeParticle.active = true;
                    let left = this.nodeParticle.getChildByName('left');
                    left.getComponent(cc.ParticleSystem).resetSystem();
                    let right = this.nodeParticle.getChildByName('right');
                    right.getComponent(cc.ParticleSystem).resetSystem();
                }).delay(0.75).call(_res).start();
            });
            // 按钮出现
            this.btnContinue.active = true;
            this.btnContinue.scale = 0.5;
            this.btnContinue.opacity = 0;
            cc.tween(this.btnContinue).parallel(
                cc.tween().to(0.233, { scale: 1 }),
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

    async eventBtnContinue() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        await kit.Popup.hide();

        let boxAreas = DataManager.data.boxAreas;
        boxAreas.cur = boxAreas.new;
        DataManager.setData();
        kit.Event.emit(CConst.event_refresh_areas);
    }
}
