var NCMB = require("ncmb");
// mobile backendアプリとの連携
var ncmb = new NCMB("2a769bb0b55358cb641215e139e1e4c409bfba09b1177e468e736635af5c7f58","e007abb894e7e571efd683ba05b19e90ed4bb3633cf8e693f287451bb4d1db06");


// クラスのTestClassを作成
var TestClass = ncmb.DataStore("TestClass");

// データストアへの登録
var testClass = new TestClass();
testClass.set("message", "Hello, NCMB!");
testClass.save()
         .then(function(){
            // 保存に成功した場合の処理
          })
         .catch(function(err){
            // 保存に失敗した場合の処理
          });