function buypage(){
        var gift_uid = $('#gift_id').val();
        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');
        var GiftData = ncmb.DataStore("giftData");
        
        GiftData
        .equalTo("giftUid", gift_uid)
        .fetch()               
        .then(function(results){
                var object = results;
                var stock = Number(object.get("stock"));
                if(stock > 0){
                        var betweenOrder = ncmb.DataStore("betweenOrder");
                        // データストアへの登録
                        var timeNow = new Date();
                        var timeNow = moment(timeNow).format();
                        var betweenOrder = new betweenOrder();
                        betweenOrder.set("giftUid", gift_uid)
                        .set("buyUser", myUserId)
                        .save()
                        .then(function(){
                                if(object.get("auction")!="オークション"){
                                        var afterStock = String(stock -1);
                                        results
                                        .set("stock",afterStock)
                                        .update();
                                }
                                document.getElementById('navi').bringPageTop('buypage.html');
                                var giftTitle = object.get("giftTitle");
                                console.log(giftTitle);
                                var giftText = object.get("giftText");
                                if(object.get("auction")!="オークション"){
                                        var price = object.get("price");
                                }else{
                                        var price = $('#detail_kakaku').val();
                                }
                                price_kakou = "¥"+price+"";
                                setTimeout(function(){
                                        $('#buypage_price_number').val(price);
                                        $('#buypage_title').html(giftTitle);
                                        $('#buypage_price').html(price_kakou);
                                        $('#buypage_gift_uid').val(gift_uid);
                                        $("#buypage_img").height($("#buypage_img").width());
                                        ncmb.File.download(gift_uid, "blob")
                                        .then(function(fileData) {
                                                var reader = new FileReader();
                                                reader.onloadend = function() {
                                                        var img = document.getElementById("buypage_img");
                                                        img.src = reader.result;
                                                }
                                                // DataURLとして読み込む
                                                reader.readAsDataURL(fileData);
                                        })
                                        .catch(function(err){
                                        // エラー処理
                                        console.log('error = ' + err);
                                        });
                                },500);
                        }).catch(function(){
                                alert("エラーが発生しました。再度お願いします。");
                        });
                }else{
                        alert("在庫が0になりました。");
                        window.location.href = 'home.html';
                }
                
        })
        .catch(function(err){
                console.log(err);
        });
}

function buyPageCancel(){
        var giftUid = $('#buypage_gift_uid').val();
        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');
        document.getElementById('navi').popPage();
        var betweenOrder = ncmb.DataStore("betweenOrder");
        
        betweenOrder
        .equalTo("giftUid", giftUid)
        .equalTo("buyUser", myUserId)
        .fetch()               
        .then(function(results){
                results.delete();
                var GiftData = ncmb.DataStore("giftData");
                GiftData
                .equalTo("giftUid", giftUid)
                .fetch()               
                .then(function(result){
                        var object = result;
                        var stock = String(Number(object.get("stock")) + 1);
                        result
                        .set("stock",stock)
                        .update();
                });
                
        });
}

function nyusatupage(){
        var gift_uid = $('#gift_id').val();
        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');
        var GiftData = ncmb.DataStore("giftData");
        var betweenOrder = ncmb.DataStore("betweenOrder");

        betweenOrder
        .equalTo("giftUid", gift_uid)
        .fetchAll()             
        .then(function(results){
                if(results.length>0){
                        alert("他の方が入札手続き中です。少々お待ち頂いた後、再度お試しくださいませ。");
                }else{
                        GiftData
                        .equalTo("giftUid", gift_uid)
                        .fetch()             
                        .then(function(results){
                                var betweenOrder = ncmb.DataStore("betweenOrder");
                                // データストアへの登録
                                var betweenOrder = new betweenOrder();
                                betweenOrder
                                .set("giftUid", gift_uid)
                                .set("buyUser", myUserId)
                                .save()
                                .then(function(){
                                        var object = results;
                                        document.getElementById('navi').bringPageTop('nyusatuPage.html');
                                        $('#nyusatuUser-ul').empty();
                                        var giftTitle = object.get("giftTitle");
                                        var createUserId = object.get("userId");
                                        var auctionDataLog = ncmb.DataStore("auctionDataLog");
                                        auctionDataLog
                                        .order("nyusatuKakaku",true)
                                        .equalTo("giftUid", gift_uid)
                                        .fetchAll()               
                                        .then(function(results){
                                                if(results.length == 0){
                                                        var price = object.get("price");
                                                        price_kakou = "¥"+price+"";
                                                }else{
                                                        var price = results[0].get("nyusatuKakaku");
                                                        price_kakou = "¥"+price+"";
                                                }
                                                for(var j=0;j<results.length;j++){
                                                        var buyUser = results[j].get("buyUser");
                                                        var nyusatuKakaku = results[j].get("nyusatuKakaku");
                                                        var createDate = isoToNormalChange(results[j].get("createDate"));
                                                        var nyusatu_list = `
                                                        <li class="list-item list-item--material">
                                                                <div class="list-item__left list-item--material__left">
                                                                        <img id="nyusatu_user_image_`;
                                                                        nyusatu_list += j+`"`;
                                                                        nyusatu_list +=`
                                                                        class="list-item__thumbnail list-item--material__thumbnail follow_thumbnanil" src="img/human.png" style="object-fit:cover;">
                                                                </div>
                                                                <div class="list-item__center list-item--material__center">
                                                                        <p id="nyusatu_list_name_`+j+`">
                                                                        </p>
                                                                </div>
                                                        
                                                                <div class="list-item__right list-item--material__right">
                                                                <p style="text-align:right;">¥`+nyusatuKakaku+`<br>`+createDate+`</p>
                                                                </div>
                                                        </li>
                                                        `;
                                                        $('#nyusatuUser-ul').append(nyusatu_list);
                                                        nyusatuUserImage(buyUser,j);
                                                        nyusatuUserName(buyUser,j);
                                                }
                                                setTimeout(function(){
                                                        $('#nyusatupage_price_number').val(price);
                                                        $('#nyusatupage_price').html(price_kakou);
                                                        $('#nyusatupage_title').html(giftTitle);
                                                        $('#nyusatupage_gift_uid').val(gift_uid);
                                                        $('#nyusatupage_createUser_uid').val(createUserId);
                                                        $('#nyusatupage_buyUser_id').val(myUserId);
                                                        $("#nyusatupage_img").height($("#nyusatupage_img").width());
                                                        ncmb.File.download(gift_uid, "blob")
                                                        .then(function(fileData) {
                                                                var reader = new FileReader();
                                                                reader.onloadend = function() {
                                                                        var img = document.getElementById("nyusatupage_img");
                                                                        img.src = reader.result;
                                                                }
                                                                // DataURLとして読み込む
                                                                reader.readAsDataURL(fileData);
                                                        })
                                                        .catch(function(err){
                                                        // エラー処理
                                                        console.log('error = ' + err);
                                                        });
                                                },500);
                                        }).catch(function(err){
                                                alert("エラーが発生しました。");
                                        });
                                }).catch(function(err){
                                        alert("エラーが発生しました。");
                                });
                                
                        }).catch(function(err){
                                alert("エラーが発生しました。");
                        });
                }
        }).catch(function(err){
                console.log("aiu");
                alert("エラーが発生しました。");
        });
        
}

function nyusatu(){
        var nyusatuKakaku = Number($('#nyusatu_input').val());
        var giftUid = $('#nyusatupage_gift_uid').val();
        var influencerId = $('#nyusatupage_createUser_uid').val();
        var buyUser = $('#nyusatupage_buyUser_id').val();
        var auctionDataLog = ncmb.DataStore("auctionDataLog");
        var auctionDataLog = new auctionDataLog();
        
        var betweenOrder = ncmb.DataStore("betweenOrder");
        betweenOrder
        .equalTo("giftUid", giftUid)
        .equalTo("buyUser", buyUser)
        .fetch()               
        .then(function(results){
                results.delete();
                auctionDataLog
                .set("giftUid", giftUid)
                .set("buyUser", buyUser)
                .set("nyusatuKakaku", nyusatuKakaku)
                .save()
                .then(function(){
                        var push = new ncmb.Push();
                        push.set("immediateDeliveryFlag", true)
                        .set("message", nyusatuKakaku+"円で新たな入札が入りました！")
                        .set("target", ["ios", "android"])
                        .set('searchCondition', {
                                userObjectId: influencerId,
                        });

                        push.send()
                        .then(function(push){
                        // 送信後処理
                                var auctionDataLog = ncmb.DataStore("auctionDataLog");
                                auctionDataLog
                                .equalTo("giftUid", giftUid)
                                .fetchAll()
                                .then(function(results){
                                        if(results.length==0){
                                                alert("入札成功");
                                                window.location.href = 'home.html';
                                        }else{
                                                var sendEndUser = [];
                                                for(var i=0;i<results.length;i++){
                                                        var buyUser = results[i].get("buyUser");
                                                        if (sendEndUser.indexOf(buyUser) == -1){
                                                                // 存在しない
                                                                sendEndUser.push(buyUser);
                                                                var push = new ncmb.Push();
                                                                push.set("immediateDeliveryFlag", true)
                                                                .set("message", nyusatuKakaku+"円で新たな入札が入りました！")
                                                                .set("target", ["ios", "android"])
                                                                .set('searchCondition', {
                                                                        userObjectId: buyUser,
                                                                });
                                                                push.send()
                                                                .then(function(push){
                                                                        
                                                                });
                                                        }     
                                                }
                                                showLoad();                                                
                                                setTimeout(function(){
                                                        alert("入札成功");
                                                        window.location.href = 'home.html';     
                                                },3000);
                                        }
                                }).catch(function(err){
                                        alert("入札成功");
                                        window.location.href = 'home.html';
                                });
                        })
                        .catch(function(err){
                        // エラー処理
                                alert("入札成功");
                                window.location.href = 'home.html';
                        });
                }).catch(function(err){
                        alert("エラーが発生しました。");
                        window.location.href = 'home.html';
                });
        }).catch(function(err){
                alert("5分を超えたため、入札権利が破棄されております。");
                window.location.href = 'home.html';
        });
}

function nyusatuUserImage(object_id,j){
        ncmb.File.download(object_id, "blob")
        .then(function(fileData) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        var nyusatu_user_image = "nyusatu_user_image_"+j;
                        var img = document.getElementById(nyusatu_user_image);
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

function nyusatuUserName(buyUser,j){
        ncmb.User
        .equalTo("objectId", buyUser)
        .fetch()
        .then(function(result){
                var userName = result.get("userName");
                var nyusatu_name = "nyusatu_list_name_"+j;
                $('#'+nyusatu_name).html(userName);
        });
}

function nyusatuPageCancel(){
        var giftUid = $('#nyusatupage_gift_uid').val();
        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');
        var betweenOrder = ncmb.DataStore("betweenOrder");
        betweenOrder
        .equalTo("giftUid", giftUid)
        .equalTo("buyUser", myUserId)
        .fetch()               
        .then(function(results){
                results.delete();
                document.getElementById('navi').popPage();
        });
}