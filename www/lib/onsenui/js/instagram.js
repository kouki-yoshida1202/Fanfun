function instaPush() {
        //ユーザーの入力したデータを変数にセットする
        var insta_url = $("#insta_url").val();
        var strong = 1000;
        var insta_uid = new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
        //入力規則およびデータをフィールドにセットする
        if(insta_url == ""){
                alertNew("入力されていません","","");
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
                                alertNew("送信OK","","");
                        })
                        .catch(function(err){
                                // エラー処理
                                alertNew("写真失敗","","");
                        });
                })
                .catch(function(err){
                        // エラー処理
                        alertNew("失敗","","");
                });
        }
}
function instagramOpen(link){
        // どっちか使う
        window.open(link, '_system', 'location=yes');
        return false;
}
function InstagramNews(){
        showLoad();
        $("#js-instalib").empty();
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var userKind = currentUser.get("userKind");
        if(userKind != "test"){
                this.name = "fanfun_fanfun";
                $.ajax('https://www.instagram.com/' + this.name + '/', {
                        timeout: 2000,
                        datatype: 'html'
                }).then(function (data) {
                        json_string = data.split("window._sharedData = ")[1];
                        json_string = json_string.split("};</script>")[0] + "}";
                        this.Arrya_data = JSON.parse(json_string);
                        let datas = this.Arrya_data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
                        for (i in datas) {
                                console.log(datas[i]);
                                url = datas[i].node.display_url;
                                shortcode = datas[i].node.shortcode;

                                openUrl = 'https://www.instagram.com/p/'+shortcode;
                                this.html = `
                                <div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"><div class="card" style="height:99%;margin:3px;border-radius:20px;"><div class="card__content" style="height:auto;"><img src="${url}"onclick="instagramOpen('${openUrl}');" class="gift_image"alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;"></div></div></div>
                                `;
                                $("#js-instalib").append(this.html);
                                if(i==datas.length-1){
                                        hideLoad();
                                }
                        }
                }).catch(function(){
                        hideLoad();
                });
                // var accessToken = '21244683227.1677ed0.cfdf4f10b42f45ea8a0aa9b84b71b0f0'; //取得したアクセストークンを貼り付ける
                // $.getJSON('https://api.instagram.com/v1/users/self/media/recent/?access_token='+accessToken+'&callback=?',function (insta) {
                //         console.log(insta);
                //         $.each(insta.data,function (photos,src) {
                //                 if ( photos ===  8) { return false; } //上限設定
                //                 $('<div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"><div class="card" style="height:99%;margin:3px;border-radius:20px;"><div class="card__content" style="height:auto;"><img src="'+src.images.standard_resolution.url+'"onclick="instagramOpen(`'+src.link+'`);" class="gift_image"alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;"></div></div></div>').appendTo('#js-instalib');
                //         });
                // });        
        }else{
                var insta = `<div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"><div class="card" style="height:99%;margin:3px;border-radius:20px;"><div class="card__content" style="height:auto;"><img src="img/loading.png" class="gift_image"alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;"></div></div></div>`;
                $('#js-instalib').append(insta);
                hideLoad();
        }
}
