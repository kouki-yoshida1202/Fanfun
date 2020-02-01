
function influencerShinseiMail(){
        Email.send({
                Host : "smtp.elasticemail.com",
                Username : "info@gonmura.info",
                Password : "E5034B190C13AC13A61A4E7DCCD27832AA1BCF10",
                To : 'info@gonmura.info',
                From : "Fanfun@gonmura.info",
                Subject : "This is the subject",
                Body : "テスト"
        }).then(
                message => alert(message)
        );
}