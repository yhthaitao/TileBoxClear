import { TypeProp } from "./ConfigCommon";

/** 配置（星星宝箱奖励） */
const ConfigBoxXingxing = {
    1: {
        total: 20,
        reward: [
            { type: TypeProp.coin, number: 100 }, 
            { type: TypeProp.tStrengthInfinite, number: 30 * 60 }
        ]
    },
    2: {
        total: 20,
        reward: [
            { type: TypeProp.tip, number: 1 }, 
            { type: TypeProp.back, number: 1 },
            { type: TypeProp.coin, number: 30 }, 
        ]
    },
    3: {
        total: 20,
        reward: [
            { type: TypeProp.coin, number: 50 }, 
            { type: TypeProp.strength, number: 5 }
        ]
    },
    4: {
        total: 20,
        reward: [
            { type: TypeProp.back, number: 1 }, 
            { type: TypeProp.refresh, number: 1 },
            { type: TypeProp.coin, number: 30 }, 
        ]
    },
    5: {
        total: 20,
        reward: [
            { type: TypeProp.back, number: 1 }, 
            { type: TypeProp.refresh, number: 1 },
            { type: TypeProp.coin, number: 20 }, 
        ]
    },
    6: {
        total: 20,
        reward: [
            { type: TypeProp.tip, number: 1 }, 
            { type: TypeProp.refresh, number: 1 },
            { type: TypeProp.coin, number: 30 }, 
        ]
    },
    7: {
        total: 20,
        reward: [
            { type: TypeProp.back, number: 1 }, 
            { type: TypeProp.ice, number: 1 },
            { type: TypeProp.coin, number: 30 }, 
        ]
    },
    8: {
        total: 20,
        reward: [
            { type: TypeProp.back, number: 1 }, 
            { type: TypeProp.ice, number: 1 },
            { type: TypeProp.coin, number: 30 }, 
        ]
    },
    9: {
        total: 20,
        reward: [
            { type: TypeProp.back, number: 1 }, 
            { type: TypeProp.tip, number: 1 },
            { type: TypeProp.coin, number: 20 }, 
        ]
    },
    10: {
        total: 20,
        reward: [
            { type: TypeProp.back, number: 1 }, 
            { type: TypeProp.refresh, number: 1 },
            { type: TypeProp.coin, number: 30 }, 
        ]
    },
};
export default ConfigBoxXingxing;

