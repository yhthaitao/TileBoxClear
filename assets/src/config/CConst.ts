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
    /** 进入 新手引导 */
    event_enter_newPlayer: 'event_enter_newPlayer',
    /** 进入 游戏 */
    event_enter_game: 'event_enter_game',
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
    /** 更新数据（碎片宝箱） */
    event_reset_suipian: 'event_reset_suipian',
    /** 更新数据（星星宝箱） */
    event_reset_xingxing: 'event_reset_xingxing',
    /** 更新数据（关卡等级宝箱） */
    event_reset_level: 'event_reset_level',
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
    
    popup_path_actPass: './Popup/ActPass/res/prefab/ActPass',
    popup_path_settingHome: './Popup/Setting/res/prefab/SettingHome',
    popup_path_settingGame: './Popup/Setting/res/prefab/SettingGame',
    popup_path_boxXingxing: './Popup/BoxXingxing/res/prefab/BoxXingxing',
    popup_path_daily: './Popup/Daily/res/prefab/Daily',
    popup_path_boxLevel: './Popup/BoxLevel/res/prefab/BoxLevel',
    popup_path_bank: './Popup/Bank/res/prefab/Bank',
    popup_path_before: './Popup/Before/res/prefab/Before',
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