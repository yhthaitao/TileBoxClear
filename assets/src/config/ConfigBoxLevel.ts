import { PropType } from "./ConfigCommon";

/** 配置（关卡等级宝箱奖励） */
const ConfigBoxLevel = {
    1: { 
        total: 10, 
        reward: [ 
            { type: PropType.refresh, number: 1 },
            { type: PropType.ice, number: 1 },
            { type: PropType.coin, number: 30 }
        ] 
    },
    2: { 
        total: 10, 
        reward: [ 
            { type: PropType.tMagnetInfinite, number: 15 * 60 } 
        ] 
    },
    3: { 
        total: 10, 
        reward: [ 
            { type: PropType.tip, number: 1 },
            { type: PropType.tClockInfinite, number: 15 * 60 },
            { type: PropType.coin, number: 30 }
        ] 
    },
    4: { 
        total: 10, 
        reward: [ 
            { type: PropType.tStrengthInfinite, number: 30 * 60 },
            { type: PropType.back, number: 1 },
            { type: PropType.coin, number: 30 }
        ] 
    },
    5: { 
        total: 10, 
        reward: [ 
            { type: PropType.tip, number: 1 },
            { type: PropType.back, number: 1 },
            { type: PropType.coin, number: 30 }
        ] 
    },
    6: {
        total: 10, 
        reward: [ 
            { type: PropType.tip, number: 1 },
            { type: PropType.ice, number: 1 },
            { type: PropType.coin, number: 20 }
        ] 
    },
    7: { 
        total: 10, 
        reward: [ 
            { type: PropType.back, number: 1 },
            { type: PropType.refresh, number: 1 },
            { type: PropType.coin, number: 20 }
        ] 
    },
    8: { 
        total: 10, 
        reward: [ 
            { type: PropType.tip, number: 1 },
            { type: PropType.refresh, number: 1 },
            { type: PropType.coin, number: 20 }
        ] 
    },
    9: { 
        total: 10, 
        reward: [ 
            { type: PropType.refresh, number: 1 },
            { type: PropType.ice, number: 1 },
            { type: PropType.coin, number: 20 }
        ] 
    },
    10: { 
        total: 10, 
        reward: [ 
            { type: PropType.tip, number: 1 },
            { type: PropType.ice, number: 1 },
            { type: PropType.coin, number: 20 }
        ] 
    },
    11: { 
        total: 10, 
        reward: [ 
            { type: PropType.tip, number: 1 },
            { type: PropType.refresh, number: 1 },
            { type: PropType.coin, number: 20 }
        ] 
    },
    12: { 
        total: 10, 
        reward: [ 
            { type: PropType.tip, number: 1 },
            { type: PropType.ice, number: 1 },
            { type: PropType.coin, number: 20 }
        ] 
    },
};
export default ConfigBoxLevel;
