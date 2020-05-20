function followUserGift(followCounter){
        console.log(followCounter);
        if(followCounter==0){
                $("#followGiftList").empty();
                showLoad();
        }
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
                if(follow_user.length == 0){
                        hideLoad();
                }
                for(var k=0;k<follow_user.length;k++){
                        follow_user_id.push(follow_user[k].get("followerId"));
                }
                
                return follow_user_id;
        })
        .then(function(follow_user_id){
                GiftData
                .order('releaseDate', true)
                .notEqualTo('ReleaseStatus',1)
                .in('userId',follow_user_id)
                .limit(10)
                .skip(followCounter*10)
                .fetchAll()                
                .then(function(results){
                        console.log(followCounter);
                        var object = results;
                        if(object.length==0){
                                hideLoad();
                                $('#followBottom').remove();
                        }
                        for(var i=0;i<object.length;i++){
                                var card_number = i+followCounter*10;
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
                                card += "prevPage('follow');giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"','"+ReleaseStatus+"','"+ohitotu+"');";
                                card +=`
                                ">
                                        <input class="gift_uid" type="" value="`;
                                        card += gift_uid;
                                        card += `
                                        " hidden>
                                        <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                <div class="card__content" style="height:auto;position:relative;">
                                                        <img id="`;
                                                        card += "follow_gift_image_top_"+card_number;
                                                        card +=`"class="gift_image" src="img/loading.png" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                                </div>
                                                <div id="follow_card_content_`;
                                                card +=card_number;
                                                card +=`" class="card__content" style="height:45px;">
                                                        <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                        <li class="list-item" style="padding:0px;">
                                                                <div class="list-item__left" style="padding:0px;">
                                                                <img class="list-item__thumbnail" id="follow_gift_user_image_top_`;
                                                                card += card_number;
                                                                card +=`" src="img/human.png" alt="" style="border-radius: 50%;object-fit:cover;">
                                                                </div>
                                                        
                                                                <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                <div id="follow_gift_user_name_top_`;
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
                                                                card += "follow_gift_favorite_"+card_number;
                                                                card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                                card += "follow_gift_favorite_span_"+card_number;
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
                                followgiftUserGet(gift_user_id,card_number);
                                followgiftImageGetTop(gift_uid,card_number,gift_stock);
                                followgiftUserImageTop(gift_user_id,card_number);
                                followgift_favorite_check(gift_uid,card_number);
                                //         }
                                // })
                                // .catch(function(err){
                                //         console.log(err);
                                // });

                                if(followCounter==0){
                                        if(i+1==object.length){
                                                hideLoad();
                                                loadingIcon = `
                                                <div id="followBottom" class="" style="width:98%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;">
                                                <br><br><br><i class="fas fa-spinner fa-3x fa-spin"></i><br><br><br>
                                                </div>`;
                                                $('#followGiftList').append(loadingIcon);
                                                console.log("きてる");
                                                $('.sp-content').height($(".swiper-slide-active").height());
                                                setTimeout(function(){
                                                        $('#sp-content').height($('.sp-content').height());
                                                },500);
                                        }
                                }else{
                                        if(i+1==object.length){
                                                hideLoad();
                                                $("#followBottom").appendTo('#followGiftList');
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
        })
        .catch(function(err){
                console.log(err);
                hideLoad();
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

function followgiftImageGetTop(giftUid,i,gift_stock){
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
                if(gift_stock==0){
                        var sold_out = `<img class="sold_out" src="img/custom – 8.png" style="border-radius:20px;"></div>`;
                        $("#follow_gift_image_top_"+i).after(sold_out);
                        $("#follow_gift_image_top_"+i).addClass("sold_img");
                        $("#follow_gift_image_top_"+i).parent().addClass("sold_img_parent");
                        $('#follow_card_content_'+i).css("margin-top","5px");
                }
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

function prevPage(prevPage){
        setTimeout(function(){
                $('#prev_page').val(prevPage);
        },500);
}
function followGiftList(){
        if($('#prev_page').val()=='follow'){
                $('#followArea').removeClass('swiper-slide-next').addClass('swiper-slide-active');
                $('#shintyakuArea').addClass('swiper-slide-prev').removeClass('swiper-slide-active');
                swiperContents.slideTo(1);
                setTimeout(function(){
                        var index = $('div.sp-content > div.swiper-slide-active').index();
                        console.log(index);
                        setCurrentSlide($('.swiper-navigation .swiper-slide').eq(index), index);
                        // swiperNavigation.slideTo(index, 500, false);
                        $('.sp-content').height($("#followArea").height());
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
