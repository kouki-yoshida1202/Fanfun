function orderEnd(){
  monaca.cloud.Mailer.sendMail("oid", "template_name", null)
    .done(function(result) {
      console.log("Send mail success");
  })
  .fail(function(err) {
      console.log("Mail Err#" + err.code +": " + err.message);
  });
}