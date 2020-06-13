//APIキーの設定とSDKの初期化
var appKey    = "2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58";
var clientKey = "e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06";
var ncmb    　= new NCMB(appKey,clientKey);

// -------[Demo1]データをmBaaSに保存する -------//
function giftInsert(ReleaseStatus) {
        showGiftInsertLoad();
        console.log(ReleaseStatus);
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
        
        if(giftKind=="オークション"){
                var gift_stock = "1";
                var timeLimit = "OFF";
                var ohitotu = "OFF";
                var auction_date = $('#yoyakuDate').val();
                var auction_time = $('#yoyakuTime').val();
                var auction_datetime = auction_date+"T"+auction_time;
                var auctionEndtime = moment(auction_datetime).format();
        }else{
                var auctionEndtime = "";
        }
        if(gift_title ==''){
                hideGiftInsertLoad();
                alertNew("ギフト名が未入力です","","");
        }else if(gift_text == ""){
                hideGiftInsertLoad();
                alertNew("ギフト説明文が未入力です","","");
        }
        else if(profileGiftInputStatus == 0){
                hideGiftInsertLoad();
                alertNew("ギフト画像が未登録です","","");
        }
        else if(gift_price == ""){
                hideGiftInsertLoad();
                alertNew("ギフト価格が未入力です","","");
        }else if(gift_stock == ""){
                hideGiftInsertLoad();
                alertNew("ギフト在庫数が未入力です","","");
        }else if(gift_stock > 999){
                hideGiftInsertLoad();
                alertNew("ギフト在庫数は0~999です","","");
        }else if(yoyaku=="予約"&&(date==""||time=="")){
                hideGiftInsertLoad();
                alertNew("日時が未入力です","","");
        }else if(giftKind=="オークション"&&(auction_date==""||auction_time=="")){
                hideGiftInsertLoad();
                alertNew("オークション終了日時が未入力です","","");
        }else if(!Number.isInteger(Number(gift_stock)) || !Number.isInteger(Number(gift_price)) || gift_price < 1 || gift_stock < 0){
                hideGiftInsertLoad();
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
                                                hideGiftInsertLoad();
                                                // giftInputOpen();
                                                
                                                if(ReleaseStatus==1){
                                                        alertNew("下書き保存しました。","","");
                                                        setTimeout(function(){
                                                                hideGiftInsertLoad();
                                                                setTimeout(function(){
                                                                        window.location.href = 'home.html';
                                                                },1500);
                                                        },1500);
                                                }else{
                                                        alertNew("出品成功しました。","","");
                                                        setTimeout(function(){
                                                                hideGiftInsertLoad();
                                                                setTimeout(function(){
                                                                        window.location.href = 'home.html';
                                                                },1500);
                                                        },1500);
                                                }
                                        })
                                        .catch(function(err){
                                                // エラー処理
                                                hideGiftInsertLoad();
                                                alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","");
                                        });
                                })
                                .catch(function(err){
                                // エラー処理
                                        hideGiftInsertLoad();
                                        
                                        if(ReleaseStatus==1){
                                                alertNew("下書き保存が失敗しました。","","");
                                        }else{
                                                alertNew("出品が失敗しました。","","");
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
                                                hideGiftInsertLoad();
                                                // giftInputOpen();
                                                
                                                if(ReleaseStatus==1){
                                                        alertNew("下書き保存しました。","","");
                                                        setTimeout(function(){
                                                                hideGiftInsertLoad();
                                                                setTimeout(function(){
                                                                        window.location.href = 'home.html';
                                                                },1500);
                                                        },1500);
                                                }else{
                                                        alertNew("出品成功しました。","","");
                                                        setTimeout(function(){
                                                                hideGiftInsertLoad();
                                                                setTimeout(function(){
                                                                        window.location.href = 'home.html';
                                                                },1500);
                                                        },1500);
                                                }
                                        })
                                        .catch(function(err){
                                                // エラー処理
                                                hideGiftInsertLoad();
                                                alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","");
                                        });
                                })
                                .catch(function(err){
                                // エラー処理
                                        hideGiftInsertLoad();
                                        
                                        if(ReleaseStatus==1){
                                                alertNew("下書き保存が失敗しました。","","");
                                        }else{
                                                alertNew("出品が失敗しました。","","");
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
                                                alertNew("変更しました。","","");
                                                setTimeout(function(){
                                                        hideGiftEditLoad();
                                                        setTimeout(function(){
                                                                window.location.href = 'home.html';
                                                        },1500);
                                                },1500);
                                        })
                                        .catch(function(err){
                                                // エラー処理
                                                hideGiftEditLoad();
                                                alertNew("画像の保存が失敗しました。","再度送信頂くか、お問い合わせください。","");
                                        });
                                }else{
                                        alertNew("変更しました。");
                                        setTimeout(function(){
                                                hideGiftEditLoad();
                                                setTimeout(function(){
                                                        window.location.href = 'home.html';
                                                },1500);
                                        },1500);
                                }
                        })
                        .catch(function(err){
                                hideGiftEditLoad();
                                alertNew("変更が失敗しました。","再度送信頂くか、お問い合わせください。","");
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

function hideGiftInsertLoad() {
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