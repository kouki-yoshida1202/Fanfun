function otherPage(){
        
        if($('#other_user_id').val() == null || $('#other_user_id').val() == ""){
                var other_user_id = $('#my_user_id').val();
        }else if($('#other_user_id').val() == null || $('#other_user_id').val() == ""){

        }else{
                var other_user_id = $('#other_user_id').val();
        }

        ncmb.User
        .equalTo("objectId", other_user_id)
        .fetch()
        .then(function(results){
                var influencer = results.get("Influencer");
                var authentication = results.get("Authentication");
                if(influencer==true && authentication=="OK"){
                        var other_user_name_title = results.get("userName") + " <i class='far fa-check-circle' style='color:#FF6070;'></i>";
                }else{
                        var other_user_name_title = results.get("userName");
                }
                var other_user_name = results.get("userName");
                var other_profile_text = results.get("Text");
                $('#other_page_user_id').val(other_user_id);
                $('#other_user_name').html(other_user_name_title);
                $('#other_page_header').html(other_user_name);
                $('#other_profile').html(other_profile_text);
                var Review = results.get("Review");
                var BoughtCount = "("+results.get("BoughtCount")+")";

                // var star = `<i class="fas fa-star" style="font-size: 12px;color:#FFBB00;"></i>`;
                // var no_star = `<i class="fas fa-star" style="font-size: 12px;color:gray;"></i>`;
                // $('#otherReview').empty();
                // for(var i=0;i<5;i++){
                //         if(i<Review){
                //                 $('#otherReview').append(star);
                //         }else{
                //                 $('#otherReview').append(no_star);
                //         }
                // }
                // var myBoughtCount = `<span id="otherBoughtCount"style="color:#898989;font-size: 12px;">`+BoughtCount+`</span>`;
                // $('#otherReview').append(myBoughtCount);

                ncmb.File.download(other_user_id, "blob")
                .then(function(fileData) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                        var img = document.getElementById("other_user_image");
                        img.src = reader.result;
                        }
                        // DataURLとして読み込む
                        reader.readAsDataURL(fileData);

                        // ギフト情報を表示
                        var GiftData = ncmb.DataStore("giftData");
                        GiftData
                        .order('createDate', true)
                        .equalTo("userId", other_user_id)
                        .fetchAll()                
                        .then(function(results){
                                var object = results;
                                var syuppinnsu = "&emsp;"+object.length+" 出品&emsp;"
                                $('#otherGiftLength').html(syuppinnsu);
                                for(var i=0;i<object.length;i++){
                                        var gift_title = object[i].get("giftTitle");
                                        var gift_text =object[i].get("giftText");
                                        var create_date = object[i].get("createDate");
                                        var time = jikanCulc(create_date);
                                        var gift_uid = object[i].get("giftUid");
                                        var gift_price = object[i].get("price");
                                        var gift_user_id = object[i].get("userId");
                                        var ReleaseStatus = object[i].get("ReleaseStatus");
                                        
                                        //カードに出力していく
                                        var card = `
                                        <div class="gift-card" style="width:49%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                        `;
                                        card += "giftIdJudge('"+gift_uid+"','"+other_user_name+"','"+gift_title+"','"+gift_text+"','"+other_user_id+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+ReleaseStatus+"');";
                                        card +=`
                                        ">
                                                <input class="gift_uid" type="" value="`;
                                                card += gift_uid;
                                                card += `
                                                " hidden>
                                                <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                        <div class="card__content" style="height:auto;">
                                                                <img id="`;
                                                                card += "gift_image_"+i;
                                                                card +=`"class="other_gift_image" src="" alt="" style="width:100%;height:125px;border-radius: 20px;">
                                                        </div>
                                                        <div class="card__content" style="height:45px;">
                                                                <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                                <li class="list-item" style="padding:0px;">
                                                                        <div class="list-item__left" style="padding:0px;">
                                                                        <img class="list-item__thumbnail" id="gift_user_image_`;
                                                                        card += i;
                                                                        card +=`" src="" alt="" style="border-radius: 50%;">
                                                                        </div>
                                                                
                                                                        <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                        <div class="current_user_name" style="text-align: left;"></div>
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
                                        var width = $('.other_gift_image').width();
                                        $('.other_gift_image').height(width);
                                        $('.current_user_name').html(other_user_name);
                                        giftImageGet(gift_uid,i);
                                        giftUserImage(other_user_id,i);
                                }
                                
                                syoryaku();

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
                                        console.log(err);
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
                                        console.log(err);
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
                                        console.log(err);
                                }); 
                        });
                })
                .catch(function(err){
                // エラー処理
                console.log('error = ' + err);
                });
        });
}

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