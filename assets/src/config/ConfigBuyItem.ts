import { TypeProp } from "./DataManager";

/** 配置（购买物品） */
const ConfigBuyItem = {
    1: {
        name: 'package1', money: '4.99', isLimit: true, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 750, },
            { typeProp: TypeProp.refresh, count: 5, },
            { typeProp: TypeProp.back, count: 3, },
            { typeProp: TypeProp.tip, count: 1, },
            { typeProp: TypeProp.ice, count: 1, },
            { typeProp: TypeProp.magnet, count: 1, },
            { typeProp: TypeProp.clock, count: 1, },
            { typeProp: TypeProp.tStrengthInfinite, count: 1, }
        ]
    },
    2: {
        name: 'package2', money: '8.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 750, },
            { typeProp: TypeProp.refresh, count: 5, },
            { typeProp: TypeProp.back, count: 3, },
            { typeProp: TypeProp.tip, count: 1, },
            { typeProp: TypeProp.ice, count: 1, },
            { typeProp: TypeProp.magnet, count: 1, },
            { typeProp: TypeProp.clock, count: 1, },
            { typeProp: TypeProp.tStrengthInfinite, count: 1, }
        ]
    },
    3: {
        name: 'package3', money: '17.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 1950, },
            { typeProp: TypeProp.refresh, count: 7, },
            { typeProp: TypeProp.back, count: 5, },
            { typeProp: TypeProp.tip, count: 3, },
            { typeProp: TypeProp.ice, count: 3, },
            { typeProp: TypeProp.magnet, count: 3, },
            { typeProp: TypeProp.clock, count: 3, },
            { typeProp: TypeProp.tStrengthInfinite, count: 3, }
        ]
    },
    4: {
        name: 'package4', money: '39.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 4950, },
            { typeProp: TypeProp.refresh, count: 11, },
            { typeProp: TypeProp.back, count: 9, },
            { typeProp: TypeProp.tip, count: 7, },
            { typeProp: TypeProp.ice, count: 7, },
            { typeProp: TypeProp.magnet, count: 7, },
            { typeProp: TypeProp.clock, count: 7, },
            { typeProp: TypeProp.tStrengthInfinite, count: 7, }
        ]
    },
    5: {
        name: 'package5', money: '69.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 9950, },
            { typeProp: TypeProp.refresh, count: 15, },
            { typeProp: TypeProp.back, count: 13, },
            { typeProp: TypeProp.tip, count: 11, },
            { typeProp: TypeProp.ice, count: 11, },
            { typeProp: TypeProp.magnet, count: 11, },
            { typeProp: TypeProp.clock, count: 11, },
            { typeProp: TypeProp.tStrengthInfinite, count: 11, }
        ]
    },
    6: {
        name: 'package6', money: '99.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 17500, },
            { typeProp: TypeProp.refresh, count: 19, },
            { typeProp: TypeProp.back, count: 17, },
            { typeProp: TypeProp.tip, count: 15, },
            { typeProp: TypeProp.ice, count: 5, },
            { typeProp: TypeProp.magnet, count: 15, },
            { typeProp: TypeProp.clock, count: 15, },
            { typeProp: TypeProp.tStrengthInfinite, count: 15, }
        ]
    },
    7: { name: 'noads', money: '5.99', isLimit: true },
    8: {
        name: 'gold1', money: '1.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 200, },
        ]
    },
    9: {
        name: 'gold2', money: '7.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 950, },
        ]
    },
    10: {
        name: 'gold3', money: '13.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 2000, },
        ]
    },
    11: {
        name: 'gold4', money: '29.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 5000, },
        ]
    },
    12: {
        name: 'gold5', money: '54.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 10000, },
        ]
    },
    13: {
        name: 'gold6', money: '99.99', isLimit: false, 
        arrProps: [
            { typeProp: TypeProp.coin, count: 20000, },
        ]
    },
};
export default ConfigBuyItem;
