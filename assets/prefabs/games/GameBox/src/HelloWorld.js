cc.Class({
    extends: cc.Component,

    properties: {
        mapNode: cc.Node,
        goodsNode: cc.Node,
        col1RowsNum: cc.EditBox,
        col2RowsNum: cc.EditBox,
        col3RowsNum: cc.EditBox,
        colsNum: cc.EditBox,
        col1boxId: cc.EditBox,
        col2boxId: cc.EditBox,
        col3boxId: cc.EditBox,
        grid1Pre: cc.Prefab,
        grid2Pre: cc.Prefab,
        grid3Pre: cc.Prefab,
        grid4Pre: cc.Prefab,
        grid5Pre: cc.Prefab,
        grid6Pre: cc.Prefab,
        grid7Pre: cc.Prefab,
        grid8Pre: cc.Prefab,
        editLoadMap: cc.EditBox,
        editX: cc.EditBox,
        editY: cc.EditBox,
        editW: cc.EditBox,
        editH: cc.EditBox,
        editNum: cc.EditBox,
        editItX: cc.EditBox,
        editItY: cc.EditBox,
        editItPic: cc.EditBox,
        goods1:cc.Node,
        goods2:cc.Node,
        goods3:cc.Node,
        goods4:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        this.goodsConf = [
            {
                "id": 1001,
                "name": "hua_fen_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1002,
                "name": "hua_zi_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1003,
                "name": "hua_lan_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1004,
                "name": "mai_zi_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1005,
                "name": "mai_lv_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1006,
                "name": "mai_lan_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1007,
                "name": "shengDanShouTao_hong_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1008,
                "name": "shengDanShu_lv_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1009,
                "name": "shengDanLazhu_huang_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1010,
                "name": "huaBan_huang_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1011,
                "name": "niuNai_lan_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 1012,
                "name": "shouDian_hong_61_181",
                "series": 1,
                "h": 181,
                "w": 61,
                "t": 1,
                "isGolden": 0
            },
            {
                "id": 2001,
                "name": "gou_huang_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2002,
                "name": "gou_fen_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2003,
                "name": "gou_lan_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2004,
                "name": "mao_hui_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2005,
                "name": "xiongMao_heibai_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2006,
                "name": "xueRen_bai_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2007,
                "name": "yaZi_huang_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2008,
                "name": "diQiuYi_lan_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2009,
                "name": "jingZi_lan_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2010,
                "name": "deng_lan_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2011,
                "name": "jiuPing_lan_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 2012,
                "name": "huoJian_lan_86_181",
                "series": 1,
                "h": 181,
                "w": 86,
                "t": 2,
                "isGolden": 0
            },
            {
                "id": 3001,
                "name": "shouTiBao_huang_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3002,
                "name": "shengDanWa_hong_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3003,
                "name": "gaoGenXie_hong_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3004,
                "name": "zhongBiao_zong_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3005,
                "name": "xianRenZhang_lv_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3006,
                "name": "ganLanQiu_hei_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3007,
                "name": "erJi_bai_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3008,
                "name": "fanBuXie_fen_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3009,
                "name": "fanBuXie_lan_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 3010,
                "name": "fanBuXie_qianlan_116_181",
                "series": 1,
                "h": 181,
                "w": 116,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4001,
                "name": "daBeiBao_huang_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4002,
                "name": "huaPen_huang_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4003,
                "name": "xiaoMao_huang_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4004,
                "name": "xiaoMao_fen_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4005,
                "name": "xiaoMao_lan_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4006,
                "name": "shuBao_lan_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4007,
                "name": "zuQiu_heibai_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4008,
                "name": "xingLiXiang_fen_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4009,
                "name": "baZi_hong_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            },
            {
                "id": 4010,
                "name": "maoWanJu_bai_134_181",
                "series": 1,
                "h": 181,
                "w": 134,
                "t": 3,
                "isGolden": 0
            }
        ];
        this.goodsPics = {};
        for(let i = 0; i < this.goodsConf.length; i++){
            this.goodsPics[this.goodsConf[i].id] = this.goodsConf[i];
        }
        // cc.log(this.goodsPics);
        this.selBoxName = "";
        this.selItemName = "";
        this.levelInfo = {};
        this.opList = [];
        this.opItemList = [];

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.find('Canvas').on('selNode', function (name) {
            cc.log("===selNode===", name);
            if(name.indexOf("box_") == 0){
                self.selBoxName = name;
                let node = self.mapNode.getChildByName(name);
                self.editX.string = node.x;
                self.editY.string = node.y;
                self.editW.string = node.width;
                self.editH.string = node.height;
                if(node.height < 100){
                    self.editNum.string = cc.find("lb", node).getComponent("cc.Label").string;
                }else{
                    self.editNum.string = "";
                }
            }
            if(name.indexOf("it_") == 0){
                self.selItemName = name;
                let itNode = self.mapNode.getChildByName(name);
                // cc.log("==selItem===", itNode.p);
                self.editItX.string = itNode.x;
                self.editItY.string = itNode.y;
                self.editItPic.string = cc.find("lb", itNode).getComponent("cc.Label").string;
            }

            for(let i = 0; i < self.mapNode.childrenCount; i++){
                let node = self.mapNode.children[i];
                if(node.name != name){
                    node.color=new cc.Color(255,255,255);
                    node.opacity = 255;
                }
            }
        });
    },

    onKeyUp (event) {
        // cc.log("=====onKeyboardStart=====", event.keyCode);
        if(event.keyCode == 46){
            this.removeItem();
        }
    },

    onKeyDown (event) {
        // cc.log("=====onKeyUpEnd=====", event.keyCode);
        // switch (event.keyCode) {
        //     case cc.macro.KEY.s:
        //         break;
        //     case cc.macro.KEY.space:
        //         break;
        // }
    },

    genMap(){
        // cc.log(parseInt(this.col1RowsNum.string), typeof(parseInt(this.col1RowsNum.string)));
        this.mapNode.removeAllChildren();
        // cc.log(this.rowsNum.string, this.colsNum.string, this.boxId.string);
        // if(this.rowsNum.string == "" || this.colsNum.string == "" || this.boxId.string == ""){
        if(this.col1RowsNum.string == "" && this.col2RowsNum.string == "" && this.col3RowsNum.string == ""){
            this.showWarn("行或box编号缺失");
            return;
        }
        if((this.col1RowsNum.string != "" && this.col1boxId.string == "") || (this.col2RowsNum.string != "" && this.col2boxId.string == "") || (this.col2RowsNum.string != "" && this.col2boxId.string == "")){
            this.showWarn("行或box编号缺失");
            return;
        }

        let boxHeight = 10;
        let box1Width = 10;
        let box2Width = 10;
        let gridPre = null;
        let boxes = [];

        for (let i = 0; i < this.col1RowsNum.string; i++) {
            gridPre = this.create_box(this.col1boxId.string);
            gridPre.name = "box_col1_" + i;
            boxHeight = gridPre.height;
            box1Width = gridPre.width;
            // gridPre.x = -360 + gridPre.width/2;
            if(this.col2boxId.string == "" && this.col3boxId.string == ""){
                gridPre.x = 0;
            }
            if(this.col2boxId.string != "" && this.col3boxId.string == ""){
                let gridPre2 = this.create_box(this.col2boxId.string);
                // gridPre.x = - (gridPre.width)/2 - 25;
                // let offset = (720 - (gridPre.width + gridPre2.width + 50))/2;
                let offset = (720 - (gridPre.width + gridPre2.width))/2;
                gridPre.x = -360 + offset + gridPre.width/2;
            }
            if(this.col2boxId.string != "" && this.col3boxId.string != ""){
                let gridPre2 = this.create_box(this.col2boxId.string);
                let gridPre3 = this.create_box(this.col3boxId.string);
                // let offset = (720 - (gridPre3.width + gridPre2.width + gridPre.width + 20))/2;
                let offset = (720 - (gridPre3.width + gridPre2.width + gridPre.width))/2;
                gridPre.x = -360 + offset + gridPre.width/2;
            }

            // gridPre.y = gridPre.height / 2 + (gridPre.height - 10) * i;
            gridPre.y = gridPre.height / 2 + gridPre.height * i;
            this.mapNode.addChild(gridPre);
            boxes.push({"x":gridPre.x, "y":gridPre.y, "t":parseInt(this.col1boxId.string), "w":gridPre.width})
        }
        let tmpHeight1 = this.col1RowsNum.string * boxHeight;

        for (let i = 0; i < this.col2RowsNum.string; i++) {
            gridPre = this.create_box(this.col2boxId.string);
            gridPre.name = "box_col2_" + i;
            boxHeight = gridPre.height;
            box2Width = gridPre.width;
            if(this.col3boxId.string == ""){
                let gridPre1 = this.create_box(this.col1boxId.string);
                // let offset = (720 - (gridPre.width + gridPre1.width + 50))/2;
                let offset = (720 - (gridPre.width + gridPre1.width))/2;
                gridPre.x = 360 - offset - gridPre.width/2;
            }else{
                let gridPre1 = this.create_box(this.col1boxId.string);
                let gridPre3 = this.create_box(this.col3boxId.string);
                // let offset = (720 - (gridPre3.width + gridPre1.width + gridPre.width + 20))/2;
                let offset = (720 - (gridPre3.width + gridPre1.width + gridPre.width))/2;
                // gridPre.x = - 360 + offset + gridPre1.width + 10 + gridPre.width/2;
                gridPre.x = - 360 + offset + gridPre1.width + gridPre.width/2;
            }

            // gridPre.y = gridPre.height / 2 + (gridPre.height - 10) * i;
            gridPre.y = gridPre.height / 2 + gridPre.height * i;
            this.mapNode.addChild(gridPre);
            boxes.push({"x":gridPre.x, "y":gridPre.y, "t":parseInt(this.col2boxId.string), "w":gridPre.width})
        }
        let tmpHeight2 = this.col2RowsNum.string * boxHeight;
        if(tmpHeight1 < tmpHeight2){
            tmpHeight1 = tmpHeight2;
        }

        for (let i = 0; i < this.col3RowsNum.string; i++) {
            gridPre = this.create_box(this.col3boxId.string);
            gridPre.name = "box_col3_" + i;
            boxHeight = gridPre.height;
            box3Width = gridPre.width;
            let gridPre1 = this.create_box(this.col1boxId.string);
            let gridPre2 = this.create_box(this.col2boxId.string);
            // let offset = (720 - (gridPre2.width + gridPre1.width + gridPre.width + 20))/2;
            let offset = (720 - (gridPre2.width + gridPre1.width + gridPre.width))/2;
            gridPre.x = 360 - offset - gridPre.width/2;
            // gridPre.x = gridPre.width/2;
            // gridPre.y = gridPre.height / 2 + (gridPre.height - 10) * i;
            gridPre.y = gridPre.height / 2 + gridPre.height * i;
            this.mapNode.addChild(gridPre);
            boxes.push({"x":gridPre.x, "y":gridPre.y, "t":parseInt(this.col3boxId.string), "w":gridPre.width})
        }
        let tmpHeight3 = this.col3RowsNum.string * boxHeight;
        if(tmpHeight1 < tmpHeight3){
            tmpHeight1 = tmpHeight3;
        }

        this.mapNode.height = tmpHeight1;

        return;
        // cc.log(boxes);
    },

    addGoods(){
        for(let i = this.mapNode.childrenCount - 1; i >= 0; i--){
            let child_node = this.mapNode.children[i];
            // cc.log("====child_node=====", child_node.name);
            // if(child_node.name == "1" || child_node.name == "2" || child_node.name == "3" || child_node.name == "4"){
            if(child_node.name.indexOf("it_") == 0){
                this.mapNode.removeChild(child_node);
            }
        }
        let good_list = [];
        let map = [];
        for(let i = 0; i < this.mapNode.childrenCount; i++){
            let node = this.mapNode.children[i];
            if(node.name.indexOf("box_col") == 0) {
                map.push({"x": node.x, "y": node.y, "w": node.width, "h": node.height});
                if (node.height > 150) {
                    if (node.width == 154) {
                        for(let j = 0; j < 2; j++){
                            let good1 = cc.instantiate(this.goods1);
                            good1.x = node.x + good1.width/2 * (2 * j - 1);
                            good1.y = node.y;
                            good1.p = i;
                            good1.name = "it_"+good1.x+"_"+good1.y
                            this.mapNode.addChild(good1);
                            cc.find("lb", good1).getComponent("cc.Label").string = "1001";
                            good_list.push({"x": good1.x, "y": good1.y, "w": 1, "p": i, "n":1001});
                        }
                    } else if (node.width == 385) {
                        for(let j = 0; j < 5; j++){
                            let good1 = cc.instantiate(this.goods1);
                            good1.x = node.x + good1.width/2 * (2 * j - 4);
                            good1.y = node.y;
                            good1.p = i;
                            good1.name = "it_"+good1.x+"_"+good1.y
                            this.mapNode.addChild(good1);
                            cc.find("lb", good1).getComponent("cc.Label").string = "1001";
                            good_list.push({"x": good1.x, "y": good1.y, "w": 1, "p": i, "n":1001});
                        }
                    } else if (node.width == 462) {
                        for(let j = 0; j < 6; j++){
                            let good1 = cc.instantiate(this.goods1);
                            good1.x = node.x + good1.width/2 * (2 * j - 5);
                            good1.y = node.y;
                            good1.p = i;
                            good1.name = "it_"+good1.x+"_"+good1.y
                            this.mapNode.addChild(good1);
                            cc.find("lb", good1).getComponent("cc.Label").string = "1001";
                            good_list.push({"x": good1.x, "y": good1.y, "w": 1, "p": i, "n":1001});
                        }
                    } else if (node.width == 539) {
                        for(let j = 0; j < 7; j++){
                            let good1 = cc.instantiate(this.goods1);
                            good1.x = node.x + good1.width/2 * (2 * j - 6);
                            good1.y = node.y;
                            good1.p = i;
                            good1.name = "it_"+good1.x+"_"+good1.y
                            this.mapNode.addChild(good1);
                            cc.find("lb", good1).getComponent("cc.Label").string = "1001";
                            good_list.push({"x": good1.x, "y": good1.y, "w": 1, "p": i, "n":1001});
                        }
                    } else if (node.width == 616) {
                        for(let j = 0; j < 8; j++){
                            let good1 = cc.instantiate(this.goods1);
                            good1.x = node.x + good1.width/2 * (2 * j - 7);
                            good1.y = node.y;
                            good1.p = i;
                            good1.name = "it_"+good1.x+"_"+good1.y
                            this.mapNode.addChild(good1);
                            cc.find("lb", good1).getComponent("cc.Label").string = "1001";
                            good_list.push({"x": good1.x, "y": good1.y, "w": 1, "p": i, "n":1001});
                        }
                    }
                } else {
                    for (let j = 0; j < parseInt(cc.find("lb", node).getComponent("cc.Label").string); j++) {
                        let rand = Math.floor(Math.random() * 4);
                        let good = null;
                        let type = 1;
                        let picName = "1001";
                        if (rand == 0) {
                            good = cc.instantiate(this.goods1);
                            type = 1;
                            picName = "1001";
                        } else if (rand == 1) {
                            good = cc.instantiate(this.goods2);
                            type = 2;
                            picName = "2001";
                        } else if (rand == 2) {
                            good = cc.instantiate(this.goods3);
                            type = 3;
                            picName = "3001";
                        } else if (rand == 3) {
                            good = cc.instantiate(this.goods4);
                            type = 4;
                            picName = "4001";
                        }
                        good.x = node.x;
                        good.y = node.y + good.height / 2;
                        good.p = i;
                        good.name = "it_"+j+"_"+good.x+"_"+good.y
                        this.mapNode.addChild(good);
                        cc.find("lb", good).getComponent("cc.Label").string = picName;
                        good_list.push({"x": good.x, "y": good.y, "w": type, "p": i, "n":picName});
                    }
                    // cc.find("lb", node).getComponent("cc.Label").string = ""+3;
                }
            }
        }

        this.levelInfo = {"map":map, "item":good_list};
        // cc.log("==levelConf==", JSON.stringify(this.levelInfo));
    },

    create_box(id){
        let gridPre = null;
        if(id == "1"){
            gridPre = cc.instantiate(this.grid1Pre);
        }else if(id == "2"){
            gridPre = cc.instantiate(this.grid2Pre);
        }else if(id== "3"){
            gridPre = cc.instantiate(this.grid3Pre);
        }else if(id == "4"){
            gridPre = cc.instantiate(this.grid4Pre);
        }else if(id == "5"){
            gridPre = cc.instantiate(this.grid5Pre);
        }else if(id == "6"){
            gridPre = cc.instantiate(this.grid6Pre);
        }else if(id == "7"){
            gridPre = cc.instantiate(this.grid7Pre);
        }
        return gridPre;
    },

    genLevel(){
        let map = [];
        let item = [];
        for(let i = 0; i < this.mapNode.childrenCount; i++){
            let node = this.mapNode.children[i];
            if(node.name.indexOf("box_col") == 0){
                map.push({"x":node.x, "y":node.y, "w":node.width, "h":node.height});
            }
            if(node.name.indexOf("it_") == 0){
                let picNo = cc.find("lb", node).getComponent("cc.Label").string;
                item.push({"x":node.x, "y":node.y, "w":parseInt(picNo.substring(0,1)), "p":node.p, "n":picNo});
            }
        }

        if(item.length == 0){
            alert("无可生成数据");
            return;
        }
        cc.log("=======aaaaaaaaa=========", item);
        this.levelInfo = {"map":map, "item":item};
        cc.log("==levelConf==", JSON.stringify(this.levelInfo));
    },

    checkMap(){
        let map = [];
        let item = [];
        let items_to_check = {};
        for(let i = 0; i < this.mapNode.childrenCount; i++){
            let node = this.mapNode.children[i];
            if(node.name.indexOf("box_col") == 0){
                map.push({"x":node.x, "y":node.y, "w":node.width, "h":node.height});
            }
            if(node.name.indexOf("it_") == 0){
                let picNo = cc.find("lb", node).getComponent("cc.Label").string;
                item.push({"x":node.x, "y":node.y, "w":parseInt(picNo.substring(0,1)), "p":node.p, "n":parseInt(picNo)});
                if(!items_to_check[picNo]){
                    items_to_check[picNo] = 0;
                }
            }
        }
        // cc.log("==items_to_check==", items_to_check);
        this.levelInfo = {"map":map, "item":item};

        if(!this.levelInfo.item){
            alert("无可校验数据");
            return;
        }
        let items = this.levelInfo.item;
        // cc.log(items);
        // if(items.length % 3 > 0){
        //     alert("校验：总数不是3的倍数");
        // }
        for(let i = 0; i < items.length; i++){
            items_to_check[items[i].n] += 1;
        }
        // cc.log(items_to_check);

        // let checkStr = JSON.stringify(items_to_check) + "   ";
        let checkStr = "";
        for(let key in items_to_check) {
            if(items_to_check[key] % 3 > 0){
                checkStr += key + "不是3的倍数,";
            }
        }
        if(checkStr == ""){
            alert("校验通过   " + JSON.stringify(items_to_check));
        }else{
            alert(JSON.stringify(items_to_check) + "   " + checkStr);
        }
    },

    updateBox(){
        let selNode = this.mapNode.getChildByName(this.selBoxName);
        this.opList.push({"name":this.selBoxName, "x":selNode.x,  "y":selNode.y, "w":selNode.width, "h":selNode.height});
        // cc.log(selNode);
        selNode.x = this.editX.string;
        selNode.y = this.editY.string;
        selNode.width = this.editW.string;
        selNode.height = this.editH.string;
        if(selNode.height < 100){
            if(this.editNum.string == "" || this.editNum.string == "0"){
                alert("必须制定重叠物品个数");
            }else{
                cc.find("lb", selNode).getComponent("cc.Label").string = this.editNum.string;
            }
        }
    },

    updateItem(){
        let selItem = this.mapNode.getChildByName(this.selItemName);
        let picNo = cc.find("lb", selItem).getComponent("cc.Label").string;
        this.opItemList.push({"name":this.selItemName, "x":selItem.x, "y":selItem.y, "w":parseInt(picNo.substring(0,1)), "p":selItem.p, "n":picNo});
        cc.log("=====opItemList=====", this.opItemList);
        // cc.log(selNode);
        selItem.x = this.editItX.string;
        selItem.y = this.editItY.string;
        cc.find("lb", selItem).getComponent("cc.Label").string = this.editItPic.string;
        cc.loader.loadRes('goods/'+this.goodsPics[this.editItPic.string].name, cc.SpriteFrame, function (err, assets) {
            selItem.getComponent(cc.Sprite).spriteFrame = assets;
        });
    },

    backBtn(){
        if(this.opList.length == 0){
            alert("没有操作记录了");
            return;
        }
        let lastOp = this.opList.pop();
        cc.log("==lastOp===", lastOp);
        let opNode = this.mapNode.getChildByName(lastOp.name);
        opNode.x = lastOp.x;
        opNode.y = lastOp.y;
        opNode.width = lastOp.w;
        opNode.height = lastOp.h;
    },

    backItemBtn(){
        cc.log("=====backItemBtn=====", this.opItemList);
        if(this.opItemList.length == 0){
            alert("没有操作记录了");
            return;
        }
        let lastOp = this.opItemList.pop();
        cc.log("==lastOp===", lastOp);
        let opNode = this.mapNode.getChildByName(lastOp.name);
        opNode.x = lastOp.x;
        opNode.y = lastOp.y;
        opNode.p = lastOp.p;
        cc.find("lb", opNode).getComponent("cc.Label").string = lastOp.n;
    },

    removeBox(){
        this.mapNode.removeChild(this.mapNode.getChildByName(this.selBoxName))
    },

    removeItem(){
        this.mapNode.removeChild(this.mapNode.getChildByName(this.selItemName))
    },

    loadMap(){
        if(this.editLoadMap.string == ""){
            alert("数据为空");
        }

        let self = this;
        let jsonMap = JSON.parse(this.editLoadMap.string);
        cc.log("===jsonMap===", jsonMap);
        this.mapNode.removeAllChildren();
        if(Array.isArray(jsonMap)){
            for(let i = 0; i < jsonMap.length; i++){
                let boxPre = this.create_box("2");
                boxPre.name = "box_col1_" + i;
                boxPre.x = jsonMap[i].x;
                boxPre.y = jsonMap[i].y;
                boxPre.width = jsonMap[i].w;
                boxPre.height = jsonMap[i].h;
                this.mapNode.addChild(boxPre);
            }
            this.mapNode.height = jsonMap.length * 200;
        }else{
            let map = jsonMap.map;
            let items = jsonMap.item;
            for(let i = 0; i < map.length; i++){
                let boxPre = this.create_box("2");
                boxPre.name = "box_col1_" + i;
                boxPre.x = map[i].x;
                boxPre.y = map[i].y;
                boxPre.width = map[i].w;
                boxPre.height = map[i].h;
                this.mapNode.addChild(boxPre);
            }
            this.mapNode.height = map.length * 200;

            for(let i = 0; i < items.length; i++){
                cc.log("======iiii======");
                let good = null;
                if(items[i].w == 1){
                    good = cc.instantiate(this.goods1);
                }else if(items[i].w == 2){
                    good = cc.instantiate(this.goods2);
                }else if(items[i].w == 3){
                    good = cc.instantiate(this.goods3);
                }else if(items[i].w == 4){
                    good = cc.instantiate(this.goods4);
                }
                good.p = items[i].p;
                good.x = items[i].x;
                good.y = items[i].y;
                good.name = "it_"+i+"_"+items[i].x+"_"+items[i].y
                cc.find("lb", good).getComponent("cc.Label").string = items[i].n;
                cc.loader.loadRes('goods/'+this.goodsPics[items[i].n].name, cc.SpriteFrame, function (err, assets) {
                    good.getComponent(cc.Sprite).spriteFrame = assets;
                    self.mapNode.addChild(good);
                });

            }
        }
    },

    exportMap(){
        let map = [];
        for(let i = 0; i < this.mapNode.childrenCount; i++){
            let node = this.mapNode.children[i];
            if(node.name.indexOf("box_col") == 0){
                map.push({"x":node.x, "y":node.y, "w":node.width, "h":node.height});
            }
        }
        cc.log("==map==", JSON.stringify(map));
    },

    // called every frame
    update: function (dt) {

    },

    showWarn(msg){
        cc.find("msg/lb", this.node).getComponent("cc.Label").string = msg;
        let msgNode = cc.find("msg", this.node);
        msgNode.active = true;
        cc.tween(msgNode)
            .delay(1)
            .to(0.5, {opacity: 0})
            .call(()=>{
                msgNode.active = false;
                msgNode.opacity = 255;
            })
            .start();
    },

    isIntNum(val){
        var regPos = / ^\d+$/; // 非负整数
        var regNeg = /^\-[1-9][0-9]*$/; // 负整数
        if(regPos.test(val) && regNeg.test(val)){
            return true;
        }else{
            return false;
        }
    },
});
