
///////////////////////////////////
// いいねボタンをギフト詳細で押した時に発火
function gift_favorite_button(){
        var gift_id = $('#gift_id').val();
    
        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');
    
        var GiftFavorite = ncmb.DataStore("GiftFavorite");
        
        GiftFavorite
        .equalTo("UserId", myUserId)
        .equalTo("giftUid", gift_id)
        .fetch()               
        .then(function(results){
            if($('#gift_favorite_status').hasClass("favorite_on")){
                //既にイイネしてるとき
                results.delete();
                $('#gift_favorite_status').removeClass("favorite_on").addClass("favorite_off");
                var gift_favorite_count = Number($('#gift_favorite_count').html()) - 1;
                $('#gift_favorite_count').html(gift_favorite_count);
            }else{
                // まだイイネしてないとき
                var giftFavorite = new GiftFavorite();
    
                giftFavorite
                .set("giftUid", gift_id)
                .set("UserId", myUserId)
                .save()
                .then(function(){
                        // 保存後の処理
                        $('#gift_favorite_status').addClass("favorite_on").removeClass("favorite_off");
                        var gift_favorite_count = Number($('#gift_favorite_count').html()) + 1;
                        $('#gift_favorite_count').html(gift_favorite_count);
                })
                .catch(function(err){
                        // エラー処理
                        console.log(err)
                });
            }
        })
        .catch(function(err){
            console.log(err);
        });
    }
    ////////////////////////////////
    // ギフト一覧でイイネ数を表示する関数
    function gift_favorite_check(gift_uid,i){
    
        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');
    
        var GiftFavorite = ncmb.DataStore("GiftFavorite");
        
        GiftFavorite
        .equalTo("giftUid", gift_uid)
        .fetchAll()
        .then(function(results){
            var favorite_count = results.length;
            $('#gift_favorite_span_'+i).html(favorite_count);
        });
    
    
        GiftFavorite
        .equalTo("UserId", myUserId)
        .equalTo("giftUid", gift_uid)
        .fetch()               
        .then(function(results){
            if(Object.keys(results).length != 0){
                $('#gift_favorite_'+i).addClass("favorite_on").removeClass("favorite_off");
                $('#gift_favorite_span_'+i).addClass("favorite_on").removeClass("favorite_off");
            }else{
                $('#gift_favorite_'+i).removeClass("favorite_on").addClass("favorite_off");
                $('#gift_favorite_span_'+i).removeClass("favorite_on").addClass("favorite_off");
            }
        })
        .catch(function(err){
            console.log(err);
        });
    }
    ///////////////////////////////
    // ギフト詳細画面でイイネ数を表示する
    function gift_favorite_check_detail(gift_uid){
    
        var currentUser = ncmb.User.getCurrentUser();
        var myUserId = currentUser.get('objectId');
    
        var GiftFavorite = ncmb.DataStore("GiftFavorite");
        
        GiftFavorite
        .equalTo("giftUid", gift_uid)
        .fetchAll()
        .then(function(results){
            var favorite_count = results.length;
            $('#gift_favorite_count').html(favorite_count);
        });
    
        GiftFavorite
        .equalTo("UserId", myUserId)
        .equalTo("giftUid", gift_uid)
        .fetch()               
        .then(function(results){
            if(Object.keys(results).length != 0){
                $('#gift_favorite_status').addClass("favorite_on").removeClass("favorite_off");
                $('#gift_favorite_count').addClass("favorite_on").removeClass("favorite_off");
            }else{
                $('#gift_favorite_status').removeClass("favorite_on").addClass("favorite_off");
                $('#gift_favorite_count').removeClass("favorite_on").addClass("favorite_off");
            }
        })
        .catch(function(err){
            console.log(err);
        });
    }