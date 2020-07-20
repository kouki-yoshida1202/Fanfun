//APIキーの設定とSDKの初期化
var appKey    = "2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58";
var clientKey = "e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06";
var ncmb    　= new NCMB(appKey,clientKey);

// -------[Demo1]データをmBaaSに保存する -------//
function giftInsert(ReleaseStatus) {
        showLoad();
        //ユーザーの入力したデータを変数にセットする
        var gift_title = $("#gift_title").val();  
        var gift_title = gift_title.replace(/'/g,"’");
        var gift_title = gift_title.replace(/"/g,"’");          
        var gift_text = $("#gift_text").val();
        var gift_text = gift_text.replace(/'/g,"’");
        var gift_text = gift_text.replace(/"/g,"’");
        var gift_text = gift_text.replace(/\r?\n/g,'<br>');
        var gift_text = gift_text.replace(/\r?\n/g,'<br>');
        var gift_price = $("#gift_price").val(); 
        var gift_stock = $("#gift_stock").val(); 
        var yoyaku = $('.segment-yoyaku:checked').val();
        var giftKind = $('.segment-giftKind:checked').val();
        if(yoyaku=="今すぐ"){
                var time = new Date();
        }else{
                var date = $('#yoyakuDate').val();
                var time = $('#yoyakuTime').val();
                var time = date+"T"+time;
        }
        
        var iso = moment(time).format();
        var ohitotu = $('.segment-ohitotu:checked').val();
        var timeLimit = $('.segment-limit:checked').val();
        var profileGiftInputStatus = $('#profileGiftInputStatus').val();
        var dataKind = $('.segment-dataKind:checked').val();
        if(dataKind=="画像"){
                var dataLong = $('#dataLongPhoto').val();
        }else{
                var dataLong = $('#dataLongMovieVoice').val();
        }
        if(giftKind=="オークション"){
                var gift_stock = "1";
                var timeLimit = "OFF";
                var ohitotu = "OFF";
                var auction_date = $('#auctionDate').val();
                var auction_time = $('#auctionTime').val();
                var auction_datetime = auction_date+"T"+auction_time;
                var auctionEndtime = moment(auction_datetime).format();
        }else if(giftKind=="抽選販売"){
                var timeLimit = "OFF";
                var ohitotu = "ON";
                var auction_date = $('#auctionDate').val();
                var auction_time = $('#auctionTime').val();
                var auction_datetime = auction_date+"T"+auction_time;
                var auctionEndtime = moment(auction_datetime).format();
        }else{
                var auctionEndtime = "";
        }
        if(giftKind=="価格自由"){
                var gift_price = "1000"; 
        }
        if(gift_title ==''){
                hideLoad();
                alertNew("ギフト名が未入力です","","");
        }else if(gift_text == ""){
                hideLoad();
                alertNew("ギフト説明文が未入力です","","");
        }
        else if(profileGiftInputStatus == 0){
                hideLoad();
                alertNew("ギフト画像が未登録です","","");
        }else if(gift_price == ""){
                hideLoad();
                alertNew("ギフト価格が未入力です","","");
        }else if(gift_stock == ""){
                hideLoad();
                alertNew("ギフト在庫数が未入力です","","");
        }else if(gift_stock > 999){
                hideLoad();
                alertNew("ギフト在庫数は0~999です","","");
        }else if(yoyaku=="予約"&&(date==""||time=="")){
                hideLoad();
                alertNew("日時が未入力です","","");
        }else if(giftKind=="オークション"&&(auction_date==""||auction_time=="")){
                hideLoad();
                alertNew("オークション終了日時が未入力です","","");
        }else if(!Number.isInteger(Number(gift_stock)) || !Number.isInteger(Number(gift_price)) || gift_price < 1 || gift_stock < 0){
                hideLoad();
                alertNew("数値を1以上の整数で入力してください","","");
        }else{
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                // クラスのTestClassを作成
                var strong = 1000;
                var uid = new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16);
                // データストアへの登録
                var currentUser = ncmb.User.getCurrentUser();
                var userKind = currentUser.get("userKind");
                if(userKind!="test"){
                        var GiftData = ncmb.DataStore("giftData");
                        var giftData = new GiftData();
                        giftData.set("userId", objectId)
                                .set("giftTitle", gift_title)
                                .set("giftText", gift_text)
                                .set("price",gift_price)
                                .set("giftUid",uid)
                                .set("stock",gift_stock)
                                .set("releaseDate",iso)
                                .set("ohitotu",ohitotu)
                                .set("timeLimit",String(timeLimit))
                                .set("ReleaseStatus",ReleaseStatus)
                                .set("auction",giftKind)
                                .set("auctionEndTime",auctionEndtime)
                                .set("dataLong",dataLong)
                                .set("dataKind",dataKind)
                                .save()
                                .then(function(gameScore){
                                        // 保存後の処理
                                        if(ReleaseStatus!=1){
                                                var gift_text = gameScore.get("giftText");
                                                var gift_text = gift_text.replace(/<br>/g,' ');
                                                var giftUrl = 'https://fanfun2020.xsrv.jp/customUrlScheme.html?GIFTorUSERID='+uid+'&page=giftPage';
                                                var dt = new Date(iso);
                                                var m = ("00" + (dt.getMonth()+1)).slice(-2);
                                                var d = ("00" + dt.getDate()).slice(-2);
                                                var hh = dt.getHours();
                                                if (hh < 10) {
                                                        hh = "0" + hh;
                                                }
                                                var mm = dt.getMinutes();
                                                if (mm < 10) {
                                                        mm = "0" + mm;
                                                }
                                                var releaseDate = m + "月" + d + "日 " +hh + "時" + mm + "分";
                                                var follow = ncmb.DataStore("follow");
                                                follow
                                                .equalTo("followerId",objectId)
                                                .fetchAll()
                                                .then(function(results){
                                                        for(var j=0;j<results.length;j++){
                                                                var forUserId = results[j].get("followId");
                                                                if(results[j].get("bellmark")=="ON"){
                                                                        followUserSyuppinMail(forUserId,releaseDate,gift_title,gift_text,gift_price,giftUrl,objectId);
                                                                        followUserSyuppinPushNotification(forUserId,objectId);
                                                                }
                                                        }
                                                }).then(function(){
                                                        var img = document.getElementById('gift_image_insert');
                                                        var dataURI = img.getAttribute('src');
                                                        // dataURIをBlobに変換する
                                                        var blob = toBlob(dataURI);
                                                        ncmb.File
                                                        .upload(uid,blob)
                                                        .then(function(res){
                                                                // アップロード後処理
                                                                hideLoad();
                                                                // giftInputOpen();
                                                                
                                                                if(ReleaseStatus==1){
                                                                        alertNew("下書き保存しました。","","homeBack");
                                                                        hideLoad();
                                                                        
                                                                }else{
                                                                        alertNew("出品成功しました。","","homeBack");
                                                                        hideLoad();
                                                                        
                                                                }
                                                        })
                                                        .catch(function(err){
                                                                // エラー処理
                                                                hideLoad();
                                                                alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                                        });
                                                }).catch(function(err){
                                                        // エラー処理
                                                        hideLoad();
                                                        
                                                        if(ReleaseStatus==1){
                                                                alertNew("下書き保存が失敗しました。","","homeBack");
                                                        }else{
                                                                alertNew("出品が失敗しました。","","homeBack");
                                                        }
                                                });
                                        }else{
                                                var img = document.getElementById('gift_image_insert');
                                                var dataURI = img.getAttribute('src');
                                                // dataURIをBlobに変換する
                                                var blob = toBlob(dataURI);
                                                ncmb.File
                                                .upload(uid,blob)
                                                .then(function(res){
                                                        // アップロード後処理
                                                        hideLoad();
                                                        // giftInputOpen();
                                                        
                                                        if(ReleaseStatus==1){
                                                                alertNew("下書き保存しました。","","homeBack");
                                                                hideLoad();
                                                                
                                                        }else{
                                                                alertNew("出品成功しました。","","homeBack");
                                                                hideLoad();
                                                                
                                                        }
                                                })
                                                .catch(function(err){
                                                        // エラー処理
                                                        hideLoad();
                                                        alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                                });
                                        }
                                })
                                .catch(function(err){
                                // エラー処理
                                        hideLoad();
                                        
                                        if(ReleaseStatus==1){
                                                alertNew("下書き保存が失敗しました。","","homeBack");
                                        }else{
                                                alertNew("出品が失敗しました。","","homeBack");
                                        }
                                });
                }else{
                        var GiftDataTest = ncmb.DataStore("giftDataTest");
                        var giftDataTest = new GiftDataTest();
                        giftDataTest.set("userId", objectId)
                                .set("giftTitle", gift_title)
                                .set("giftText", gift_text)
                                .set("price",gift_price)
                                .set("giftUid",uid)
                                .set("stock",gift_stock)
                                .set("releaseDate",iso)
                                .set("ohitotu",ohitotu)
                                .set("timeLimit",String(timeLimit))
                                .set("ReleaseStatus",ReleaseStatus)
                                .save()
                                .then(function(gameScore){
                                        // 保存後の処理
                                        var img = document.getElementById('gift_image_insert');
                                        var dataURI = img.getAttribute('src');
                                        // dataURIをBlobに変換する
                                        var blob = toBlob(dataURI);
                                        ncmb.File
                                        .upload(uid,blob)
                                        .then(function(res){
                                                // アップロード後処理
                                                hideLoad();
                                                // giftInputOpen();
                                                
                                                if(ReleaseStatus==1){
                                                        alertNew("下書き保存しました。","","homeBack");
                                                        hideLoad();
                                                }else{
                                                        alertNew("出品成功しました。","","homeBack");
                                                        hideLoad();
                                                }
                                        })
                                        .catch(function(err){
                                                // エラー処理
                                                hideLoad();
                                                alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                        });
                                })
                                .catch(function(err){
                                // エラー処理
                                        hideLoad();
                                        
                                        if(ReleaseStatus==1){
                                                alertNew("下書き保存が失敗しました。","","homeBack");
                                        }else{
                                                alertNew("出品が失敗しました。","","homeBack");
                                        }
                                });
                }
        }
}

function giftEdit() {
        showGiftEditLoad();
        //ユーザーの入力したデータを変数にセットする
        var gift_title = $("#gift_title_edit").val();            //お名前
        var gift_title = gift_title.replace(/'/g,"’");
        var gift_title = gift_title.replace(/"/g,"’");                  
        var gift_text = $("#gift_text_edit").val();     //メールアドレス
        var gift_text = gift_text.replace(/'/g,"’");
        var gift_text = gift_text.replace(/"/g,"’");
        var gift_text = gift_text.replace(/\r?\n/g,'<br>');
        var gift_price = $("#gift_price_edit").val();      //パスワード
        var gift_stock = $("#gift_stock_edit").val();
        var profileGiftEditStatus = $('#profileGiftEditStatus').val();
        var ohitotu = $('.segment-ohitotu:checked').val();
        if(gift_title ==''){
                hideGiftEditLoad();
                alertNew("ギフトタイトルが未入力です","","");
        }else if(gift_text == ""){
                hideGiftEditLoad();
                alertNew("ギフト説明文が未入力です","","");
        }else if(gift_price == ""){
                hideGiftEditLoad();
                alertNew("ギフト価格が未入力です","","");
        }else if(gift_price % 100 != 0){
                hideGiftEditLoad();
                alertNew("価格を100円単位で設定してください","","")
        }else if(gift_stock == ""){
                hideGiftEditLoad();
                alertNew("ギフト在庫数が未入力です","","");
        }else if(gift_stock > 999){
                hideGiftEditLoad();
                alertNew("ギフト在庫数は0~999です","","");
        }else if(!Number.isInteger(Number(gift_stock)) || !Number.isInteger(Number(gift_price)) || gift_price < 1 || gift_stock < 0){
                hideGiftEditLoad();
                alertNew("数値を1以上の整数で入力してください","","");
        }else{
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                // クラスのTestClassを作成
                var uid = $('.gift_uid_edit').val();
                // データストアへの登録
                var GiftData = ncmb.DataStore("giftData");

                GiftData.equalTo("giftUid", uid)
                        .fetch()                
                        .then(function(results){
                                var object = results;
                                console.log(object);
                                var gift_objectId = object.get("objectId");
                                results.set("giftTitle", gift_title)
                                        .set("giftText", gift_text)
                                        .set("price",gift_price)
                                        .set("stock",gift_stock)
                                        .set("ohitotu",ohitotu)
                                        .update();

                                if(profileGiftEditStatus != 0){
                                        // 保存後の処理
                                        var img = document.getElementById('gift_image_edit');
                                        var dataURI = img.getAttribute('src');
                                        // dataURIをBlobに変換する
                                        var blob = toBlob(dataURI);
                                        ncmb.File
                                        .upload(uid,blob)
                                        .then(function(res){
                                                // アップロード後処理
                                                alertNew("変更しました。","","homeBack");
                                                hideGiftEditLoad();
                                                
                                        })
                                        .catch(function(err){
                                                // エラー処理
                                                hideGiftEditLoad();
                                                alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                        });
                                }else{
                                        alertNew("変更しました。","","homeBack");
                                        hideGiftEditLoad();
                                }
                        })
                        .catch(function(err){
                                hideGiftEditLoad();
                                alertNew("変更が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                        });
        }
}

function giftNowInfo(){
        var gift_title = $('#gift_detail_title').html();
        var gift_text = $('#gift_detail_text').html();
        var gift_text = gift_text.replace(/<br>/g,"\n");
        var gift_price = $('#gift_detail_price').html();
        var gift_price = Number(gift_price.slice(1));
        var gift_uid = $('#my_gift_id').val();
        var gift_stock = $('#my_stock').html();
        setTimeout(function() {
                $('.gift_uid_edit').val(gift_uid);
                $('#gift_title_edit').val(gift_title);
                $('#gift_text_edit').val(gift_text);
                $('#gift_price_edit').val(gift_price);
                var tesuryou = Math.floor(gift_price*0.1);
                var rieki = gift_price - tesuryou;
                $('.tesuryou').text(tesuryou);
                $('.rieki').text(rieki);
                $('#gift_stock_edit').val(gift_stock);
                var GiftData = ncmb.DataStore("giftData");
                GiftData.equalTo("giftUid", gift_uid)
                        .fetch()
                        .then(function(results){
                                var object = results;
                                console.log(object);
                                var releaseDate = object.get("releaseDate");
                                var ohitotu = object.get("ohitotu");
                                var giftKind = object.get("auction");
                                if(ohitotu=="ON"){
                                        var ohitotu = "ohitotuON";
                                }else{
                                        var ohitotu = "ohitotuOFF";
                                }
                                $('#'+ohitotu).prop("checked",true);
                                var yoyakuDateTimeEdit = isoToNormalChange(releaseDate);
                                $('#yoyakuDateTimeEdit').val(yoyakuDateTimeEdit);
                                if(giftKind == "オークション"){
                                        var auctionEndTime = object.get("auctionEndTime");
                                        var gift_price = object.get("price");
                                        $('#gift_stock_edit').val("1");
                                        $('#gift_price_edit').prop("disabled",true);
                                        $('#kakaku_text_edit').html("スタート価格");
                                        $('#normal_text_edit').css("display","none");
                                        $('#auction_text_edit').css("display","block");
                                        $('#6_area_edit').css("display","none");
                                        $('#6_area_auction_edit').css("display","block");
                                        var auctionEndTimeEdit = isoToNormalChange(auctionEndTime);
                                        $('#auctionDateTimeEdit').val(auctionEndTimeEdit);
                                        $('#rieki_area_edit').css("display","none");

                                        $('#gift_price_edit').val(gift_price);
                                }else if(giftKind=="プレゼント"){
                                        $('#3_area_edit').css("display","none");
                                        $('#4_area_edit').css("display","none");
                                        $('#5_area_edit').css("display","none");
                                        $('#6_area_edit').css("display","none");
                                        $('#giftEditButtonZone').css("display","none");
                                        $('#giftEditButton2').css("display","none");
                                        $('#presentEditButtonZone').css("display","block");
                                        $('#presentEditButton').css("display","block");
                                }else if(giftKind=="価格自由"){
                                        $('#itemKakakuEdit').css("display","none");
                                        $('#gift_price_edit').val(1000);
                                        $('#kakakuFreeZoneEdit').css("display","block");
                                }else if(giftKind=="抽選販売"){
                                        $('#3_area_edit').css("display","none");
                                        $('#4_area_edit').css("display","none");
                                        $('#5_area_edit').css("display","none");
                                        $('#6_area_edit').css("display","none");
                                        var gift_stock = object.get("stock");
                                        $('#gift_stock_edit').val(gift_stock);
                                }
                        });

                ncmb.File.download(gift_uid, "blob")
                .then(function(fileData) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                                var img = document.getElementById("gift_image_edit");
                                img.src = reader.result;
                        }
                        // DataURLとして読み込む
                        reader.readAsDataURL(fileData);
                })
                .catch(function(err){
                // エラー処理
                        console.log('error = ' + err);
                });
        }, 500);
        
}

function showGiftInsertLoad(){
        $("#giftInsertButtonZone,#giftShitagakiButtonZone").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
}

function hideLoad() {
        $("#giftInsertButtonZone,#giftShitagakiButtonZone").LoadingOverlay("hide");
};

function showGiftEditLoad(){
        $("#giftEditButtonZone").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
}

function hideGiftEditLoad() {
        $("#giftEditButtonZone").LoadingOverlay("hide");
};

function isoToNormalChange(datetime){
        var dt = new Date(datetime);
        var y = dt.getFullYear();
        var m = ("00" + (dt.getMonth()+1)).slice(-2);
        var d = ("00" + dt.getDate()).slice(-2);
        var date = y + "-" + m + "-" + d;
        var hh = dt.getHours();
        if (hh < 10) {
                hh = "0" + hh;
        }
        var mm = dt.getMinutes();
        if (mm < 10) {
                mm = "0" + mm;
        }
        var time = hh + ":" + mm;
        var datetimeEdit = date + " "+ time;
        return datetimeEdit;
}

function giftInsertPresent() {
        showLoad();
        //ユーザーの入力したデータを変数にセットする
        var gift_title = $("#gift_title").val();  
        var gift_title = gift_title.replace(/'/g,"’");
        var gift_title = gift_title.replace(/"/g,"’");          
        var gift_text = $("#gift_text").val();
        var gift_text = gift_text.replace(/'/g,"’");
        var gift_text = gift_text.replace(/"/g,"’");
        var gift_text = gift_text.replace(/\r?\n/g,'<br>');
        var gift_text = gift_text.replace(/\r?\n/g,'<br>');
        var gift_price = "0"; 
        var gift_stock = "0";
        var giftKind = "プレゼント";
        var time = new Date();
        var iso = moment(time).format();
        var ohitotu = 'ON';
        var timeLimit = $('.segment-limit:checked').val();
        var profileGiftInputStatus = $('#profileGiftInputStatus').val();
        var ReleaseStatus="";
        var auctionEndtime = "";
        var dataKind = $('.segment-dataKind:checked').val();
        if(dataKind=="画像"){
                var dataLong = $('#dataLongPhoto').val();
        }else{
                var dataLong = $('#dataLongMovieVoice').val();
        }
        if(gift_title ==''){
                hideLoad();
                alertNew("ギフト名が未入力です","","");
        }else if(gift_text == ""){
                hideLoad();
                alertNew("ギフト説明文が未入力です","","");
        // }
        // else if(profileGiftInputStatus == 0){
        //         hideLoad();
        //         alertNew("ギフト画像が未登録です","","");
        }else{
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                var influencerName = currentUser.get("userName");
                // クラスのTestClassを作成
                var strong = 1000;
                var uid = new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16);
                // データストアへの登録
                var currentUser = ncmb.User.getCurrentUser();
                var userKind = currentUser.get("userKind");
                if(userKind!="test"){
                        var GiftData = ncmb.DataStore("giftData");
                        var giftData = new GiftData();
                        giftData.set("userId", objectId)
                                .set("giftTitle", gift_title)
                                .set("giftText", gift_text)
                                .set("price",gift_price)
                                .set("giftUid",uid)
                                .set("stock",gift_stock)
                                .set("releaseDate",iso)
                                .set("ohitotu",ohitotu)
                                .set("timeLimit",String(timeLimit))
                                .set("ReleaseStatus",ReleaseStatus)
                                .set("auction",giftKind)
                                .set("auctionEndTime",auctionEndtime)
                                .set("dataLong",dataLong)
                                .set("dataKind",dataKind)
                                .save()
                                .then(function(gameScore){
                                        // 保存後の処理
                                        var userId = objectId;
                                        var rank = $('#fanRankPresentValue').val();
                                        var giftLog = ncmb.DataStore("giftLog");
                                        giftLog
                                        .equalTo('giftCreateInfluencer',userId)
                                        .fetchAll()         
                                        .then(function(results){
                                                var buyUserArray = [];
                                                if(results.length==0){
                                                        hideLoad();
                                                }
                                                for (var i = 0; i < results.length; i++) {
                                                        var buyUser = results[i].get("buyUser");
                                                        var buyKakaku = results[i].get("buyKakaku");
                                                        
                                                        if (buyUserArray[buyUser]){
                                                                // 存在しない
                                                                var beforeKakaku = buyUserArray[buyUser];
                                                                buyUserArray[buyUser] = Number(beforeKakaku)+Number(buyKakaku);
                                                        }else{
                                                                // 存在するからお金だけプラス
                                                                buyUserArray[buyUser]=Number(buyKakaku);
                                                        }
                                                }
                                                let arr = Object.keys(buyUserArray).map((e)=>({ key: e, value: buyUserArray[e] }));
                                                arr.sort(function(a,b){
                                                        if(a.value < b.value) return 1;
                                                        if(a.value > b.value) return -1;
                                                        return 0;
                                                });
                                                return arr;
                                        }).then(function(arr){
                                                // console.log(arr);
                                                var fanRankArray = [];
                                                if(rank>arr.length){
                                                        rank = arr.length;
                                                }
                                                for (var i = 0; i < Number(rank); i++) {
                                                        var userId = arr[i]["key"];
                                                        fanRankArray.push(userId);
                                                }
                                                return fanRankArray;
                                        }).then(function(fanRankArray){
                                                var fanRankNumber = fanRankArray.length;
                                                console.log(fanRankArray);
                                                var giftPresentData = ncmb.DataStore("giftPresentData");
                                                var giftPresentData = new giftPresentData();
                                                giftPresentData
                                                .set("forUser", fanRankArray)
                                                .set("giftUid",uid)
                                                .set("rankLength",fanRankNumber)
                                                .save()
                                                .then(function(gameScore){
                                                        for(var j=0;j<fanRankArray.length;j++){
                                                                var forUserId = fanRankArray[j];
                                                                fanPresentPushMail(forUserId,influencerName);
                                                        }
                                                        var img = document.getElementById('gift_image_insert');
                                                        var dataURI = img.getAttribute('src');
                                                        // dataURIをBlobに変換する
                                                        var blob = toBlob(dataURI);
                                                        ncmb.File
                                                        .upload(uid,blob)
                                                        .then(function(res){
                                                                // アップロード後処理
                                                                
                                                                hideLoad();
                                                                alertNew("出品成功しました。","","homeBack");
                                                        })
                                                        .catch(function(err){
                                                                // エラー処理
                                                                hideLoad();
                                                                alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                                        });                                                
                                                })
                                                .catch(function(err){
                                                        hideLoad();
                                                        alertNew("失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                                });
                                        }).catch(function(err){
                                                hideLoad();
                                                alertNew("失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                        });
                                })
                                .catch(function(err){
                                // エラー処理
                                        hideLoad();
                                        alertNew("出品が失敗しました。","","homeBack");
                                });
                }else{
                        var GiftDataTest = ncmb.DataStore("giftDataTest");
                        var giftDataTest = new GiftDataTest();
                        giftDataTest.set("userId", objectId)
                                .set("giftTitle", gift_title)
                                .set("giftText", gift_text)
                                .set("price",gift_price)
                                .set("giftUid",uid)
                                .set("stock",gift_stock)
                                .set("releaseDate",iso)
                                .set("ohitotu",ohitotu)
                                .set("timeLimit",String(timeLimit))
                                .set("ReleaseStatus",ReleaseStatus)
                                .save()
                                .then(function(gameScore){
                                        // 保存後の処理
                                        var img = document.getElementById('gift_image_insert');
                                        var dataURI = img.getAttribute('src');
                                        // dataURIをBlobに変換する
                                        var blob = toBlob(dataURI);
                                        ncmb.File
                                        .upload(uid,blob)
                                        .then(function(res){
                                                // アップロード後処理
                                                hideLoad();
                                                // giftInputOpen();
                                                
                                                if(ReleaseStatus==1){
                                                        alertNew("下書き保存しました。","","homeBack");
                                                        hideLoad();
                                                }else{
                                                        alertNew("出品成功しました。","","homeBack");
                                                        hideLoad();
                                                }
                                        })
                                        .catch(function(err){
                                                // エラー処理
                                                hideLoad();
                                                alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                        });
                                })
                                .catch(function(err){
                                // エラー処理
                                        hideLoad();
                                        
                                        if(ReleaseStatus==1){
                                                alertNew("下書き保存が失敗しました。","","homeBack");
                                        }else{
                                                alertNew("出品が失敗しました。","","homeBack");
                                        }
                                });
                }
        }
}

function fanPresentPushMail(forUserId,influencerName){
        console.log(forUserId,influencerName);
        ncmb.User
        .equalTo("objectId", forUserId)
        .fetch()
        .then(function(result){
                var mailAddress = result.get("mailAddress");
                var userName = result.get("userName");
                $.ajax({
                        type: 'post',
                        url: 'https://fanfun2020.xsrv.jp/fanRankingPresentMail.html',
                        data: {
                                'userName':userName,
                                'mailAddress':mailAddress,
                                'influencerName':influencerName,
                        },
                        success: function(data){
                                console.log("----success.----");
                        }
                });
        });
}

function presentEdit(){
        showLoad();
        //ユーザーの入力したデータを変数にセットする
        var gift_title = $("#gift_title_edit").val();            //お名前
        var gift_title = gift_title.replace(/'/g,"’");
        var gift_title = gift_title.replace(/"/g,"’");                  
        var gift_text = $("#gift_text_edit").val();     //メールアドレス
        var gift_text = gift_text.replace(/'/g,"’");
        var gift_text = gift_text.replace(/"/g,"’");
        var gift_text = gift_text.replace(/\r?\n/g,'<br>');
        var profileGiftEditStatus = $('#profileGiftEditStatus').val();
        var ohitotu = 'ON';
        if(gift_title ==''){
                hideLoad();
                alertNew("ギフトタイトルが未入力です","","");
        }else if(gift_text == ""){
                hideLoad();
                alertNew("ギフト説明文が未入力です","","");
        }else{
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                // クラスのTestClassを作成
                var uid = $('.gift_uid_edit').val();
                // データストアへの登録
                var GiftData = ncmb.DataStore("giftData");
                GiftData.equalTo("giftUid", uid)
                .fetch()                
                .then(function(results){
                        results.set("giftTitle", gift_title)
                                .set("giftText", gift_text)
                                .update();

                        if(profileGiftEditStatus != 0){
                                // 保存後の処理
                                var img = document.getElementById('gift_image_edit');
                                var dataURI = img.getAttribute('src');
                                // dataURIをBlobに変換する
                                var blob = toBlob(dataURI);
                                ncmb.File
                                .upload(uid,blob)
                                .then(function(res){
                                        // アップロード後処理
                                        alertNew("変更しました。","","homeBack");
                                        hideLoad();
                                        
                                })
                                .catch(function(err){
                                        // エラー処理
                                        hideLoad();
                                        alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                                });
                        }else{
                                alertNew("変更しました。","","homeBack");
                                hideLoad();
                        }
                })
                .catch(function(err){
                        hideLoad();
                        alertNew("変更が失敗しました。","再度送信頂くか、お問い合わせください。","homeBack");
                });
        }
}

function followUserSyuppinMail(fanUserId,releaseDate,gift_title,gift_text,gift_price,giftUrl,influencerId){

        ncmb.User
        .equalTo("objectId", influencerId)
        .fetch()
        .then(function(result){
                var influencerName = result.get("userName");
                return influencerName;
        }).then(function(influencerName){
                ncmb.User
                .equalTo("objectId", fanUserId)
                .fetch()
                .then(function(result){
                        var mailAddress = result.get("mailAddress");
                        var userName = result.get("userName");
                        $.ajax({
                                type: 'post',
                                url: 'https://fanfun2020.xsrv.jp/followUserSyuppinMail.html',
                                data: {
                                        'influencerName':influencerName,
                                        'userName':userName,
                                        'mailAddress':mailAddress,
                                        'releaseDate':releaseDate,
                                        'gift_title':gift_title,
                                        'gift_text':gift_text,
                                        'gift_price':gift_price,
                                        'giftUrl':giftUrl
                                },
                                success: function(data){
                                        console.log("----success.----");
                                }
                        });
                });
        });
}

function followUserSyuppinPushNotification(fanUserId,influencerId){
        ncmb.User
        .equalTo("objectId", influencerId)
        .fetch()
        .then(function(result){
                var influencerName = result.get("userName");
                return influencerName;
        }).then(function(influencerName){
                var push = new ncmb.Push();
                push.set("immediateDeliveryFlag", true)
                .set("message", influencerName+"様が新商品を出品しました！")
                .set("target", ["ios", "android"])
                .set('searchCondition', {
                        userObjectId: fanUserId,
                });
                push.send()
                .then(function(push){
                        // 送信後処理
                        console.log("----success.----");
                })
                .catch(function(err){
                        // エラー処理
                        console.log("----success.----");
                });
        });
}