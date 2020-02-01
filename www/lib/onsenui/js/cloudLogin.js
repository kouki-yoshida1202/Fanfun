function cloudLogin(){
    monaca.cloud.User.login("id", "pass")
    .done(function(result) {
        console.log("Login, " + result.user._username);
    })
    .fail(function(err) {
        console.log("Err#" + err.code +": " + err.message);
    });
}