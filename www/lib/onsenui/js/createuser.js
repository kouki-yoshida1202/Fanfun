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
        alert("お名前が入力されていません");
    }else if(mailaddress == ""){
        alert("メールアドレスが入力されていません");
    }else if(password == ""){
        alert("パスワードが入力されていません");
    }else{
        var user = new ncmb.User();
        // ユーザー名・パスワードを設定
        var mailcheck = MailCheck(mailaddress);
        if(mailcheck){
            user.set("userName", username) /* ユーザー名 */
            .set("password", password) /* パスワード */
            .set("mailAddress", mailaddress) /* 任意フィールドも追加可能 */
            .set("BoughtCount",0)
            .set("Review",0)
            .set("Influencer",false);
            //   ユーザーの新規登録処理
            user.signUpByAccount()
                .then(function(){
                    //   登録後処理
                    //  保存に成功した場合の処理
                    alert("認証メールを送信しました。メールに記載のURL押下後、登録が完了します。");
                    window.location.href = 'index.html';
                })
                .catch(function(err){
                    //   エラー処理
                    //  保存に失敗した場合の処理
                    alert("ユーザ名かメールアドレスが既に使用されています");
                });
        }else{
            alert("メールアドレスが正しくありません");
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
        alert("お名前が入力されていません");
    }else if(mailaddress == ""){
        alert("メールアドレスが入力されていません");
    }else if(password == ""){
        alert("パスワードが入力されていません");
    }else{
        var user = new ncmb.User();
        // ユーザー名・パスワードを設定
        var mailcheck = MailCheck(mailaddress);
        if(mailcheck){
            user.set("userName", username) /* ユーザー名 */
            .set("password", password) /* パスワード */
            .set("mailAddress", mailaddress) /* 任意フィールドも追加可能 */
            .set("BoughtCount",0)
            .set("Review",0)
            .set("Genre",genre)
            .set("Influencer",true);
            //   ユーザーの新規登録処理
            user.signUpByAccount()
                .then(function(){
                    //   登録後処理
                    
                    // 運営へ通知
                    monaca.cloud.Mailer.sendMail("oid", "template_name", null)
                    .done(function(result) {
                        console.log("Send mail success");
                    })
                    .fail(function(err) {
                        console.log("Mail Err#" + err.code +": " + err.message);
                    });

                    alert('申請が完了致しました。運営より登録頂いたメールアドレスに後ほどご連絡致します。それまでは一般ユーザとして利用できます。');

                    window.location.href = 'index.html';
                })
                .catch(function(err){
                    //   エラー処理
                    //  保存に失敗した場合の処理
                    alert("ユーザ名かメールアドレスが既に使用されています");
                });
        }else{
            alert("メールアドレスが正しくありません");
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
        window.location.href = 'home.html';
    })
    .catch(function(err){
        // エラー処理
        alert("メールアドレスかパスワードが間違っています");
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
                alert("上記メールアドレスにメールを送信しました。ご確認ください。");
                window.location.href = 'index.html';
            })
            .catch(function(err){
                // エラー処理
                alert("受付エラーです。お問い合わせください。");
            });
    }else{
        alert("メールアドレスが正しくありません");
    }
}