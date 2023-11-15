/** 设计分辨率 */
export const Design = {
    width: 720,
    height: 1560,
}

/** 购买磁铁需要的金币 */
export const coinsBuyClock = 180;
/** 购买时钟需要的金币 */
export const coinsBuyMagnet = 180;
/** 弹窗显示动画时间 */
export const popupShowTime = {
    scale0: 0.15,
    scale1: 0.15,
    scale2: 0.15,
    opacity: 0.13,
};

/** 游戏状态 */
export enum StateGame {
    loading = 1,// 冰冻
    menu = 1 << 1,// 提示
    game = 1 << 2,// 返回上一步
}

/** 资源类型 */
export enum TypeRes {
    PNG = "png",// 图片
    DRAGON = "dragon", // 龙骨
};

/** 道具状态（游戏开始前的弹窗） */
export enum StateBeforeProp {
    lock = 1,// 未解锁
    noProp = 1 << 1,// 解锁 无道具
    unChoose = 1 << 2,// 解锁 有道具 未选中
    choose = 1 << 3,// 解锁 有道具 选中
    infinite = 1 << 4,// 道具无限
};

/** 游戏结束枚举状态 */
export enum TypeFinish {
    win = 1,
    failSpace = 1 << 1,
    failTime = 1 << 2,
}

/** 弹窗枚举(游戏前弹窗类型) */
export enum TypeBefore {
    fromMenu = 1,
    fromWin = 1 << 1,
    fromFail = 1 << 2,
    fromSetting = 1 << 3,
}

/** 挑战状态 */
export enum ChallengeState {
    before = 'before',// 未挑战-前
    chose = 'chose',// 未挑战-选中
    after = 'after',// 未挑战-后
    already = 'already',// 已挑战
}

/** 挑战数据 */
export interface ChallengeParam {
    dayWeek: number, // 日期
    dayTotal: number, // 当前天数（总）
    state: ChallengeState,// 挑战状态
}

/** box参数 */
export interface BoxParam {
    index: number;
    name: string;
    x: number;
    y: number;
    w: number;
    h: number;
    goods: any;
    isMove: boolean;
    isFrame: boolean;
    boxType: number;
}

/** good参数 */
export interface GoodParam {
    index: number;
    name: string;
    nameRes: string;
    x: number;
    y: number;
    w: number;
    h: number;
    keyGood: number;
    isMove: boolean;
    isEnough: boolean;
    gold: { isGold: boolean, count: number, total: number },
    box: { name: string, key: number, x: number, y: number },
}

/** 关卡参数 */
export interface LevelParam {
    difficulty?: number,// 难度（对应不同的过渡动画）
    isGolden?: boolean,// 是否有金币
    levelTime?: number,// 关卡时间
    layer?: number,// 关卡显示层级
    objW?: { left: number, right: number },// 左右宽度
    map: any[],// 箱子数据
    item: any[],// 物品数据
}

/** 参数枚举（游戏胜利） */
export interface ParamsWin {
    tCount: number;
    disBoxGood: number;
    disBoxLevel: number;
    disBoxSuipian: number;
    disBoxXingxing: number;
    objCoin: {
        position: {x: number, y: number};
        scale: number;
    }
}

/** 参数枚举（游戏失败） */
export interface ParamsFail {
    type: TypeFinish;
    numStrength: number;
    numSuipian: number;
    numMagnet: number;
}

/** 道具类型 */
export enum TypeProp {
    ice = 1,// 冰冻
    tip = 1 << 1,// 提示
    back = 1 << 2,// 返回上一步
    refresh = 1 << 3,// 刷新
    magnet = 1 << 4,// 磁铁
    clock = 1 << 5,// 时钟
    coin = 1 << 6,// 金币
    strength = 1 << 7,// 体力
    tStrengthInfinite = 1 << 8,// 无限时间-体力
    tMagnetInfinite = 1 << 9,// 无限时间-磁铁
    tClockInfinite = 1 << 10,// 无限时间-时钟
}

/** 数据类型（碎片宝箱奖励） */
export interface TypeReward {
    total: number, // 碎片数量
    reward: { type: TypeProp, number: number }[],// 奖励的类型和数量
}

/** 数据类型（资源） */
export interface TypeResource {
    bundle: string,
    resPath: string,
}