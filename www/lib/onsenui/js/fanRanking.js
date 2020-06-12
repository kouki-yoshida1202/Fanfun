function fanRanking(pageKind){
        showLoad();
        if(pageKind=="mypage"){
                var userId = $('.current_user_id').val();
        }else if(pageKind=="otherpage"){
                var userId = $('#other_page_user_id').val();
        }else{
                alertNew("情報取得に失敗しました。","","");
                exit;
        }

        ncmb.User
        .equalTo("objectId",userId)
        .fetch()
        .then(function(results){
                var userName = results.get("userName");
                $('#fanRankName').html(userName);
                ncmb.File.download(userId, "blob")
                .then(function(fileData) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                        var img = document.getElementById("fanRankImg");
                        img.src = reader.result;
                        }
                        // DataURLとして読み込む
                        reader.readAsDataURL(fileData);
                })
                .catch(function(err){
                // エラー処理
                console.log('error = ' + err);
                });
        }).catch(function(err){
                console.log(err);
        });

        var giftLog = ncmb.DataStore("giftLog");
        giftLog
        .equalTo('giftCreateInfluencer',userId)
        .fetchAll()         
        .then(function(results){
                var buyUserArray = [];
                if(results.length==0){
                        hideLoad();
                }
                for (var i = 0; i < results.length; i++) {
                        var buyUser = results[i].get("buyUser");
                        var buyKakaku = results[i].get("buyKakaku");
                        
                        if (buyUserArray[buyUser]){
                                // 存在しない
                                var beforeKakaku = buyUserArray[buyUser];
                                buyUserArray[buyUser] = Number(beforeKakaku)+Number(buyKakaku);
                        }else{
                                // 存在するからお金だけプラス
                                buyUserArray[buyUser]=Number(buyKakaku);
                        }
                        
                        // console.log(userAndKakaku);
                        
                }
                let arr = Object.keys(buyUserArray).map((e)=>({ key: e, value: buyUserArray[e] }));
                arr.sort(function(a,b){
                        if(a.value < b.value) return 1;
                        if(a.value > b.value) return -1;
                        return 0;
                });
                return arr;
        }).then(function(arr){
                console.log(arr);
                for (var i = 0; i < arr.length; i++) {
                        var userId = arr[i]["key"];
                        var point = arr[i]['value'];
                        console.log(point);
                        console.log(userId);
                        if(i+1==arr.length){
                                userAndPoint(userId,point,i+1,"last");
                        }else{
                                userAndPoint(userId,point,i+1,"");
                        }
                        fanRankImg(i+1,userId);
                }
        }).catch(function(err){
                console.log(err);
        });
}

function userAndPoint(userId,point,i,lastcheck){
        ncmb.User
        .equalTo("objectId",userId)
        .fetch()
        .then(function(results){
                var userName = results.get("userName");
                console.log(userName,point,i);
                $('#fanRank_'+i+'_name').text(i+"."+userName);
                $('#fanRank_'+i+'_tag').text(point+"pt");
                $('#fanRankUserId_'+i).val(userId);
                if(lastcheck=="last"){
                        hideLoad();
                        console.log("ラスト");
                }
        }).catch(function(err){
                console.log(err);
        });
}

function fanRankImg(j,userId){
        ncmb.File.download(userId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                var img = document.getElementById("fanRank_"+j+"_img");
                img.src = reader.result;
                console.log(j);
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
        })
        .catch(function(err){
        // エラー処理
        console.log('error = ' + err);
        });
}

function clickFanRank(rank){
        var userId = $('#fanRankUserId_'+rank).val();

        var currentUser = ncmb.User.getCurrentUser();
        var userKind = currentUser.get("userKind");
        if(userKind != "test"){
                document.getElementById('navi').bringPageTop('otherpage.html');
                otherPageUserId(userId);
        }
}