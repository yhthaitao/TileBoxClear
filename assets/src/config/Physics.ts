import { kit } from "../kit/kit";
import CConst from "./CConst";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Physics extends cc.Component {

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider): void {
        kit.Event.emit(CConst.event_collider_start, selfCollider, otherCollider);
    };

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, selfCollider, otherCollider): void {

    };

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(contact, selfCollider, otherCollider): void {

    };

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(contact, selfCollider, otherCollider): void {

    };
}