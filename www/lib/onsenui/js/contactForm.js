function jumpContactForm(status){
        if(status == "afterLogin"){
                var currentUser = ncmb.User.getCurrentUser();
                var userName = currentUser.get("userName");
                var mailaddress = currentUser.get("mailAddress");
                var objectId = currentUser.get("objectId");

                document.getElementById('navi').pushPage('contactForm.html');
                // $('#searchGift').empty();
                setTimeout(function(){
                        $('#contactFormUserObjectId').val(objectId);
                        $('#contactFormUserMailaddress').val(mailaddress);
                        $('#contactFormStatus').val(status);
                }, 500);
        }else if(status == "beforeLogin"){
                document.getElementById('login').pushPage('contactForm.html');
                setTimeout(function(){
                        $('#contactFormStatus').val(status);
                }, 500);
        }
        
}

function contactFormSend(){
        var objectId = $('#contactFormUserObjectId').val();
        var mailaddress = $('#contactFormUserMailaddress').val();
        var text = $('#contactFormTextarea').val();
        var status = $('#contactFormStatus').val();

        if(status == "afterLogin"){
                if(mailaddress == "" || text == ""){
                        alert("未入力の項目があります。");
                }else{
                        var contactForm = ncmb.DataStore("contactForm");
                        // データストアへの登録
                        var contactForm = new contactForm();
                        contactForm.set("userObjectId", objectId)
                                .set("mailaddress", mailaddress)
                                .set("text",text)
                                .save()
                                .then(function(gameScore){
                                // 保存後の処理
                                        aiueo('https://fanfun2020.xsrv.jp/contactSend.html?text='+text+'&mailaddress='+mailaddress);
                                })
                                .catch(function(err){
                                // エラー処理
                                        alert("送信失敗しました。");
                                });
                }
        }else if(status == "beforeLogin"){
                if(mailaddress == "" || text == ""){
                        alert("未入力の項目があります。");
                }else{
                        var contactForm = ncmb.DataStore("contactForm");
                        // データストアへの登録
                        var contactForm = new contactForm();
                        contactForm.set("mailaddress", mailaddress)
                                .set("text",text)
                                .save()
                                .then(function(gameScore){
                                // 保存後の処理
                                        aiueo('https://fanfun2020.xsrv.jp/contactSend.html?text='+text+'&mailaddress='+mailaddress);
                                })
                                .catch(function(err){
                                // エラー処理
                                        alert("送信失敗しました。");
                                });
                }
        }

}
