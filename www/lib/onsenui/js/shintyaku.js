function shintyaku(shintyakuCounter){
        if(shintyakuCounter==0){
                $("#shintyakuList").empty();
                showLoad();
        }
        // console.log(shintyakuCounter);
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        $('.current_user_id').val(objectId);
        var userName = currentUser.get("userName");
        var userKind = currentUser.get("userKind");
        //データストアから取得して、1件表示する
        var GiftData = ncmb.DataStore("giftData");
        if(userKind!="test"){
                GiftData
                .order('releaseDate', true)
                .notEqualTo('ReleaseStatus',1)
                .limit(10)
                .skip(shintyakuCounter*10)
                .fetchAll()                
                .then(function(results){
                        var object = results;
                        // console.log(shintyakuCounter);
                        // var syuppinnsu = "&emsp;"+object.length+" 出品&emsp;"
                        // $('#myGiftLength').html(syuppinnsu);
                        if(object.length==0){
                                hideLoad();
                                $('#topBottom').remove();
                        }
                        for(var i = 0;i<object.length;i++){
                                var card_number = i+shintyakuCounter*10;
                                var gift_title = object[i].get("giftTitle");
                                var gift_text =object[i].get("giftText");
                                var create_date = object[i].get("createDate");
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
                                                <div class="gift-card" style="width:48%;height: 298px; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                                `;
                                                card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"','"+ReleaseStatus+"','"+ohitotu+"');";
                                                card +=`
                                                ">
                                                        <input class="gift_uid" type="" value="`;
                                                        card += gift_uid;
                                                        card += `
                                                        " hidden>
                                                        <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                                <div class="card__content" style="height:auto;position:relative;">
                                                                        <img id="`;
                                                                        card += "gift_image_top_"+card_number;
                                                                        card +=`"class="gift_image" src="img/loading.png" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                                                </div>
                                                                <div id="shintyaku_card_content_`;
                                                                card +=card_number;
                                                                card +=`" class="card__content" style="height:45px;">
                                                                        <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                                        <li class="list-item" style="padding:0px;">
                                                                                <div class="list-item__left" style="padding:0px;">
                                                                                <img class="list-item__thumbnail" id="gift_user_image_top_`;
                                                                                card += card_number;
                                                                                card +=`" src="img/human.png" alt="" style="border-radius: 50%;object-fit:cover;">
                                                                                </div>
                                                                        
                                                                                <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                                <div id="gift_user_name_top_`;
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
                                                                                card += "gift_favorite_"+card_number;
                                                                                card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                                                card += "gift_favorite_span_"+card_number;
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
                                                $('#shintyakuList').append(card);
                                                giftUserGet(gift_user_id,card_number);
                                                giftImageGetTop(gift_uid,card_number,gift_stock);
                                                giftUserImageTop(gift_user_id,card_number);
                                                gift_favorite_check(gift_uid,card_number);
                                //         }
                                // })
                                // .catch(function(err){
                                //         console.log(err);
                                // }); 
                                if(shintyakuCounter==0){
                                        if(i+1==object.length){
                                                hideLoad();
                                                loadingIcon = `
                                                <div id="topBottom" class="" style="width:98%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;">
                                                <br><br><br><i class="fas fa-spinner fa-3x fa-spin"></i><br><br><br>
                                                </div>`;
                                                $('#shintyakuList').append(loadingIcon);
                                                $('.sp-content').height($(".swiper-slide-active").height());
                                                setTimeout(function(){
                                                        $('#sp-content').height($('.sp-content').height());
                                                },500);
                                        }
                                }else{
                                        if(i+1==object.length){
                                                hideLoad();
                                                $("#topBottom").appendTo('#shintyakuList');
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
                        alert("エラーが発生しました。一度ログアウトして再度ログインし直してください。");
                        logout();
                });   
        }else{
                // テストアカウント用
                hideLoad();
                var giftDataTest = ncmb.DataStore("giftDataTest");
                giftDataTest
                .order('createDate', true)
                .fetchAll()                
                .then(function(results){
                        var object = results;
                        // var syuppinnsu = "&emsp;"+object.length+" 出品&emsp;"
                        // $('#myGiftLength').html(syuppinnsu);
                        for(var i=0;i<object.length;i++){
                                var gift_title = object[i].get("giftTitle");
                                var gift_text =object[i].get("giftText");
                                var create_date = object[i].get("createDate");
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
                                                <div class="gift-card" style="width:48%;height: 298px;padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                                `;
                                                card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"','"+ReleaseStatus+"','"+ohitotu+"');";
                                                card +=`
                                                ">
                                                        <input class="gift_uid" type="" value="`;
                                                        card += gift_uid;
                                                        card += `
                                                        " hidden>
                                                        <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                                <div class="card__content" style="height:auto;">
                                                                        <img id="`;
                                                                        card += "gift_image_top_"+i;
                                                                        card +=`"class="gift_image" src="img/loading.png" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                                                </div>
                                                                <div class="card__content" style="height:45px;">
                                                                        <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                                        <li class="list-item" style="padding:0px;">
                                                                                <div class="list-item__left" style="padding:0px;">
                                                                                <img class="list-item__thumbnail" id="gift_user_image_top_`;
                                                                                card += i;
                                                                                card +=`" src="img/human.png" alt="" style="border-radius: 50%;object-fit:cover;">
                                                                                </div>
                                                                        
                                                                                <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                                <div id="gift_user_name_top_`;
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
                                                                                card += "gift_favorite_"+i;
                                                                                card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                                                card += "gift_favorite_span_"+i;
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
                                                $('#shintyakuList').append(card);
                                                giftUserGet(gift_user_id,i);
                                                giftImageGetTop(gift_uid,i,gift_stock);
                                                giftUserImageTop(gift_user_id,i);
                                                gift_favorite_check(gift_uid,i);
                                //         }
                                // })
                                // .catch(function(err){
                                //         console.log(err);
                                // }); 
                                if(shintyakuCounter==0){
                                        if(i+1==object.length){
                                                hideLoad();
                                                $('.sp-content').height($(".swiper-slide-active").height());
                                                setTimeout(function(){
                                                        $('#sp-content').height($('.sp-content').height());
                                                },500);
                                        }
                                }else{
                                        if(i+1==object.length){
                                                hideLoad();
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
                        alert("エラーが発生しました。一度ログアウトして再度ログインし直してください。");
                        logout();
                });   
        }    
}

function giftUserGet(gift_user_id,i){
        ncmb.User
        .equalTo("objectId", gift_user_id)
        .fetch()
        .then(function(results){
                var gift_user_name = results.get("userName");
                var gift_user_name_top = "gift_user_name_top_"+i;
                document.getElementById(gift_user_name_top).innerHTML = gift_user_name;
        });
}

function giftImageGetTop(giftUid,i,gift_stock){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_image_place = "gift_image_top_"+i;
                        var img = document.getElementById(gift_image_place);
                        img.src = reader.result;
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);

                if(gift_stock==0){
                        var sold_out = `<img class="sold_out" src="img/custom – 8.png" style="border-radius:20px;">`;
                        $("#gift_image_top_"+i).before(sold_out);
                        $("#gift_image_top_"+i).addClass("sold_img");
                        $("#gift_image_top_"+i).parent().addClass("sold_img_parent");
                        $('#shintyaku_card_content_'+i).css("margin-top","5px");
                }
        })
        .catch(function(err){
        // エラー処理
        console.log('error = ' + err);
        });
}

function giftUserImageTop(gift_user_id,i){
        ncmb.File.download(gift_user_id, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_userimage = "gift_user_image_top_"+i;
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

