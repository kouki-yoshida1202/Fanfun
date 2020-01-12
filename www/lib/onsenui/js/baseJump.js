function baseJump(){
        var gift_uid = $('#gift_id').val();

        var GiftData = ncmb.DataStore("giftData");
        
        GiftData
        .equalTo("giftUid", gift_uid)
        .fetch()               
        .then(function(results){
                var object = results;
                var URL = object.get("giftURL");
                window.open(URL);
        })
        .catch(function(){
                alert("失敗");
        })
}