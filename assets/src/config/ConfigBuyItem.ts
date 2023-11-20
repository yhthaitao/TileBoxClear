import { PropType } from "./ConfigCommon";

/** 道具类型 */
export enum BuyKey {
    package1 = 1,
    package2 = 2,
    package3 = 3,
    package4 = 4,
    package5 = 5,
    package6 = 6,
    noads = 7,
    gold1 = 8,
    gold2 = 9,
    gold3 = 10,
    gold4 = 11,
    gold5 = 12,
    gold6 = 13,
}

/** 购买类型 */
export interface BuyCfg {
    name: string;
    money: string;
    isLimit: boolean;
    props: [{ typeProp: PropType, count: number}];
}

/** 配置（购买物品） */
const ConfigBuyItem = {
    1: {
        name: 'package1', money: '$4.99', isLimit: true, 
        props: [
            { typeProp: PropType.coin, count: 750, },
            { typeProp: PropType.ice, count: 1, },
            { typeProp: PropType.refresh, count: 5, },
            { typeProp: PropType.back, count: 3, },
            { typeProp: PropType.tStrengthInfinite, count: 1, },
            { typeProp: PropType.tip, count: 1, },
            { typeProp: PropType.clock, count: 1, },
            { typeProp: PropType.magnet, count: 1, },
        ]
    },
    2: {
        name: 'package2', money: '$8.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 750, },
            { typeProp: PropType.ice, count: 1, },
            { typeProp: PropType.refresh, count: 5, },
            { typeProp: PropType.back, count: 3, },
            { typeProp: PropType.tStrengthInfinite, count: 1, },
            { typeProp: PropType.tip, count: 1, },
            { typeProp: PropType.clock, count: 1, },
            { typeProp: PropType.magnet, count: 1, },
        ]
    },
    3: {
        name: 'package3', money: '$17.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 1950, },
            { typeProp: PropType.ice, count: 3, },
            { typeProp: PropType.refresh, count: 7, },
            { typeProp: PropType.back, count: 5, },
            { typeProp: PropType.tStrengthInfinite, count: 3, },
            { typeProp: PropType.tip, count: 3, },
            { typeProp: PropType.clock, count: 3, },
            { typeProp: PropType.magnet, count: 3, },
        ]
    },
    4: {
        name: 'package4', money: '$39.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 4950, },
            { typeProp: PropType.ice, count: 7, },
            { typeProp: PropType.refresh, count: 11, },
            { typeProp: PropType.back, count: 9, },
            { typeProp: PropType.tStrengthInfinite, count: 7, },
            { typeProp: PropType.tip, count: 7, },
            { typeProp: PropType.clock, count: 7, },
            { typeProp: PropType.magnet, count: 7, },
        ]
    },
    5: {
        name: 'package5', money: '$69.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 9950, },
            { typeProp: PropType.ice, count: 11, },
            { typeProp: PropType.refresh, count: 15, },
            { typeProp: PropType.back, count: 13, },
            { typeProp: PropType.tStrengthInfinite, count: 11, },
            { typeProp: PropType.tip, count: 11, },
            { typeProp: PropType.clock, count: 11, },
            { typeProp: PropType.magnet, count: 11, },
        ]
    },
    6: {
        name: 'package6', money: '$99.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 17500, },
            { typeProp: PropType.ice, count: 5, },
            { typeProp: PropType.refresh, count: 19, },
            { typeProp: PropType.back, count: 17, },
            { typeProp: PropType.tStrengthInfinite, count: 15, },
            { typeProp: PropType.tip, count: 15, },
            { typeProp: PropType.clock, count: 15, },
            { typeProp: PropType.magnet, count: 15, },
        ]
    },
    7: { name: 'noads', money: '$5.99', isLimit: true },
    8: {
        name: 'gold1', money: '$1.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 200, },
        ]
    },
    9: {
        name: 'gold2', money: '$7.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 950, },
        ]
    },
    10: {
        name: 'gold3', money: '$13.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 2000, },
        ]
    },
    11: {
        name: 'gold4', money: '$29.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 5000, },
        ]
    },
    12: {
        name: 'gold5', money: '$54.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 10000, },
        ]
    },
    13: {
        name: 'gold6', money: '$99.99', isLimit: false, 
        props: [
            { typeProp: PropType.coin, count: 20000, },
        ]
    },
};
export default ConfigBuyItem;
