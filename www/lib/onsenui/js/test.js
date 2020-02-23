function testZone(){
        var testInput = $('#testInput').val();
        
        $.ajax({
                type: 'post',
                url: 'https://fanfun2020.xsrv.jp/test.html',
                data: {
                        'item1': '成功！',
                        'item2': '成功2！',
                        'testInput': testInput
                },
                success: function(data, status, xhr){
                        console.log("----success.----");
                        console.log(data);
                        console.log(data[0]);
                        console.log(status);
                        console.log(xhr);
                }
        });


        // 3秒ごとに実行
        // window.setTimeout("TimerCount()",3000);
}