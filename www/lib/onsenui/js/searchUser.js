function searchUser(search_way){
        showLoad();
        if(search_way=="キーワード検索"){
                var user_name = $('#searchUserKeyword').val();
                if(!user_name || user_name == ""){
                        searchKeywordNoOpen();
                        hideLoad();
                }else{
                        document.getElementById('navi').bringPageTop('searchUserPage.html');
                        $('#searchUser').empty();
                
                        var currentUser = ncmb.User.getCurrentUser();
                        var objectId = currentUser.get("objectId");
                        var userName = currentUser.get("userName");
                        var search_user_array=[];

                        ncmb.User.regularExpressionTo("userName", "^(?=.*"+user_name+").*$")
                        .equalTo("Authentication","OK")
                        .notEqualTo('userKind','test')
                        .fetchAll()
                        .then(function(userList){
                                var userList = userList;
                                var search_user_id=[];
                                if(userList.length == 0){
                                        hideLoad();
                                }

                                for(var k=0;k<userList.length;k++){
                                        var object_id = userList[k].get("objectId");
                                        var searchUser = `
                                        <li class="list-item list-item--material">
                                                <div class="list-item__left list-item--material__left" onclick="document.getElementById('navi').bringPageTop('otherpage.html');
                                                `;
                                                searchUser += "otherPageUserId('"+object_id+"');";
                                                searchUser +=`
                                                ;">
                                                        <img id="search_user_image_`;
                                                        searchUser += object_id+`"`;
                                                        searchUser +=`
                                                        class="list-item__thumbnail list-item--material__thumbnail follow_thumbnanil" src="img/human.png" style="width:50px;height:50px;object-fit:cover;">
                                                </div>
                                                <div class="list-item__center list-item--material__center">
                                                        <p id="search_user_name_`;
                                                        searchUser += object_id + `" style="width:100%;margin:3px;">`;
                                                        searchUser +=`
                                                        </p>
                                                        <br>
                                                        <p id="search_user_genre_`;
                                                        searchUser += object_id + `" style="font-size:0.8em;color:#898989;margin:3px;">`;
                                                        searchUser +=`
                                                        </p>
                                                </div>
                                        </li>
                                        `;
                                        $('#searchUser').append(searchUser);
                                        searchUserName(object_id);
                                        searchUserGenre(object_id);
                                        searchUserImage(object_id);
                                }
                                hideLoad();
                        })
                        .catch(function(err){
                                console.log(err);
                                hideLoad();
                        });
                }
        }else if(search_way=="カテゴリ検索"){
                var genre = $('.search_user:checked').map(function() {
                        return $(this).val();
                }).get();
                if(genre ==""){
                        categoryNoOpen();
                        hideLoad();
                }else{
                        document.getElementById('navi').bringPageTop('searchUserPage.html');
                        $('#searchUser').empty();
                        //データストアから取得して、1件表示する
                        ncmb.User
                        .order('createDate', true)
                        .equalTo("Authentication","OK")
                        .inArray("Genre",genre)
                        .notEqualTo('userKind','test')
                        .fetchAll()
                        .then(function(results){
                                var object = results;
                                if(results.length == 0){
                                        hideLoad();
                                }
                                for(var k=0;k<results.length;k++){
                                        var object_id = results[k].get("objectId");
                                        var searchUser = `
                                        <li class="list-item list-item--material">
                                                <div class="list-item__left list-item--material__left" onclick="document.getElementById('navi').bringPageTop('otherpage.html');
                                                `;
                                                searchUser += "otherPageUserId('"+object_id+"');";
                                                searchUser +=`
                                                ;">
                                                        <img id="search_user_image_`;
                                                        searchUser += object_id+`"`;
                                                        searchUser +=`
                                                        class="list-item__thumbnail list-item--material__thumbnail follow_thumbnanil" src="img/human.png" style="width:50px;height:50px;object-fit:cover;">
                                                </div>
                                                <div class="list-item__center list-item--material__center">
                                                        <p id="search_user_name_`;
                                                        searchUser += object_id + `" style="width:100%;margin:3px;">`;
                                                        searchUser +=`
                                                        </p>
                                                        <br>
                                                        <p id="search_user_genre_`;
                                                        searchUser += object_id + `" style="font-size:0.8em;color:#898989;margin:3px;">`;
                                                        searchUser +=`
                                                        </p>
                                                </div>
                                        </li>
                                        `;
                                        $('#searchUser').append(searchUser);
                                        searchUserName(object_id);
                                        searchUserGenre(object_id);
                                        searchUserImage(object_id);
                                }
                                hideLoad();
                        })
                        .catch(function(err){
                                console.log(err);
                                hideLoad();
                        });
                }
        }else{
                document.getElementById('navi').bringPageTop('searchUserPage.html');
                $('#searchUser').empty();
                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get("objectId");
                $('.current_user_id').val(objectId);
                var userName = currentUser.get("userName");
                var giftUid = $('#giftSearchId').val();
                var GiftData = ncmb.DataStore("giftData");
                GiftData
                .order('createDate', true)
                .equalTo('giftUid',giftUid)
                .fetchAll()                
                .then(function(results){
                        if(results.length>0){
                                
                                var object = results;
                                for(var i=0;i<object.length;i++){
                                        var gift_title = object[i].get("giftTitle");
                                        var gift_text =object[i].get("giftText");
                                        var create_date = object[i].get("releaseDate");
                                        var time = jikanCulc(create_date);
                                        var gift_uid = object[i].get("giftUid");
                                        var gift_price = object[i].get("price");
                                        var gift_user_id = object[i].get("userId");
                                        var gift_stock = object[i].get("stock");
                                        var ReleaseStatus = object[i].get("ReleaseStatus");
                                        var ohitotu = object[i].get("ohitotu");
                                        //カードに出力していく
                                        var card = `
                                        <div class="gift-card" style="width:48%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
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
                                        $('#searchUser').append(card);
                                        searchgiftUserGet(gift_user_id,i);
                                        searchgiftImageGetTop(gift_uid,i);
                                        searchgiftUserImageTop(gift_user_id,i);
                                        searchgift_favorite_check(gift_uid,i);
                                        if(i+1==object.length){
                                                hideLoad();
                                        }
                                }
                                
                                syoryaku();
                        }else{
                                searchGiftNoOpen();
                                hideLoad();
                        }
                })
                .catch(function(err){
                        console.log(err);
                        hideLoad();
                });
        }
}
// 一覧にユーザネームを追加
function searchUserName(object_id){

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
                var follower_user_name = "search_user_name_"+object_id;
                $('#'+follower_user_name).append(user_name);
        });
}

// 一覧にユーザネームを追加
function searchUserGenre(object_id){

        ncmb.User
        .equalTo("objectId",object_id)
        .fetch()
        .then(function(result){
                var object_id = result.get("objectId");
                var genre = result.get("Genre");
                var tag1 = '#'+genre[0];
                if(genre[1]!=null){
                        var tag2 = ' #'+genre[1];
                }else{
                        var tag2 = '';
                }
                if(genre[2]!=null){
                        var tag3 = ' #'+genre[2];
                }else{
                        var tag3='';
                }
                var follower_user_name = "search_user_genre_"+object_id;
                $('#'+follower_user_name).append(tag1+tag2+tag3);
        });
}

// フォロワー一覧でユーザ画像を表示
function searchUserImage(objectId){
        ncmb.File.download(objectId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var follower_user_image = "search_user_image_"+objectId;
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

