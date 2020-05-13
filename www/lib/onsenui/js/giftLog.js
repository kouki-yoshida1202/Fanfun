function shopPushPage(){
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var Influencer = currentUser.get("Influencer");
        var minouUriage = ncmb.DataStore("minouUriage");
        minouUriage
        .equalTo('userId',objectId)
        .fetch()         
        .then(function(result){
                var object = result;
                var minouUriage = object.get("minouUriage");
                if(minouUriage==""||minouUriage==null){
                        minouUriage=0;
                }
                $('#minouHurikomi').html(minouUriage + "円");
        }).catch(function(err){
                console.log(err);
        });

        $(".mikanryo").LoadingOverlay("show", {
                image       : "",
                fontawesome : "fa fa-refresh fa-spin",
        });
        
        var giftLog = ncmb.DataStore("giftLog");
        giftLog
        .order('createDate', true)
        .equalTo('giftCreateInfluencer',objectId)
        .notEqualTo('torihikiStatus',"プレゼント完了")
        .fetchAll()         
        .then(function(results){
                var object = results;
                var mikanryoSyuppinTorihikiCount = object.length;
                $('#mikanryoSyuppinTorihiki').html(mikanryoSyuppinTorihikiCount+"件");
                $(".mikanryoSyuppin").LoadingOverlay("hide");
        });

        giftLog
        .order('createDate', true)
        .equalTo('buyUser',objectId)
        .notEqualTo('torihikiStatus',"プレゼント完了")
        .fetchAll()         
        .then(function(results){
                var object = results;
                var mikanryoKounyuTorihikiCount = object.length;
                $('#mikanryoKounyuTorihiki').html(mikanryoKounyuTorihikiCount+"件");
                $(".mikanryoKounyu").LoadingOverlay("hide");
        });

}

function uriageRireki(){
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var objectId = currentUser.get("objectId");
        
        document.getElementById('navi').pushPage('uriageRireki.html');
        $("#uriageRirekiList").empty();
        var giftLog = ncmb.DataStore("giftLog");
        giftLog
        .order('createDate', true)
        .equalTo('giftCreateInfluencer',objectId)
        .fetchAll()                
        .then(function(results){
                var object = results;
                for(var j=0;j<object.length;j++){
                        var giftUid = object[j].get("giftUid");
                        var giftTitle = object[j].get("giftTitle");
                        var torihikiStatus = object[j].get("torihikiStatus");
                        var buyUser = object[j].get("buyUser");
                        var buyUserAtena = object[j].get("buyUserAtena");
                        var buyUserNickName = object[j].get("buyUserNickName");
                        var buyKakaku = object[j].get("buyKakaku");
                        var buyRequest = object[j].get("buyRequest");
                        var buyDate = object[j].get("buyDate");
                        var logId = object[j].get("logId");
                        var uriageRirekiList = `
                        <li class="list-item list-item--material" onclick="
                        `;
                        uriageRirekiList += "giftLogDetail('"+buyUserAtena+"','"+buyUserNickName+"','"+buyRequest+"','"+buyKakaku+"','"+giftUid+"','"+torihikiStatus+"','"+buyDate+"','出品','"+logId+"');";
                        uriageRirekiList +=`
                                ">
                                <div class="list-item__left list-item--material__left">
                                <img id="`;
                                uriageRirekiList += "gift_log_image_"+j;
                                uriageRirekiList +=`" class="list-item__thumbnail list-item--material__thumbnail" src="img/loading.png" style="object-fit: cover;">
                                </div>
                                <div class="list-item__center list-item--material__center">
                                <div class="list-item__title list-item--material__title">
                                        `+giftTitle+`
                                </div>
                                <div class="list-item__subtitle list-item--material__subtitle" style="margin-top:10px";>`;
                                if(torihikiStatus=="プレゼント完了"){
                                        uriageRirekiList += `<span style="border-radius:20px;background:#898989;color:white;padding:5px 10px 5px 10px;">`;
                                }else if(torihikiStatus == "ギフト準備中"){
                                        uriageRirekiList += `<span style="border-radius:20px;background:#FF6070;color:white;padding:5px 10px 5px 10px;">`;
                                }else{
                                        uriageRirekiList += `<span style="border-radius:20px;background:#FFD760;color:white;padding:5px 10px 5px 10px;">`;
                                }
                                uriageRirekiList += torihikiStatus;
                                uriageRirekiList += `</span>
                                <span style="float:right;color:#898989;">`;
                                        uriageRirekiList += buyDate;
                                        uriageRirekiList +=`
                                        </span>
                                </div>
                                </div>
                        </li>
                        `;
                        $('#uriageRirekiList').append(uriageRirekiList);
                        giftLogImage(giftUid,j);
                }
        }).catch(function(err){
                console.log(err);
        });  
}

function mikanryoSyuppinTorihikiList(){
        document.getElementById('navi').pushPage('mikanryoTorihiki.html');
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var objectId = currentUser.get("objectId");

        $("#mikanryoRirekiList").empty();
        var giftLog = ncmb.DataStore("giftLog");
        giftLog
        .order('createDate', true)
        .equalTo('giftCreateInfluencer',objectId)
        .notEqualTo('torihikiStatus',"プレゼント完了")
        .fetchAll()                
        .then(function(results){
                var object = results;
                for(var j=0;j<object.length;j++){
                        var giftUid = object[j].get("giftUid");
                        var giftTitle = object[j].get("giftTitle");
                        var torihikiStatus = object[j].get("torihikiStatus");
                        var buyUser = object[j].get("buyUser");
                        var buyUserAtena = object[j].get("buyUserAtena");
                        var buyUserNickName = object[j].get("buyUserNickName");
                        var buyKakaku = object[j].get("buyKakaku");
                        var buyRequest = object[j].get("buyRequest");
                        var buyDate = object[j].get("buyDate");
                        var logId = object[j].get("logId");
                        var mikanryoRirekiList = `
                        <li class="list-item list-item--material" onclick="
                        `;
                        mikanryoRirekiList += "giftLogDetail('"+buyUserAtena+"','"+buyUserNickName+"','"+buyRequest+"','"+buyKakaku+"','"+giftUid+"','"+torihikiStatus+"','"+buyDate+"','出品','"+logId+"');";
                        mikanryoRirekiList +=`
                                ">
                                <div class="list-item__left list-item--material__left">
                                <img id="`;
                                mikanryoRirekiList += "gift_log_image_"+j;
                                mikanryoRirekiList +=`" class="list-item__thumbnail list-item--material__thumbnail" src="img/loading.png" style="object-fit: cover;">
                                </div>
                                <div class="list-item__center list-item--material__center">
                                <div class="list-item__title list-item--material__title">
                                        `+giftTitle+`
                                </div>
                                <div class="list-item__subtitle list-item--material__subtitle" style="margin-top:10px";>`;
                                if(torihikiStatus=="プレゼント完了"){
                                        mikanryoRirekiList += `<span style="border-radius:20px;background:#898989;color:white;padding:5px 10px 5px 10px;">`;
                                }else if(torihikiStatus == "ギフト準備中"){
                                        mikanryoRirekiList += `<span style="border-radius:20px;background:#FF6070;color:white;padding:5px 10px 5px 10px;">`;
                                }else{
                                        mikanryoRirekiList += `<span style="border-radius:20px;background:#FFD760;color:white;padding:5px 10px 5px 10px;">`;
                                }
                                mikanryoRirekiList += torihikiStatus;
                                mikanryoRirekiList += `</span>
                                <span style="float:right;color:#898989;">`;
                                        mikanryoRirekiList += buyDate;
                                        mikanryoRirekiList +=`
                                        </span>
                                </div>
                                </div>
                        </li>
                        `;
                        $('#mikanryoRirekiList').append(mikanryoRirekiList);
                        giftLogImage(giftUid,j);
                }
        }).catch(function(err){
                console.log(err);
        });  
}
function kounyuRireki(){
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var objectId = currentUser.get("objectId");
        
        document.getElementById('navi').pushPage('kounyuRireki.html');
        $("#kounyuRirekiList").empty();
        var giftLog = ncmb.DataStore("giftLog");
        giftLog
        .order('createDate', true)
        .equalTo('buyUser',objectId)
        .fetchAll()                
        .then(function(results){
                var object = results;
                for(var j=0;j<object.length;j++){
                        var giftUid = object[j].get("giftUid");
                        var giftTitle = object[j].get("giftTitle");
                        var torihikiStatus = object[j].get("torihikiStatus");
                        var buyUser = object[j].get("buyUser");
                        var buyUserAtena = object[j].get("buyUserAtena");
                        var buyUserNickName = object[j].get("buyUserNickName");
                        var buyKakaku = object[j].get("buyKakaku");
                        var buyRequest = object[j].get("buyRequest");
                        var buyDate = object[j].get("buyDate");
                        var logId = object[j].get("logId");
                        var kounyuRirekiList = `
                        <li class="list-item list-item--material" onclick="
                        `;
                        kounyuRirekiList += "giftLogDetail('"+buyUserAtena+"','"+buyUserNickName+"','"+buyRequest+"','"+buyKakaku+"','"+giftUid+"','"+torihikiStatus+"','"+buyDate+"','購入','"+logId+"');";
                        kounyuRirekiList +=`
                                ">
                                <div class="list-item__left list-item--material__left">
                                <img id="`;
                                kounyuRirekiList += "gift_log_image_"+j;
                                kounyuRirekiList +=`" class="list-item__thumbnail list-item--material__thumbnail" src="img/loading.png" style="object-fit: cover;">
                                </div>
                                <div class="list-item__center list-item--material__center">
                                <div class="list-item__title list-item--material__title">
                                        `+giftTitle+`
                                </div>
                                <div class="list-item__subtitle list-item--material__subtitle" style="margin-top:10px";>`;
                                if(torihikiStatus=="プレゼント完了"){
                                        kounyuRirekiList += `<span style="border-radius:20px;background:#898989;color:white;padding:5px 10px 5px 10px;">`;
                                }else if(torihikiStatus == "ギフト準備中"){
                                        kounyuRirekiList += `<span style="border-radius:20px;background:#FF6070;color:white;padding:5px 10px 5px 10px;">`;
                                }else{
                                        kounyuRirekiList += `<span style="border-radius:20px;background:#FFD760;color:white;padding:5px 10px 5px 10px;">`;
                                }
                                kounyuRirekiList += torihikiStatus;
                                kounyuRirekiList += `</span>
                                <span style="float:right;color:#898989;">`;
                                        kounyuRirekiList += buyDate;
                                        kounyuRirekiList +=`
                                        </span>
                                </div>
                                </div>
                        </li>
                        `;
                        $('#kounyuRirekiList').append(kounyuRirekiList);
                        giftLogImage(giftUid,j);
                }
        }).catch(function(err){
                console.log(err);
        });  
}

function mikanryoKounyuTorihikiList(){
        document.getElementById('navi').pushPage('mikanryoTorihiki.html');
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var objectId = currentUser.get("objectId");

        $("#mikanryoRirekiList").empty();
        var giftLog = ncmb.DataStore("giftLog");
        giftLog
        .order('createDate', true)
        .equalTo('buyUser',objectId)
        .notEqualTo('torihikiStatus',"プレゼント完了")
        .fetchAll()                
        .then(function(results){
                var object = results;
                for(var j=0;j<object.length;j++){
                        var giftUid = object[j].get("giftUid");
                        var giftTitle = object[j].get("giftTitle");
                        var torihikiStatus = object[j].get("torihikiStatus");
                        var buyUser = object[j].get("buyUser");
                        var buyUserAtena = object[j].get("buyUserAtena");
                        var buyUserNickName = object[j].get("buyUserNickName");
                        var buyKakaku = object[j].get("buyKakaku");
                        var buyRequest = object[j].get("buyRequest");
                        var buyDate = object[j].get("buyDate");
                        var logId = object[j].get("logId");
                        var mikanryoRirekiList = `
                        <li class="list-item list-item--material" onclick="
                        `;
                        mikanryoRirekiList += "giftLogDetail('"+buyUserAtena+"','"+buyUserNickName+"','"+buyRequest+"','"+buyKakaku+"','"+giftUid+"','"+torihikiStatus+"','"+buyDate+"','購入','"+logId+"');";
                        mikanryoRirekiList +=`
                                ">
                                <div class="list-item__left list-item--material__left">
                                <img id="`;
                                mikanryoRirekiList += "gift_log_image_"+j;
                                mikanryoRirekiList +=`" class="list-item__thumbnail list-item--material__thumbnail" src="img/loading.png" style="object-fit: cover;">
                                </div>
                                <div class="list-item__center list-item--material__center">
                                <div class="list-item__title list-item--material__title">
                                        `+giftTitle+`
                                </div>
                                <div class="list-item__subtitle list-item--material__subtitle" style="margin-top:10px";>`;
                                if(torihikiStatus=="プレゼント完了"){
                                        mikanryoRirekiList += `<span style="border-radius:20px;background:#898989;color:white;padding:5px 10px 5px 10px;">`;
                                }else if(torihikiStatus == "ギフト準備中"){
                                        mikanryoRirekiList += `<span style="border-radius:20px;background:#FF6070;color:white;padding:5px 10px 5px 10px;">`;
                                }else{
                                        mikanryoRirekiList += `<span style="border-radius:20px;background:#FFD760;color:white;padding:5px 10px 5px 10px;">`;
                                }
                                mikanryoRirekiList += torihikiStatus;
                                mikanryoRirekiList += `</span>
                                <span style="float:right;color:#898989;">`;
                                        mikanryoRirekiList += buyDate;
                                        mikanryoRirekiList +=`
                                        </span>
                                </div>
                                </div>
                        </li>
                        `;
                        $('#mikanryoRirekiList').append(mikanryoRirekiList);
                        giftLogImage(giftUid,j);
                }
        }).catch(function(err){
                console.log(err);
        });  
}

function giftLogDetail(buyUserAtena,buyUserNickName,buyRequest,buyKakaku,giftUid,torihikiStatus,buyDate,status,logId){
        document.getElementById('navi').pushPage('giftLogDetail.html');
        var buyKakaku = String( buyKakaku );
        var giftData = ncmb.DataStore("giftData");
        giftData
        .equalTo('giftUid',giftUid)
        .fetch()                
        .then(function(results){
                var giftTitle = results.get("giftTitle");
                var giftText = results.get("giftText");
                $("#giftLogId").html(logId);
                $("#giftLogTitle").html(giftTitle);
                $("#giftLogDetail").html(giftText);
                $("#giftLogKakaku").html(buyKakaku+"円");
                $("#giftLogAtena").html(buyUserAtena);
                $("#giftLogNickName").html(buyUserNickName);
                $("#giftLogRequest").html(buyRequest);
                $('#giftLogtorihikiStatus').val(torihikiStatus);
                if(status=="出品" && torihikiStatus=="ギフト準備中"){
                        $('#giftUploadButton').css("display","block");
                }
        });
}


function giftLogImage(giftUid,j){
        ncmb.File.download(giftUid, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var gift_log_image = "gift_log_image_"+j;
                        var img = document.getElementById(gift_log_image);
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

function hurikomiShinsei(){
        document.getElementById('navi').pushPage('hurikomiShinsei.html');
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");
        var mailAddress = currentUser.get("mailAddress");

        setTimeout(function(){
                $('#hurikomiUserId').val(objectId);
                $('#hurikomiMailaddress').val(mailAddress);
        },500);
}

function hurikomiFormSend(){
        var hurikomiUserId = $('#hurikomiUserId').val();
        var hurikomiMailaddress = $('#hurikomiMailaddress').val();
        var hurikomiGinkou = $('#hurikomiGinkou').val();
        var hurikomiShiten = $('#hurikomiShiten').val();
        var hurikomiShubetu = $('#hurikomiShubetu').val();
        var hurikomiBangou = $('#hurikomiBangou').val();
        var hurikomiMeigi = $('#hurikomiMeigi').val();
        var hurikomiKingaku = $('#hurikomiKingaku').val();
        var mailcheck = MailCheck(hurikomiMailaddress);
        if(hurikomiMailaddress=="" || hurikomiGinkou=="" || hurikomiShiten=="" || hurikomiShubetu=="" || hurikomiBangou=="" || hurikomiMeigi=="" || hurikomiKingaku ==""){
                alert("未入力項目があります");
        }else if(Number(hurikomiKingaku)<1000){
                alert("振込申請は1000円以上からとなります。");
        }else{
                if(mailcheck){
                        var minouUriage = ncmb.DataStore("minouUriage");
                        minouUriage
                        .equalTo('userId',hurikomiUserId)
                        .fetch()                
                        .then(function(results){
                                var minouUriage = results.get("minouUriage");
                                if(Number(minouUriage)<Number(hurikomiKingaku)){
                                        alert("売上金よりも上回る金額は設定できません。");
                                }else{
                                        var hurikomiForm = ncmb.DataStore("hurikomiForm");
                                        // データストアへの登録
                                        var hurikomiForm = new hurikomiForm();
                                        hurikomiForm.set("userId", hurikomiUserId)
                                                .set("mailAddress", hurikomiMailaddress)
                                                .set("Ginkou",hurikomiGinkou)
                                                .set("Shiten",hurikomiShiten)
                                                .set("Shubetu",hurikomiShubetu)
                                                .set("Bangou",hurikomiBangou)
                                                .set("Meigi",hurikomiMeigi)
                                                .set("Kingaku",hurikomiKingaku)
                                                .save()
                                                .then(function(gameScore){
                                                // 保存後の処理
                                                        $.ajax({
                                                                type: 'post',
                                                                url: 'https://fanfun2020.xsrv.jp/hurikomiSend.html',
                                                                data: {
                                                                        "userId":hurikomiUserId,
                                                                        "mailAddress": hurikomiMailaddress,
                                                                        "Ginkou":hurikomiGinkou,
                                                                        "Shiten":hurikomiShiten,
                                                                        "Shubetu":hurikomiShubetu,
                                                                        "Bangou":hurikomiBangou,
                                                                        "Meigi":hurikomiMeigi,
                                                                        "Kingaku":hurikomiKingaku,
                                                                },
                                                                success: function(data){
                                                                        console.log(data);
                                                                }
                                                        });
                                                        alert("申請が完了しました。担当から改めてご連絡致します。");
                                                        document.getElementById('navi').popPage();
                                                })
                                                .catch(function(err){
                                                // エラー処理
                                                        alert("申請が失敗しました。お手数ですがお問い合わせお願い致します。");
                                                });
                                }
                        }).catch(function(err){
                        // エラー処理
                                alert("申請が失敗しました。お手数ですがお問い合わせお願い致します。");
                        });
                        
                }else{
                        alert("メールアドレスが正しくありません");
                }
        }
}