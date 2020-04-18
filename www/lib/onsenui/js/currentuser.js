function loginInfo(){
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var text = currentUser.get('Text');
        var objectId = currentUser.get("objectId");
        var Genre = currentUser.get("Genre");
        var BoughtCount = "("+currentUser.get("BoughtCount")+")";
        $('#myGenre').empty();
        
        // if(objectId == "V5wsDER2rALwDReh"){
        //         $('#kanrisyabox').show();
        // }
        if(Genre){
                for(var n=0;n<Genre.length;n++){
                        $('#myGenre').append(" #"+Genre[n]);
                }
        }
        $('#mypage_user_name').html(userName);
        $('.current_text').html(text);
        $('.current_user_id').val(objectId);
        // $('#myGenre').html(Genre);
        // var star = `<i class="fas fa-star" style="font-size: 12px;color:#FFBB00;"></i>`;
        // var no_star = `<i class="fas fa-star" style="font-size: 12px;color:gray;"></i>`;
        // $('#myReview').empty();
        // for(var i=0;i<5;i++){
        //         if(i<Review){
        //                 $('#myReview').append(star);
        //         }else{
        //                 $('#myReview').append(no_star);
        //         }
        // }
        // var myBoughtCount = `<span id="myBoughtCount"style="color:#898989;font-size: 12px;">`+BoughtCount+`</span>`;
        // $('#myReview').append(myBoughtCount);
        //フォローフォロワー数
        var FollowData = ncmb.DataStore("follow");

        ncmb.DataStore("follow");
        FollowData
        .equalTo("followerId", objectId)
        .fetchAll()               
        .then(function(results){
                var object = results;
                var followerNumber = object.length;
                $('#my_follower_number').html(followerNumber);
        })
        .catch(function(err){
                console.log(err);
        }); 
        FollowData
        .equalTo("followId", objectId)
        .fetchAll()               
        .then(function(results){
                var object = results;
                var followNumber = object.length;
                $('#my_follow_number').html(followNumber);
        })
        .catch(function(err){
                console.log(err);
        }); 

        //ログイン情報取得ミスでログイン画面に戻す
        if (currentUser) {
        } else {
                alert("不明なエラーが発生しました");
                window.location.href = 'index.html';
        }
}
function profilePage(){
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var text = currentUser.get('Text');
        var objectId = currentUser.get("objectId");

        if (currentUser) {
                setTimeout(function() {
                        $('#current_user_name_profile').val(userName);
                        $('#current_mailaddress_profile').val(mailaddress);
                        $('#current_text_profile').val(text);
                }, 500);
                
        }
}
function loginImage(){
        setTimeout(function() {
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                $('#user_image').height($('#user_image').width());

                ncmb.File.download(objectId, "blob")
                .then(function(fileData) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                        var img = document.getElementById("user_image");
                        img.src = reader.result;
                        }
                        // DataURLとして読み込む
                        reader.readAsDataURL(fileData);
                })
                .catch(function(err){
                // エラー処理
                console.log('error = ' + err);
                });
        }, 2000);
        
}

function loginImageEdit(){
        setTimeout(function() {
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                $('#image_edit').height($('#image_edit').width());


                ncmb.File.download(objectId, "blob")
                .then(function(fileData) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                        var img = document.getElementById("image_edit");
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