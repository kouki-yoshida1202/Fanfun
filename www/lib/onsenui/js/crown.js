function crown(){
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var userKind = currentUser.get("userKind");
        if(userKind != "test"){
                var crownCounter = 0;
                if(crownCounter==0){
                        crownCounter++;
                        showLoadRanking();
                        var crownData = ncmb.DataStore("crownData");
                        crownData
                        .order('rank')
                        .limit(15)
                        .fetchAll()
                        .then(function(results){
                                crownCounter++;
                                for (var i = 0; i < results.length; i++) {
                                        var userId = results[i].get("userId");
                                        var j = i+1;
                                        if(j==results.length){
                                                crownImg(j,userId,"last");
                                        }else{
                                                crownImg(j,userId,"");
                                        }
                                        crownNameTag(j,userId);
                                        // crownClick(j,userId);
                                }
                        }).catch(function(err){
                                console.log(err);
                        });
                        var kyujosyoData = ncmb.DataStore("kyujosyoData");
                        kyujosyoData
                        .order('rank')
                        .limit(12)
                        .fetchAll()
                        .then(function(results){
                                crownCounter++;
                                for (var i = 0; i < results.length; i++) {
                                        var userId = results[i].get("userId");
                                        var j = i+1;
                                        kyujosyoImg(j,userId);
                                        kyujosyoNameTag(j,userId);
                                        // kyujosyoClick(j,userId);
                                }
                        }).catch(function(err){
                                console.log(err);
                        });
                }
        }else{
                $('#kyujosyo-menu').hide();
                $('#kyujosyo-Area').hide();
                $('#userSearchTab').hide();
                $('#rank_7').hide();
                $('#rank_8').hide();
                $('#rank_9').hide();
                $('#rank_10').hide();
                $('#rank_11').hide();
                $('#rank_12').hide();
                $('#rank_13').hide();
                $('#rank_14').hide();
                $('#rank_15').hide();
                var crownCounter = 0;
                if(crownCounter==0){
                        crownCounter++;
                        var crownData = ncmb.DataStore("crownDataTest");
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
        }
}
function clickCrown(rank){
        var currentUser = ncmb.User.getCurrentUser();
        var userKind = currentUser.get("userKind");
        if(userKind != "test"){
                var clickCounter = 0;
                if(clickCounter==0){
                        clickCounter++;
                        var crownData = ncmb.DataStore("crownData");
                        crownData
                        .equalTo('rank',rank)
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
}

function crownNameTag(j,userId){
        ncmb.User
        .equalTo("objectId", userId)
        .fetch()
        .then(function(results){
                var userName = results.get("userName");
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
function crownImg(j,userId,last){
        ncmb.File.download(userId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                var img = document.getElementById("rank_"+j+"_img");
                img.src = reader.result;
                console.log(last);
                
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
                if(last=="last"){
                        console.log(j,last);
                        hideLoadRanking();
                        setTimeout(function(){
                                $('#crown-sp-content').height($('#rankingZone').height()+100);
                        },1000);
                }
        })
        .catch(function(err){
        // エラー処理
        console.log('error = ' + err);
        });
}

function clickKyujosyo(rank){
        var currentUser = ncmb.User.getCurrentUser();
        var userKind = currentUser.get("userKind");
        if(userKind != "test"){
                var clickCounter = 0;
                if(clickCounter==0){
                        clickCounter++;
                        var kyujosyoData = ncmb.DataStore("kyujosyoData");
                        kyujosyoData
                        .equalTo('rank',rank)
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
}

function kyujosyoNameTag(j,userId){
        ncmb.User
        .equalTo("objectId", userId)
        .fetch()
        .then(function(results){
                var userName = results.get("userName");
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
                $('#kyujosyo_'+j+'_name').text(j+"."+userName);
                $('#kyujosyo_'+j+'_tag').text(tag1+tag2+tag3);
        });
}
function kyujosyoImg(j,userId){
        ncmb.File.download(userId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                var img = document.getElementById("kyujosyo_"+j+"_img");
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

function showLoadRanking(){
        $("#rankingZone").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
}

function hideLoadRanking() {
        $("#rankingZone").LoadingOverlay("hide");
}

function showLoadKyujosyo(){
        $("#kyujosyoZone").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
}

function hideLoadKyujosyo() {
        $("#kyujosyoZone").LoadingOverlay("hide");
};