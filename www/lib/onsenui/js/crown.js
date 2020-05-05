function crown(){
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        if(objectId != "5eUcid4PpPcG5iqM"){
                var crownCounter = 0;
                if(crownCounter==0){
                        crownCounter++;
                        var crownData = ncmb.DataStore("crownData");
                        crownData
                        .order('rank')
                        .fetchAll()
                        .then(function(results){
                                crownCounter++;
                                for (var i = 0; i < results.length; i++) {
                                        var userId = results[i].get("userId");
                                        var j = i+1;
                                        crownImg(j,userId);
                                        crownNameTag(j,userId);
                                        // crownClick(j,userId);
                                }
                        }).catch(function(err){
                                console.log(err);
                        });
                }
        }else{
                $('#userSearch').hide();
        }
}
function clickCrown(rank){
        var clickCounter = 0;
        if(clickCounter==0){
                clickCounter++;
                var crownData = ncmb.DataStore("crownData");
                crownData
                .equalTo('rank',String(rank))
                .fetch()
                .then(function(results){
                        var userId = results.get("userId");
                        document.getElementById('navi').bringPageTop('otherpage.html');
                        otherPageUserId(userId);
                }).catch(function(err){
                        console.log(err);
                });     
        }
}

function crownNameTag(j,userId){
        ncmb.User
        .equalTo("objectId", userId)
        .fetch()
        .then(function(results){
                var userName = results.get("userName");
                console.log(userName);
                var genre = results.get("Genre");
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
                $('#rank_'+j+'_name').text(j+"."+userName);
                $('#rank_'+j+'_tag').text(tag1+tag2+tag3);
        });
}
function crownImg(j,userId){
        ncmb.File.download(userId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                var img = document.getElementById("rank_"+j+"_img");
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