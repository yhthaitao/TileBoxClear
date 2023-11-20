import { PropType } from "./ConfigCommon";

/** 配置（碎片宝箱奖励） */
const ConfigBoxSuipian = {
    1: { 
        total: 5, 
        reward: [ 
            { type: PropType.refresh, number: 2 } 
        ] 
    },
    2: { 
        total: 15, 
        reward: [ 
            { type: PropType.coin, number: 50 } 
        ] 
    },
    3: { 
        total: 15, 
        reward: [ 
            { type: PropType.back, number: 2 } 
        ] 
    },
    4: { 
        total: 25, 
        reward: [ 
            { type: PropType.coin, number: 80 } 
        ] 
    },
    5: {
        total: 20, 
        reward: [ 
            { type: PropType.tip, number: 2 } 
        ] 
    },
    6: { 
        total: 30, 
        reward: [ 
            { type: PropType.coin, number: 100 } 
        ] 
    },
    7: { 
        total: 25, 
        reward: [ 
            { type: PropType.magnet, number: 2 } 
        ] 
    },
    8: { 
        total: 25, 
        reward: [ 
            { type: PropType.clock, number: 2 } 
        ] 
    },
    9: { 
        total: 30, 
        reward: [ 
            { type: PropType.tStrengthInfinite, number: 30 * 60 } 
        ] 
    },
    10: { 
        total: 40, 
        reward: [ 
            { type: PropType.refresh, number: 5 } 
        ] 
    },
    11: { 
        total: 35, 
        reward: [ 
            { type: PropType.coin, number: 150 } 
        ] 
    },
    12: { 
        total: 35, 
        reward: [ 
            { type: PropType.tip, number: 3 } 
        ] 
    },
    13: { 
        total: 35, 
        reward: [ 
            { type: PropType.ice, number: 3 } 
        ] 
    },
    14: { 
        total: 40, 
        reward: [ 
            { type: PropType.tStrengthInfinite, number: 60 * 60 } 
        ] 
    },
    15: { 
        total: 35, 
        reward: [ 
            { type: PropType.magnet, number: 3 } 
        ] 
    },
    16: { 
        total: 35, 
        reward: [ 
            { type: PropType.coin, number: 200 } 
        ] 
    },
    17: { 
        total: 35, 
        reward: [ 
            { type: PropType.clock, number: 4 } 
        ] 
    },
    18: { 
        total: 45, 
        reward: [ 
            { type: PropType.tStrengthInfinite, number: 90 * 60 } 
        ] 
    },
    19: { 
        total: 50, 
        reward: [ 
            { type: PropType.tStrengthInfinite, number: 120 * 60 } 
        ] 
    },
    20: { 
        total: 55, 
        reward: [ 
            { type: PropType.coin, number: 1000 } 
        ] 
    },
};
export default ConfigBoxSuipian;