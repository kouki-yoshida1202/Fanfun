// This is a JavaScript file

// ログ登録
function addLog(uid,gid,lType,msg,process,page){
  var LogData = ncmb.DataStore("log");
  var logData = new LogData();

  logData.set("userId", uid)  // ユーザーID
    .set("giftId", gid)       // ギフトID（違うページなら空文字）
    .set("type",lType)        // エラータイプ（Info：正常、Err：エラー）
    .set("message",msg)       // メッセージ（Info：none、Err：出力されたエラー
    .set("process",process)   // ログ内容（課金処理実行、ポイント消費実行など）
    .set("page",page)         // ページ名（home.html、index.htmlなど）
    .save()
    .catch(function(err){
      // エラー処理
      console.log(err)
    });
}