function myHoukokuSend() {
        //ユーザーの入力したデータを変数にセットする
        var houkoku_text = $("#houkoku_text").val();
        var currentUser = ncmb.User.getCurrentUser();
        var sendUserId = currentUser.get("objectId");
        var houkoku_gift_id = $("#houkokuform_gift_id").val();
        //入力規則およびデータをフィールドにセットする
        if(houkoku_text == ""){
                houkokuNoOpen();
        }else{
                // クラスのTestClassを作成
                var Houkoku = ncmb.DataStore("Houkoku");
                // データストアへの登録
                var houkoku = new Houkoku();

                houkoku
                .set("sendUserId", sendUserId)
                .set("houkokuText", houkoku_text)
                .set("houkokuGiftId", houkoku_gift_id)
                .save()
                .then(function(){
                        // 保存後の処理
                        houkokuCheckOpen();
                        houkokuMailSend(houkoku_gift_id,houkoku_text);
                })
                .catch(function(err){
                        // エラー処理
                        houkokuMissClose();
                });
        }
}

function houkokuSend() {
        //ユーザーの入力したデータを変数にセットする
        var houkoku_text = $("#houkoku_text").val();
        var currentUser = ncmb.User.getCurrentUser();
        var sendUserId = currentUser.get("objectId");
        var houkoku_gift_id = $("#houkokuform_gift_id").val();
        //入力規則およびデータをフィールドにセットする
        if(houkoku_text == ""){
                houkokuNoOpen();
        }else{
                // クラスのTestClassを作成
                var Houkoku = ncmb.DataStore("Houkoku");
                // データストアへの登録
                var houkoku = new Houkoku();

                houkoku
                .set("sendUserId", sendUserId)
                .set("houkokuText", houkoku_text)
                .set("houkokuGiftId", houkoku_gift_id)
                .save()
                .then(function(){
                        // 保存後の処理
                        houkokuCheckOpen();
                        houkokuMailSend(houkoku_gift_id,houkoku_text);
                })
                .catch(function(err){
                        // エラー処理
                        houkokuMissClose();
                });
        }
}

function houkokuMailSend(gift_id,houkoku_text){
        $.ajax({
                type: 'post',
                url: 'https://fanfun2020.xsrv.jp/houkokuMail.html',
                data: {
                        'gift_id': gift_id,
                        'houkoku_text':houkoku_text
                },
                success: function(data){
                        console.log("----success.----");
                }
        });
}