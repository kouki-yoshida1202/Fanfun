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
                                var afterStock = String(stock -1);
                                results
                                .set("stock",afterStock)
                                .update();
                                document.getElementById('navi').bringPageTop('buypage.html');
                                var giftTitle = object.get("giftTitle");
                                console.log(giftTitle);
                                var giftText = object.get("giftText");
                                var price = object.get("price");
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
                console.log(results);
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