function buypage(){
        document.getElementById('navi').pushPage('buypage.html');
        var gift_uid = $('#gift_id').val();

        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');

        var GiftData = ncmb.DataStore("giftData");
        
        GiftData
        .equalTo("giftUid", gift_uid)
        .fetch()               
        .then(function(results){
                var object = results;
                var giftTitle = object.get("giftTitle");
                var giftText = object.get("giftText");
                var price = object.get("price");
                price = "¥"+price+"(税込)";
                $('#buypage_title').html(giftTitle);
                $('#buypage_price').html(price);
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
                alert('error = ' + err);
                });
        })
        .catch(function(err){
                console.log(err);
        });
}