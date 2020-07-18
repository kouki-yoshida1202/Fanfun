function myFavoriteGift(){
        document.getElementById('navi').bringPageTop('myFavoriteGift.html');
        $('#myFavoriteGift').empty();

        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var userName = currentUser.get("userName");

        var GiftFavorite = ncmb.DataStore("GiftFavorite");
        var GiftData = ncmb.DataStore("giftData");

        GiftFavorite
        .equalTo("UserId",objectId)
        .fetchAll()
        .then(function(favList){
                var favList = favList;
                
                var gift_uid_array = [];
                for(var k=0;k<favList.length;k++){
                        gift_uid_array.push(favList[k].get("giftUid"));
                }
                return gift_uid_array;
        })
        .then(function(gift_uid_array){
                GiftData
                .order('createDate', true)
                .notEqualTo('ReleaseStatus',1)
                .in('giftUid',gift_uid_array)
                .fetchAll()                
                .then(function(results){
                        var object = results;
                        for(var i=0;i<object.length;i++){
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
                                <div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                `;
                                card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"','"+ReleaseStatus+"','"+ohitotu+"','"+auction+"');";
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
                                                        card +=`"class="gift_image" src="" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                                </div>
                                                <div class="card__content" style="height:45px;">
                                                        <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                        <li class="list-item" style="padding:0px;">
                                                                <div class="list-item__left" style="padding:0px;">
                                                                <img class="list-item__thumbnail" id="search_gift_user_image_top_`;
                                                                card += i;
                                                                card +=`" src="" alt="" style="border-radius: 50%;object-fit:cover;">
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
                                $('#myFavoriteGift').append(card);
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
                
        });
}