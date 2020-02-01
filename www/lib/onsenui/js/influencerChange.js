function changeInfluencer(){

        //APIキーの設定とSDKの初期化
        var appKey    = "2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58";
        var clientKey = "e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06";
        var ncmb    　= new NCMB(appKey,clientKey);
        ncmb.sessionToken = "<sessionToken>";

        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get('objectId');
        var user = new ncmb.User();
        var genre = $('.checkbox__input:checked').map(function() {
                return $(this).val();
        }).get();
        //更新処理開始
        user
        .set('objectId', objectId)
        .set("BoughtCount",0)
        .set("Review",0)
        .set("Genre",genre)
        .set("Influencer",true)
        .update()
        .then(function(data) {
                // 更新完了
                // 運営へ通知
                monaca.cloud.Mailer.sendMail("oid", "template_name", null)
                .done(function(result) {
                console.log("Send mail success");
                })
                .fail(function(err) {
                console.log("Mail Err#" + err.code +": " + err.message);
                });
                alert('申請が完了致しました。運営より登録頂いたメールアドレスに後ほどご連絡致します。');
        })
        .catch(function(err) {
        // エラー
                alert('更新が失敗しました。');
        });               
        
}
