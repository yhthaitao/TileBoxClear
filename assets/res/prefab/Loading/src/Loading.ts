import { kit } from "../../../../src/kit/kit";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { LangChars } from "../../../../src/config/ConfigLang";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Loading extends cc.Component {

    @property(cc.Node) nodeLogo: cc.Node = null;
    @property(cc.Node) nodeProcess: cc.Node = null;
    @property(cc.Sprite) spriteProcessBar: cc.Sprite = null;
    @property(cc.Label) labelLoading: cc.Label = null;
    @property(cc.Node) itemIcon: cc.Node = null;
    @property([cc.SpriteFrame]) roleFrames: cc.SpriteFrame[] = [];

    isStart: boolean = false;
    objTime = { count: 0, total: 0.015, };

    protected onLoad(): void {
        Common.log('页面 加载');
        this.initLabel();
        this.node.setContentSize(cc.winSize);

        this.isStart = false;
        this.nodeLogo.opacity = 0;
        this.nodeLogo.y = cc.winSize.height * 0.5 + 100;
        
        this.nodeProcess.opacity = 0;
        this.nodeProcess.y = -cc.winSize.height * 0.5 * 0.8;

        this.spriteProcessBar.fillRange = 0;
        // 随机头像
        let roleId = Math.floor(Math.random()*2);
        this.itemIcon.getComponent(cc.Sprite).spriteFrame = this.roleFrames[roleId];
    }

    initLabel() {
        DataManager.setString(LangChars.loading, (chars: string) => {
            this.nodeProcess.getChildByName('label').getComponent(cc.Label).string = chars;
        });
    }

    protected start(): void {
        this.playAniEnter();
    }

    protected update(dt: number): void {
        if (!this.isStart) {
            return;
        }
        this.objTime.count += dt;
        if (this.objTime.count < this.objTime.total) {
            return;
        }
        this.objTime.count = 0;
        // 刷新
        this.spriteProcessBar.fillRange += 0.01;
        DataManager.setString(LangChars.loading, (chars: string) => {
            this.labelLoading.string = chars + '  ' + Math.floor(this.spriteProcessBar.fillRange * 100) + '%';
        });
        if (this.spriteProcessBar.fillRange >= 1) {
            this.isStart = false;
            kit.Event.emit(CConst.event_loading_complete);
        }
    }

    /** 动画 loading 进入 */
    playAniEnter() {
        let tDelay = 0.55;
        let tMove1 = 0.383;
        let tMove2 = 0.320;
        let tOpa = 0.383;

        let y1 = cc.winSize.height * 0.5 * 0.30;
        let y2 = cc.winSize.height * 0.5 * 0.35;
        this.nodeLogo.active = true;
        let tween = cc.tween;
        tween(this.nodeLogo).delay(tDelay)
            .parallel(
                tween().to(tMove1, { y: y1 }, cc.easeSineOut()),
                tween().to(tOpa, { opacity: 255 })
            )
            .to(tMove2, { y: y2 }, cc.easeSineInOut())
            .start();

        this.nodeProcess.active = true;
        tween(this.nodeProcess).delay(tDelay)
            .to(tOpa, { opacity: 255 }).call(() => {
                this.isStart = true;
                this.spriteProcessBar.fillRange = 0;
            })
            .start();
    }

    /** 动画 loading 离开 */
    playAniLeave(callback: Function) {
        cc.tween(this.nodeProcess).delay(0.75).to(0.25, { opacity: 0 }).call(() => {
            callback && callback();
        }).start();
    }
}
