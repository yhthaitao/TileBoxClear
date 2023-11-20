/** 游戏打点 */
const ConfigDot = {
    /*****************************************************************************************/
    /*************************************** 打点 ****************************************/
    /*****************************************************************************************/
    /** 资源加载 */
    dot_resource_load_success: '100_Resource_load_success',// 游戏加载完成（参数：0）
    /** 新手 */
    dot_guide_adventure_01: '101_Guide_adventure_01',// 新手引导 01（参数：0）
    dot_guide_adventure_02: '102_Guide_adventure_02',// 新手引导 02（参数：0）
    dot_guide_adventure_03: '103_Guide_adventure_03',// 新手引导 03（参数：0）
    dot_guide_adventure_04: '104_Guide_adventure_04',// 新手引导 04（参数：0）
    dot_guide_adventure_05: '105_Guide_adventure_05',// 新手引导 05（参数：0）
    dot_guide_adventure_06: '106_Guide_adventure_06',// 新手引导 06（参数：0）
    dot_guide_adventure_07: '107_Guide_adventure_07',// 新手引导 07（参数：0）
    dot_guide_adventure_08: '108_Guide_adventure_08',// 新手引导 08（参数：0）
    dot_guide_adventure_09: '109_Guide_adventure_09',// 新手引导 09（参数：0）
    dot_guide_adventure_10: '110_Guide_adventure_10',// 新手引导 10（参数：0）
    dot_guide_adventure_11: '111_Guide_adventure_11',// 新手引导 11（参数：0）
    /** 视频相关（有奖励的，先检测视频；其他情况只检测插屏） */
    dot_ads_request_all: '118_Ads_direct_request',// 视频+插屏 请求（参数：0）
    dot_ads_request_video: '120_Ads_All_direct_request',// 视频 请求（参数：0）
    dot_ads_request_advert: '123_Ads_Interstitial_direct_request',// 插屏 请求（参数：0）
    // dot_ads_debug_all_impression: '119_Debug_all_ad_impression',// java端使用
    // dot_ads_all_direct_play_finished: '122_Ads_All_direct_play_finished',// java端使用
    // dot_ads_debug_Interstitial_show: '125_Debug_Interstitial_show',// java端使用
    dot_ads_advert_succe_back: 'Ads_beckground_Interstitial_succ',// 返回游戏的插屏播放
    dot_ads_advert_succe_home: 'Ads_Interstitial_home_Succeed',// 返回首页的插屏(quit,close,continue)
    dot_ads_advert_succe_next: 'Ads_Interstitial_nextlevel_Succeed', // 下关开始的插屏
    dot_ads_advert_succe_rePlay: 'Ads_Interstitial_restart_Succeed',// 重新开始的插屏（play)，可能没意义
    dot_ads_advert_succe_noVideo: 'Ads_Interstitial_videoNull_Succeed',// 没有视频的插屏
    dot_ads_advert_succe_challenge_win: 'Ads_Interstitial_dailyChallenge_Succeed',// 每日挑战胜利的插屏播放成功
    dot_ads_advert_succe_challenge_home: 'Ads_Interstitial_dailyChallenge_home_Succeed',// 每日挑战返回首页的插屏播放成功
    dot_ads_advert_succe_challenge_replay: 'Ads_Interstitial_dailyChallenge_restart_Succeed',// 每日挑战重新开始的插屏播放成功

    dot_ads_video_succe_challenge: 'Ads_video_dailyChallenge_succ',// 每日挑战开始的视频播放成功
    dot_ads_video_getGold_show: 'Ads_video_getGold_show',// 加金币弹窗弹出
    dot_ads_video_getGold_succe: 'Ads_video_getGold_succ',// 加金币，视频播放成功
    dot_ads_video_getLife_show: 'Ads_video_getLife_show',// 加体力弹窗弹出
    dot_ads_video_getLife_succe: 'Ads_video_getLife_succ',// 加体力，视频播放成功
    /** 广告相关 */
    dot_ad_revenue_track_flag_20: '227_Ad_revenue_track_flag', // 广告计数 20
    dot_ad_revenue_track_flag_30: '228_Ad_revenue_track_flag_30', // 广告计数 30
    dot_ad_revenue_track_flag_40: '229_Ad_revenue_track_flag_40', // 广告计数 40
    dot_ad_revenue_track_flag_50: '230_Ad_revenue_track_flag_50', // 广告计数 50
    dot_ad_revenue_track_flag_70: '232_Ad_revenue_track_flag_70', // 广告计数 70
    dot_ad_done: 'AdDone',// android端使用
    dot_ad_req: 'AdReq',// 广告请求（参数：3）
    /** 关卡开始 总点 */
    dot_levelStart: 'Stage_start_all',
    dot_levelStart_one: 'levelStart',
    /** 关卡通过 总点 */
    dot_levelPass: 'levelPass',
    /** 关卡通过 */
    dot_pass_level_1: '161_pass_level_1',
    dot_pass_level_2: '162_pass_level_2',
    dot_pass_level_3: '163_pass_level_3',
    dot_pass_level_4: '164_pass_level_4',
    dot_pass_level_5: '165_pass_level_5',
    dot_pass_level_6: '166_pass_level_6',
    dot_pass_level_7: '167_pass_level_7',
    dot_pass_level_8: '168_pass_level_8',
    dot_pass_level_9: '169_pass_level_9',
    dot_pass_level_10: '170_pass_level_10',
    dot_pass_level_15: '175_pass_level_15',
    dot_pass_level_20: '180_pass_level_20',
    dot_pass_level_all: '205_Stage_pass_all',
    /** 挑战 */
    dot_challenge_start: 'dailyChallenge_start', // 挑战开始
    dot_challenge_fail: 'dailyChallenge_failure', // 挑战失败
    dot_challenge_win: 'dailyChallenge_end', // 挑战胜利
    /** gameover */
    dot_gameover_outOfMove: 'Gameover_outOfMove',
    dot_gameover_outOFTime: 'Gameover_outOFTime',
    dot_gameover_restart: 'Gameover_restart',
    /** 用金币购买道具 */
    dot_buy_succ_ice: 'buy_freeze_succ',
    dot_buy_succ_tip: 'buy_tips_succ',
    dot_buy_succ_back: 'buy_return_succ',
    dot_buy_succ_refresh: 'buy_refresh_succ',
    dot_buy_succ_magnet: 'buy_magnet_succ',
    dot_buy_succ_clock: 'buy_stopWatch_succ',
    dot_buy_succ_fuhuo_noTime: 'buy_fuhuo_addTime_succ',
    dot_buy_succ_fuhuo_noSpace: 'buy_fuhuo_ReturnGoods_succ',
    /** 用钱购买道具 */
    dot_store_show: 'Store_show',// 打开商店
    dot_package_005: 'Package_4.99',
    dot_package_009: 'Package_8.99',
    dot_package_018: 'Package_17.99',
    dot_package_040: 'Package_39.99',
    dot_package_070: 'Package_69.99',
    dot_package_100: 'Package_99.99',
    dot_buy_succ_noads: 'noads_buySucc',
    dot_buy_succ_coin_0199: 'coin199_buySucc',
    dot_buy_succ_coin_0799: 'coin799_buySucc',
    dot_buy_succ_coin_1399: 'coin1399_buySucc',
    dot_buy_succ_coin_2999: 'coin2999_buySucc',
    dot_buy_succ_coin_5499: 'coin5499_buySucc',
    dot_buy_succ_coin_9999: 'coin9999_buySucc',

    /** 暂无 */
    dot_buy_succ_bank: 'bank_buySucc',
    dot_consume_25per: 'consume_25per',
    dot_consume_50per: 'consume_50per',
    dot_consume_75per: 'consume_75per',
    dot_passlv_25per: 'passlv_25per',
    dot_passlv_50per: 'passlv_50per',
    dot_passlv_75per: 'passlv_75per',
    dot_showLanguage: 'showLanguage',
    undefinedData: 'undefinedData',
    dot_cloudCover: 'cloudCover',
    dot_cloudDataShow: 'cloudDataShow',
    dot_ad_25per: 'ad_25per',
    dot_ad_50per: 'ad_50per',
    dot_ad_75per: 'ad_75per',
    dot_applovin_cpe: 'applovin_cpe',// 过完35关、看广告次数达到50次打点，只记一次；
    dot_applovin_cpe_20: 'applovin_cpe_20',
    dot_applovin_cpe_30: 'applovin_cpe_30',
    dot_applovin_cpe_40: 'applovin_cpe_40',
    dot_ad_revenue_020: 'ad_revenue_20',
    dot_ad_revenue_030: 'ad_revenue_30',
    dot_ad_revenue_040: 'ad_revenue_40',
    dot_ad_revenue_050: 'ad_revenue_50',
    dot_ad_revenue_060: 'ad_revenue_60',
    dot_ad_revenue_070: 'ad_revenue_70',
    dot_ad_revenue_100: 'ad_revenue_100',
    dot_ad_revenue_iap: 'iap_revenue',
    dot_OnApplicationResume: 'OnApplicationResume',//
    /*************************************** end **************************************************/
};
export default ConfigDot;












