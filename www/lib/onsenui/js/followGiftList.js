function followUserGift(){
        $("#followGiftList").empty();
        showLoad();
        setTimeout(function(){
                hideLoad();
        }, 1500);
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        $('.current_user_id').val(objectId);
        var userName = currentUser.get("userName");
        var GiftData = ncmb.DataStore("giftData");
        //データストアから取得して、1件表示する

        var FollowData = ncmb.DataStore("follow");
        FollowData
        .equalTo("followId", objectId)
        .fetchAll()
        .then(function(results){
                var follow_user = results;
                var follow_user_id = [];
                for(var k=0;k<follow_user.length;k++){
                        follow_user_id.push(follow_user[k].get("followerId"));
                }
                return follow_user_id;
        })
        .then(function(follow_user_id){
                GiftData
                .order('createDate', true)
                .in('userId',follow_user_id)
                .fetchAll()                
                .then(function(results){
                        var object = results;
                        for(var i=0;i<object.length;i++){
                                var gift_title = object[i].get("giftTitle");
                                var gift_text =object[i].get("giftText");
                                var create_date = object[i].get("createDate");
                                var time = jikanCulc(create_date);
                                var gift_uid = object[i].get("giftUid");
                                var gift_price = object[i].get("price");
                                var gift_stock = object[i].get("stock");
                                var gift_user_id = object[i].get("userId");
                                
                                //カードに出力していく
                                var card = `
                                <div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                `;
                                card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"');";
                                card +=`
                                ">
                                        <input class="gift_uid" type="" value="`;
                                        card += gift_uid;
                                        card += `
                                        " hidden>
                                        <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                <div class="card__content" style="height:auto;">
                                                        <img id="`;
                                                        card += "follow_gift_image_top_"+i;
                                                        card +=`"class="gift_image" src="img/loading.png" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                                </div>
                                                <div class="card__content" style="height:45px;">
                                                        <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                        <li class="list-item" style="padding:0px;">
                                                                <div class="list-item__left" style="padding:0px;">
                                                                <img class="list-item__thumbnail" id="follow_gift_user_image_top_`;
                                                                card += i;
                                                                card +=`" src="img/human.png" alt="" style="border-radius: 50%;">
                                                                </div>
                                                        
                                                                <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                <div id="follow_gift_user_name_top_`;
                                                                card +=i;
                                                                card +=`" class="current_user_name" style="text-align: left;">
                                                                </div>
                                                                </div>
                                                        </li>
                                                        </ul>
                                                </div>
                                                <div class="gift_text" style="height:60px;font-size:12px;padding:5px;">
                                                `;
                                                card += gift_title;
                                                card += `
                                                </div>
                                                <div style="height:20px;">
                                                        <button class="toolbar-button" style="font-size:12px;padding:0px;">
                                                                <i id="`;
                                                                card += "follow_gift_favorite_"+i;
                                                                card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                                card += "follow_gift_favorite_span_"+i;
                                                                card +=`"class="favorite_off">0</span>
                                                        </button>
                                                        <button class="toolbar-button" style="font-size:12px;padding:0px;">
                                                                <span style="font-size:12px;color:gray">残:`;
                                                                card += gift_stock;
                                                                card +=`</span>
                                                        </button>
                                                        <button class="toolbar-button" style="font-size:12px;padding:0px;float: right;">
                                                                <span style="color:#898989">
                                                                `;
                                                                card += time;
                                                                card +=`
                                                                </span>
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                                `;
                                // console.log(card);
                                $('#followGiftList').append(card);
                                followgiftUserGet(gift_user_id,i);
                                followgiftImageGetTop(gift_uid,i);
                                followgiftUserImageTop(gift_user_id,i);
                                followgift_favorite_check(gift_uid,i);
                        }
                        
                        syoryaku();
                })
                .catch(function(err){
                        console.log(err);
                });   
        });
}

function followgiftUserGet(gift_user_id,i){
        ncmb.User
        .equalTo("objectId", gift_user_id)
        .fetch()
        .then(function(results){
                var gift_user_name = results.get("userName");
                var gift_user_name_top = "follow_gift_user_name_top_"+i;
                document.getElementById(gift_user_name_top).innerHTML = gift_user_name;
        });
}

function followgiftImageGetTop(giftUid,i){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_image_place = "follow_gift_image_top_"+i;
                        var img = document.getElementById(gift_image_place);
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

function followgiftUserImageTop(gift_user_id,i){
        ncmb.File.download(gift_user_id, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_userimage = "follow_gift_user_image_top_"+i;
                        var img = document.getElementById(gift_userimage);
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

////////////////////////////////
    // ギフト一覧でイイネ数を表示する関数
function followgift_favorite_check(gift_uid,i){

var currentUser = ncmb.User.getCurrentUser();
var myUserId = currentUser.get('objectId');

var GiftFavorite = ncmb.DataStore("GiftFavorite");

GiftFavorite
.equalTo("giftUid", gift_uid)
.fetchAll()
.then(function(results){
        var favorite_count = results.length;
        $('#follow_gift_favorite_span_'+i).html(favorite_count);
});


GiftFavorite
.equalTo("UserId", myUserId)
.equalTo("giftUid", gift_uid)
.fetch()               
.then(function(results){
        if(Object.keys(results).length != 0){
        $('#follow_gift_favorite_'+i).addClass("favorite_on").removeClass("favorite_off");
        $('#follow_gift_favorite_span_'+i).addClass("favorite_on").removeClass("favorite_off");
        }else{
        $('#follow_gift_favorite_'+i).removeClass("favorite_on").addClass("favorite_off");
        $('#follow_gift_favorite_span_'+i).removeClass("favorite_on").addClass("favorite_off");
        }
})
.catch(function(err){
        console.log(err);
});
}
