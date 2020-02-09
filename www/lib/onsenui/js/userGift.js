function MyGift(){
        $("#myGiftList").empty();
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        $('.current_user_id').val(objectId);
        var influencer = currentUser.get("Influencer");
        var authentication = currentUser.get("Authentication");
        if(influencer==true && authentication=="OK"){
                $('#exhibition_button').prop("disabled",false);
                var userNameTitle = currentUser.get("userName") + " <i class='far fa-check-circle' style='color:#FF6070;'></i>";
                $('#influencerTouroku').hide();
        }else{
                var userNameTitle = currentUser.get("userName");
                $('#myGiftList').hide();

                var influencer_button = `
                <button id="influencer_button" class="button "style="width:70%;padding-top:0px;padding-bottom:0px;line-height:auto;border-radius:30px;font-size:16px;margin:0 auto;"onclick="document.getElementById('navi').pushPage('influencerChangeKiyaku.html');influencerChangeKiyaku();">インフルエンサー申請</button>
                `;
                $('#influencerTouroku').html(influencer_button);
        }
        $('.user_name_title').html(userNameTitle);
        var userName = currentUser.get("userName");
        //データストアから取得して、1件表示する
        var GiftData = ncmb.DataStore("giftData");

        GiftData
        .order('createDate', true)
        .equalTo("userId", objectId)
        .fetchAll()                
        .then(function(results){
                var object = results;
                var syuppinnsu = "&emsp;"+object.length+" 出品&emsp;"
                $('#myGiftLength').html(syuppinnsu);
                for(var i=0;i<object.length;i++){
                        var gift_title = object[i].get("giftTitle");
                        var gift_text =object[i].get("giftText");
                        var create_date = object[i].get("createDate");
                        var time = jikanCulc(create_date);
                        var gift_uid = object[i].get("giftUid");
                        var gift_stock = object[i].get("stock");
                        var gift_price = object[i].get("price");
                        var gift_user_id = object[i].get("userId");
                        
                        //カードに出力していく
                        var card = `
                        <div class="gift-card" style="width:49%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                        `;
                        card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"');";
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
                                                card +=`"class="gift_image" src="" alt="" style="width:100%;height:125px;border-radius: 20px;">
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
                                                        card += "my_gift_favorite_"+i;
                                                        card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                        card += "my_gift_favorite_span_"+i;
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
                        $('#myGiftList').append(card);
                        $('.gift_image').height($('.gift_image').width());
                        
                        
                        $('.current_user_name').html(userName);
                        giftImageGet(gift_uid,i);
                        giftUserImage(objectId,i);
                        my_gift_favorite_check(gift_uid,i);
                }
                
                syoryaku();
        })
        .catch(function(err){
                console.log(err);
        });       
}
function giftUserImage(objectId,i){
        ncmb.File.download(objectId, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_userimage = "gift_user_image_"+i;
                        var img = document.getElementById(gift_userimage);
                        img.src = reader.result;
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
        })
        .catch(function(err){
                // エラー処理
                alert('error = ' + err);
        });
}
function giftImageGet(giftUid,i){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_image_place = "gift_image_"+i;
                        
                        var img = document.getElementById(gift_image_place);
                        img.src = reader.result;
                }
                // DataURLとして読み込む
                reader.readAsDataURL(fileData);
        })
        .catch(function(err){
        // エラー処理
        alert('error = ' + err);
        });
}

function giftIdJudge(gift_uid,userName,gift_title,gift_text,objectId,create_date,price,gift_user_id,gift_stock){
        // 日付のフォーマット変換
        
        ncmb.User
        .equalTo("objectId", gift_user_id)
        .fetch()
        .then(function(results){
                var gift_user_name = results.get("userName");
                if(gift_user_id == objectId){
                        document.getElementById('navi').pushPage('myGiftDetail.html');
                        function formatDate(date) {
                                const y = date.getFullYear()
                                const m = date.getMonth() + 1
                                const d = date.getDate();
                                const day = '日月火水木金土'.charAt(date.getDay());
                                return `${y}年${m}月${d}日 (${day})`;
                        }
                        const date = new Date(create_date);
                
                        // 画像ダウンロード
                        ncmb.File.download(gift_uid, "blob")
                        .then(function(fileData) {
                                var reader = new FileReader();
                                reader.onloadend = function() {
                                        var img = document.getElementById("gift_detail_image");
                                        img.src = reader.result;
                                }
                                // DataURLとして読み込む
                                reader.readAsDataURL(fileData);
                        })
                        .catch(function(err){
                        // エラー処理
                                alert('error = ' + err);
                        });
                
                        // 画像ダウンロード
                        ncmb.File.download(gift_user_id, "blob")
                        .then(function(fileData) {
                                var reader = new FileReader();
                                reader.onloadend = function() {
                                        var img = document.getElementById("gift_detail_user_image");
                                        img.src = reader.result;
                                }
                                // DataURLとして読み込む
                                reader.readAsDataURL(fileData);
                        })
                        .catch(function(err){
                        // エラー処理
                                alert('error = ' + err);
                        });
                        // 各テキストを入れる
                        setTimeout(function() {
                                gift_price = "¥"+price;
                                $('#gift_detail_username').html(gift_user_name);
                                $('#gift_detail_title').html(gift_title);
                                $('#gift_detail_text').html(gift_text);
                                $('#gift_detail_price').html(gift_price);
                                $('#gift_detail_time').html(formatDate(date));
                                $('#my_user_id').val(gift_user_id);
                                $('#my_gift_id').val(gift_uid);
                                $('#my_stock').html(gift_stock);
                                my_gift_favorite_check_detail(gift_uid);
                        },500);
                }else{
                        document.getElementById('navi').pushPage('detail.html');
                        function formatDate(date) {
                                const y = date.getFullYear()
                                const m = date.getMonth() + 1
                                const d = date.getDate();
                                const day = '日月火水木金土'.charAt(date.getDay());
                                return `${y}年${m}月${d}日 (${day})`;
                        }
                        const date = new Date(create_date);
                
                        // 画像ダウンロード
                        ncmb.File.download(gift_uid, "blob")
                        .then(function(fileData) {
                                var reader = new FileReader();
                                reader.onloadend = function() {
                                        var img = document.getElementById("gift_detail_image_other");
                                        img.src = reader.result;
                                }
                                // DataURLとして読み込む
                                reader.readAsDataURL(fileData);
                        })
                        .catch(function(err){
                        // エラー処理
                                alert('error = ' + err);
                        });
                
                        // 画像ダウンロード
                        ncmb.File.download(gift_user_id, "blob")
                        .then(function(fileData) {
                                var reader = new FileReader();
                                reader.onloadend = function() {
                                        var img = document.getElementById("gift_detail_user_image_other");
                                        img.src = reader.result;
                                }
                                // DataURLとして読み込む
                                reader.readAsDataURL(fileData);
                        })
                        .catch(function(err){
                        // エラー処理
                                alert('error = ' + err);
                        });
                        // 各テキストを入れる
                        setTimeout(function() {
                                gift_price = "¥"+price;
                                $('#gift_detail_username_other').html(gift_user_name);
                                $('#gift_detail_title_other').html(gift_title);
                                $('#gift_detail_text_other').html(gift_text);
                                $('#gift_detail_price_other').html(gift_price);
                                $('#gift_detail_time_other').html(formatDate(date));
                                $('#other_user_id').val(gift_user_id);
                                $('#gift_id').val(gift_uid);
                                $('#stock').html(gift_stock);
                                gift_favorite_check_detail(gift_uid);
                                if(gift_stock == 0 || gift_stock == '' || gift_stock==undefined){
                                        $('#ReleaseStatusButton').prop("disabled",true);
                                        $('#ReleaseStatusButton').html("在庫切れ");
                                }
                        },500);
                }
        });
}

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

function syoryaku(){
        $('.gift_text').each(function() {
                var $target = $(this);
            
                // オリジナルの文章を取得する
                var html = $target.html();
                
                // 対象の要素を、高さにautoを指定し非表示で複製する
                var $clone = $target.clone();
                $clone
                  .css({
                    display: 'none',
                    position : 'absolute',
                    overflow : 'visible'
                  })
                  .width($target.width())
                  .height('auto');
            
                // DOMを一旦追加
                $target.after($clone);
            
                // 指定した高さになるまで、1文字ずつ消去していく
                while((html.length > 0) && ($clone.height() > $target.height())) {
                  html = html.substr(0, html.length - 1);
                  $clone.html(html + '...');
                }
            
                // 文章を入れ替えて、複製した要素を削除する
                $target.html($clone.html());
                $clone.remove();
        });
}