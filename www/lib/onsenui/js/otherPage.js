function followerNumber(){
        var FollowData = ncmb.DataStore("follow");
        FollowData
        .equalTo("followerId", other_user_id)
        .fetchAll()               
        .then(function(results){
                var object = results;
                var followerNumber = object.length;
                return followerNumber;
        })
        .catch(function(err){
                console.log(err);
        });  
}

function otherGiftUserImage(objectId,i){
        ncmb.File.download(objectId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_userimage = "other_gift_user_image_"+i;
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
function otherGiftImageGet(giftUid,i,gift_stock,auction){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_image_place = "other_gift_image_"+i;
                        
                        var img = document.getElementById(gift_image_place);
                        img.src = reader.result;
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
                if(gift_stock==0&& (auction=="通常出品" || auction=="価格自由")){
                        var sold_out = `<img class="sold_out" src="img/custom – 8.png" style="border-radius:20px;"></div>`;
                        $("#other_gift_image_"+i).after(sold_out);
                        $("#other_gift_image_"+i).addClass("sold_img");
                        $("#other_gift_image_"+i).parent().addClass("sold_img_parent");
                        $('#otherpage_card_content_'+i).css("margin-top","5px");
                }
        })
        .catch(function(err){
        // エラー処理
        console.log('error = ' + err);
        });
}


function otherPageUserId(other_user_id){     
        $('#otherGiftList').empty();
        $('#other_page_user_id').empty();
        $('#other_user_name').empty();
        $('#other_page_header').empty();
        $('#other_profile').empty();
        $('#otherFanfunURL').empty();
        $('#otherTwitterURL').empty();
        $('#otherInstagramURL').empty();
        $('#otherYouTubeURL').empty();
        $('#other_user_image').attr('src','img/human.png');
        $('#other_follow_button').removeClass("follow_on").html("フォローする");
        $('#otherPagekyujosyoRanking').empty();
        $('#otherPageSougouRanking').empty();
        ncmb.User
        .equalTo("objectId", other_user_id)
        .fetch()
        .then(function(results){
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                var influencer = results.get("Influencer");
                var authentication = results.get("Authentication");
                if(influencer==true && authentication=="OK"){
                        var other_user_name_title = results.get("userName") + " <span style='color:#FF6070;border:1px solid #FF6070;border-radius:20px;font-size:0.5em;padding:3px;vertical-align:middle;'>本人確認済</span>";
                        $('#fanRankDiv').show();
                }else{
                        var other_user_name_title = results.get("userName");
                        $('#fanRankDiv').hide();
                }

                var FollowData = ncmb.DataStore("follow");
                FollowData
                .equalTo("followerId", other_user_id)
                .equalTo("followId", objectId)
                .fetchAll()               
                .then(function(results){
                        if(results.length){
                                if(results[0].get("bellmark")=="ON"){
                                        other_user_name_title += "<i class='far fa-bell' style='color:white;background:#ff6070;border:1px solid;border-radius:50%;padding:4px;font-size:0.7em;transform:translateY(-1px);margin-left:5px;' onclick='bellmarkChange(`OFF`,`"+other_user_id+"`,`"+objectId+"`)'></i>";
                                }else{
                                        other_user_name_title += "<i class='far fa-bell-slash' style='color:#FF6070;margin-left:5px;' onclick='bellmarkChange(`ON`,`"+other_user_id+"`,`"+objectId+"`)'></i>";
                                }
                        }
                        $('#other_user_name').html(other_user_name_title);
                });  
                var other_user_name = results.get("userName");
                var other_profile_text = results.get("Text");
                var userKind = results.get("userKind");
                var Genre = results.get("Genre");
                var URLtwitter = results.get("URLtwitter");
                var URLfanfun = results.get("URLfanfun");
                var URLinstagram = results.get("URLinstagram");
                var URLyoutube = results.get("URLyoutube");
                $('#other_page_user_id').val(other_user_id);
                
                $('#other_page_header').html(other_user_name);
                $('#other_profile').html(other_profile_text);
                $('#otherFanfunURL').val(URLfanfun);
                $('#otherTwitterURL').val(URLtwitter);
                $('#otherInstagramURL').val(URLinstagram);
                $('#otherYouTubeURL').val(URLyoutube);
                if(URLtwitter == ''||URLtwitter==null){
                        $('#otherTwitter').hide();
                }
                if(URLinstagram == ''||URLinstagram==null){
                        $('#otherInstagram').hide();
                }
                if(URLyoutube == ''||URLyoutube==null){
                        $('#otherYouTube').hide();
                }
                if(URLfanfun == ''||URLfanfun==null){
                        $('#otherFanfun').hide();
                }
                if(userKind=="test"){
                        $('#otherPageMigiue').hide();
                }
                $('#otherGenre').empty();
                if(Genre){
                        for(var n=0;n<Genre.length;n++){
                                $('#otherGenre').append(" #"+Genre[n]);
                        }
                }
                ncmb.File.download(other_user_id, "blob")
                .then(function(fileData) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                        var img = document.getElementById("other_user_image");
                        img.src = reader.result;
                        }
                        // DataURLとして読み込む
                        reader.readAsDataURL(fileData);
                })
                .catch(function(err){
                // エラー処理
                });
                // ギフト情報を表示
                var GiftData = ncmb.DataStore("giftData");
                GiftData
                .equalTo("userId", other_user_id)
                .notEqualTo('ReleaseStatus',1)
                .fetchAll()                
                .then(function(results){
                        var syuppinnsu = "&emsp;"+results.length+" 出品&emsp;"
                        $('#otherGiftLength').html(syuppinnsu);
                });

                otherPageGiftList(other_user_id,other_user_name,0);
                // ブロックしてるかのチェック
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                var BlockList = ncmb.DataStore("BlockList");
                BlockList
                .equalTo("blockerId", objectId)
                .equalTo("blockedId", other_user_id)
                .fetchAll()               
                .then(function(results){
                        var object = results;
                        var block_check = object.length;
                        if(block_check > 0){
                                $('#blockCheck').addClass("onBlock").html("ブロック解除");
                        }
                })
                .catch(function(err){
                }); 

                //フォロー中かのチェック
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                var FollowData = ncmb.DataStore("follow");
                FollowData
                .equalTo("followId", objectId)
                .equalTo("followerId", other_user_id)
                .fetchAll()               
                .then(function(results){
                        var object = results;
                        var follow_check = object.length;
                        if(follow_check > 0){
                                $('#other_follow_button').addClass("follow_on").html("フォロー中");
                        }
                })
                .catch(function(err){
                }); 

                ncmb.DataStore("follow");
                FollowData
                .equalTo("followerId", other_user_id)
                .fetchAll()               
                .then(function(results){
                        var object = results;
                        var followerNumber = object.length;
                        $('#follower_number').html(followerNumber);
                })
                .catch(function(err){
                }); 
                
                FollowData
                .equalTo("followId", other_user_id)
                .fetchAll()               
                .then(function(results){
                        var object = results;
                        var followNumber = object.length;
                        $('#follow_number').html(followNumber);
                })
                .catch(function(err){
                }); 

                var kyujosyoData = ncmb.DataStore("kyujosyoData");
                kyujosyoData
                .equalTo("userId", other_user_id)
                .fetch()               
                .then(function(result){
                        if(Object.keys(result).length){
                                var rank = Number(result.get("rank"));
                                if(0<rank && rank<16){
                                        $('#otherPageRanking').css("display","block");
                                        $('#otherPagekyujosyoRanking').html("<i class='fas fa-crown'></i>急上昇ランキング"+rank+"位");
                                }
                        }
                });

                var crownData = ncmb.DataStore("crownData");
                crownData
                .equalTo("userId", other_user_id)
                .fetch()               
                .then(function(result){
                        if(Object.keys(result).length){
                                var rank = Number(result.get("rank"));
                                if(0<rank && rank<16){
                                        $('#otherPageRanking').css("display","block");
                                        $('#otherPageSougouRanking').html("<i class='fas fa-crown'></i>総合ランキング"+rank+"位");
                                }
                        }
                });
        });
}

////////////////////////////////
// ギフト一覧でイイネ数を表示する関数
function otherPageGiftFavorite(gift_uid,i){
var currentUser = ncmb.User.getCurrentUser();
var myUserId = currentUser.get('objectId');

var GiftFavorite = ncmb.DataStore("GiftFavorite");

GiftFavorite
.equalTo("giftUid", gift_uid)
.fetchAll()
.then(function(results){
        var favorite_count = results.length;
        $('#otherPage_favorite_span_'+i).html(favorite_count);
});


GiftFavorite
.equalTo("UserId", myUserId)
.equalTo("giftUid", gift_uid)
.fetch()               
.then(function(results){
        if(Object.keys(results).length != 0){
        $('#otherPage_favorite_'+i).addClass("favorite_on").removeClass("favorite_off");
        $('#otherPage_favorite_span_'+i).addClass("favorite_on").removeClass("favorite_off");
        }else{
        $('#otherPage_favorite_'+i).removeClass("favorite_on").addClass("favorite_off");
        $('#otherPage_favorite_span_'+i).removeClass("favorite_on").addClass("favorite_off");
        }
})
.catch(function(err){
        console.log(err);
});
}


function showLoadOtherPage(){
        $("#otherGiftList").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
}

function hideLoadOtherPage() {
        $("#otherGiftList").LoadingOverlay("hide");
};

function otherPageGiftList(other_user_id,other_user_name,otherPageCounter){
        if(otherPageCounter==0){
                showLoadOtherPage();
        }
        // ギフト情報を表示
        var GiftData = ncmb.DataStore("giftData");
        GiftData
        .order('releaseDate', true)
        .order('giftTitle', true)
        .equalTo("userId", other_user_id)
        .notEqualTo('ReleaseStatus',1)
        .limit(10)
        .skip(otherPageCounter*10)
        .fetchAll()                
        .then(function(results){
                var object = results;
                if(object.length==0){
                        hideLoadOtherPage();
                        $('#otherPageBottom').remove();
                }
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get('objectId');
                var userKind = currentUser.get("userKind");

                if(userKind=="test"){
                        $('#fanRankDiv').hide();
                }
                for(var i=0;i<object.length;i++){
                        var card_number = i+otherPageCounter*10;
                        var gift_title = object[i].get("giftTitle");
                        var gift_text =object[i].get("giftText");
                        var create_date = object[i].get("releaseDate");
                        var time = jikanCulc(create_date);
                        var gift_uid = object[i].get("giftUid");
                        var gift_price = object[i].get("price");
                        var gift_stock = object[i].get("stock");
                        var gift_user_id = object[i].get("userId");
                        var ReleaseStatus = object[i].get("ReleaseStatus");
                        var ohitotu = object[i].get("ohitotu");
                        var auction = object[i].get("auction");
                        //カードに出力していく
                        var card = `
                        <div class="gift-card" style="width:49%;height: 298px;padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                        `;
                        card += "giftIdJudge('"+gift_uid+"','"+other_user_name+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"','"+ReleaseStatus+"','"+ohitotu+"','"+auction+"');";
                        card +=`
                        ">
                                <input class="gift_uid" type="" value="`;
                                card += gift_uid;
                                card += `
                                " hidden>
                                <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                        <div class="card__content" style="height:auto;position:relative;">
                                                <img id="`;
                                                card += "other_gift_image_"+card_number;
                                                card +=`"class="other_gift_image" src="" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                        </div>
                                        <div id="otherpage_card_content_`;
                                        card +=card_number;
                                        card +=`" class="card__content" style="height:45px;">
                                                <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                <li class="list-item" style="padding:0px;">
                                                        <div class="list-item__left" style="padding:0px;">
                                                        <img class="list-item__thumbnail" id="other_gift_user_image_`;
                                                        card += card_number;
                                                        card +=`" src="img/human.png" alt="" style="border-radius: 50%;object-fit:cover;">
                                                        </div>
                                                
                                                        <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                        <div class="current_user_name other_page_user_name" style="text-align: left;"></div>
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
                                                card += "otherPage_favorite_"+card_number;
                                                card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                card += "otherPage_favorite_span_"+card_number;
                                                card +=`"class="favorite_off">0</span>
                                                </button>`;
                                                if(auction=="オークション"){
                                                        card += `<button class="toolbar-button" style="font-size:12px;padding:0px;background:#FF6070;margin-left:3px;border-radius:20px;padding:3px;">
                                                        <span style="font-size:10px;color:white;">オークション</span>
                                                        </button>`;
                                                }else if(auction=="プレゼント"){
                                                        card += `<button class="toolbar-button" style="font-size:12px;padding:0px;background:#FF6070;margin-left:3px;border-radius:20px;padding:3px;">
                                                        <span style="font-size:10px;color:white;">プレゼント</span>
                                                        </button>`;
                                                }else if(auction=="抽選販売"){
                                                        card += `<button class="toolbar-button" style="font-size:12px;padding:0px;background:#FF6070;margin-left:3px;border-radius:20px;padding:3px;">
                                                        <span style="font-size:10px;color:white;">抽選ギフト</span>
                                                        </button>`;
                                                }else{
                                                        card += `<button class="toolbar-button" style="font-size:12px;padding:0px;">
                                                        <span style="font-size:12px;color:gray">残:`;
                                                        card += gift_stock;
                                                        card +=`</span>
                                                        </button>`;
                                                }
                                                card += `
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
                        $('#otherGiftList').append(card);
                        $('.other_page_user_name').html(other_user_name);
                        otherGiftImageGet(gift_uid,card_number,gift_stock,auction);
                        otherGiftUserImage(other_user_id,card_number);
                        otherPageGiftFavorite(gift_uid,card_number);

                        if(otherPageCounter==0){
                                if(i+1==object.length){
                                        hideLoadOtherPage();
                                        loadingIcon = `
                                        <div id="otherPageBottom" class="" style="width:98%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;text-align:center;">
                                        <br><br><br><i class="fas fa-spinner fa-3x fa-spin"></i><br><br><br>
                                        </div>`;
                                        $('#otherGiftList').append(loadingIcon);
                                }
                        }else{
                                if(i+1==object.length){
                                        hideLoadOtherPage();
                                        $("#otherPageBottom").appendTo('#otherGiftList');
                                }
                        }
                }
                
                syoryaku();
        });

        setTimeout(function(){
                otherPageRefresh();
        },2000);
}