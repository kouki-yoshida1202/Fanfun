function myHoukokuSend() {
        //ユーザーの入力したデータを変数にセットする
        var houkoku_text = $("#houkoku_text").val();
        var currentUser = ncmb.User.getCurrentUser();
        var sendUserId = currentUser.get("objectId");
        var houkoku_gift_id = $("#houkokuform_gift_id").val();
        var houkokuform_gift_name = $("#houkokuform_gift_name").val();
        var houkokuform_gift_username = $("#houkokuform_gift_username").val();
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
                        var currentUser = ncmb.User.getCurrentUser();
                        var userName = currentUser.get("userName");
                        var mailaddress = currentUser.get("mailAddress");
                        houkokuMailSend(houkoku_gift_id,houkoku_text,houkokuform_gift_name,houkokuform_gift_username,userName,mailaddress);
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
        var houkokuform_gift_name = $("#houkokuform_gift_name").val();
        var houkokuform_gift_username = $("#houkokuform_gift_username").val();
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
                        var currentUser = ncmb.User.getCurrentUser();
                        var userName = currentUser.get("userName");
                        var mailaddress = currentUser.get("mailAddress");
                        houkokuMailSend(houkoku_gift_id,houkoku_text,houkokuform_gift_name,houkokuform_gift_username,userName,mailaddress);
                })
                .catch(function(err){
                        // エラー処理
                        houkokuMissClose();
                });
        }
}

function houkokuMailSend(gift_id,houkoku_text,houkokuform_gift_name,houkokuform_gift_username,userName,mailaddress){
        $.ajax({
                type: 'post',
                url: 'https://fanfun2020.xsrv.jp/houkokuMail.html',
                data: {
                        'gift_id': gift_id,
                        'houkoku_text':houkoku_text,
                        'houkokuform_gift_name':houkokuform_gift_name,
                        'houkokuform_gift_username':houkokuform_gift_username,
                        'userName':userName,
                        'mailaddress':mailaddress
                },
                success: function(data){
                        console.log("----success.----");
                }
        });
}