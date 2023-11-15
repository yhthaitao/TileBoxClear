import { kit } from "../../../../src/kit/kit";
import PopupBase from "../../../../src/kit/manager/popupManager/PopupBase";
import CConst from "../../../../src/config/CConst";
import Common from "../../../../src/config/Common";
import DataManager from "../../../../src/config/DataManager";
import { ChallengeParam, ChallengeState } from "../../../../src/config/ConfigCommon";
import { LangChars } from "../../../../src/config/ConfigLang";
import GameManager from "../../../../src/config/GameManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Challenge extends PopupBase {

    @property(cc.Node) nodeTitle: cc.Node = null;
    @property(cc.Node) btnPlay: cc.Node = null;
    @property(cc.Node) btnLeft: cc.Node = null;
    @property(cc.Node) btnRight: cc.Node = null;
    @property(cc.Node) nodeMain: cc.Node = null;
    @property(cc.Node) itemDay: cc.Node = null;
    @property(cc.Material) materialNormal: cc.Material = null;
    @property(cc.Material) materialGray: cc.Material = null;

    obj = {
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
    };

    protected showBefore(options: any): void {
        Common.log('弹窗 银行页面 showBefore()');
        let date = new Date();
        this.obj.year.init = date.getFullYear();
        this.obj.year.cur = this.obj.year.init;
        this.obj.month.init = date.getMonth();
        this.obj.month.cur = this.obj.month.init;
        this.obj.dayTotal.init = DataManager.getDayTotalFromDate(date);
        this.refreshUI();
    }

    /** 刷新ui */
    refreshUI(){
        let year = this.obj.year.cur;
        let month = this.obj.month.cur;
        let dayTotal = this.obj.dayTotal;
        let objMonth = DataManager.getChallengeData(year, month, dayTotal.init);
        this.obj.dayTotal.cur = DataManager.getDayTotalCur(objMonth);
        this.refreshTitle(year, month);
        this.refreshPlay(this.obj.dayTotal);
        this.refreshMonth(this.obj.dayTotal, objMonth);
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
            let date = new Date();
            date.setTime(dayTotal.cur * 86400 * 1000);
            let charsPlay = await DataManager.getString(LangChars.gameBefore_play);
            let charsMonth = await DataManager.getString(Common.getLangCharsKeyMonth(date.getMonth()));
            let stringBtn = charsPlay + ' ' + charsMonth + ' ' + DataManager.getDayMonth(date);
            itemPlay.getComponent(cc.Label).string = stringBtn;
            itemBack.getComponent(cc.Sprite).setMaterial(0, this.materialNormal);
            itemSign.active = dayTotal.cur != dayTotal.init;
            this.btnPlay.getComponent(cc.Button).interactable = true;
        }
        else{
            itemPlay.getComponent(cc.Label).string = 'Can Not Play!';
            itemBack.getComponent(cc.Sprite).setMaterial(0, this.materialGray);
            itemSign.active = false;
            this.btnPlay.getComponent(cc.Button).interactable = false;
        }
    }

    /** 刷新左右按钮 */
    refreshLeftAndRight(){
        let monthCur = this.obj.year.cur * 12 + this.obj.month.cur;
        let monthInit = this.obj.year.init * 12 + this.obj.month.init;
        this.btnRight.active = monthCur < monthInit;
    }

    /** 初始化月份 */
    refreshMonth(dayTotal: { cur: number, init: number }, objMonth: any) {
        // 删除挑战节点
        this.clearChallengeItem();
        let row = 0;
        let col = 0;
        let yDis = (this.obj.side.yMax - this.obj.side.yMin) / (DataManager.getWeekMax(objMonth) - 1);
        let days = Object.keys(objMonth);
        days.sort((a, b) => { return Number(a) - Number(b); });
        for (let index = 0, length = days.length; index < length; index++) {
            let key: string = days[index];
            let value: ChallengeParam = objMonth[key];
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
            switch (value.state) {
                case ChallengeState.before:
                    if (value.dayTotal == dayTotal.cur) {
                        current.active = true;
                        itemLabel.color = this.obj.color.notCurrent;
                    }
                    else{
                        itemLabel.color = this.obj.color.notBefore;
                    }
                    break;
                case ChallengeState.chose:
                    current.active = true;
                    itemLabel.color = this.obj.color.notCurrent;
                    break;
                case ChallengeState.after:
                    itemLabel.color = this.obj.color.notAfter;
                    break;
                case ChallengeState.already:
                    already.active = true;
                    itemLabel.color = this.obj.color.already;
                    break;
                default:
                    break;
            }
            itemDay.x = this.obj.side.xMin + col * this.obj.side.xDis;
            itemDay.y = this.obj.side.yMax - row * yDis;
            itemDay.parent = this.nodeMain;
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
        let monthCur = this.obj.year.cur * 12 + this.obj.month.cur;
        let monthInit = this.obj.year.init * 12 + this.obj.month.init;
        if (monthCur >= monthInit) {
            return;
        }
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

    eventBtnPlay() {
        kit.Audio.playEffect(CConst.sound_clickUI);
        kit.Popup.hide();
        GameManager.enterGameFromMenu(DataManager.data.challengeData.level);
    }
}