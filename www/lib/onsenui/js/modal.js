function modal(){
    var modalBtn = $('.js-modal__btn');
    var modalBtnClose = $('.js-modal__btn--close');
    var modalBtnCloseFix = $('.js-modal__btn--close--fix');
    var modalBg = $('.js-modal__bg');
    var modalMain = $('.js-modal__main');
    modalBtn.on('click', function (e) {
        $(this).next(modalBg).fadeIn();
        $(this).next(modalBg).next(modalMain).removeClass("_slideDown");
        $(this).next(modalBg).next(modalMain).addClass("_slideUp");
    });
    modalBtnClose.on('click', function (e) {
        modalBg.fadeOut();
        modalMain.removeClass("_slideUp");
        modalMain.addClass("_slideDown");
    });
    modalBtnCloseFix.on('click', function (e) {
        modalBg.fadeOut();
        modalMain.removeClass("_slideUp");
        modalMain.addClass("_slideDown");
    });
    modalMain.on('click', function (e) {
        e.stopPropagation();
    });
    modalBg.on('click', function () {
        $(this).fadeOut();
        $(this).next(modalMain).removeClass("_slideUp");
        $(this).next(modalMain).addClass("_slideDown");
    });
}

function copyPage(){
    $(document.body).append("<textarea id=\"copyTarget\" style=\"position:absolute; left:-9999px; top:0px;\" readonly=\"readonly\">" +location.href+ "</textarea>");
    let obj = document.getElementById("copyTarget");
    let range = document.createRange();
    range.selectNode(obj);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    alert("コピーしました");
}