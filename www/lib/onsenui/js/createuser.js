//APIキーの設定とSDKの初期化
var appKey    = "2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58";
var clientKey = "e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06";
var ncmb    　= new NCMB(appKey,clientKey);

// -------[Demo1]データをmBaaSに保存する -------//
function insertUser() {
        
    //ユーザーの入力したデータを変数にセットする
    var username = $("#form_name").val();            //お名前
    var mailaddress = $("#form_mailaddress").val();     //メールアドレス
    var password = $("#form_password").val();      //パスワード
    //入力規則およびデータをフィールドにセットする
    if(username == ""){
        alertNew('表示名が入力されていません','','');
    }else if(mailaddress == ""){
        alertNew('メールアドレスが入力されていません','','');
    }else if(password == ""){
        alertNew('パスワードが入力されていません','','');
    }else{
        var android = "Android";
        if(navigator.userAgent.indexOf(android)>0){
            // console.log("android");
            var user = new ncmb.User();
            // ユーザー名・パスワードを設定
            var mailcheck = MailCheck(mailaddress);
            if(mailcheck){
                user.set("userName", username) /* ユーザー名 */
                .set("password", password) /* パスワード */
                .set("mailAddress", mailaddress)
                .set("Influencer",false);
                //   ユーザーの新規登録処理
                user.signUpByAccount()
                    .then(function(){
                        //   登録後処理
                        //  保存に成功した場合の処理
                        alertNew('まだ登録は完了しておりません','認証メールを送信しました。メールに記載のURL押下後、登録が完了します。','logout');
                    })
                    .catch(function(err){
                        //   エラー処理
                        //  保存に失敗した場合の処理
                        alertNew('登録失敗','ユーザ名かメールアドレスが既に使用されています。','');
                    });
            }else{
                alertNew('送信失敗','メールアドレスの形式が正しくありません。','');
            }
        }else{
            // console.log("androidじゃない");
            $.ajax({
                type: 'post',
                url: 'https://fanfun2020.xsrv.jp/vsApple301.html',
                data: {
                },
                success: function(test){
                    console.log(test);
                    var user = new ncmb.User();
                    // ユーザー名・パスワードを設定
                    var mailcheck = MailCheck(mailaddress);
                    if(mailcheck){
                        user.set("userName", username) /* ユーザー名 */
                        .set("password", password) /* パスワード */
                        .set("mailAddress", mailaddress)
                        .set("userKind",test)
                        .set("Influencer",false);
                        
                        //   ユーザーの新規登録処理
                        user.signUpByAccount()
                            .then(function(){
                                //   登録後処理
                                //  保存に成功した場合の処理
                                alertNew('まだ登録は完了しておりません','認証メールを送信しました。メールに記載のURL押下後、登録が完了します。','logout');
                            })
                            .catch(function(err){
                                //   エラー処理
                                //  保存に失敗した場合の処理
                                alertNew('登録失敗','ユーザ名かメールアドレスが既に使用されています。','');
                            });
                    }else{
                        alertNew('送信失敗','メールアドレスの形式が正しくありません。','');
                    }
                }
            
            });
        }
    }
}

// -------[Demo1]データをmBaaSに保存する -------//
function insertInfluencer() {
        
    //ユーザーの入力したデータを変数にセットする
    var username = $("#form_name").val();            //お名前
    var mailaddress = $("#form_mailaddress").val();     //メールアドレス
    var password = $("#form_password").val();      //パスワード
    var genre = $('.checkbox__input:checked').map(function() {
        return $(this).val();
    }).get();
    //入力規則およびデータをフィールドにセットする
    if(username == ""){
        alertNew('表示名が入力されていません','','');
    }else if(mailaddress == ""){
        alertNew('メールアドレスが入力されていません','','');
    }else if(password == ""){
        alertNew('パスワードが入力されていません','','');
    }else{
        var android = "Android";
        if(navigator.userAgent.indexOf(android)>0){
            var user = new ncmb.User();
            // ユーザー名・パスワードを設定
            var mailcheck = MailCheck(mailaddress);
            if(mailcheck){
                user.set("userName", username) /* ユーザー名 */
                .set("password", password) /* パスワード */
                .set("mailAddress", mailaddress)
                .set("Genre",genre)
                .set("Influencer",true);
                //   ユーザーの新規登録処理
                user.signUpByAccount()
                    .then(function(){
                        //   登録後処理
                        
                        // // 運営へ通知
                        // monaca.cloud.Mailer.sendMail("oid", "template_name", null)
                        // .done(function(result) {
                        //     console.log("Send mail success");
                        // })
                        // .fail(function(err) {
                        //     console.log("Mail Err#" + err.code +": " + err.message);
                        // });
                        $.ajax({
                            type: 'post',
                            url: 'https://fanfun2020.xsrv.jp/influencerOrder.html',
                            data: {
                                    'username': username,
                                    'mailaddress':mailaddress
                            },
                            success: function(data){
                                    console.log("----success.----");
                            }
                        });
                        alertNew('まだ登録は完了しておりません','認証メールを送信しました。メールに記載のURL押下後、登録が完了します。','logout');
                    })
                    .catch(function(err){
                        //   エラー処理
                        //  保存に失敗した場合の処理
                        alertNew('登録失敗','ユーザ名かメールアドレスが既に使用されています。','');
                    });
            }else{
                alertNew('送信失敗','メールアドレスの形式が正しくありません。','');
            }
        }else{
            $.ajax({
                type: 'post',
                url: 'https://fanfun2020.xsrv.jp/vsApple301.html',
                data: {
                },
                success: function(test){
                    var user = new ncmb.User();
                    // ユーザー名・パスワードを設定
                    var mailcheck = MailCheck(mailaddress);
                    if(mailcheck){
                        user.set("userName", username) /* ユーザー名 */
                        .set("password", password) /* パスワード */
                        .set("mailAddress", mailaddress)
                        .set("Genre",genre)
                        .set("userKind",test)
                        .set("Influencer",true);
                        //   ユーザーの新規登録処理
                        user.signUpByAccount()
                            .then(function(){
                                //   登録後処理
                                
                                // // 運営へ通知
                                // monaca.cloud.Mailer.sendMail("oid", "template_name", null)
                                // .done(function(result) {
                                //     console.log("Send mail success");
                                // })
                                // .fail(function(err) {
                                //     console.log("Mail Err#" + err.code +": " + err.message);
                                // });
                                $.ajax({
                                    type: 'post',
                                    url: 'https://fanfun2020.xsrv.jp/influencerOrder.html',
                                    data: {
                                            'username': username,
                                            'mailaddress':mailaddress
                                    },
                                    success: function(data){
                                            console.log("----success.----");
                                    }
                                });
                                alertNew('まだ登録は完了しておりません','認証メールを送信しました。メールに記載のURL押下後、登録が完了します。','logout');
                            })
                            .catch(function(err){
                                //   エラー処理
                                //  保存に失敗した場合の処理
                                alertNew('登録失敗','ユーザ名かメールアドレスが既に使用されています。','');
                            });
                    }else{
                        alertNew('送信失敗','メールアドレスの形式が正しくありません。','');
                    }
                }
            });
        }
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

function loginCheck(){
    //ユーザーの入力したデータを変数にセットする
    var mailaddress = $("#login_mail").val();     //メールアドレス
    var password = $("#login_pass").val();      //パスワード
    
    // メールアドレスとパスワードでログイン
    ncmb.User.loginWithMailAddress(mailaddress,password)
    .then(function(data){
        // ログイン後処理
        //現在の登録ユーザー取得
        var user = ncmb.User.getCurrentUser();
        //ACLの設定を行う
        var acl = new ncmb.Acl();
        //登録ユーザーに対するアクセス制御(読み込みと更新可能)
        acl.setUserWriteAccess(user,true);
        acl.setUserReadAccess(user,true);
        //全員に対するアクセス制御(読み込み可能のみ)
        acl.setPublicReadAccess(true);
        user.set("acl", acl);
        user.update()
            .then(function(obj){
                setTimeout(function(){
                    window.location.href = 'home.html';
                },1000);
            })
            .catch(function(error){
                console.log("error:" + error.message);
            });
        
    })
    .catch(function(err){
        // エラー処理
        ons.notification.confirm({
            message: 'メールアドレスかパスワードが間違っています',
            title: "ログイン失敗",
            buttonLabels:["閉じる","ヒント"],
            callback: function(buttonIndex) {
                if(buttonIndex==1){
                    document.getElementById('login').bringPageTop('loginHelp.html');
                }
            }
        });
    });
}

function passwordReminder(){
    var reminder_mail = $('#reminder_mail').val();
    var user = new ncmb.User();

    var mailcheck = MailCheck(reminder_mail);
    if(mailcheck){
        user.set("mailAddress", reminder_mail);
        user.requestPasswordReset()
            .then(function(data){
                // 送信後処理
                alertNew("送信しました。","上記メールアドレスにメールを送信しました。ご確認ください。","");
            })
            .catch(function(err){
                // エラー処理
                alertNew("このメールアドレスは登録されておりません。全角文字が混ざっていないか確認の上、再度お願いします。","","");
            });
    }else{
        alertNew('送信失敗','メールアドレスの形式が正しくありません。','');
    }
}