function profileEdit(){
        showLoad();
        //APIキーの設定とSDKの初期化
        var appKey    = "2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58";
        var clientKey = "e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06";
        var ncmb    　= new NCMB(appKey,clientKey);
        ncmb.sessionToken = "<sessionToken>";
        var user = new ncmb.User();
        // カレントユーザー情報の取得
        
        var currentUser = ncmb.User.getCurrentUser();
        var userName = currentUser.get("userName");
        var mailaddress = currentUser.get("mailAddress");
        var text = currentUser.get('Text');
        var objectId = currentUser.get('objectId');
        var username_edit = $("#current_user_name_profile").val();            //お名前
        var mailaddress_edit = $("#current_mailaddress_profile").val();     //メールアドレス
        var text_edit = $("#current_text_profile").val();
        var myTwitterURL = $("#editMyTwitterURL").val();
        var myInstagramURL = $("#editMyInstagramURL").val();
        var myYouTubeURL = $("#editMyYouTubeURL").val();
        var mailAddress_changeOnOff = $('input[name="mailaddress-radio"]:checked').val();
        if(mailAddress_changeOnOff == "onChange"){
                var mailcheck = MailCheck(mailaddress_edit);
                //更新処理開始
                if(mailcheck){
                                user
                                .set('objectId', objectId)
                                .set('userName', username_edit)
                                .set('mailAddress',mailaddress_edit)
                                .set('Text',text_edit)
                                .set('URLtwitter',myTwitterURL)
                                .set('URLinstagram',myInstagramURL)
                                .set('URLyoutube',myYouTubeURL)
                                .update()
                                .then(function(data) {
                                // 更新完了
                                        var profileImageEditStatus = $('#profileImageEditStatus').val();
                                        if(profileImageEditStatus != 0){
                                                var img = document.getElementById('image_edit');
                                                var dataURI = img.getAttribute('src');
                                                // dataURIをBlobに変換する
                                                var blob = toBlob(dataURI);
                                                // ファイル名を取得
                                                ncmb.File
                                                .upload(objectId,blob)
                                                .then(function(res){
                                                        // アップロード後処理
                                                        hideLoad();
                                                        profileMailEditOpen();
                                                })
                                                .catch(function(err){
                                                        // エラー処理
                                                        hideLoad();
                                                        profileImageEditMissOpen();
                                                });
                                        }else{
                                                // // アップロード後処理
                                                hideLoad();
                                                profileMailEditOpen();
                                        }
                                })
                                .catch(function(err) {
                                // エラー
                                        hideLoad();
                                        profileEditMissOpen();
                                });               
                }else{
                        hideLoad();
                        profileMailaddressEditMissOpen();
                }
        }else{
                user
                .set('objectId', objectId)
                .set('userName', username_edit)
                .set('Text',text_edit)
                .set('URLtwitter',myTwitterURL)
                .set('URLinstagram',myInstagramURL)
                .set('URLyoutube',myYouTubeURL)
                .update()
                .then(function(data) {
                // 更新完了
                        var profileImageEditStatus = $('#profileImageEditStatus').val();
                        if(profileImageEditStatus != 0){
                                var img = document.getElementById('image_edit');
                                var dataURI = img.getAttribute('src');
                                // dataURIをBlobに変換する
                                var blob = toBlob(dataURI);
                                ncmb.File
                                .upload(objectId,blob)
                                .then(function(res){
                                        // アップロード後処理
                                        hideLoad();
                                        profileEditOpen();
                                })
                                .catch(function(err){
                                        // エラー処理
                                        hideLoad();
                                        profileImageEditMissOpen();
                                });
                        }else{
                                // アップロード後処理
                                hideLoad();
                                profileEditOpen();
                        }
                })
                .catch(function(err) {
                // エラー
                        hideLoad();
                        profileEditMissOpen();
                });               
        }
}

// -------------------------------------------------------------------
// メールアドレスチェック関数
// -------------------------------------------------------------------
function MailCheck(mail) {
        var mail_regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
        var mail_regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
        if(mail.match(mail_regex1)&&mail.match(mail_regex2)){
            // 全角チェック
                if( mail.match( /[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/ ) ) { return false; }
                // 末尾TLDチェック（〜.co,jpなどの末尾ミスチェック用）
                if( !mail.match( /\.[a-z]+$/ ) ) { return false; }
                return true;
        } else {
                return false;
        }
}
