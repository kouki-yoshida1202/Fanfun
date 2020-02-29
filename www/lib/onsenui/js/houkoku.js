function myHoukokuSend() {
    //ユーザーの入力したデータを変数にセットする
    var houkoku_text = $("#houkoku_text").val();
    var currentUser = ncmb.User.getCurrentUser();
    var sendUserId = currentUser.get("objectId");
    var houkoku_gift_id = $("#my_gift_id").val();
    //入力規則およびデータをフィールドにセットする
    if(houkoku_text == ""){
            alert("入力されていません");
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
                    alert("送信OK");
                    mygiftHoukokuClose();
            })
            .catch(function(err){
                    // エラー処理
                    alert("失敗");
            });
    }
}

function houkokuSend() {
        //ユーザーの入力したデータを変数にセットする
        var houkoku_text = $("#houkoku_text").val();
        var currentUser = ncmb.User.getCurrentUser();
        var sendUserId = currentUser.get("objectId");
        var houkoku_gift_id = $("#gift_id").val();
        //入力規則およびデータをフィールドにセットする
        if(houkoku_text == ""){
                alert("入力されていません");
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
                        alert("送信OK");
                        detailHoukokuClose();
                })
                .catch(function(err){
                        // エラー処理
                        alert("失敗");
                });
        }
    }