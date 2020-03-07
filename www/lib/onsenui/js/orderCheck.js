function orderCheck(){
                
        // 送り先の取得とセッティング
        var send_human = $('.segment__input:checked').val();
        // 送り先のニックネーム
        var nickname_input = $('#nickname_input').val();
        // リクエストメッセージ
        var request_message_input = $('#request_message_input').val();
        var gift_title = $('#buypage_title').html();
        var price = $('#buypage_price_number').val();
        var gift_uid = $('#buypage_gift_uid').val();
        if(send_human==""){
                sendHumanNoMissOpen();
        }else if(nickname_input==""){
                nicknameNoMissOpen();
        }else if(request_message_input==""){
                requestMessageNoMissOpen();
        }else{
                document.getElementById('navi').bringPageTop('ordercheck.html');
                setTimeout(function(){
                        $('#check_gift_title').val(gift_title);
                        $('#check_price').val(price);
                        $('#check_gift_title_div').html(gift_title);
                        $('#check_price_div').html("¥"+price*1.04+" (手数料4%込み)");
                        $('#check_gift_uid').val(gift_uid);
                        $('#send_human').html(send_human);
                        $('#nickname').html(nickname_input);
                        $('#request_message').html(request_message_input);
                },500);
        }
}