//блок-аккордеон
$('.accordeon_block h3').click(function () {
    if (!$(this).parent().find('block').is(':visible')) {
        $(this).parent().find('block').show(200)
    }
    else {
        $(this).parent().find('block').hide(200)
    }
});


//закрыть окошко

$(document).on('click', '.cross_image', function(){
    $(this).parent().parent().toggleClass('deleteIt')
    $("div.deleteIt").remove()

});

$('#yourContract').on('click', '.cross_image', function(){
    $(this).parent().toggleClass('deletedBlock');
    $("div.deletedBlock").remove()

});


//получить сообщение об ошбке
function getErr(){
    fetch('/geterror')
        .then(
            function(response) {
                if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.text().then(function(data) {
                    if (data!="None") {
                        showErr(data)
                        console.log(data);
                    }
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}

//вывести сообщение об ошибке
function showErr(data){
    let qq = '';
    qq += '<div id="err_msg", class="push">';
    qq += '<div class="push_head"><h3>Ошибка!</h3><img class="cross_image clickable" src="style/img/cross.svg" alt="close"></div>';
    qq += '<div class="push_body">'+data+'</div>';
    document.getElementById('error_message').innerHTML = qq;
}

getErr();
