function jumpRequestForm(){
        var currentUser = ncmb.User.getCurrentUser();
        var objectId = currentUser.get("objectId");

        document.getElementById('navi').pushPage('requestForm.html');
        // $('#searchGift').empty();
        setTimeout(function(){
                $('#requestFormUserObjectId').val(objectId);
        }, 500);
        
}

function requestFormSend(){
        var objectId = $('#requestFormUserObjectId').val();
        var requestName = $('#requestFormInfluencerName').val();
        var requestFormTextarea = $('#requestFormTextarea').val();

        if(requestName == ""){
                alert("インフルエンサー名が未入力です。");
        }else{
                var requestForm = ncmb.DataStore("requestForm");
                // データストアへの登録
                var requestForm = new requestForm();
                requestForm.set("userObjectId", objectId)
                        .set("requestName", requestName)
                        .set("requestFormTextarea",requestFormTextarea)
                        .save()
                        .then(function(gameScore){
                        // 保存後の処理
                                $.ajax({
                                        type: 'post',
                                        url: 'https://fanfun2020.xsrv.jp/requestSend.html',
                                        data: {
                                                'username': requestName,
                                                'requestFormTextarea':requestFormTextarea,
                                        },
                                        success: function(data){
                                                console.log(data);
                                        }
                                });
                                requestCheckOpen();

                        })
                        .catch(function(err){
                        // エラー処理
                                requestMissOpen();
                        });
        }
}
