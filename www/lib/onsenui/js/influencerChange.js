function influencerChange(){

        //APIキーの設定とSDKの初期化
        var appKey    = "2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58";
        var clientKey = "e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06";
        var ncmb    　= new NCMB(appKey,clientKey);
        ncmb.sessionToken = "<sessionToken>";

        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get('objectId');
        var userName = currentUser.get("userName");
        var mailAddress = currentUser.get("mailAddress");
        var user = new ncmb.User();
        var genre = $('.checkbox__input:checked').map(function() {
                return $(this).val();
        }).get();
        //更新処理開始
        user
        .set('objectId', objectId)
        .set("Genre",genre)
        .set("Influencer",true)
        .update()
        .then(function(data) {
                // 更新完了
                // 運営へ通知
                $.ajax({
                        type: 'post',
                        url: 'https://fanfun2020.xsrv.jp/influencerOrder.html',
                        data: {
                                'username': userName,
                                'mailaddress':mailAddress,
                        },
                        success: function(data){
                                console.log("----success.----");
                        }
                });
                influencerChangeCheckOpen();
        })
        .catch(function(err) {
        // エラー
                influencerChangeMissOpen();
        });               
        
}