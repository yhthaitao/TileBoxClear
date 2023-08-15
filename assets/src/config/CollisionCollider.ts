// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CConst from "./CConst";
import { kit } from "../kit/kit";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollisionCollider extends cc.Component {

    /**
     * 当碰撞产生的时候调用
     * @param {Collider} other 产生碰撞的另一个碰撞组件 
     * @param {Collider} self  产生碰撞的自身的碰撞组件 
     */
    onCollisionEnter(other, self) {
        kit.Event.emit(CConst.event_collider_start, other, self);
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay(other, self) {}

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self) { }
}
