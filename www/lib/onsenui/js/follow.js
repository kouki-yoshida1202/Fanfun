// -------[Demo1]データをmBaaSに保存する -------//

//ユーザ画面でフォローか外すかの処理
function follow() {
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var followerId = $('#other_page_user_id').val();

        if($('#other_follow_button').hasClass("follow_on")){ // クリックされた要素がclickedクラスだったら
                var FollowData = ncmb.DataStore("follow");
                // データストアへの削除

                FollowData
                .equalTo("followId", objectId)
                .equalTo("followerId", followerId)
                .fetch()
                .then(function(results){
                        // 保存後の処理
                        results.delete();
                        followOffOpen();
                        $('#other_follow_button').removeClass("follow_on").html("フォロー");
                })
                .catch(function(err){
                        // エラー処理
                        console.log(err)
                });
        }else{
                // クラスのTestClassを作成
                var FollowData = ncmb.DataStore("follow");
                // データストアへの登録
                var followdata = new FollowData();

                followdata
                .set("followId", objectId)
                .set("followerId", followerId)
                .save()
                .then(function(){
                        // 保存後の処理
                        followOnOpen();
                        $('#other_follow_button').addClass("follow_on").html("フォロー中");
                        
                })
                .catch(function(err){
                        // エラー処理
                        console.log(err)
                });
        }
}

//一覧画面でフォローか外すかの処理
function ichiranFollow(user_id) {
        var currentUser = ncmb.User.getCurrentUser();
        var my_id = currentUser.get("objectId");
        var button_id = "follow_check_button_"+user_id;
        if($('#'+button_id).hasClass("follow_on")){ // クリックされた要素がclickedクラスだったら何もしない
                var FollowData = ncmb.DataStore("follow");
                // データストアへの削除

                FollowData
                .equalTo("followId", my_id)
                .equalTo("followerId", user_id)
                .fetch()
                .then(function(results){
                        // 保存後の処理
                        results.delete();
                        followerListFollowOffOpen();
                        $('#'+button_id).removeClass("follow_on").addClass("follow_off").html("フォロー");
                })
                .catch(function(err){
                        // エラー処理
                        console.log(err)
                });
        }else{
                // クラスのTestClassを作成
                var FollowData = ncmb.DataStore("follow");
                // データストアへの登録
                var followdata = new FollowData();

                followdata
                .set("followId", my_id)
                .set("followerId", user_id)
                .save()
                .then(function(){
                        // 保存後の処理
                        followerListFollowOnOpen();
                        $('#'+button_id).addClass("follow_on").removeClass("follow_off").html("フォロー中");
                        
                })
                .catch(function(err){
                        // エラー処理
                        console.log(err)
                });
        }
}
// 自分のフォロー一覧を表示
function followList(){
        $("#myfollow-ul").empty();
        var userId = $('.current_user_id').val();
        var FollowData = ncmb.DataStore("follow");
        FollowData
        .equalTo("followId", userId)
        .order('createDate', true)
        .fetchAll()               
        .then(function(results){
                var object = results;
                var followNumber = object.length;
                for(var j=0;j<followNumber;j++){
                        var follower_id = object[j].get("followerId");
                        ncmb.User
                        .equalTo("objectId", follower_id)
                        .fetch()
                        .then(function(result){
                                var object_id = result.get("objectId");
                                var influencer = result.get("Influencer");
                                var authentication = result.get("Authentication");
                                if(influencer==true && authentication=="OK"){
                                        var user_name = result.get("userName") + " <i class='far fa-check-circle' style='color:#FF6070;'></i>";
                                }else{
                                        var user_name = result.get("userName");
                                }
                                var follow_list = `
                                <li class="list-item list-item--material">
                                        <div class="list-item__left list-item--material__left" onclick="document.getElementById('navi').bringPageTop('otherpage.html');
                                        `;
                                        follow_list += "toOtherPageFromFollowList('"+object_id+"');";
                                        follow_list +=`
                                        ;">
                                                <img id="follow_user_image_`;
                                                follow_list += j+`"`;
                                                follow_list +=`
                                                class="list-item__thumbnail list-item--material__thumbnail follow_thumbnanil" src="img/human.png" style="object-fit:cover;">
                                        </div>
                                        <div class="list-item__center list-item--material__center">
                                                <p>`;
                                                follow_list += user_name;
                                                follow_list +=`
                                                </p>
                                        </div>
                                
                                        <div class="list-item__right list-item--material__right">`;
                                        follow_list +=`
                                        <button id="follow_check_button_`;
                                        follow_list += object_id+`"`;
                                        follow_list += `
                                        class="button follow_on" style="" onclick="`;
                                        follow_list += "ichiranFollow('"+object_id+"');";
                                        follow_list +=`
                                        ">フォロー中</button>
                                        </div>
                                </li>
                                `;
                                $('#myfollow-ul').append(follow_list);
                                followUserImage(object_id,j);
                                j++;
                        });
                }
        })
        .catch(function(err){
                console.log(err);
        }); 
}
// 自分のフォロワー一覧を表示
function followerList(){
        $('#followerList').empty();
        var userId = $('.current_user_id').val();
        var FollowData = ncmb.DataStore("follow");
        FollowData
        .equalTo("followerId", userId)
        .order('createDate', true)
        .fetchAll()               
        .then(function(results){
                var object = results;
                return object;
        }).then(function(object){
                for(var j=0;j<object.length;j++){
                        var object_id = object[j].get("followId");
                        var follower_list = `
                        <li class="list-item list-item--material">
                                <div class="list-item__left list-item--material__left" onclick="document.getElementById('navi').bringPageTop('otherpage.html');
                                `;
                                follower_list += "toOtherPageFromFollowList('"+object_id+"');";
                                follower_list +=`
                                ;">
                                        <img id="follower_user_image_`;
                                        follower_list += object_id+`"`;
                                        follower_list +=`
                                        class="list-item__thumbnail list-item--material__thumbnail follow_thumbnanil" src="img/human.png"style="object-fit:cover;">
                                </div>
                                <div class="list-item__center list-item--material__center">
                                        <p id="follower_user_name_`;
                                        follower_list += object_id + `">`;
                                        follower_list +=`
                                        </p>
                                </div>
                        
                                <div id="follower_check_`;
                                follower_list += object_id+`"`;
                                follower_list +=`
                                class="list-item__right list-item--material__right">
                                </div>
                        </li>
                        `;
                        $('#followerList').append(follower_list);
                        followerCheck(object_id,userId);
                        userNameAppend(object_id);
                        followerUserImage(object_id);
                }
        })
        .catch(function(err){
                console.log(err);
        }); 
}

// 一覧にユーザネームを追加
function userNameAppend(object_id){

        ncmb.User
        .equalTo("objectId",object_id)
        .fetch()
        .then(function(result){
                var object_id = result.get("objectId");
                var influencer = result.get("Influencer");
                var authentication = result.get("Authentication");
                if(influencer==true && authentication=="OK"){
                        var user_name = result.get("userName") + " <i class='far fa-check-circle' style='color:#FF6070;'></i>";
                }else{
                        var user_name = result.get("userName");
                }
                var follower_user_name = "follower_user_name_"+object_id;
                $('#'+follower_user_name).append(user_name);
        });
}
// 一覧でフォローしているかの判断
function followerCheck(object_id,userId){
        var FollowData = ncmb.DataStore("follow");
        FollowData
        .equalTo("followId", userId)
        .equalTo("followerId", object_id)
        .fetchAll()               
        .then(function(results){
                var object = results;
                var follow_check = "follower_check_"+object_id;
                if(object.length>0){
                        var followcheck =`
                        <button id="follow_check_button_`;
                        followcheck += object_id+`"`;
                        followcheck += `
                        class="button follow_on" style="" onclick="`;
                        followcheck += "ichiranFollow('"+object_id+"');";
                        followcheck +=`
                        ">フォロー中</button>
                        `;
                }else{
                        var followcheck =`
                        <button id="follow_check_button_`;
                        followcheck += object_id+`"`;
                        followcheck += `
                        class="button follow_off" style="" onclick="`;
                        followcheck += "ichiranFollow('"+object_id+"');";
                        followcheck +=`
                        ">フォロー</button>
                        `;
                }
                $('#'+follow_check).append(followcheck);
        })
}
// 一覧でユーザ画像を表示
function followUserImage(objectId,j){
        ncmb.File.download(objectId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var follow_user_image = "follow_user_image_"+j;
                        var img = document.getElementById(follow_user_image);
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
// フォロワー一覧でユーザ画像を表示
function followerUserImage(objectId){
        ncmb.File.download(objectId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var follower_user_image = "follower_user_image_"+objectId;
                        var img = document.getElementById(follower_user_image);
                        img.src = reader.result;
                } 
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
        })
        .catch(function(err){
                // エラー処理
                // alert('error = ' + err);
        });
}

// 一覧からユーザ画面に遷移するときの処理
function toOtherPageFromFollowList(jumpToUserId){
        $('#otherGiftList').empty();
        $('.current_user_name').empty();
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        ncmb.User
        .equalTo("objectId", jumpToUserId)
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
                var Genre = results.get("Genre");
                $('#other_page_user_id').val(jumpToUserId);
                $('#other_user_name').html(other_user_name_title);
                $('#other_page_header').html(other_user_name);
                $('#other_profile').html(other_profile_text);
                var Review = results.get("Review");
                var BoughtCount = "("+results.get("BoughtCount")+")";
                $('#otherGenre').empty();
                if(Genre){
                        for(var n=0;n<Genre.length;n++){
                                $('#otherGenre').append(" #"+Genre[n]);
                        }
                }
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

                ncmb.File.download(jumpToUserId, "blob")
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
                        .equalTo("userId", jumpToUserId)
                        .notEqualTo('ReleaseStatus',1)
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
                                        var gift_stock = object[i].get("stock");
                                        var ReleaseStatus = object[i].get("ReleaseStatus");
                                        var ohitotu = object[i].get("ohitotu");
                                        //カードに出力していく
                                        var card = `
                                        <div class="gift-card" style="width:49%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                                        `;
                                        card += "giftIdJudge('"+gift_uid+"','"+other_user_name+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+jumpToUserId+"','"+gift_stock+"','"+ReleaseStatus+"','"+ohitotu+"');";
                                        card +=`
                                        ">
                                                <input class="gift_uid" type="" value="`;
                                                card += gift_uid;
                                                card += `
                                                " hidden>
                                                <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                                        <div class="card__content" style="height:auto;">
                                                                <img id="`;
                                                                card += "gift_image_follow_"+i;
                                                                card +=`"class="other_gift_image" src="" alt="" style="width:100%;height:154px;object-fit:cover;border-radius: 20px;">
                                                        </div>
                                                        <div class="card__content" style="height:45px;">
                                                                <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                                <li class="list-item" style="padding:0px;">
                                                                        <div class="list-item__left" style="padding:0px;">
                                                                        <img class="list-item__thumbnail" id="gift_user_image_follow_`;
                                                                        card += i;
                                                                        card +=`" src="" alt="" style="border-radius: 50%;object-fit:cover;">
                                                                        </div>
                                                                
                                                                        <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                                        <div class="current_user_name follow_page_user_name" style="text-align: left;"></div>
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
                                        $('#otherGiftList').append(card);
                                        $('.follow_page_user_name').html(other_user_name);
                                        giftImageGetFollow(gift_uid,i);
                                        giftUserImageFollow(jumpToUserId,i);
                                        gift_favorite_check(gift_uid,i);
                                }
                                
                                syoryaku();

                                //フォロー中かのチェック
                                var currentUser = ncmb.User.getCurrentUser();
                                var objectId = currentUser.get("objectId");
                                var FollowData = ncmb.DataStore("follow");
                                FollowData
                                .equalTo("followId", objectId)
                                .equalTo("followerId", jumpToUserId)
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
                                .equalTo("followerId", jumpToUserId)
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
                                .equalTo("followId", jumpToUserId)
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
function giftUserImageFollow(objectId,i){
        ncmb.File.download(objectId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_userimage = "gift_user_image_follow_"+i;
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
function giftImageGetFollow(giftUid,i){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_image_place = "gift_image_follow_"+i;
                        
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
// ユーザ画面にてフォロー解除の処理
function followDelete() {
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var followerId = $('#other_page_user_id').val();

        if($('#other_follow_button').hasClass("follow_on")){ // クリックされた要素がclickedクラスだったら
                var FollowData = ncmb.DataStore("follow");
                // データストアへの削除

                FollowData
                .equalTo("followId", objectId)
                .equalTo("followerId", followerId)
                .fetch()
                .then(function(results){
                        // 保存後の処理
                        results.delete();
                        followOffOpen();
                        $('#other_follow_button').removeClass("follow_on").html("フォロー");
                })
                .catch(function(err){
                        // エラー処理
                        console.log(err)
                });
        }else{
                // クラスのTestClassを作成
                var FollowData = ncmb.DataStore("follow");
                // データストアへの登録
                var followdata = new FollowData();

                followdata
                .set("followId", objectId)
                .set("followerId", followerId)
                .save()
                .then(function(){
                        // 保存後の処理
                        followOnOpen();
                        $('#other_follow_button').addClass("follow_on").html("フォロー中");
                        
                })
                .catch(function(err){
                        // エラー処理
                        console.log(err)
                });
        }
}