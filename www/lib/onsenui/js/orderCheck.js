function orderCheck(){
        
        // 送り先の取得とセッティング
        var send_human = $('.segment__input:checked').val();
        // 送り先のニックネーム
        var nickname_input = $('#nickname_input').val();
        // リクエストメッセージ
        var request_message_input = $('#request_message_input').val();

        if(send_human==""){
                alert("送り先が選択されていません");
        }else if(nickname_input==""){
                alert("ニックネームが入力されていません");
        }else if(request_message_input==""){
                alert("リクエストが入力されていません");
        }else{
                document.getElementById('navi').pushPage('ordercheck.html');
                setTimeout(function(){
                        $('#send_human').html(send_human);
                        $('#nickname').html(nickname_input);
                        $('#request_message').html(request_message_input);
                },500);
        }
}