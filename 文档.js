/**
电脑: 
    123012

wifi: 
    账号：Clicksplay
    密码：Liuliang222

vpn：
    账号：yinlong@clicksplay.com
    密码：Liuliang222

谷歌邮箱：yht601231596@gmail.com(通用密码)

asIcon生成地址：
    https://icon.wuruihong.com/

命令行删除文件夹：rmdir /s 地址
as命令行：gradlew processDebugManifest -stacktrace

keystore: blockfish.keystore  blockTube_dress.keystore  boxclear.keystore
    keystore password: YY20200828
    key alias: blockfish.keystore
    key password: YY20200828

工程：
    BlockFishOld        blockfish.keystore
    BlockFishNew        blockfish.keystore
    BlockFishSudoku     BlockFishSudoku.jks
    BlockTubeBlack      blockfish.keystore
	BlockTubeDress      blockTube_dress.keystore
    TileBoxClear        boxclear.keystore

git: 
    sshkey: yht
	
图片压缩：
	npm i super-tinypng -g
	super-tinypng

打包：
    要点：bundle外的脚本，不能引用bandle内的脚本；

as控制台：
    adb安装apk: adb install -t ./app/release/BlockFish-release.apk
    gradlew BlockFish:dependencies --configuration releaseRuntimeClasspath：查看工程所有依赖

sourcetree：把key缓存到主机中
    1.进入 sourcetree的 putty（SourceTree\app-3.4.12\tools\putty） 目录
    2.执行 plink.exe git@github.com

加密解密流程：
    1.安装加密工具：https://x-studio.net/
    2.执行加密（对象为creator发布后的assets、src内的文件）：
        加密：
            x-studio -c -enc -cfg=E:\keystore\encrypt-cfg.xml -cp=.fnt;.ttf;.mp3;.ogg -i=assets -o=encrypt\assets
            x-studio -c -enc -cfg=E:\keystore\encrypt-cfg.xml -cp=.fnt;.ttf;.mp3;.ogg -i=src -o=encrypt\src
            
        -cfg=加密文件路径（第一次执行会自动创建）；
        -dc=不加密的文件类型 
        -i=加密文件原路径 
        -o=加密后文件输出路径

把加密后的EncryptedAssets 文件夹 替换掉 assets 文件夹内容（字体文件也被压缩了，注意先删掉压缩后的字体）

4、修改 build\jsb-default\frameworks\runtime-src\Classes目录的文件
EncryptManager.cpp 复制过去
EncryptManager.h 复制过去
cryptk文件夹 复制过去
AppDelegate.cpp 修改部分东西，并把keystore里面的 值复制进去

5、修改xxx\jsb-default\frameworks\runtime-src\proj.android-studio\jni\CocosAndroid.mk

直接比对BlockFish-APP

*/