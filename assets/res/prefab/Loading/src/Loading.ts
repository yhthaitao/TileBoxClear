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

    isStart: boolean = false;
    objTime = { count: 0, total: 0.02, };

    protected onLoad(): void {
        Common.log('页面 加载');
        this.initLabel();
        this.node.setContentSize(cc.winSize);

        this.isStart = false;
        this.nodeLogo.opacity = 0;
        this.nodeProcess.opacity = 0;
        this.spriteProcessBar.fillRange = 0;
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
            kit.Event.emit(CConst.event_complete_loading);
        }
    }

    /** 动画 loading 进入 */
    playAniEnter() {
        let tDelay = .55;
        let tMove = .383;
        let tOpa = .383;
        let heightMax = cc.winSize.height * 0.5;
        let y0 = heightMax + 100;
        let y2 = DataManager.getTitlePosY();
        let y1 = y2 - 50;
        this.nodeLogo.active = true;
        this.nodeLogo.y = y0;
        let tween = cc.tween;
        tween(this.nodeLogo).delay(tDelay)
            .parallel(
                tween().to(tMove, { y: y1 }, cc.easeSineOut()),
                tween().to(tOpa, { opacity: 255 })
            )
            .to(.4, { y: y2 }, cc.easeSineInOut())
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
