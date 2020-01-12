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

function InstagramNews(){
        $("#instaNews").empty();
        //データストアから取得して、1件表示する
        var InstagramNews = ncmb.DataStore("InstagramNews");

        InstagramNews
        .order('createDate', true)
        .fetchAll()                
        .then(function(results){
                var object = results;
                for(var i=0;i<object.length;i++){
                        var insta_uid = object[i].get("InstaUid");
                        var insta_url =object[i].get("InstaUrl");
                        var create_date = object[i].get("createDate");
                        // var time = jikanCulc(create_date);
                
                        //カードに出力していく
                        var card = `
                        <div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                        `;
                        card += "window.open('"+insta_url+"');";
                        card +=`
                        ">
                                <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                        <div class="card__content" style="height:auto;">
                                                <img id="`;
                                                card += "insta_image_top_"+i;
                                                card +=`"class="gift_image" src="" alt="" style="width:100%;height:125px;border-radius: 20px;">
                                        </div>
                                </div>
                        </div>
                        `;
                        $('#instaNews').append(card);
                        $('.gift_image').height($('.gift_image').width());
                        InstaImageGetTop(insta_uid,i);
                }
        })
        .catch(function(err){
                console.log(err);
        });        
}

function InstaImageGetTop(InstaUid,i){
        ncmb.File.download(InstaUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var insta_image_top = "insta_image_top_"+i;
                        var img = document.getElementById(insta_image_top);
                        img.src = reader.result;
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
        })
        .catch(function(err){
        // エラー処理
        console.log('error = ' + err);
        });
}