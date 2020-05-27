//get
$('#setTypeForm').submit(function (event) {
    event.preventDefault();
    var selectedKey = document.getElementById('selectKeyType').selectedIndex;
    var keyOptions = document.getElementById('selectKeyType').options;
    let keyType = keyOptions[selectedKey].value;
    if (keyType === "float (Go)") keyType = "float";
    if (keyType === "address (Solidity)") keyType = "address";


    var selectedVar = document.getElementById('selectVarType').selectedIndex;
    var varOptions = document.getElementById('selectVarType').options;
    let varType = varOptions[selectedVar].value;
    if (varType === "float (Go)") varType = "float";
    if (varType === "address (Solidity)") varType = "address";


    let code = '<div class="accordeon_block dataTypeBlock" data-type = "' + keyType + '_' + varType + '" data-typeOfKey ="' + keyType + '" data-typeOfVar = "' + varType + '", data-get="", data-set="", data-delete=""><div class="isChecking"></div>';
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

$('#setStructure').submit( function(event){
    event.preventDefault();
    let n = $(document).find('#addMoreItems').attr('class');

    let structTypes = [];
    let structNames = [];
    for (let i = 1; i<=n; ++i) {
        let idType = 'varType_' + i.toString();
        let idName = 'varName_' + i.toString();

        structNames.push(document.getElementById(idName).value);

        var index = document.getElementById(idType).options.selectedIndex;
        structTypes.push(document.getElementById(idType).options[index].text);
        if (structTypes[i-1] === "float (Go)") structTypes[i-1] = "float";
        if (structTypes[i-1] === "address (Solidity)") structTypes[i-1] = "address";
    }
    let structName = document.getElementById('structName').value;
    var index = document.getElementById('structKeyType').options.selectedIndex;
    let structKey = document.getElementById('structKeyType').options[index].text;
    if (structKey === "float (Go)") structKey = "float";
    if (structKey === "address (Solidity)") structKey = "address";
    let code = '';

    code += '<div class="accordeon_block dataTypeBlock" data-type = "' + structKey + '_' + structName + '" data-typeOfKey ="' + structKey + '" data-typeOfVar = "' + structName + '", data-get="", data-set="", data-delete="", data-isstruct="yes"><div class="isChecking"></div>';
    code += '<h3 class="clickable"><img class="cross_image clickable blockRemovingCross" src="style/img/cross.svg" alt="close"><span class="ti1">' + structKey + ' => ' + structName + '</span></h3>';
    code += '<block>';
    code += '<div class="containerForGet"><button class="btn btn-outline-dark submitType methodButton" onclick="pressBut(this)" id="getBut" type="submit" value="getBut">Настроить Get</button></div>';
    code += '<br><div class="containerForSet"><button class="btn btn-outline-dark submitType methodButton" onclick="pressBut(this)" id="setBut" type="submit" value="setBut">Настроить Set</button></div>';
    code += '<br><div class="containerForDelete"><button class="btn btn-outline-dark submitType methodButton" onclick="pressBut(this)" id=deleteBut" type="submit" value="deleteBut">Настроить Delete</button></div>';
    code += '</block></div>';

    document.getElementById('yourContract').innerHTML += code;

    let strCode = "";
    strCode += '<div class="accordeon_block structureBlock" data-structname = "' + structName + '" data-length ="' + n + '" data-structtypes = "' + structTypes + '", data-structnames="' + structNames + '"><div class="isChecking"></div>';
    strCode += '<h3 class="clickable"><img class="cross_image clickable blockRemovingCross" src="style/img/cross.svg" alt="close"><span class="ti1"> struct ' + structName + '</span></h3>';
    strCode += '<block>';
    for (let i=0; i<n; ++i) {
        strCode += '<div>' + structTypes[i] + ' ' + structNames[i] + '</div>';
    }
    strCode += '</block></div>';
    document.getElementById('structsPlace').innerHTML += strCode;

    $('.accordeon_block h3 span').click(function () {
        if (!$(this).parent().parent().find('block').is(':visible')) {
            $(this).parent().parent().find('block').show(200)
        } else {
            $(this).parent().parent().find('block').hide(200)
        }
    });

    document.getElementById('addMoreItems').className = '1';
    let newItem = '<div><span><select class="structKeyPlace" id="varType_1">';
    newItem += '<option>int</option><option>uint</option><option>string</option><option>float (Go)</option><option>address (Solidity)</option><option>bool</option></select></span>';
    newItem += '<span><input type="text" id="varName_1" placeholder="Имя переменной" class="structVarPlace" name = "varName" pattern="[A-Za-z]+[A-Za-z0-9]{0,15}" required></span></div><br>';
    document.getElementById('addMoreItems').innerHTML = newItem;
});