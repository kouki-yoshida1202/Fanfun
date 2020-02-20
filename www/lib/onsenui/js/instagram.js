function instaPush() {
        //ユーザーの入力したデータを変数にセットする
        var insta_url = $("#insta_url").val();
        var strong = 1000;
        var insta_uid = new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
        //入力規則およびデータをフィールドにセットする
        if(insta_url == ""){
                alert("入力されていません");
        }else{
                // クラスのTestClassを作成
                var InstagramNews = ncmb.DataStore("InstagramNews");
                // データストアへの登録
                var instagramnews = new InstagramNews();

                instagramnews
                .set("InstaUrl", insta_url)
                .set("InstaUid",insta_uid)
                .save()
                .then(function(){
                        var fileData = document.getElementById("insta-data").files[0];
                
                        ncmb.File
                        .upload(insta_uid,fileData)
                        .then(function(res){
                                // アップロード後処理
                                alert("送信OK");
                        })
                        .catch(function(err){
                                // エラー処理
                                alert("写真失敗");
                        });
                })
                .catch(function(err){
                        // エラー処理
                        alert("失敗");
                });
        }
}
function aiueo(link){
        // どっちか使う
        window.open(link, '_blank', 'location=yes');
        return false;
}
function InstagramNews(){
        $("#js-instalib").empty();
        var accessToken = '21244683227.1677ed0.cfdf4f10b42f45ea8a0aa9b84b71b0f0'; //取得したアクセストークンを貼り付ける
        $.getJSON('https://api.instagram.com/v1/users/self/media/recent/?access_token='+accessToken+'&callback=?',function (insta) {
                
                $.each(insta.data,function (photos,src) {
                        if ( photos === 10 ) { return false; } //上限設定
                        $('<div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"><div class="card" style="height:99%;margin:3px;border-radius:20px;"><div class="card__content" style="height:auto;"><img src="'+src.images.standard_resolution.url+'"onclick="aiueo(`'+src.link+'`);" class="gift_image"alt="" style="width:100%;height:125px;border-radius: 20px;"></div></div></div>').appendTo('#js-instalib');
                });
                $('.gift_image').height($('.gift_image').width());
        });        
}
