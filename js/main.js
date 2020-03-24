function getNewBlock () {
    let qq = '';
    qq += '<div class="enter_param">';
    qq += '<img class="cross_image clickable" src="style/img/cross.svg" alt="close">';
    qq += '<div class="enter_param_head"><h3>Ввод параметров</h3></div>';
    qq += '<div class="enter_param_body">Здесь будут всякие варианты и кнопка</div>';
    qq += '<button class="btn btn-outline-dark submit_param" type="submit">Button</button></div>';
    document.getElementById('parameters').innerHTML = qq;
};

$('.accordeon_block h3').click(function () {
    if (!$(this).parent().find('block').is(':visible')) {
        $(this).parent().find('block').show(200)
    }
    else {
        $(this).parent().find('block').hide(200)
    }
});


$('.fun_option1').click(function () {
    getNewBlock();
});

$(document).on('click', '.cross_image', function(){
    $(this).parent().hide(200);
});

$(document).keyup(function(e){
    if(e.keyCode === 27){
        $(document).find('.enter_param').hide(200);
    }
});

