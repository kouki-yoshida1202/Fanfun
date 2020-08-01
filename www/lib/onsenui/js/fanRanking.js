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
        var n=0;
        var buyUserArray = [];
        var arr = fanRankArrayPush(buyUserArray,n,userId);
        console.log(arr);
}

function fanRankArrayPush(buyUserArray,n,userId){
        console.log("きたよ");
        var giftLog = ncmb.DataStore("giftLog");
        giftLog
        .order("createDate",true)
        .skip(100*n)
        .equalTo('giftCreateInfluencer',userId)
        .fetchAll()         
        .then(function(results){
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
                }
                console.log(buyUserArray);
                if(results.length==100){
                        fanRankArrayPush(buyUserArray,n+1,userId);
                }else{
                        let arr = Object.keys(buyUserArray).map((e)=>({ key: e, value: buyUserArray[e] }));
                        arr.sort(function(a,b){
                                if(a.value < b.value) return 1;
                                if(a.value > b.value) return -1;
                                return 0;
                        });        
                        fanRankArrayClean(arr);
                }
        }).catch(function(err){
                console.log(err);
        });
}
function fanRankArrayClean(arr){
        for (var i = 0; i < 9; i++) {
                if(arr.length<=i){
                        var j = i+1;
                        $('#fanRank_'+j).css("display","none");
                        hideLoad();
                }else{
                        var userId = arr[i]["key"];
                        var point = arr[i]['value'];
                        if(i==8){
                                userAndPoint(userId,point,i+1,"last");
                        }else{
                                userAndPoint(userId,point,i+1,"");
                        }
                        fanRankImg(i+1,userId);
                }
        }
}

function userAndPoint(userId,point,i,lastcheck){
        ncmb.User
        .equalTo("objectId",userId)
        .fetch()
        .then(function(results){
                var userName = results.get("userName");
                $('#fanRank_'+i+'_name').text(i+"."+userName);
                $('#fanRank_'+i+'_tag').text(point+"pt");
                $('#fanRankUserId_'+i).val(userId);
                if(lastcheck=="last"){
                        hideLoad();
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
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
        })
        .catch(function(err){
        // エラー処理
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

function fanRankPresentPageOpen(){
        setTimeout(() => {
                $('#itemKakaku').hide();
                $('#itemKakakuRadio').hide();
                $('#itemKakakuRadio2').hide();
                $('#meyasuKakakuZone').hide();
                $('#fanRankPresentText').css("display","block");
                $('#4_area').hide();
                $('#5_area').hide();
                $('#6_area').hide();
                $('#7_area').hide();
                $('#4_area_fanRank').css("display","block");
                $('#giftPresentButtonZone').css("display","block");
                $('#giftShitagakiButtonZone').css("display","none");
                $('#giftInsertButtonZone').css("display","none");
        }, (500));
}