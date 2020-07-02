function orderCheck(){
                
        // 送り先の取得とセッティング
        var send_human = $('.segment__input:checked').val();
        // 送り先のニックネーム
        var nickname_input = $('#nickname_input').val();
        // リクエストメッセージ
        var request_message_input = $('#request_message_input').val();
        var request_message_input = request_message_input.replace(/\r?\n/g,'');
        var gift_title = $('#buypage_title').html();
        var price = Number($('#buypage_price_number').val());
        var gift_uid = $('#buypage_gift_uid').val();
        console.log(price);
        if(send_human==""){
                alertNew("送り先が指定されていません");
        }else if(nickname_input==""){
                alertNew("ニックネームが入力されていません");
        }else if(request_message_input==""){
                alertNew("リクエストが入力されていません");
        }else if(price == ''){
                alertNew("投げ銭額を入力してください");
        }else if(!Number.isInteger(price) || price < 1000){
                alertNew("1000以上の整数で入力してください");
        }else if(price%100 != 0){
                alertNew("100円単位(下2桁が00)で設定してください");
        }else{
                document.getElementById('navi').bringPageTop('ordercheck.html');
                setTimeout(function(){
                        $('#check_gift_title').val(gift_title);
                        $('#check_price').val(price);
                        $('#check_gift_title_div').html(gift_title);
                        $('#check_price_div').html("¥"+price);
                        $('#check_gift_uid').val(gift_uid);
                        $('#send_human').html(send_human);
                        $('#nickname').html(nickname_input);
                        $('#request_message').html(request_message_input);
                        var GiftData = ncmb.DataStore("giftData");
                        GiftData
                        .equalTo("giftUid", gift_uid)
                        .fetch()               
                        .then(function(result){
                                var auction = result.get("auction");
                                if(auction=="プレゼント"){
                                        $('#cardKessaiZone').css("display","none");
                                        $('#ginkouKessaiZone').css("display","none");
                                        $('#paypalKessaiZone').css("display","none");
                                        $('#fanPresentKessaiZone').css("display","block");
                                }
                        });
                },500);
        }
}