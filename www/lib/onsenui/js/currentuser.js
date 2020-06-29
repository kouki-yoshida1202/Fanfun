function loginInfo(){
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var text = currentUser.get('Text');
        var objectId = currentUser.get("objectId");
        var Genre = currentUser.get("Genre");
        var userKind = currentUser.get("userKind");
        var URLtwitter = currentUser.get("URLtwitter");
        var URLinstagram = currentUser.get("URLinstagram");
        var URLyoutube = currentUser.get("URLyoutube");
        var URLfanfun = currentUser.get("URLfanfun");
        $('#myGenre').empty();
        
        if(objectId == "V5wsDER2rALwDReh" || objectId=="sKRzVvf4gBcZFDNT"){
                $('#kanrisyabox').show();
        }
        if(Genre){
                for(var n=0;n<Genre.length;n++){
                        $('#myGenre').append(" #"+Genre[n]);
                }
        }
        $('#mypage_user_name').html(userName);
        $('.current_text').html(text);
        $('.current_user_id').val(objectId);
        $('#myTwitterURL').val(URLtwitter);
        $('#myInstagramURL').val(URLinstagram);
        $('#myYouTubeURL').val(URLyoutube);
        $('#myFanfunURL').val(URLfanfun);
        
        if(URLtwitter == ''||URLtwitter==null){
                $('#myTwitter').hide();
        }
        if(URLinstagram == ''||URLinstagram==null){
                $('#myInstagram').hide();
        }
        if(URLyoutube == ''||URLyoutube==null){
                $('#myYouTube').hide();
        }
        if(URLfanfun == ''||URLfanfun==null){
                $('#myFanfun').hide();
        }

        if(userKind=="test"){
                $('#mypageFanRankDiv').hide();
                $('#myPageShare').hide();
                $('#myPageGuide').hide();
        }
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

        var kyujosyoData = ncmb.DataStore("kyujosyoData");
        kyujosyoData
        .equalTo("userId", objectId)
        .fetch()               
        .then(function(result){
                if(result){
                        var rank = Number(result.get("rank"));
                        if(0<rank && rank<16){
                                console.log(rank);
                                $('#myPageRanking').css("display","block");
                                $('#myPagekyujosyoRanking').html("<i class='fas fa-crown'></i>急上昇ランキング"+rank+"位");
                        }
                }
        })
        .catch(function(err){
                console.log(err);
        }); 

        var crownData = ncmb.DataStore("crownData");
        crownData
        .equalTo("userId", objectId)
        .fetch()               
        .then(function(result){
                if(result){
                        var rank = Number(result.get("rank"));
                        if(0<rank && rank<16){
                                console.log(rank);
                                $('#myPageRanking').css("display","block");
                                $('#myPagekyujosyoRanking').html("<i class='fas fa-crown'></i>総合ランキング"+rank+"位");
                        }
                }
        })
        .catch(function(err){
                console.log(err);
        }); 

        //ログイン情報取得ミスでログイン画面に戻す
        if (currentUser) {
        } else {
                alertNew("不明なエラーが発生しました","","");
                window.location.href = 'logout.html';
        }
}
function profilePage(){
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var text = currentUser.get('Text');
        var objectId = currentUser.get("objectId");
        var URLtwitter = currentUser.get("URLtwitter");
        var URLinstagram = currentUser.get("URLinstagram");
        var URLyoutube = currentUser.get("URLyoutube");

        if (currentUser) {
                setTimeout(function() {
                        $('#current_user_name_profile').val(userName);
                        $('#current_mailaddress_profile').val(mailaddress);
                        $('#current_text_profile').val(text);
                        $('#editMyTwitterURL').val(URLtwitter);
                        $('#editMyInstagramURL').val(URLinstagram);
                        $('#editMyYouTubeURL').val(URLyoutube);
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