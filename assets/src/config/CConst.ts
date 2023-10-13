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
    pathLevelData: './games/GameBox/res/level/',
    /*************************************** end **************************************************/


    /*****************************************************************************************/
    /*************************************** 层级 ****************************************/
    /*****************************************************************************************/
    zIndex_menu: 1,
    zIndex_game: 2,
    zIndex_gameWin: 997,
    zIndex_newPlayer: 998,
    zIndex_loading: 999,
    zIndex_mask: 1000,
    zIndex_video: 1001,
    zIndex_popup: 1002,
    zIndex_noVideo: 1003,
    /*************************************** end **************************************************/


    /*****************************************************************************************/
    /*************************************** 事件 ****************************************/
    /*****************************************************************************************/
    /** loading完成 */
    event_complete_loading: 'event_complete_loading',
    /** 进入 刷新语言 */
    event_refresh_language: 'event_reset_language',
    /** 进入 菜单 */
    event_enter_menu: 'event_enter_menu',
    /** 进入 菜单商店 */
    event_enter_menuShop: 'event_enter_menuShop',
    /** 进入 新手引导 */
    event_enter_newPlayer: 'event_enter_newPlayer',
    /** 进入 游戏 */
    event_enter_game: 'event_enter_game',
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
    /** 主页 刷新 */
    event_menu_updateTheme: 'event_menu_updateTheme',
    /** 加体力（花费金币） */
    event_addStrength_byCoin: 'event_addStrength_byCoin',
    /** 加体力（看视频） */
    event_addStrength_byWatch: 'event_addStrength_byWatch',
    /** 加体力（看视频） */
    event_addCoin_byWatch: 'event_addCoin_byWatch',
    /** game start */
    event_game_start: 'event_game_start',
    /** game pause */
    event_game_pause: 'event_game_pause',
    /** game resume */
    event_game_resume: 'event_game_resume',
    /** game revive */
    event_game_revive: 'event_game_revive',
    /** game restart */
    event_game_restart: 'event_game_restart',
    /** 进入 胜利 */
    event_enter_win: 'event_enter_win',
    /** 游戏胜利后 进入菜单 */
    event_win_enterMenu: 'event_win_enterMenu',
    /** 游戏失败后 继续 */
    event_fail_playOn: 'event_fail_playOn',
    /** 游戏失败后 放弃 */
    event_fail_giveUp: 'event_fail_giveUp',
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
    popup_path_openBoxLevel: './Popup/OpenBox/res/prefab/OpenBoxLevel',
    popup_path_openBoxSuipian: './Popup/OpenBox/res/prefab/OpenBoxSuipian',
    popup_path_openBoxXingxing: './Popup/OpenBox/res/prefab/OpenBoxXingxing',
    popup_path_daily: './Popup/Daily/res/prefab/Daily',
    popup_path_bank: './Popup/Bank/res/prefab/Bank',
    popup_path_before: './Popup/Before/res/prefab/Before',
    popup_path_getCoins: './Popup/GetCoins/res/prefab/GetCoins',
    popup_path_getLives: './Popup/GetLives/res/prefab/GetLives',
    popup_path_gameShop: './Popup/GameShop/res/prefab/GameShop',
    popup_path_gameWin: './Popup/GameWin/res/prefab/GameWin',
    popup_path_gameFail: './Popup/GameFail/res/prefab/GameFail',
    popup_path_user_evaluate: './Popup/UserEvaluate/res/prefab/UserEvaluate',
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