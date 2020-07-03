function MessageJudge(){
        var pushCounter = 0;
        pushCounter++;
        if(pushCounter==1){
                var currentUser = ncmb.User.getCurrentUser();
                var Influencer = currentUser.get('Influencer');
                var Authentication = currentUser.get('Authentication');
                if(Influencer==true&&Authentication=="OK"){
                        setTimeout(function(){
                                $('.card_jusinbako').click();
                        },500);
                }else{
                        setTimeout(function(){
                                $('.card_oreichat').click();
                        },500);
                }
        }
        
}

function Message(kind){
        showMessageLoad();
        $('#jushinBox').empty();
        if(kind == 'receive'){
                var kind = 'receiveUserId';
        }else if(kind == 'send'){
                var kind = 'sendUserId';
        }
        var messageCounter = 0;

        if(kind=="oreichat"){
                var soushinkanou = `<p style="width:95%;color:white;margin:0 auto;font-size:0.8em;">送信可能リスト(購入後ギフトが表示されます)</p>`;
                $('#jushinBox').append(soushinkanou);

                var currentUser = ncmb.User.getCurrentUser();
                var objectId = currentUser.get('objectId');
                var giftLog = ncmb.DataStore("giftLog");
                giftLog
                .order('createDate',true)
                .equalTo("buyUser",objectId)
                .equalTo("torihikiStatus","プレゼント完了")
                .notEqualTo("sendOreiChat","end")
                .fetchAll()
                .then(function(results){
                        if(results.length==0){
                                hideMessageLoad();
                                setTimeout(function(){
                                        heightChagne();
                                },500);
                                setTimeout(function(){
                                        heightChagne();
                                },1000);
                                setTimeout(function(){
                                        heightChagne();
                                },2000);
                        }
                        for (var i=0;i<results.length;i++){
                                var createDate = results[i].get("createDate");
                                var createDate = new Date(createDate).toLocaleString();
                                var giftUid = results[i].get("giftUid");
                                var giftTitle = results[i].get("giftTitle");
                                var logId = results[i].get("logId");
                                var jushin = `
                                        <div class="card" style="text-align: center;padding-top:15px;padding-bottom:15px;margin-bottom:20px;" onclick="oreiChatPage('`+logId+`');">
                                                <div style="width:20%;display:inline-block;">
                                                        <img id="oreiChatGiftImg_`+i+`" src="img/loading.png" style="height:60px;width:60px;object-fit:cover;border-radius:5px;">
                                                </div>
                                                <div class="card__content" style="vertical-align:top;text-align: left;width:75%;display:inline-block;height:60px;position:relative;">`+giftTitle+`
                                                <p style="vertical-align:bottom;position:absolute;bottom:0;margin-top:0px;margin-bottom:0px;padding-top:10px;width:100%;text-align: right;color:#898989;font-size:0.8em;">注文ID:`+logId+` 購入日:`+createDate+`</p>
                                                </div>
                                        </div>
                                `;
                                $('#jushinBox').append(jushin);
                                oreiChatGiftImg(giftUid,i);
                                
                                if(i+1==results.length){
                                        hideMessageLoad();

                                        setTimeout(function(){
                                                heightChagne();
                                        },500);
                                        setTimeout(function(){
                                                heightChagne();
                                        },1000);
                                        setTimeout(function(){
                                                heightChagne();
                                        },2000);
                                }
                        }
                });
                
                
        }else{
                if(kind == 'receiveUserId'){
                        var soushinkanou = `<p style="width:95%;color:white;margin:0 auto;font-size:0.8em;">届いたお礼メッセージ</p>`;
                        $('#jushinBox').append(soushinkanou);
                }else if(kind == 'sendUserId'){
                        var soushinkanou = `<p style="width:95%;color:white;margin:0 auto;font-size:0.8em;">送信済みのお礼メッセージ</p>`;
                        $('#jushinBox').append(soushinkanou);
                }
                
                messageKind(kind,messageCounter);
        }
}

function messageKind(kind,messageCounter){
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get('objectId');
        var messageData = ncmb.DataStore("messageData");
        messageData
        .order('createDate',true)
        .equalTo(kind,objectId)
        .limit(5)
        .skip(messageCounter*5)
        .fetchAll()
        .then(function(results){
                if(results.length==0){
                        hideMessageLoad();
                        $('#messagePageBottom').remove();
                        setTimeout(function(){
                                heightChagne();
                        },500);
                        setTimeout(function(){
                                heightChagne();
                        },1000);
                        setTimeout(function(){
                                heightChagne();
                        },2000);
                }
                for (var i=0;i<results.length;i++){
                        var card_number = i+messageCounter*5;
                        var sendUserId = results[i].get("sendUserId");
                        var receiveUserId = results[i].get("receiveUserId");
                        var giftUid = results[i].get("giftUid");
                        var logId = results[i].get("logId");
                        var messageText = results[i].get("messageText");
                        var nagesengaku = results[i].get("nagesengaku");
                        if(nagesengaku==null || nagesengaku==""||nagesengaku=="undefined"){
                                nagesengaku=0;
                        }
                        
                        var jushin = `
                                <div class="card" style="text-align: center;padding-top:15px;padding-bottom:15px;margin-bottom:20px;">
                                        <div style="margin:0 auto;width:90%;">
                                                <div class="" style="height: auto;width:30%;display:inline-block;" onclick="messageUserJump('`+sendUserId+`');">
                                                        <img id="sendUserImg_`+card_number+`" src="img/human.png" alt="" style="width:40px;height:40px;border-radius: 50%;object-fit:cover;"><br>
                                                        <span id="sendUserName_`+card_number+`"style="font-size: 0.7em;"></span>
                                                </div>
                                                <div class="" style="height: auto;width:30%;display:inline-block;transform: translateY(-20px);">
                                                        <i class="fas fa-caret-right"></i>
                                                        <i class="fas fa-caret-right"></i>
                                                        <i class="fas fa-caret-right"></i>
                                                        <i class="fas fa-caret-right"></i>
                                                </div>
                                                <div class="" style="height: auto;width:30%;display:inline-block;" onclick="messageUserJump('`+receiveUserId+`');">
                                                        <img id="receiveUserImg_`+card_number+`"src="img/human.png" alt="" style="width:40px;height:40px;border-radius: 50%;object-fit:cover;"><br>
                                                        <span id="receiveUserName_`+card_number+`"style="font-size: 0.7em;"></span>
                                                </div>
                                        
                                        </div>
                                        <div id="giftTitle_`+card_number+`" class="card__content" style="margin-top:10px;font-weight:bold;text-align: left;"></div>
                                        <div class="card__content" style="margin-top:10px;text-align: left;font-size:0.7em;">`+messageText+`
                                        </div>
                                        <div style="padding-top:10px;width:100%;text-align: right;color:#898989;font-size:0.7em;">注文ID:`+logId+` 投げ銭¥:`+nagesengaku+`</div>
                                </div>
                        `;
                        $('#jushinBox').append(jushin);
                        sendUserImg(sendUserId,card_number);
                        sendUserName(sendUserId,card_number);
                        receiveUserImg(receiveUserId,card_number);
                        receiveUserName(receiveUserId,card_number);
                        giftTitle(giftUid,card_number);

                        if(messageCounter==0){
                                if(i+1==results.length){
                                        loadingIcon = `
                                        <div id="messagePageBottom" class="" style="width:98%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;text-align:center;">
                                        <br><br><br><i class="fas fa-spinner fa-3x fa-spin"></i><br><br><br>
                                        </div>`;
                                        $('#jushinBox').append(loadingIcon);
                                        hideMessageLoad();
                                        setTimeout(function(){
                                                heightChagne();
                                        },500);
                                        setTimeout(function(){
                                                heightChagne();
                                        },1000);
                                        setTimeout(function(){
                                                heightChagne();
                                        },2000);
                                }
                        }else{
                                if(i+1==results.length){
                                        $("#messagePageBottom").appendTo('#jushinBox');
                                        hideMessageLoad();
                                        setTimeout(function(){
                                                heightChagne();
                                        },500);
                                        setTimeout(function(){
                                                heightChagne();
                                        },1000);
                                        setTimeout(function(){
                                                heightChagne();
                                        },2000);
                                }
                        }
                }
                setTimeout(function(){
                        messagePageRefresh(kind);
                },2000);
        }).catch(function(err){
                console.log(err);
        });
        
}

function sendUserImg(sendUserId,i){
        ncmb.File.download(sendUserId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                var img = document.getElementById("sendUserImg_"+i);
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

function receiveUserImg(receiveUserId,i){
        ncmb.File.download(receiveUserId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                var img = document.getElementById("receiveUserImg_"+i);
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

function oreiChatGiftImg(giftUid,i){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var img = document.getElementById("oreiChatGiftImg_"+i);
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

function sendUserName(sendUserId,i){
        ncmb.User
        .equalTo("objectId",sendUserId)
        .fetch()
        .then(function(results){
                var userName = results.get("userName");
                $('#sendUserName_'+i).text(userName);
        }).catch(function(err){
                console.log(err);
        });
}

function receiveUserName(receiveUserId,i){
        ncmb.User
        .equalTo("objectId",receiveUserId)
        .fetch()
        .then(function(results){
                var userName = results.get("userName");
                $('#receiveUserName_'+i).text(userName);
        }).catch(function(err){
                console.log(err);
        });
}

function giftTitle(giftUid,i){
        var giftData = ncmb.DataStore("giftData");
        giftData
        .equalTo('giftUid',giftUid)
        .fetch()
        .then(function(results){
                var giftTitle = results.get("giftTitle");
                $('#giftTitle_'+i).text(giftTitle);
        });
}

function messageUserJump(UserId){
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get('objectId');
        if(objectId == UserId){

        }else{
                document.getElementById('navi').bringPageTop('otherpage.html');
                otherPageUserId(UserId);
        }
}

function oreiChatPage(logId){
        console.log(logId);
        var giftLog = ncmb.DataStore("giftLog");
        giftLog
        .equalTo("logId",logId)
        .fetch()
        .then(function(result){
                document.getElementById('navi').bringPageTop('oreichat.html');
                var sendUser = result.get("buyUser");
                var receiveUser = result.get("giftCreateInfluencer");
                var giftUid = result.get("giftUid");
                setTimeout(function(){
                        $('#sendUser').val(sendUser);
                        $('#receiveUser').val(receiveUser);
                        $('#giftUid').val(giftUid);
                        $('#logId').val(logId);
                },500);
        });
}

function showMessageLoad(){
        $("#message-page").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
}

function hideMessageLoad(){
        $("#message-page").LoadingOverlay("hide");
}

