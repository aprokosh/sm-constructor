//get
$('#setTypeForm').submit(function (event) {
    event.preventDefault();
    var selectedKey = document.getElementById('selectKeyType').selectedIndex;
    var keyOptions = document.getElementById('selectKeyType').options;
    keyType = keyOptions[selectedKey].value;

    var selectedVar = document.getElementById('selectVarType').selectedIndex;
    var varOptions = document.getElementById('selectVarType').options;
    varType = varOptions[selectedVar].value;

    let code = '<div class="accordeon_block" data-type = "' + keyType + '_' + varType + '" data-typeOfKey ="' + keyType + '" data-typeOfVar = "' + varType + '", data-get="", data-set="", data-delete=""><div class="isChecking"></div>';
    code += '<h3 class="clickable"><img class="cross_image clickable blockRemovingCross" src="style/img/cross.svg" alt="close"><span class="ti1">' + keyType + ' => ' + varType + '</span></h3>'
    code += '<block>'
    code += '<div class="containerForGet"><button class="btn btn-outline-dark submitType methodButton" onclick="pressBut(this)" id="getBut" type="submit" value="getBut">Настроить Get</button></div>';
    code += '<br><div class="containerForSet"><button class="btn btn-outline-dark submitType methodButton" onclick="pressBut(this)" id="setBut" type="submit" value="setBut">Настроить Set</button></div>';
    code += '<br><div class="containerForDelete"><button class="btn btn-outline-dark submitType methodButton" onclick="pressBut(this)" id=deleteBut" type="submit" value="deleteBut">Настроить Delete</button></div>';
    code += '</block></div>';
    document.getElementById('yourContract').innerHTML += code;

    $('.accordeon_block h3 span').click(function () {
        if (!$(this).parent().parent().find('block').is(':visible')) {
            $(this).parent().parent().find('block').show(200)
        } else {
            $(this).parent().parent().find('block').hide(200)
        }
    });
});

function pressBut(that){
    event.preventDefault();
    qq = '<div class="push">';
    qq += '<div class="push_head"><h3>Настройка метода</h3><img class="cross_image clickable" src="style/img/cross.svg" alt="close"></div>';
    qq += '<div class="push_body">';
    if (that.id === 'getBut') {
        qq += '<div><form id="formCheckingGet"><input type="checkbox" id="checkOwnerGet" name="checkIt"> Проверять разрешение Get';
        qq += '<input class="btn btn-outline-dark submitType"  type="submit" value="OK"></form></div>';
    } else if (that.id === 'setBut'){
        qq += '<div><form id="formCheckingSet"><input type="checkbox" id="checkOwnerSet" name="checkIt"> Проверять разрешение Set';
        qq += '<input class="btn btn-outline-dark submitType" type="submit" value="OK"></form></div>';
    } else {
        qq += '<div><form id="formCheckingDelete"><input type="checkbox" id="checkOwnerDelete" name="checkIt"> Проверять разрешение Delete';
        qq += '<input class="btn btn-outline-dark submitType" type="submit" value="OK"></form></div>';
    }
    qq += '</div></div>';
    $(that).parent().parent().parent().find('.isChecking').html(qq);


    $('#formCheckingGet').submit(function (event) {
        event.preventDefault();
        let isCheck = document.getElementById('checkOwnerGet');
        parentOfThat = $(that).parent()
        if (isCheck.checked === true) {
            $(that).parent().parent().parent().data('get', "close").attr('data-get', "close");
            let innerCode = '<button class="btn btn-outline-dark submitType methodButton" onclick="pressAntiBut(this)" id="getAntiBut" type="submit">Отменить Get</button><span class="ti2">Доступно автору</span></div>';
            $(that).parent().parent().parent().find('.containerForGet').html(innerCode);
        } else {
            $(that).parent().parent().parent().data('get', "open").attr('data-get', "open");
            let innerCode = '<button class="btn btn-outline-dark submitType methodButton" onclick="pressAntiBut(this)" id="getAntiBut" type="submit">Отменить Get</button><span class="ti2">Доступно всем</span></div>';
            $(that).parent().parent().parent().find('.containerForGet').html(innerCode);
        }
        $(parentOfThat).parent().parent().find('.push').toggleClass('deleteIt')
        $("div.deleteIt").remove()
    });

    $('#formCheckingSet').submit(function (event) {
        event.preventDefault();
        let isCheck = document.getElementById('checkOwnerSet');
        parentOfThat = $(that).parent()
        if (isCheck.checked === true) {
            $(that).parent().parent().parent().data('set', "close").attr('data-set', "close");
            let innerCode = '<button class="btn btn-outline-dark submitType methodButton" onclick="pressAntiBut(this)" id="setAntiBut" type="submit">Отменить Set</button><span class="ti2">Доступно автору</span></div>';
            $(that).parent().parent().parent().find('.containerForSet').html(innerCode);
        } else {
            $(that).parent().parent().parent().data('set', "open").attr('data-set', "open");
            let innerCode = '<button class="btn btn-outline-dark submitType methodButton" onclick="pressAntiBut(this)" id="setAntiBut" type="submit">Отменить Set</button><span class="ti2">Доступно всем</span></div>';
            $(that).parent().parent().parent().find('.containerForSet').html(innerCode);
        }
        $(parentOfThat).parent().parent().parent().find('.push').toggleClass('deleteIt')
        $("div.deleteIt").remove()
    });

    $('#formCheckingDelete').submit(function (event) {
        event.preventDefault();
        let isCheck = document.getElementById('checkOwnerDelete');
        parentOfThat = $(that).parent()
        if (isCheck.checked === true) {
            $(that).parent().parent().parent().data('delete', "close").attr('data-delete', "close");
            let innerCode = '<button class="btn btn-outline-dark submitType methodButton" onclick="pressAntiBut(this)" id="deleteAntiBut" type="submit">Отменить Delete</button><span class="ti2">Доступно автору</span></div>';
            $(that).parent().parent().parent().find('.containerForDelete').html(innerCode);
        } else {
            $(that).parent().parent().parent().data('delete', "open").attr('data-delete', "open");
            let innerCode = '<button class="btn btn-outline-dark submitType methodButton" onclick="pressAntiBut(this)" id="deleteAntiBut" type="submit">Отменить Delete</button><span class="ti2">Доступно всем</span></div>';
            $(that).parent().parent().parent().find('.containerForDelete').html(innerCode);
        }
        $(parentOfThat).parent().parent().find('.push').toggleClass('deleteIt')
        $("div.deleteIt").remove()
    });
}

function pressAntiBut(that) {
    event.preventDefault();
    if (that.id === 'getAntiBut') {
        $(that).parent().parent().parent().data('get', "").attr('data-get', "");

        let innerCode = '<button class="btn btn-outline-dark submitType methodButton"onclick="pressBut(this)" id="getBut" type="submit">Настроить Get</button>';
        $(that).parent().html(innerCode);
    }

    if (that.id === 'setAntiBut') {
        $(that).parent().parent().parent().data('set', "").attr('data-set', "");

        let innerCode = '<button class="btn btn-outline-dark submitType methodButton" onclick="pressBut(this)" id=setBut" type="submit">Настроить Set</button>';
        $(that).parent().html(innerCode);
    }

    if (that.id === 'deleteAntiBut') {
            $(that).parent().parent().parent().data('delete', "").attr('data-delete', "");

        let innerCode = '<button class="btn btn-outline-dark submitType methodButton" onclick="pressBut(this)" id=deleteBut" type="submit">Настроить Delete</button>';
        $(that).parent().html(innerCode);
    }
}