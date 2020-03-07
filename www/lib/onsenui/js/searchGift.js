function searchGift(search_way){
        if(search_way=="キーワード検索"){
                var user_name = $('#user_name_search').val();
                if(!user_name || user_name == ""){
                        searchKeywordNoOpen();
                }else{
                        document.getElementById('navi').bringPageTop('searchpage.html');
                        $('#searchGift').empty();
                
                        var currentUser = ncmb.User.getCurrentUser();
                        var objectId = currentUser.get("objectId");
                        var userName = currentUser.get("userName");
                        var search_user_array=[];

                        var GiftData = ncmb.DataStore("giftData");
                        ncmb.User.regularExpressionTo("userName", "^(?=.*"+user_name+").*$")
                        .fetchAll()
                        .then(function(userList){
                                var userList = userList;
                                var search_user_id=[];
                                for(var k=0;k<userList.length;k++){
                                        search_user_id.push(userList[k].get("objectId"));
                                }
                                return search_user_id;
                        })
                        .then(function(search_user_id){
                                if (search_user_array.indexOf(search_user_id) == -1){
                                        search_user_array.push(search_user_id);

                                        GiftData
                                        .order('createDate', true)
                                        .in('userId',search_user_id)
                                        .fetchAll()                
                                        .then(function(results){
                                                console.log(results);
                                                var object = results;
                                                for(var i=0;i<object.length;i++){
                                                        var gift_title = object[i].get("giftTitle");
                                                        var gift_text =object[i].get("giftText");
                                                        var create_date = object[i].get("createDate");
                                                        var time = jikanCulc(create_date);
                                                        var gift_uid = object[i].get("giftUid");
                                                        var gift_price = object[i].get("price");
                                                        var gift_user_id = object[i].get("userId");
                                                        // ユーザ名の取得
                                                        
                                                
                                                        //カードに出力していく
                                                        var card = `
                                                        <div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                                        `;
                                                        card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"');";
                                                        card +=`
                                                        ">
                                                                <input class="gift_uid" type="" value="`;
                                                                card += gift_uid;
                                                                card += `
                                                                " hidden>
                                                                <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                                        <div class="card__content" style="height:auto;">
                                                                                <img id="`;
                                                                                card += "search_gift_image_top_"+i;
                                                                                card +=`"class="gift_image" src="img/loading.png" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                                                        </div>
                                                                        <div class="card__content" style="height:45px;">
                                                                                <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                                                <li class="list-item" style="padding:0px;">
                                                                                        <div class="list-item__left" style="padding:0px;">
                                                                                        <img class="list-item__thumbnail" id="search_gift_user_image_top_`;
                                                                                        card += i;
                                                                                        card +=`" src="img/human.png" alt="" style="border-radius: 50%;">
                                                                                        </div>
                                                                                
                                                                                        <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                                        <div id="search_gift_user_name_top_`;
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
                                                                                        card += "search_gift_favorite_"+i;
                                                                                        card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                                                        card += "search_gift_favorite_span_"+i;
                                                                                        card +=`"class="favorite_off">0</span>
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
                                                        $('#searchGift').append(card);
                                                        searchgiftUserGet(gift_user_id,i);
                                                        searchgiftImageGetTop(gift_uid,i);
                                                        searchgiftUserImageTop(gift_user_id,i);
                                                        searchgift_favorite_check(gift_uid,i);
                                                }
                                                
                                                syoryaku();
                                        })
                                        .catch(function(err){
                                                console.log(err);
                                        });   
                                }
                        });
                }
        }else if(search_way=="カテゴリ検索"){
                var genre = $('.checkbox__input:checked').map(function() {
                        return $(this).val();
                }).get();
                console.log(genre);
                if(genre ==""){
                        categoryNoOpen();
                }else{
                        document.getElementById('navi').bringPageTop('searchpage.html');
                        var currentUser = ncmb.User.getCurrentUser();
                        var objectId = currentUser.get("objectId");
                        $('.current_user_id').val(objectId);
                        var userName = currentUser.get("userName");
                        var GiftData = ncmb.DataStore("giftData");
                        //データストアから取得して、1件表示する

                        ncmb.User
                        .order('createDate', true)
                        .inArray("Genre",genre)
                        .fetchAll()
                        .then(function(results){
                                console.log(results);
                                var object = results;
                                if(object.length>0){
                                        search_user_id=[];
                                        for(var i=0;i<object.length;i++){
                                                search_user_id.push(object[i].get("objectId"));
                                        }
                                        
                                        $('#searchGift').empty();
                
                                        var currentUser = ncmb.User.getCurrentUser();
                                        var objectId = currentUser.get("objectId");
                                        var userName = currentUser.get("userName");

                                        var GiftData = ncmb.DataStore("giftData");
                                        GiftData
                                        .order('createDate', true)
                                        .in('userId',search_user_id)
                                        .fetchAll()                
                                        .then(function(results){
                                                if(results.length>0){
                                                        
                                                        var object = results;
                                                        for(var i=0;i<object.length;i++){
                                                                var gift_title = object[i].get("giftTitle");
                                                                var gift_text =object[i].get("giftText");
                                                                var create_date = object[i].get("createDate");
                                                                var time = jikanCulc(create_date);
                                                                var gift_uid = object[i].get("giftUid");
                                                                var gift_price = object[i].get("price");
                                                                var gift_user_id = object[i].get("userId");
                                                                // ユーザ名の取得
                                                                
                                                        
                                                                //カードに出力していく
                                                                var card = `
                                                                <div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                                                `;
                                                                card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"');";
                                                                card +=`
                                                                ">
                                                                        <input class="gift_uid" type="" value="`;
                                                                        card += gift_uid;
                                                                        card += `
                                                                        " hidden>
                                                                        <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                                                <div class="card__content" style="height:auto;">
                                                                                        <img id="`;
                                                                                        card += "search_gift_image_top_"+i;
                                                                                        card +=`"class="gift_image" src="img/loading.png" alt="" style="width:100%;height:154px;border-radius: 20px;">
                                                                                </div>
                                                                                <div class="card__content" style="height:45px;">
                                                                                        <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                                                        <li class="list-item" style="padding:0px;">
                                                                                                <div class="list-item__left" style="padding:0px;">
                                                                                                <img class="list-item__thumbnail" id="search_gift_user_image_top_`;
                                                                                                card += i;
                                                                                                card +=`" src="img/human.png" alt="" style="border-radius: 50%;">
                                                                                                </div>
                                                                                        
                                                                                                <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                                                <div id="search_gift_user_name_top_`;
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
                                                                                                card += "search_gift_favorite_"+i;
                                                                                                card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                                                                card += "search_gift_favorite_span_"+i;
                                                                                                card +=`"class="favorite_off">0</span>
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
                                                                $('#searchGift').append(card);
                                                                searchgiftUserGet(gift_user_id,i);
                                                                searchgiftImageGetTop(gift_uid,i);
                                                                searchgiftUserImageTop(gift_user_id,i);
                                                                searchgift_favorite_check(gift_uid,i);
                                                        }
                                                        
                                                        syoryaku();
                                                }else{
                                                        searchGiftNoOpen();
                                                }
                                        })
                                        .catch(function(err){
                                                console.log(err);
                                        });
                                }else{
                                        searchUserNoOpen();
                                }
                        });
                }
        }
}

function searchgiftUserGet(gift_user_id,i){
        console.log(gift_user_id);
        ncmb.User
        .equalTo("objectId", gift_user_id)
        .fetch()
        .then(function(results){
                console.log(results);
                var gift_user_name = results.get("userName");
                var gift_user_name_top = "search_gift_user_name_top_"+i;
                // document.getElementById(gift_user_name_top).innerHTML = gift_user_name;
                $('#'+gift_user_name_top).html(gift_user_name);
        });
}

function searchgiftImageGetTop(giftUid,i){
        console.log(giftUid,i);
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_image_place = "search_gift_image_top_"+i;
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

function searchgiftUserImageTop(gift_user_id,i){
        ncmb.File.download(gift_user_id, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                console.log(reader);
                reader.onloadend = function() {
                        var gift_userimage = "search_gift_user_image_top_"+i;
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
function searchgift_favorite_check(gift_uid,i){

var currentUser = ncmb.User.getCurrentUser();
var myUserId = currentUser.get('objectId');

var GiftFavorite = ncmb.DataStore("GiftFavorite");

GiftFavorite
.equalTo("giftUid", gift_uid)
.fetchAll()
.then(function(results){
        var favorite_count = results.length;
        $('#search_gift_favorite_span_'+i).html(favorite_count);
});


GiftFavorite
.equalTo("UserId", myUserId)
.equalTo("giftUid", gift_uid)
.fetch()               
.then(function(results){
        if(Object.keys(results).length != 0){
        $('#search_gift_favorite_'+i).addClass("favorite_on").removeClass("favorite_off");
        $('#search_gift_favorite_span_'+i).addClass("favorite_on").removeClass("favorite_off");
        }else{
        $('#search_gift_favorite_'+i).removeClass("favorite_on").addClass("favorite_off");
        $('#search_gift_favorite_span_'+i).removeClass("favorite_on").addClass("favorite_off");
        }
})
.catch(function(err){
        console.log(err);
});
}

