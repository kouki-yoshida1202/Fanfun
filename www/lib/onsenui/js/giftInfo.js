//APIキーの設定とSDKの初期化
var appKey    = "2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58";
var clientKey = "e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06";
var ncmb    　= new NCMB(appKey,clientKey);

// -------[Demo1]データをmBaaSに保存する -------//
function giftInsert() {
        showGiftInsertLoad();
        //ユーザーの入力したデータを変数にセットする
        var gift_title = $("#gift_title").val();            
        var gift_text = $("#gift_text").val();     
        var gift_price = $("#gift_price").val(); 
        var gift_stock = $("#gift_stock").val(); 
        var gift_image = $('#file-data-gift').val().length;
        if(gift_title ==''){
                hideGiftInsertLoad();
                alert("ギフトタイトルが未入力です");
        }else if(gift_text == ""){
                hideGiftInsertLoad();
                alert("ギフト説明文が未入力です");
        }else if(gift_image == ""){
                hideGiftInsertLoad();
                alert("ギフト画像が未登録です");
        }else if(gift_price == ""){
                hideGiftInsertLoad();
                alert("ギフト価格が未入力です");
        }else if(gift_stock == ""){
                hideGiftInsertLoad();
                alert("ギフト在庫数が未入力です");
        }else if(gift_stock > 999){
                hideGiftInsertLoad();
                alert("ギフト在庫数は0~999です");
        }else if(!Number.isInteger(Number(gift_stock)) || !Number.isInteger(Number(gift_price)) || gift_price < 1 || gift_stock < 0){
                hideGiftInsertLoad();
                alert("数値を1以上の整数で入力してください");
        }else{
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                // クラスのTestClassを作成
                var GiftData = ncmb.DataStore("giftData");
                var strong = 1000;
                var uid = new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16);
                // データストアへの登録
                var giftData = new GiftData();
                console.log(objectId,gift_title,gift_text,gift_price,gift_stock,uid)
                giftData.set("userId", objectId)
                        .set("giftTitle", gift_title)
                        .set("giftText", gift_text)
                        .set("price",gift_price)
                        .set("giftUid",uid)
                        .set("stock",gift_stock)
                        .save()
                        .then(function(gameScore){
                                // 保存後の処理
                                // var fileData = document.getElementById("file-data-gift").files[0];
                                if(!blob) {
                                        hideGiftInsertLoad();
                                        giftInputImageMissOpen();
                                }else{
                                        ncmb.File
                                        .upload(uid,blob)
                                        .then(function(res){
                                                // アップロード後処理
                                                hideGiftInsertLoad();
                                                giftInputOpen();
                                        })
                                        .catch(function(err){
                                                // エラー処理
                                                hideGiftInsertLoad();
                                                giftInputImageMissOpen();
                                        });
                                }
                                // ncmb.File
                                // .upload(uid,fileData)
                                // .then(function(res){
                                //         // アップロード後処理
                                //         hideGiftInsertLoad();
                                //         giftInputOpen();
                                // })
                                // .catch(function(err){
                                //         // エラー処理
                                //         hideGiftInsertLoad();
                                //         giftInputImageMissOpen();
                                // });
                        })
                        .catch(function(err){
                        // エラー処理
                                hideGiftInsertLoad();
                                giftInputMissOpen();
                        });
        }
}

function giftEdit() {
        showGiftEditLoad();
        //ユーザーの入力したデータを変数にセットする
        var gift_title = $("#gift_title_edit").val();            //お名前
        var gift_text = $("#gift_text_edit").val();     //メールアドレス
        var gift_price = $("#gift_price_edit").val();      //パスワード
        var gift_stock = $("#gift_stock_edit").val();
        var gift_image = $('#file-data-gift-edit').val().length;
        if(gift_title ==''){
                hideGiftEditLoad();
                alert("ギフトタイトルが未入力です");
        }else if(gift_text == ""){
                hideGiftEditLoad();
                alert("ギフト説明文が未入力です");
        }else if(gift_price == ""){
                hideGiftEditLoad();
                alert("ギフト価格が未入力です");
        }else if(gift_price % 100 != 0){
                hideGiftEditLoad();
                alert("価格を100円単位で設定してください")
        }else if(gift_stock == ""){
                hideGiftEditLoad();
                alert("ギフト在庫数が未入力です");
        }else if(gift_stock > 999){
                hideGiftEditLoad();
                alert("ギフト在庫数は0~999です");
        }else if(!Number.isInteger(Number(gift_stock)) || !Number.isInteger(Number(gift_price)) || gift_price < 1 || gift_stock < 0){
                hideGiftEditLoad();
                alert("数値を1以上の整数で入力してください");
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
                                        .update();

                                if(gift_image != ""){
                                        if(!blob) {
                                                hideGiftEditLoad();
                                                giftEditImageMissOpen();
                                        }else{
                                                ncmb.File
                                                .upload(uid,blob)
                                                .then(function(res){
                                                        // アップロード後処理
                                                        hideGiftEditLoad();
                                                        giftEditOpen();
                                                })
                                                .catch(function(err){
                                                        // エラー処理
                                                        hideGiftEditLoad();
                                                        giftEditImageMissOpen();
                                                });
                                        }
                                        // var fileData = document.getElementById("file-data-gift-edit").files[0];
                                        // console.log(fileData);
                                        // ncmb.File
                                        // .upload(uid,fileData)
                                        // .then(function(res){
                                        //         // アップロード後処理
                                        //         hideGiftEditLoad();
                                        //         giftEditOpen();
                                        // })
                                        // .catch(function(err){
                                        //         // エラー処理
                                        //         hideGiftEditLoad();
                                        //         giftEditImageMissOpen();
                                        // });
                                }else{
                                        hideGiftEditLoad();
                                        giftEditOpen();
                                }
                        })
                        .catch(function(err){
                                hideGiftEditLoad();
                                giftEditMissOpen();
                        });
        }
}

function giftNowInfo(){
        var gift_title = $('#gift_detail_title').html();
        var gift_text = $('#gift_detail_text').html();
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
        $("#giftInsertButtonZone").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
}

function hideGiftInsertLoad() {
        $("#giftInsertButtonZone").LoadingOverlay("hide");
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