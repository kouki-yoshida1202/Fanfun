function searchUser(search_way,searchCounter){
        showLoadSearchUserPage();
        if(search_way=="キーワード検索"){
                var user_name = $('#searchUserKeyword').val();
                if(!user_name || user_name == ""){
                        searchKeywordNoOpen();
                        hideLoadSearchUserPage();
                }else{
                        document.getElementById('navi').bringPageTop('searchUserPage.html');
                        $('#searchUser').empty();
                        searchUserKeyWord(user_name,searchCounter);
                }
        }else if(search_way=="カテゴリ検索"){
                var genre = $('.search_user:checked').map(function() {
                        return $(this).val();
                }).get();
                if(genre ==""){
                        categoryNoOpen();
                        hideLoadSearchUserPage();
                }else{
                        document.getElementById('navi').bringPageTop('searchUserPage.html');
                        $('#searchUser').empty();
                        //データストアから取得して、1件表示する
                        searchUserGenre(genre,searchCounter);
                }
        }else{
                alert("こちらの画面には遷移できません。");
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
function searchUserGenreTag(object_id){

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

function searchUserKeyWord(user_name,searchCounter){
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var userName = currentUser.get("userName");
        var search_user_array=[];
        
        ncmb.User.regularExpressionTo("userName", "^(?=.*"+user_name+").*$")
        .order('createDate', true)
        .equalTo("Authentication","OK")
        .notEqualTo('userKind','test')
        .limit(10)
        .skip(searchCounter*10)
        .fetchAll()
        .then(function(userList){
                var userList = userList;
                
                var search_user_id=[];
                if(userList.length == 0){
                        hideLoadSearchUserPage();
                        $('#searchUserPageBottom').remove();
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
                        searchUserGenreTag(object_id);
                        searchUserImage(object_id);

                        if(searchCounter==0){
                                if(k+1==userList.length){
                                        hideLoadSearchUserPage();
                                        loadingIcon = `
                                        <div id="searchUserPageBottom" class="" style="width:98%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;text-align:center;">
                                        <br><br><br><i class="fas fa-spinner fa-3x fa-spin"></i><br><br><br>
                                        </div>`;
                                        $('#searchUser').append(loadingIcon);
                                }
                        }else{
                                if(k+1==userList.length){
                                        $("#searchUserPageBottom").appendTo('#searchUser');
                                }
                        }
                }
                setTimeout(function(){
                        searchPageRefresh("Keyword");
                },2000);
        }).catch(function(err){
                console.log(err);
                hideLoadSearchUserPage();
        });

        
}

function searchUserGenre(genre,searchCounter){
        ncmb.User
        .order('createDate', true)
        .equalTo("Authentication","OK")
        .inArray("Genre",genre)
        .notEqualTo('userKind','test')
        .limit(10)
        .skip(searchCounter*10)
        .fetchAll()
        .then(function(results){
                var object = results;
                if(results.length == 0){
                        hideLoadSearchUserPage();
                        $('#searchUserPageBottom').remove();
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
                        searchUserGenreTag(object_id);
                        searchUserImage(object_id);
                        if(searchCounter==0){
                                if(k+1==results.length){
                                        hideLoadSearchUserPage();
                                        loadingIcon = `
                                        <div id="searchUserPageBottom" class="" style="width:98%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;text-align:center;">
                                        <br><br><br><i class="fas fa-spinner fa-3x fa-spin"></i><br><br><br>
                                        </div>`;
                                        $('#searchUser').append(loadingIcon);
                                }
                        }else{
                                if(k+1==results.length){
                                        $("#searchUserPageBottom").appendTo('#searchUser');
                                }
                        }
                }

                setTimeout(function(){
                        searchPageRefresh("Genre");
                },2000);
        })
        .catch(function(err){
                console.log(err);
                hideLoadSearchUserPage();
        });
}

function showLoadSearchUserPage(){
        $("#searchUser").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
}

function hideLoadSearchUserPage() {
        $("#searchUser").LoadingOverlay("hide");
};