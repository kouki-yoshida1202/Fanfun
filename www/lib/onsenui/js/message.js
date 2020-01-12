function messageSend() {
        
        //ユーザーの入力したデータを変数にセットする
        var message_to_userId = $("#message_to_userId").val();            //お名前
        var message_title = $("#message_title").val();     //メールアドレス
        var message_text = $("#message_text").val();      //パスワード
        var message_gift_id = $("#message_gift_id").val();
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        //入力規則およびデータをフィールドにセットする
        if(message_to_userId == "" || message_title==""||message_text=="" ||message_gift_id==""){
                alert("入力されていません");
        }else{
                // クラスのTestClassを作成
                var Notification = ncmb.DataStore("Notification");
                // データストアへの登録
                var notification = new Notification();

                notification
                .set("fromUserId", objectId)
                .set("toUserId", message_to_userId)
                .set("messageTitle", message_title)
                .set("messageText", message_text)
                .set("messageGiftId", message_gift_id)
                .set("readStatus",0)
                .save()
                .then(function(){
                        // 保存後の処理
                        alert("送信OK");
                })
                .catch(function(err){
                        // エラー処理
                        alert("失敗");
                });
        }
}