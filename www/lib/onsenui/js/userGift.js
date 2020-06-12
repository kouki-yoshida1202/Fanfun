function MyGift(myPageGiftCounter){
        $("#myGiftList").empty();
        showUserLoad();
        // カレントユーザー情報の取得
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        $('.current_user_id').val(objectId);
        var influencer = currentUser.get("Influencer");
        var authentication = currentUser.get("Authentication");
        var userKind = currentUser.get("userKind");
        if(userKind=="test"){
                var userNameTitle = currentUser.get("userName");
                $('#myGiftList').hide();
        }else if(influencer==true && authentication=="OK"){
                $('#exhibition_button').prop("disabled",false);
                var userNameTitle = currentUser.get("userName") + " <span style='color:#FF6070;border:1px solid #FF6070;border-radius:20px;font-size:0.5em;padding:3px;vertical-align:middle;'>本人確認済</span>";
                $('#influencerTouroku').hide();
        }else if(influencer==true && authentication!="OK"){
                var userNameTitle = currentUser.get("userName");
                // $('#myGiftList').hide();
                $('#exhibition_button').prop("disabled",false);
                var influencer_button = `
                <button id="influencer_button" class="button "style="width:80%;padding-top:0px;padding-bottom:0px;line-height:auto;border-radius:30px;font-size:16px;margin:0 auto;" onclick="honninCheck();">本人確認マークの申請</button>
                <p style="width:80%;margin:0 auto;font-size:0.8em;margin-top:15px;text-align:left;">本人確認がお済みでない限り、出品は出来ますがファンの方は購入できません。</p>
                `;
                $('#influencerTouroku').html(influencer_button);
        }else{
                var userNameTitle = currentUser.get("userName");
                $('#myGiftList').hide();

                var influencer_button = `
                <button id="influencer_button" class="button "style="width:70%;padding-top:0px;padding-bottom:0px;line-height:auto;border-radius:30px;font-size:16px;margin:0 auto;"onclick="document.getElementById('navi').bringPageTop('influencerChangeKiyaku.html');influencerChangeKiyaku();">インフルエンサー登録</button>
                `;
                $('#influencerTouroku').html(influencer_button);
        }
        $('.user_name_title').html(userNameTitle);
        myPageGiftList(myPageGiftCounter);

        var GiftData = ncmb.DataStore("giftData");
        GiftData
        .equalTo("userId", objectId)
        .notEqualTo('ReleaseStatus',1)
        .fetchAll()                
        .then(function(results){
                var syuppinnsu = "&emsp;"+results.length+" 出品&emsp;"
                $('#myGiftLength').html(syuppinnsu);
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
                console.log('error = ' + err);
        });
}
function giftImageGet(giftUid,i,gift_stock,auction){
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
                if(gift_stock==0 && auction!="オークション"){
                        var sold_out = `<img class="sold_out" src="img/custom – 8.png" style="border-radius:20px;"></div>`;
                        $("#gift_image_"+i).after(sold_out);
                        $("#gift_image_"+i).addClass("sold_img");
                        $("#gift_image_"+i).parent().addClass("sold_img_parent");
                        $('#mypage_card_content_'+i).css("margin-top","5px");
                }
        })
        .catch(function(err){
        // エラー処理
        console.log('error = ' + err);
        });
}

function giftIdJudge(gift_uid,userName,gift_title,gift_text,objectId,create_date,price,gift_user_id,gift_stock,ReleaseStatus,ohitotu,auction){
        // 日付のフォーマット変換
        ncmb.User
        .equalTo("objectId", gift_user_id)
        .fetch()
        .then(function(results){
                var gift_user_name = results.get("userName");
                var Authentication = results.get("Authentication");
                var userKind = results.get("userKind");
                if(gift_user_id == objectId){
                        //自分のギフト
                        document.getElementById('navi').bringPageTop('myGiftDetail.html');
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
                                setTimeout(function(){
                                        reader.onloadend = function() {
                                                var img = document.getElementById("gift_detail_image");
                                                img.src = reader.result;
                                        }
                                        // DataURLとして読み込む
                                        reader.readAsDataURL(fileData);
                                },500);
                        })
                        .catch(function(err){
                        // エラー処理
                                console.log('error = ' + err);
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
                                console.log('error = ' + err);
                        });
                        // 各テキストを入れる
                        setTimeout(function() {
                                gift_price = "¥"+price;
                                $('#gift_detail_username').html(gift_user_name);
                                $('#gift_detail_title').html(gift_title);
                                $('#gift_detail_text').html(gift_text);
                                
                                $('#gift_detail_time').html(formatDate(date));
                                $('#my_user_id').val(gift_user_id);
                                $('#my_gift_id').val(gift_uid);
                                if(auction=="オークション"){
                                        $('#mygift_detail_auction').css("display","block");
                                        $('#gift_detail_price').html("現在:"+gift_price);
                                        var giftData = ncmb.DataStore("giftData");
                                        giftData
                                        .equalTo('giftUid',gift_uid)
                                        .fetch()         
                                        .then(function(result){
                                                var auctionEndTime = isoToNormalChange(result.get("auctionEndTime"));
                                                $('#zaikoMyDetail').html("終了:"+auctionEndTime);
                                        });
                                }else{
                                        $('#my_stock').html(gift_stock);
                                        $('#gift_detail_price').html(gift_price);
                                }
                                $('#ReleaseStatus').val(ReleaseStatus);
                                my_gift_favorite_check_detail(gift_uid);
                                if(ReleaseStatus==1){
                                        $('#gift_detail_ReleaseStatus').css("display","block");
                                        $('#shitagakiButton').text("公開する");
                                        $('#shitagakiTitle').html("公開しますか？");
                                }
                                if(ohitotu=="ON" && auction!="オークション"){
                                        $('#mygift_detail_ohitotu').css("display","block");
                                }
                                if(Authentication!="OK"){
                                        alertNew("本人確認が未完了のため、購入されません。","","");
                                }
                        },500);
                }else{
                        document.getElementById('navi').bringPageTop('detail.html');
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
                                console.log('error = ' + err);
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
                                console.log('error = ' + err);
                        });
                        var giftData = ncmb.DataStore("giftData");
                        giftData
                        .equalTo('giftUid',gift_uid)
                        .fetch()         
                        .then(function(result){
                                var gift_stock = result.get("stock");
                                setTimeout(function(){
                                        $('#stock').html(gift_stock);
                                        if((gift_stock <= 0 || gift_stock == '' || gift_stock==undefined) && auction!="オークション"){
                                                $('#ReleaseStatusButton').prop("disabled",true);
                                                $('#ReleaseStatusButton').html("在庫切れ");
                                        }
                                },500)
                                
                                var ReleaseStatus = result.get("ReleaseStatus");
                                if(ReleaseStatus==1){
                                        $('#ReleaseStatusButton').prop("disabled",true);
                                        $('#ReleaseStatusButton').html("購入不可");
                                }
                                
                                if(auction=="オークション"){
                                        if(result.get('auctionEndTime') == ''||result.get('auctionEndTime') == null){
                                                $('#zaikoOtherDetail').html("終了:");
                                        }else{
                                                var auctionEndTime = isoToNormalChange(result.get("auctionEndTime"));
                                                $('#zaikoOtherDetail').html("終了:"+auctionEndTime);
                                        }
                                        var auctionStatus = result.get("auctionStatus");
                                        if(auctionStatus=="終了"){
                                                var auctionRakusatuLog = ncmb.DataStore("auctionRakusatuLog");
                                                auctionRakusatuLog
                                                .equalTo("giftUid", gift_uid)
                                                .fetchAll()
                                                .then(function(auctionResult){
                                                        if(auctionResult.length!=0){
                                                                var buyUser = auctionResult[0].get("buyUser");
                                                                if(buyUser==objectId){
                                                                        $('#ReleaseStatusButton').css('display','block');
                                                                        $('#nyusatuButton').css('display','none');
                                                                        $('#nyusatuEndButton').css('display','none');
                                                                }else{
                                                                        $('#ReleaseStatusButton').css('display','none');
                                                                        $('#nyusatuButton').css('display','none');
                                                                        $('#nyusatuEndButton').css('display','block');
                                                                }
                                                        }else{
                                                                $('#ReleaseStatusButton').css('display','none');
                                                                $('#nyusatuButton').css('display','none');
                                                                $('#nyusatuEndButton').css('display','block');
                                                        }
                                                        
                                                });
                                                
                                        }else{
                                                $('#ReleaseStatusButton').css("display","none");
                                                $('#nyusatuButton').css("display","block");
                                                $('#nyusatuEndButton').css('display','none');
                                        }
                                        setTimeout(function(){
                                                var releaseDate = result.get("releaseDate");
                                                var time = new Date();
                                                var iso = moment(time).format();
                                                if(releaseDate > iso){
                                                        console.log("aiueo");
                                                        var dt = new Date(releaseDate);
                                                        var m = ("00" + (dt.getMonth()+1)).slice(-2);
                                                        var d = ("00" + dt.getDate()).slice(-2);
                                                        var hh = dt.getHours();
                                                        if (hh < 10) {
                                                                hh = "0" + hh;
                                                        }
                                                        var mm = dt.getMinutes();
                                                        if (mm < 10) {
                                                                mm = "0" + mm;
                                                        }
                                                        var time = m + "/" + d + " " +hh + ":" + mm;
                                                        $('#nyusatuButton').prop("disabled",true);
                                                        $('#nyusatuButton').html(time+"開始");
                                                }
                                        },500);
                                }
                                setTimeout(function(){
                                        var releaseDate = result.get("releaseDate");
                                        var time = new Date();
                                        var iso = moment(time).format();
                                        if(releaseDate > iso){
                                                var dt = new Date(releaseDate);
                                                var m = ("00" + (dt.getMonth()+1)).slice(-2);
                                                var d = ("00" + dt.getDate()).slice(-2);
                                                var hh = dt.getHours();
                                                if (hh < 10) {
                                                        hh = "0" + hh;
                                                }
                                                var mm = dt.getMinutes();
                                                if (mm < 10) {
                                                        mm = "0" + mm;
                                                }
                                                var time = m + "/" + d + " " +hh + ":" + mm;
                                                $('#ReleaseStatusButton').prop("disabled",true);
                                                $('#ReleaseStatusButton').html(time+"公開");
                                        }
                                },500);
                        });
                        // 各テキストを入れる
                        setTimeout(function() {
                                gift_price = "¥"+price;
                                $('#gift_detail_username_other').html(gift_user_name);
                                $('#gift_detail_title_other').html(gift_title);
                                $('#gift_detail_text_other').html(gift_text);
                                $('#gift_detail_time_other').html(formatDate(date));
                                $('#other_user_id').val(gift_user_id);
                                $('#gift_id').val(gift_uid);
                                if(userKind=="test"){
                                        $('#ReleaseStatusButton').prop("disabled",true);
                                        $('#ReleaseStatusButton').html("在庫切れ");
                                        $('#stock').html("0");
                                        $('#share_button').css("display","none");
                                }
                                
                                if(auction=="オークション"){
                                        var auctionDataLog = ncmb.DataStore("auctionDataLog");
                                        auctionDataLog
                                        .order("nyusatuKakaku",true)
                                        .equalTo('giftUid',gift_uid)
                                        .limit(1)
                                        .fetchAll()         
                                        .then(function(results){
                                                for(var i=0;i<results.length;i++){
                                                        var nyusatuKakaku = results[i].get("nyusatuKakaku");
                                                        $('#gift_detail_price_other').html("現在:¥"+nyusatuKakaku);
                                                        $('#detail_kakaku').val(nyusatuKakaku);
                                                }
                                                if(results.length==0){
                                                        $('#gift_detail_price_other').html("現在:"+gift_price);
                                                        $('#detail_kakaku').val(nyusatuKakaku);
                                                }
                                        });
                                        
                                        $('#gift_detail_auction').css("display","block");
                                        
                                }else{
                                        
                                        $('#gift_detail_price_other').html(gift_price);
                                }
                                gift_favorite_check_detail(gift_uid);
                                if(Authentication!="OK"){
                                        $('#ReleaseStatusButton').prop("disabled",true);
                                }
                                if(ohitotu=="ON" && auction!="オークション"){
                                        $('#gift_detail_ohitotu').css("display","block");
                                        // 購入済みかどうか
                                        var giftLog = ncmb.DataStore("giftLog");
                                        giftLog
                                        .equalTo('buyUser',objectId)
                                        .equalTo('giftUid',gift_uid)
                                        .fetchAll()         
                                        .then(function(results){
                                                var object = results;
                                                if(object.length > 0){
                                                        $('#ReleaseStatusButton').prop("disabled",true);
                                                        $('#ReleaseStatusButton').html("購入済み");
                                                }
                                        });
                                }
                                if(Authentication!="OK"){
                                        alertNew("このギフトは本人確認が済んでいない出品者のため購入不可です。","","")
                                }
                        },500);
                }
        });
}

function jikanCulc(create_date){
        var datetime = create_date;
        var time = new Date();
        var iso = moment(time).format();
        if(datetime > iso){
                var time = "公開待ち"
                return time;
        }else{
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
        }å
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

function honninCheck(){
        document.getElementById('navi').bringPageTop('honninCheck.html');
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var mailAddress = currentUser.get("mailAddress");
        var userName = currentUser.get("userName");
        setTimeout(function(){
                $('#honninUserId').val(objectId);
                $('#honninMailaddress').val(mailAddress);
                $('#honninUserName').val(userName);
        },500);
}

function myPageGiftList(myPageGiftCounter){
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var userName = currentUser.get("userName");
        //データストアから取得して、1件表示する
        var GiftData = ncmb.DataStore("giftData");
        GiftData
        .order('createDate', true)
        .equalTo("userId", objectId)
        .notEqualTo('ReleaseStatus',1)
        .limit(6)
        .skip(myPageGiftCounter*6)
        .fetchAll()                
        .then(function(results){
                var object = results;
                if(object.length==0){
                        hideUserLoad();
                        $('#myPageBottom').remove();
                }
                for(var i=0;i<object.length;i++){
                        var card_number = i+myPageGiftCounter*6;
                        var gift_title = object[i].get("giftTitle");
                        var gift_text =object[i].get("giftText");
                        var create_date = object[i].get("releaseDate");
                        var time = jikanCulc(create_date);
                        var gift_uid = object[i].get("giftUid");
                        var gift_stock = object[i].get("stock");
                        var gift_price = object[i].get("price");
                        var gift_user_id = object[i].get("userId");
                        var ReleaseStatus = object[i].get("ReleaseStatus");
                        var ohitotu = object[i].get("ohitotu");
                        var auction = object[i].get("auction");
                        //カードに出力していく
                        var card = `
                        <div class="gift-card" style="width:49%;height: 298px;padding: 1px 0 0 0;display: inline-block;margin-top:5px;"onclick="
                        `;
                        card += "giftIdJudge('"+gift_uid+"','"+userName+"','"+gift_title+"','"+gift_text+"','"+objectId+"','"+create_date+"','"+gift_price+"','"+gift_user_id+"','"+gift_stock+"','"+ReleaseStatus+"','"+ohitotu+"','"+auction+"');";
                        card +=`
                        ">
                                <input class="gift_uid" type="" value="`;
                                card += gift_uid;
                                card += `
                                " hidden>
                                <div class="card" style="height:99%;margin:3px;border-radius:20px;">
                                        <div class="card__content" style="height:auto;position:relative;">
                                                <img id="`;
                                                card += "gift_image_"+card_number;
                                                card +=`"class="gift_image" src="" alt="" style="width:100%;height:157px;object-fit:cover;border-radius: 20px;">
                                        </div>
                                        <div id="mypage_card_content_`;
                                        card +=card_number;
                                        card +=`" class="card__content" style="height:45px;">
                                                <ul class="list" style="background-image:none;background:transparent;margin-top:-13px;">
                                                <li class="list-item" style="padding:0px;">
                                                        <div class="list-item__left" style="padding:0px;">
                                                        <img class="list-item__thumbnail" id="gift_user_image_`;
                                                        card += card_number;
                                                        card +=`" src="" alt="" style="border-radius: 50%;">
                                                        </div>
                                                
                                                        <div class="list-item__center" style="padding:0px; padding-left:5px;">
                                                        <div class="current_user_name my_page_user_name" style="text-align: left;"></div>
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
                                                        card += "my_gift_favorite_"+card_number;
                                                        card +=`"class="fas fa-heart favorite_off" style="font-size:12px;"></i> <span id="`;
                                                        card += "my_gift_favorite_span_"+card_number;
                                                        card +=`"class="favorite_off">0</span>
                                                </button>`;
                                                if(auction=="オークション"){
                                                        card += `<button class="toolbar-button" style="font-size:12px;padding:0px;background:#FF6070;margin-left:3px;border-radius:20px;padding:3px;">
                                                        <span style="font-size:10px;color:white;">オークション</span>
                                                        </button>`;
                                                }else{
                                                        card += `<button class="toolbar-button" style="font-size:12px;padding:0px;">
                                                        <span style="font-size:12px;color:gray">残:`;
                                                        card += gift_stock;
                                                        card +=`</span>
                                                        </button>`;
                                                }
                                                card +=`
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
                        $('.my_page_user_name').html(userName);
                        giftImageGet(gift_uid,card_number,gift_stock,auction);
                        giftUserImage(objectId,card_number);
                        my_gift_favorite_check(gift_uid,card_number);

                        if(myPageGiftCounter==0){
                                if(i+1==object.length){
                                        hideUserLoad();
                                        loadingIcon = `
                                        <div id="myPageBottom" class="" style="width:98%;height: auto; padding: 1px 0 0 0;display: inline-block;margin-top:5px;text-align:center;">
                                        <br><br><br><i class="fas fa-spinner fa-3x fa-spin"></i><br><br><br>
                                        </div>`;
                                        $('#myGiftList').append(loadingIcon);
                                }
                        }else{
                                if(i+1==object.length){
                                        hideUserLoad();
                                        $("#myPageBottom").appendTo('#myGiftList');
                                }
                        }
                }
                
                syoryaku();
        })
        .catch(function(err){
                console.log(err);
                hideUserLoad();
        });  

        setTimeout(function(){
                myPageRefresh();
        },2000);
}