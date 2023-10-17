/** 设计分辨率 */
export const Design = {
    width: 720,
    height: 1560,
}

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
    fromSettingGame = 1 << 1,
    fromGameWin = 1 << 2,
    fromGameFail = 1 << 3,
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
    tStrengthInfinite = 1 << 7,// 无限时间-体力
    tMagnetInfinite = 1 << 8,// 无限时间-磁铁
    tClockInfinite = 1 << 9,// 无限时间-时钟
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