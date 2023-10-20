const { ccclass, property } = cc._decorator;

/** 弹窗基类 */
@ccclass
export default class PopupBase<Options = any> extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '背景遮罩（下层）' })
    public maskDown: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && '弹窗主体' })
    public content: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && '背景遮罩（上层）' })
    public maskUp: cc.Node = null;

    popupShowTime = {
        scale0: 0.15,
        scale1: 0.15,
        scale2: 0.15,
        opacity: 0.13,
    };

    /** 弹窗选项 */
    protected options: Options = null;

    protected onLoad(): void {
        this.node.active = false;
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
            cc.tween(this.maskDown).delay(0.2).to(0.233, { opacity: 0 }, { easing: 'sineInOut' }).start();
            // 播放弹窗主体动画
            cc.tween(this.content).parallel(
                cc.tween().delay(0.2).to(0.233, { opacity: 0 }, { easing: 'sineInOut' }),
                cc.tween().to(0.2, { scale: 1.1 }, { easing: 'sineInOut' })
                    .to(0.233, { scale: 0.5 }, { easing: 'sineInOut' })
                    .to(0.02, { scale: 0 }, { easing: 'sineInOut' }),
            ).call(() => {
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

    /**
     * 初始化（派生类请重写此函数以实现自定义逻辑）
     */
    protected showBefore(options: Options) { }

    /** 弹窗已完全展示（派生类请重写此函数以实现自定义逻辑）*/
    protected showAfter() { }

    /** 弹窗隐藏前（派生类请重写此函数以实现自定义逻辑）*/
    protected hideBefore() { }

    /**
     * 弹窗已完全关闭
     * @param suspended 
     */
    protected hideAfter(suspended: boolean) { }

    /**
     * 弹窗流程结束回调（注意：该回调为 PopupManager 专用，重写 hide 函数时记得调用该回调）
     */
    protected finishCallback: (suspended: boolean) => void = null;

    /**
     * 设置弹窗完成回调（该回调为 PopupManager 专用）
     * @param callback 回调
     */
    public setFinishCallback(callback: (suspended: boolean) => void) {
        this.finishCallback = callback;
    }

}
