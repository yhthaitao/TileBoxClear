import { TypeProp } from "./ConfigCommon";

/** 配置（关卡等级宝箱奖励） */
const ConfigBoxLevel = {
    1: { 
        total: 10, 
        reward: [ 
            { type: TypeProp.tStrengthInfinite, number: 10 * 60 } 
        ] 
    },
    2: { 
        total: 10, 
        reward: [ 
            { type: TypeProp.tMagnetInfinite, number: 15 * 60 } 
        ] 
    },
    3: { 
        total: 10, 
        reward: [ 
            { type: TypeProp.tStrengthInfinite, number: 20 * 60 } 
        ] 
    },
    4: { 
        total: 10, 
        reward: [ 
            { type: TypeProp.tClockInfinite, number: 20 * 60 } 
        ] 
    },
    5: { 
        total: 10, 
        reward: [ 
            { type: TypeProp.tMagnetInfinite, number: 25 * 60 } 
        ] 
    },
    6: { 
        total: 10, 
        reward: [ 
            { type: TypeProp.tStrengthInfinite, number: 25 * 60 } 
        ] 
    },
    7: { 
        total: 10, 
        reward: [ 
            { type: TypeProp.tClockInfinite, number: 25 * 60 } 
        ] 
    },
    8: { 
        total: 10, 
        reward: [ 
            { type: TypeProp.tMagnetInfinite, number: 25 * 60 } 
        ] 
    },
};
export default ConfigBoxLevel;
