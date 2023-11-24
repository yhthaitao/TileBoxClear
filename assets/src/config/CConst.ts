/** 常用变量 */
const CConst = {

    localDataKey: 'gameData',
    javaClassName: 'org/cocos2dx/javascript/AppActivity',

    /*****************************************************************************************/
    /*************************************** bundle ****************************************/
    /*****************************************************************************************/
    bundleCommon: 'common',
    pathLanguage: './language/text/',
    pathImage: './language/img/',
    pathThemeBg: './theme/bg/',
    pathThemeLock: './theme/lock/',
    pathThemeUnLock: './theme/unlock/',
    pathAchieve: './achieve/color/',
    pathGameBg: './game/bg/',
    pathGameGood: './game/good/',
    pathGameGold: './game/gold/',

    bundlePrefabs: 'prefabs',
    pathGameBox: './games/GameBox/res/prefab/GameBox',
    pathGameChallenge: './games/GameBox/res/prefab/GameChallenge',
    pathLevel: './games/GameBox/res/level/',
    pathGuideGame: 'components/UserGuide/res/prefab/GuideGame',
    pathGuideBefore: 'components/UserGuide/res/prefab/GuideBefore',
    pathGuideChallenge: 'components/UserGuide/res/prefab/GuideChallenge',
    /*************************************** end **************************************************/


    /*****************************************************************************************/
    /*************************************** 层级 ****************************************/
    /*****************************************************************************************/
    zIndex_menu: 1,
    zIndex_game: 2,
    zIndex_gameWin: 997,
    zIndex_loading: 999,
    zIndex_mask: 1000,
    zIndex_popup: 1002,
    zIndex_noVideo: 1003,
    zIndex_newPlayer: 1004,
    zIndex_video: 1005,
    /*************************************** end **************************************************/


    /*****************************************************************************************/
    /*************************************** 事件 ****************************************/
    /*****************************************************************************************/
    
    /** 进入 刷新语言 */
    event_refresh_language: 'event_refresh_language',

    /** 进入 菜单 */
    event_enter_loading: 'event_enter_loading',
    /** loading完成 */
    event_loading_complete: 'event_loading_complete',

    /** 进入 菜单 */
    event_enter_menu: 'event_enter_menu',
    /** 菜单 动画开始 */
    event_menu_start: 'event_menu_start',
    /** 进入 菜单商店 */
    event_enter_menuShop: 'event_enter_menuShop',
    /** 进入 游戏 */
    event_enter_game: 'event_enter_game',
    /** 进入 挑战 */
    event_enter_challenge: 'event_enter_challenge',
    /** game load */
    event_game_load: 'event_game_load',
    /** game reload */
    event_game_reload: 'event_game_reload',
    /** game start */
    event_game_start: 'event_game_start',
    /** game pause */
    event_game_pause: 'event_game_pause',
    /** game resume */
    event_game_resume: 'event_game_resume',
    /** game revive */
    event_game_revive: 'event_game_revive',
    /** 物品触摸 */
    event_touch_show: 'event_touch_show',
    event_touch_good: 'event_touch_good',
    /** 主页 刷新 */
    event_scale_strength: 'event_scale_strength',
    /** 主页 刷新 */
    event_scale_coin: 'event_scale_coin',
    /** 主页 刷新 */
    event_scale_prop: 'event_scale_prop',
    /** 主页 刷新 */
    event_scale_suipian: 'event_scale_suipian',
    /** 主页 刷新 */
    event_scale_xingxingBox: 'event_scale_xingxingBox',
    /** 主页 刷新 */
    event_menu_updateSuipianReward: 'event_menu_updateSuipianReward',
    /** 刷新bg */
    event_refresh_areas: 'event_refresh_areas',
    /** 刷新顶部ui */
    event_refresh_top: 'event_refresh_top',
    /** 刷新体力 */
    event_refresh_strength: 'event_refresh_strength',
    /** 刷新金币 */
    event_refresh_coin: 'event_refresh_coin',
    /** 刷新道具 */
    event_refresh_prop: 'event_refresh_prop',
    /** 刷新红色point */
    event_refresh_point: 'event_refresh_point',
    /** 刷新红色shop */
    event_refresh_shop: 'event_refresh_shop',
    /** 进入 新手引导 */
    event_guide_game: 'event_guide_game',
    event_guide_before: 'event_guide_before',
    event_guide_challenge: 'event_guide_challenge',
    /** 刷新 引导 点击 */
    event_guide_3: 'event_guide_3',
    event_guide_5: 'event_guide_5',
    event_guide_7: 'event_guide_7',
    event_guide_9: 'event_guide_9',
    event_guide_12: 'event_guide_12',
    event_guide_15: 'event_guide_15',
    
    /** 提示 */
    event_notice: 'event_notices',
    /** 购买成功 */
    event_buy_succe: 'event_buy_succe',
    /** 购买失败 */
    event_buy_fail: 'event_buy_fail',
    /*************************************** end **************************************************/


    /*****************************************************************************************/
    /*************************************** 打点 ****************************************/
    /*****************************************************************************************/
    /** 打点：点击分享 */
    event_log_share_click: 'share_level_click',
    /** 打点：点击看广告奖励金币 */
    event_log_adAddCoin_click: 'Ads_addCoin_click',
    /** 打点：点击转盘 */
    event_log_wheel_click: 'wheel_click',
    /*************************************** end **************************************************/


    /*****************************************************************************************/
    /*************************************** 弹窗地址 ****************************************/
    /*****************************************************************************************/
    popup_path_achieve: './Popup/Achieve/res/prefab/Achieve',
    popup_path_actPass: './Popup/ActPass/res/prefab/ActPass',
    popup_path_settingHome: './Popup/Setting/res/prefab/SettingHome',
    popup_path_settingGame: './Popup/Setting/res/prefab/SettingGame',
    popup_path_boxSuipian: './Popup/BoxSuipian/res/prefab/BoxSuipian',
    popup_path_boxXingxing: './Popup/BoxXingxing/res/prefab/BoxXingxing',
    popup_path_boxLevel: './Popup/BoxLevel/res/prefab/BoxLevel',
    popup_path_boxGood: './Popup/BoxGood/res/prefab/BoxGood',
    popup_path_openBoxAreas: './Popup/OpenBox/res/prefab/OpenBoxAreas',
    popup_path_openBoxLevel: './Popup/OpenBox/res/prefab/OpenBoxLevel',
    popup_path_openBoxShop: './Popup/OpenBox/res/prefab/OpenBoxShop',
    popup_path_openBoxSuipian: './Popup/OpenBox/res/prefab/OpenBoxSuipian',
    popup_path_openBoxXingxing: './Popup/OpenBox/res/prefab/OpenBoxXingxing',
    popup_path_challenge: './Popup/Challenge/res/prefab/Challenge',
    popup_path_bank: './Popup/Bank/res/prefab/Bank',
    popup_path_before: './Popup/Before/res/prefab/Before',
    popup_path_getCoins: './Popup/GetCoins/res/prefab/GetCoins',
    popup_path_getLives: './Popup/GetLives/res/prefab/GetLives',
    popup_path_getProps: './Popup/GetProps/res/prefab/GetProps',
    popup_path_gameShop: './Popup/GameShop/res/prefab/GameShop',
    popup_path_gameWin: './Popup/GameWin/res/prefab/GameWin',
    popup_path_gameFail: './Popup/GameFail/res/prefab/GameFail',
    popup_path_evaluate: './Popup/Evaluate/res/prefab/Evaluate',
    /*************************************** end **************************************************/


    /*****************************************************************************************/
    /*************************************** 音频资源地址 ****************************************/
    /*****************************************************************************************/
    /** 音效：按键 */
    sound_music: './audio/music',
    sound_actPass: './audio/enterGame',
    sound_clickUI: './audio/clickUI',
    sound_clickGood: './audio/clickGood',
    sound_getProp: './audio/getProp',
    sound_removeGood: './audio/removeGood',
    sound_win: './audio/win',
    sound_winXing: './audio/winXing',
    /*************************************** end **************************************************/


    /*****************************************************************************************/
    /*************************************** 新手引导 ****************************************/
    /*****************************************************************************************/
    /** sort游戏 引导 1 */
    newPlayer_guide_sort_1: 'newPlayer_guide_sort_1',
    /** sort游戏 引导 2 */
    newPlayer_guide_sort_2: 'newPlayer_guide_sort_2',
    /** sort游戏 引导 3 */
    newPlayer_guide_sort_3: 'newPlayer_guide_sort_3',
    /*************************************** end **************************************************/
};
export default CConst;