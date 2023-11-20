import { PropType } from "./ConfigCommon";

/** 配置（星星宝箱奖励） */
const ConfigBoxXingxing = {
    1: {
        total: 20,
        reward: [
            { type: PropType.coin, number: 100 }, 
            { type: PropType.tStrengthInfinite, number: 30 * 60 }
        ]
    },
    2: {
        total: 20,
        reward: [
            { type: PropType.tip, number: 1 }, 
            { type: PropType.back, number: 1 },
            { type: PropType.coin, number: 30 }, 
        ]
    },
    3: {
        total: 20,
        reward: [
            { type: PropType.coin, number: 50 }, 
            { type: PropType.tStrengthInfinite, number: 15 * 60 }
        ]
    },
    4: {
        total: 20,
        reward: [
            { type: PropType.back, number: 1 }, 
            { type: PropType.refresh, number: 1 },
            { type: PropType.coin, number: 30 }, 
        ]
    },
    5: {
        total: 20,
        reward: [
            { type: PropType.back, number: 1 }, 
            { type: PropType.refresh, number: 1 },
            { type: PropType.coin, number: 20 }, 
        ]
    },
    6: {
        total: 20,
        reward: [
            { type: PropType.tip, number: 1 }, 
            { type: PropType.refresh, number: 1 },
            { type: PropType.coin, number: 30 }, 
        ]
    },
    7: {
        total: 20,
        reward: [
            { type: PropType.back, number: 1 }, 
            { type: PropType.ice, number: 1 },
            { type: PropType.coin, number: 30 }, 
        ]
    },
    8: {
        total: 20,
        reward: [
            { type: PropType.back, number: 1 }, 
            { type: PropType.ice, number: 1 },
            { type: PropType.coin, number: 30 }, 
        ]
    },
    9: {
        total: 20,
        reward: [
            { type: PropType.back, number: 1 }, 
            { type: PropType.tip, number: 1 },
            { type: PropType.coin, number: 20 }, 
        ]
    },
    10: {
        total: 20,
        reward: [
            { type: PropType.back, number: 1 }, 
            { type: PropType.refresh, number: 1 },
            { type: PropType.coin, number: 30 }, 
        ]
    },
};
export default ConfigBoxXingxing;

