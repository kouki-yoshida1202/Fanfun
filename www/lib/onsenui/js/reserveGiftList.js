function reserveGift(reserveCounter){
        if(reserveCounter==0){
                $("#reserveGiftList").empty();
                showLoad();
        }
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        $('.current_user_id').val(objectId);
        var userName = currentUser.get("userName");
        var userKind = currentUser.get("userKind");
        var today = new Date();
        var iso = moment(today).format();
        if(userKind!="test"){
                var GiftData = ncmb.DataStore("giftData");
                GiftData
                .order('releaseDate', true)
                .notEqualTo('ReleaseStatus',1)
                .greaterThan("releaseDate",iso)
                .limit(10)
                .skip(reserveCounter*10)
                .fetchAll()                
                .then(function(results){
                        var object = results;
                        if(object.length==0){
                                hideLoad();
                                $('#reserveBottom').remove();
                        }
                        for(var i=0;i<object.length;i++){
                                var card_number = i+reserveCounter*10;
                                var gift_title = object[i].get("giftTitle");
                                var gift_text =object[i].get("giftText");
                                var create_date = object[i].get("releaseDate");
                                var time = jikanCulc(create_date);
                                var gift_uid = object[i].get("giftUid");
                                var gift_price = object[i].get("price");
                                var gift_stock = object[i].get("stock");
                                var gift_user_id = object[i].get("userId");
                                var BlockList = ncmb.DataStore("BlockList");
                                var ReleaseStatus = object[i].get("ReleaseStatus");
                                var ohitotu = object[i].get("ohitotu");
                                var auction = object[i].get("auction");
                                // BlockList
                                // .equalTo("blockerId", objectId)
                                // .equalTo("blockedId", gift_user_id)
                                // .fetchAll()               
                                // .then(function(results){
                                //         var block_object = results;
                                //         var block_check = block_object.length;
                                //         if(block_check > 0){
                                                
                                //         }else{
                                //カードに出力していく
                                var card = `
                                <div class="gift-card" style="width:49%;height: 298px;padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                `;
                                card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"','"+ReleaseStatus+"','"+ohitotu+"','"+auction+"');";
                                card +=`
                                ">
                                        <input class="gift_uid" type="" value="`;
                                        card += gift_uid;
                                        card += `
                                        " hidden>
                                        <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                <div class="card__content" style="height:auto;position:relative;">
                                                        <img id="`;
                                                        card += "reserve_gift_image_top_"+card_number;
                                                        card +=`"class="gift_image" src="img/loading.png" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                                </div>
                                                <div id="reserve_card_content_`;
                                                card +=card_number;
                                                card +=`" class="card__content" style="height:45px;">
                                                        <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                        <li class="list-item" style="padding:0px;">
                                                                <div class="list-item__left" style="padding:0px;">
                                                                <img class="list-item__thumbnail" id="reserve_gift_user_image_top_`;
                                                                card += card_number;
                                                                card +=`" src="img/human.png" alt="" style="border-radius: 50%;object-fit:cover;">
                                                                </div>
                                                        
                                                                <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                <div id="reserve_gift_user_name_top_`;
                                                                card +=card_number;
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
                                                                card += "reserve_gift_favorite_"+card_number;
                                                                card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                                card += "reserve_gift_favorite_span_"+card_number;
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
                                $('#reserveGiftList').append(card);
                                reservegiftUserGet(gift_user_id,card_number);
                                reservegiftImageGetTop(gift_uid,card_number,gift_stock,auction);
                                reservegiftUserImageTop(gift_user_id,card_number);
                                reservegift_favorite_check(gift_uid,card_number);
                                //         }
                                // })
                                // .catch(function(err){
                                //         console.log(err);
                                // });

                                if(reserveCounter==0){
                                        if(i+1==object.length){
                                                hideLoad();
                                                loadingIcon = `
                                                <div id="reserveBottom" class="" style="width:98%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;">
                                                <br><br><br><i class="fas fa-spinner fa-3x fa-spin"></i><br><br><br>
                                                </div>`;
                                                $('#reserveGiftList').append(loadingIcon);
                                                $('.sp-content').height($(".swiper-slide-active").height());
                                                setTimeout(function(){
                                                        $('#sp-content').height($('.sp-content').height());
                                                },500);
                                        }
                                }else{
                                        if(i+1==object.length){
                                                hideLoad();
                                                $("#reserveBottom").appendTo('#reserveGiftList');
                                                $('.sp-content').height($(".swiper-slide-active").height());
                                                setTimeout(function(){
                                                        $('#sp-content').height($('.sp-content').height());
                                                },500);
                                        }
                                }
                        }
                        
                        syoryaku();
                })
                .catch(function(err){
                        console.log(err);
                        hideLoad();
                });
        }
}

function reservegiftUserGet(gift_user_id,i){
        ncmb.User
        .equalTo("objectId", gift_user_id)
        .fetch()
        .then(function(results){
                var gift_user_name = results.get("userName");
                var gift_user_name_top = "reserve_gift_user_name_top_"+i;
                document.getElementById(gift_user_name_top).innerHTML = gift_user_name;
        });
}

function reservegiftImageGetTop(giftUid,i,gift_stock,auction){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_image_place = "reserve_gift_image_top_"+i;
                        var img = document.getElementById(gift_image_place);
                        img.src = reader.result;
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
                if(gift_stock==0 && (auction=="通常出品" || auction=="価格自由")){
                        var sold_out = `<img class="sold_out" src="img/custom – 8.png" style="border-radius:20px;"></div>`;
                        $("#reserve_gift_image_top_"+i).after(sold_out);
                        $("#reserve_gift_image_top_"+i).addClass("sold_img");
                        $("#reserve_gift_image_top_"+i).parent().addClass("sold_img_parent");
                        $('#reserve_card_content_'+i).css("margin-top","5px");
                }
        })
        .catch(function(err){
        // エラー処理
        console.log('error = ' + err);
        });
}

function reservegiftUserImageTop(gift_user_id,i){
        ncmb.File.download(gift_user_id, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_userimage = "reserve_gift_user_image_top_"+i;
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
function reservegift_favorite_check(gift_uid,i){

        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');

        var GiftFavorite = ncmb.DataStore("GiftFavorite");

        GiftFavorite
        .equalTo("giftUid", gift_uid)
        .fetchAll()
        .then(function(results){
                var favorite_count = results.length;
                $('#reserve_gift_favorite_span_'+i).html(favorite_count);
        });


        GiftFavorite
        .equalTo("UserId", myUserId)
        .equalTo("giftUid", gift_uid)
        .fetch()               
        .then(function(results){
                if(Object.keys(results).length != 0){
                $('#reserve_gift_favorite_'+i).addClass("favorite_on").removeClass("favorite_off");
                $('#reserve_gift_favorite_span_'+i).addClass("favorite_on").removeClass("favorite_off");
                }else{
                $('#reserve_gift_favorite_'+i).removeClass("favorite_on").addClass("favorite_off");
                $('#reserve_gift_favorite_span_'+i).removeClass("favorite_on").addClass("favorite_off");
                }
        })
        .catch(function(err){
                console.log(err);
        });
}

function reserveGiftList(){
        if($('#prev_page').val()=='reserve'){
                $('#reserveArea').removeClass('swiper-slide-next').addClass('swiper-slide-active');
                $('#shintyakuArea').addClass('swiper-slide-prev').removeClass('swiper-slide-active');
                swiperContents.slideTo(1);
                setTimeout(function(){
                        var index = $('div.sp-content > div.swiper-slide-active').index();
                        console.log(index);
                        setCurrentSlide($('.swiper-navigation .swiper-slide').eq(index), index);
                        // swiperNavigation.slideTo(index, 500, false);
                        $('.sp-content').height($("#reserveArea").height());
                        console.log($(".swiper-slide-active").height());
                        setTimeout(function(){
                                $('#sp-content').height($('.sp-content').height());
                                console.log($('.sp-content').height());
                        },50);
                },50);
        }
}

function setCurrentSlide(ele, index) {
        $(".swiper-navigation .swiper-slide").removeClass('selected');
        ele.addClass('selected');
}
