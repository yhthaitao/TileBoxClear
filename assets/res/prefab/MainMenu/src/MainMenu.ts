import { Design } from "../../../../src/config/DataManager";

/** 菜单类型 */
export enum StateMenu {
    shop = 0,// 冰冻
    menu = 1,// 提示
    theme = 2,// 返回上一步
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainMenu extends cc.Component {

    @property(cc.Node) mask: cc.Node = null;
    @property(cc.Node) content: cc.Node = null;

    // 顶部ui
    @property(cc.Node) uiTop: cc.Node = null;

    // 底部ui
    @property(cc.Node) uiBottom: cc.Node = null;
    @property(cc.Node) bottomLight: cc.Node = null;
    @property(cc.Node) bottomShop: cc.Node = null;
    @property(cc.Node) bottomHome: cc.Node = null;
    @property(cc.Node) bottomTheme: cc.Node = null;

    // 中间ui
    @property(cc.Node) uiMid: cc.Node = null;
    // 中间ui--商店
    @property(cc.Node) midShop: cc.Node = null;
    @property(cc.Node) midShopTop: cc.Node = null;
    @property(cc.Node) midShopMid: cc.Node = null;
    // 中间ui--主菜单
    @property(cc.Node) midHome: cc.Node = null;
    @property(cc.Node) midHomeBack: cc.Node = null;
    @property(cc.Node) midHomeTop: cc.Node = null;
    @property(cc.Node) midHomeBottom: cc.Node = null;
    @property(cc.Node) midHomeLeft: cc.Node = null;
    @property(cc.Node) midHomeRight: cc.Node = null;
    // 中间ui--主题
    @property(cc.Node) midTheme: cc.Node = null;
    @property(cc.Node) midThemeTop: cc.Node = null;
    @property(cc.Node) midThemeMidA: cc.Node = null;
    @property(cc.Node) midThemeMidC: cc.Node = null;

    stateMenu: StateMenu = StateMenu.menu;// 菜单类型
    // 菜单数据
    arrMidMenu: cc.Node[] = [];
    arrBottomMenu: cc.Node[] = [];
    // 是否锁屏
    isLock: boolean = false;
    // 菜单内节点属性变化
    mParams = {
        item: {
            down: { y: -10, scale: 1.0 },
            up: { y: 58, scale: 1.25 },
        },
        label: { y: -40, dis: 100, },
        baseTime: 1,
        baseDis: 1000,
        arrUIMidx: [cc.winSize.width, 0, -cc.winSize.width],
    };
    widthDown: number = 0;
    widthUp: number = 0;

    protected onLoad(): void {
        // 缩放数据
        let winScaleByH = cc.winSize.height / Design.height;
        // 顶部ui
        this.uiTop.y = cc.winSize.height * 0.5 - this.uiTop.height * 0.5;
        // 底部ui
        this.uiBottom.y = -cc.winSize.height * 0.5 + this.uiBottom.height * 0.5;
        // 中间ui-home
        this.midShop.x = -cc.winSize.width;
        this.midTheme.x = cc.winSize.width;
        let home_dis_topToTop = 20 * winScaleByH;
        let home_dis_topToLeft = 15 * winScaleByH;
        let home_dis_topToRight = 15 * winScaleByH;
        let home_dis_bottomToBottom = 100 * winScaleByH;
        this.midHome.x = 0;
        this.midHomeBack.y = cc.winSize.height * 0.5 - this.midHomeBack.height * 0.5;
        this.midHomeTop.y = this.uiTop.y - this.uiTop.height * 0.5 - home_dis_topToTop - this.midHomeTop.height * 0.5;
        this.midHomeLeft.y = this.midHomeTop.y - this.midHomeTop.height * 0.5 - home_dis_topToLeft;
        this.midHomeRight.y = this.midHomeTop.y - this.midHomeTop.height * 0.5 - home_dis_topToRight;
        this.midHomeBottom.y = this.uiBottom.y + this.uiBottom.height * 0.5 + home_dis_bottomToBottom + this.midHomeBottom.height * 0.5;
        // 中间ui-shop
        this.midShopTop.y = this.midHomeTop.y;
        this.midShopMid.y = 195 * winScaleByH;
        // 中间ui-theme
        this.midThemeTop.y = this.midHomeTop.y;
        this.midThemeMidA.y = this.midThemeTop.y - this.midThemeTop.height * 0.5;
        this.midThemeMidC.y = this.midThemeMidA.y;
        // 菜单数组
        this.arrMidMenu = [this.midShop, this.midHome, this.midTheme];
        this.arrBottomMenu = [this.bottomShop, this.bottomHome, this.bottomTheme];
        this.widthUp = this.bottomLight.width;
        this.widthDown = (cc.winSize.width - this.widthUp) * 0.5;
    }

    protected onEnable(): void {
        this.initMenu();
    }

    initMenu() {
        this.setIsLock(false);
        this.resetMenu(false);
        this.bottomLight.x = this.getMenuObj(this.stateMenu).x;
        let menuX = -cc.winSize.width * 0.5;
        for (let index = 0, length = this.arrBottomMenu.length; index < length; index++) {
            let menu = this.arrBottomMenu[index];
            let label = menu.getChildByName('label');
            let item = menu.getChildByName('item');
            // param
            if (index == this.stateMenu) {
                item.y = this.mParams.item.up.y;
                item.scale = this.mParams.item.up.scale;
                item.getChildByName('selectY').active = true;
                item.getChildByName('selectN').active = false;
                label.active = true;
                label.y = this.mParams.label.y;
            }
            else {
                item.y = this.mParams.item.down.y;
                item.scale = this.mParams.item.down.scale;
                item.getChildByName('selectY').active = false;
                item.getChildByName('selectN').active = true;
                label.active = false;
            }

            // x
            menu.width = index == this.stateMenu ? this.widthUp : this.widthDown;
            if (index == 0) {
                menuX += menu.width * 0.5;
                menu.x = menuX;
            }
            else {
                let menuLast = this.arrBottomMenu[index - 1];
                menuX += (menuLast.width * 0.5 + menu.width * 0.5);
                menu.x = menuX;
            }
        }
    };

    /** 重置菜单项 */
    resetMenu(isMove: boolean){
        if (isMove) {
            this.arrMidMenu.forEach((item)=>{ item.opacity = 255 });
        }
        else{
            this.arrMidMenu.forEach((item, index)=>{ 
                item.opacity = this.stateMenu == index ? 255 : 0 
            });
        }
    };

    /** 获取菜单x值 */
    getMenuObj(type: StateMenu) {
        let arrObj: { x: number, w: number }[] = [];
        let total = 0;
        for (let index = 0, length = this.arrBottomMenu.length; index < length; index++) {
            let width = index == this.stateMenu ? this.widthUp : this.widthDown;
            total += width;
            let x = total - width * 0.5 - cc.winSize.width * 0.5;
            arrObj.push({ x: x, w: width });

        }
        return arrObj[type];
    };

    /** 选择菜单 */
    playAniResetMenu(type: StateMenu) {
        // 显示所有菜单
        this.resetMenu(true);
        let start = this.stateMenu;
        let finish = type;
        let timeMove = 0.15 / Math.abs(start - finish);
        let funcMove = () => {
            if (this.stateMenu == type) {
                this.setIsLock(false);
                // 显示当前菜单
                this.resetMenu(false);
                return;
            }
            let cur = this.stateMenu;
            if (this.stateMenu > type) {
                this.stateMenu--;
            }
            else {
                this.stateMenu++;
            }
            let next = this.stateMenu;
            let count = 0;
            let total = 2;
            // 当前按钮
            let menuCur = this.arrBottomMenu[cur];
            let objCur = this.getMenuObj(cur);
            cc.tween(menuCur).parallel(
                cc.tween().to(timeMove, { x: objCur.x }),
                cc.tween().to(timeMove, { width: objCur.w }),
            ).call(() => {
                count++
                if (count > total - 1) {
                    funcMove();
                }
            }).start();
            // 当前按钮-复原
            if (cur == start) {
                this.bottomLight.getChildByName('select').active = false;
                let itemCur = menuCur.getChildByName('item');
                itemCur.getChildByName('selectY').active = false;
                itemCur.getChildByName('selectN').active = true;
                cc.tween(itemCur).parallel(
                    cc.tween().to(timeMove, { y: this.mParams.item.down.y }),
                    cc.tween().to(timeMove, { scale: this.mParams.item.down.scale }),
                ).start();
                // 隐藏文字
                let itemLabel = menuCur.getChildByName('label');
                itemLabel.y = this.mParams.label.y;
                itemLabel.active = false;
                cc.tween(itemLabel).to(timeMove * 0.5, { opacity: 0 }).start();
            }
            // 下个按钮
            let menuNext = this.arrBottomMenu[next];
            let objNext = this.getMenuObj(next);
            cc.tween(menuNext).parallel(
                cc.tween().to(timeMove, { x: objNext.x }),
                cc.tween().to(timeMove, { width: objNext.w }),
            ).call(() => {
                count++
                if (count > total - 1) {
                    funcMove();
                }
            }).start();
            // 下个按钮-抬起
            if (next == finish) {
                let itemNext = menuNext.getChildByName('item');
                itemNext.getChildByName('selectY').active = true;
                itemNext.getChildByName('selectN').active = false;
                cc.tween(itemNext).parallel(
                    cc.tween().to(timeMove, { y: this.mParams.item.up.y }),
                    cc.tween().to(timeMove, { scale: this.mParams.item.up.scale }),
                ).call(() => {
                    this.bottomLight.getChildByName('select').active = true;
                }).start();
                // 显示文字
                let itemLabel = menuNext.getChildByName('label');
                itemLabel.y = this.mParams.label.y;
                itemLabel.active = true;
                cc.tween(itemLabel).to(timeMove * 0.5, { opacity: 255 }).start();
            }
            // 亮色移动
            cc.tween(this.bottomLight).to(timeMove, { x: objNext.x }).start();

            // mid移动
            cc.tween(this.uiMid).to(timeMove, { x: this.mParams.arrUIMidx[next] }).start();
        };
        funcMove();
    };

    /** 设置锁定 */
    setIsLock(isLock) {
        this.isLock = isLock;
    };

    /** 菜单选项 */
    eventBtnChoseMenu(event: cc.Event.EventTouch, custom: string) {
        let type = Number(custom);
        if (type == this.stateMenu) {
            return;
        }
        if (this.isLock) {
            return;
        }
        this.setIsLock(true);

        this.playAniResetMenu(type);
    };
}
