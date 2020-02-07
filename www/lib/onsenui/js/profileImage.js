var appKey    = "2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58";
var clientKey = "e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06";
var ncmb    　= new NCMB(appKey,clientKey);


function onFormSend(){
        // var fileName = document.getElementById("file-name").value;
        var currentUser = ncmb.User.getCurrentUser();
        var fileData = document.getElementById("file-data").files[0];
        var objectId = currentUser.get('objectId');

        ncmb.File
        .upload(objectId,fileData)
        .then(function(res){
                // アップロード後処理
                window.location.href = 'index.html';
        })
        .catch(function(err){
                // エラー処理
                console.log(err);
        });
}

function onFormSendGift(uid){
        var fileData = document.getElementById("file-data-gift").files[0];

        ncmb.File
        .upload(uid,fileData)
        .then(function(res){
                // アップロード後処理
                window.location.href = 'home.html';
        })
        .catch(function(err){
                // エラー処理
                console.log(err);
        });
}

function onFormSendGiftEdit(uid){
        var fileData = document.getElementById("file-data-gift-edit").files[0];

        ncmb.File
        .upload(uid,fileData)
        .then(function(res){
                // アップロード後処理
                window.location.href = 'home.html';
        })
        .catch(function(err){
                // エラー処理
                console.log(err);
        });
}