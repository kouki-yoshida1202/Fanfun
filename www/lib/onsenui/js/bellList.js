

// -------[Demo1]データをmBaaSに保存する -------//
function bellList() {
        
    $("#myBellList").empty();
    var currentUser = ncmb.User.getCurrentUser();
    var myUserId = currentUser.get('objectId');

    var Notification = ncmb.DataStore("Notification");
    Notification
    .equalTo("toUserId", myUserId)
    .fetchAll()               
    .then(function(results){
        var object = results;
        for(var j=0;j<object.length;j++){
            var NotificationObjectId = object[j].get("objectId");
            var fromUserId = object[j].get("fromUserId");
            var messageGiftId = object[j].get("messageGiftId");
            var messageText = object[j].get("messageText");
            var messageTitle = object[j].get("messageTitle");
            var createDate = object[j].get("createDate");
            var readStatus = object[j].get("readStatus");
            var time = jikanCulc(createDate);
            var bell_list = `
                <li class="list-item list-item--material" onclick="
                `;
                bell_list += "messageDetail('"+messageTitle+"','"+messageText+"','"+messageGiftId+"','"+NotificationObjectId+"');";
                bell_list +=`
                    ">
                    <div class="list-item__left list-item--material__left">
                        <img class="list-item__thumbnail list-item--material__thumbnail" src="img/fanfun.jpg">
                    </div>
                    <div class="list-item__center list-item--material__center">
                        <div class="list-item__title list-item--material__title">
                            fanfun運営
                            <span style="float:right;color:#898989;">`;
                            bell_list += time;
                            bell_list +=`
                            </span>
                        </div>
                        <div class="list-item__subtitle list-item--material__subtitle">`;
                        bell_list += messageTitle;
                        bell_list +=`
                        </div>
                    </div>
                
                    <div class="list-item__right list-item--material__right">`;
                    if(readStatus != 1){
                        bell_list += `
                        <i style="color:#FF6070;" class="list-item__icon list-item--material__icon zmdi zmdi-comment"></i>
                        `;
                    }else{
                        bell_list += `
                        <i style="color:#ccc;" class="list-item__icon list-item--material__icon zmdi zmdi-comment"></i>
                        `;
                    }
                    bell_list +=`
                    </div>
                </li>
            `;
            $('#myBellList').append(bell_list);
        }
    })
    .catch(function(err){
        // エラー処理
        console.log(err);
        alert("メッセージ取得失敗");
    });
}

// メッセージ詳細に飛ぶときに必要な情報を送る
function messageDetail(messageTitle,messageText,messageGiftId,NotificationObjectId){
    var Notification = ncmb.DataStore("Notification");
    if(messageGiftId == ''){
        $('#gift_zone').hide();
    }
    Notification.equalTo("objectId", NotificationObjectId)
                .fetch()                
                .then(function(results){
                        var object = results;
                        var objectId = object.get("objectId");
                        results.set("readStatus", 1)
                                .update();
                        return results;
                })
                .then(function(results){
                    document.getElementById('navi').pushPage('belldetail.html');
                    return results;
                })
                .then(function(results){
                    var messageGiftId = results.get("messageGiftId");
                    var messageTitle = results.get("messageTitle");
                    var messageText = results.get("messageText");

                    var giftData = ncmb.DataStore("giftData");

                    giftData.equalTo("objectId", messageGiftId)
                            .fetch()                
                            .then(function(giftresult){
                                    var giftTitle = giftresult.get("giftTitle");
                                    var giftText = giftresult.get("giftText");
                                    var price = "¥"+ giftresult.get("price") + "";
                                    var giftUid = giftresult.get("giftUid");
                                    
                                    $('#message_title').html(messageTitle);
                                    $('#message_text').html(messageText);
                                    $('#gift_title').html(giftTitle);
                                    $('#gift_text').html(giftText);
                                    $('#gift_price').html(price);
                                    giftImageGetBell(giftUid);
                    });
                })
                .catch(function(err){
                    console.log(err);
                });

                
}

/////////////////////////////////
//ギフトイメージ
function giftImageGetBell(giftUid){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_image_place = "gift_photo";
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

/////////////////////////////////
//メッセージ送信時間から表示時間を算出
function jikanCulc(create_date){
    var datetime = create_date;
    var from = new Date(datetime);

    // 現在時刻との差分＝経過時間
    var diff = new Date().getTime() - from.getTime();
    // 経過時間をDateに変換
    var elapsed = new Date(diff);

    // 大きい単位から順に表示
    if (elapsed.getUTCFullYear() - 1970) {
            var time = elapsed.getUTCFullYear() - 1970 + '年前';
    } else if (elapsed.getUTCMonth()) {
            var time = elapsed.getUTCMonth() + 'ヶ月前';
    } else if (elapsed.getUTCDate() - 1) {
            var time = elapsed.getUTCDate() - 1 + '日前';
    } else if (elapsed.getUTCHours()) {
            var time = elapsed.getUTCHours() + '時間前';
    } else if (elapsed.getUTCMinutes()) {
            var time = elapsed.getUTCMinutes() + '分前';
    } else {
            var time = 'たった今';
    }
    return time;
}
