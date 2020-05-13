function getFormBody(stringHead) {
    str = '<div class="push">';
    str += '<div class="push_head"><h3>' + stringHead + '</h3><img class="cross_image clickable" src="style/img/cross.svg" alt="close"></div>';
    str += '<div class="push_body">';
    return str;
}

//get
$('.getFunc').click(function () {
    let qq = getFormBody("Получить значения");
    qq += '<div><input type="checkbox" id="checkOwnerGet" name="checkIt"> Проверять разрешение</div>';
    qq += '<button id="getFuncSubmit" class="btn btn-outline-dark submit_param" type="submit">Добавить</button></div>';
    document.getElementById('parameters').innerHTML += qq;


    $('#getFuncSubmit').on('click', function (event) {
        event.preventDefault();
        let code = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close">';
        code += '<div class="ti1">function get() public {</div>'
        let checkOwner =document.getElementById('checkOwnerGet');
        if(checkOwner.checked===true)
            code += '<div class="ti2">require (msg.sender==owner)</div>'
        code += '<div class="ti2">return data</div><div class="ti1">}</div></div>';

        document.getElementById('functionsField').innerHTML += code;
    });
});


//set
$('.setFunc').click(function () {
    let qq = getFormBody("Задать значение");
    qq += '<form id="setForm">'
    qq += '<div>Тип переменной: <input type="text" id="typeName" name = "typeName" required></div><br>';
    qq += '<div>Имя переменной: <input type="text" id="valueName" name = "valueName" required></div>';
    qq += '<div><input type="checkbox" id="checkOwnerSet" name="checkIt"> Проверять разрешение</div>'
    qq += '<input class="btn btn-outline-dark submit_param" type="submit" value="Добавить"></form></div>';
    document.getElementById('parameters').innerHTML = qq;


    $('#setForm').submit(function (event) {
        event.preventDefault();
        const tN = document.querySelector('#typeName')
        let typeName = tN.value;
        const vN = document.querySelector('#valueName')
        let valueName = vN.value;

        let code = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close">';
        code += '<div class="ti1">function set(<span>' + typeName +'</span> <span>' + valueName + '</span>) public {</div>'
        let checkOwner =document.getElementById('checkOwnerSet');
        if(checkOwner.checked===true)
            code += '<div class="ti2">require (msg.sender==owner)</div>'
        code += '<div class="ti2">data = ' + valueName + ';</div>';
        code += '<div class="ti1">}</div></div></div>';

        document.getElementById('functionsField').innerHTML += code;
    });
});


//owner
$('.ownerFunc').click(function () {
    let qq = getFormBody("Задать значение owner");
    qq += '<form id="ownerFuncForm">';
    qq += '<input type="radio" id="sender" name="whoIsOwner" value="sender" checked>';
    qq += '<label for="sender"> Автор запроса</label><br>';
    qq += '<input type="radio" id="own" name="whoIsOwner" value="own">';
    qq += '<input type="text" id="ownerAddress" placeholder="Адрес владельца" name = "ownerAddress">';
    qq += '<input class="btn btn-outline-dark submit_param" type="submit" value="Добавить"></form></div>';

    document.getElementById('parameters').innerHTML += qq;


    $('#ownerFuncForm').submit(function (event) {
        event.preventDefault();

        let code = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close">';
        code += '<div class="ti1">adress owner</div>'
        code += '<div class="ti1">constructor () public {</div>'
        let whoOwns = document.getElementsByName('whoIsOwner');
        if(whoOwns[0].checked)
            code += '<div class="ti2">owner = msg.sender;</div>'
        else if (whoOwns[1].checked) {
            let ownerAddr = document.getElementById('ownerAddress').value;
            if(ownerAddr === '') ownerAddr = 'msg.sender';
            code += '<div class="ti2">owner = ' + ownerAddr +'</div>';
        }
        code += '<div class="ti1">}</div></div></div>';

        document.getElementById('valuesField').innerHTML += code;
    });
});


//values
$('.valFunc').click(function () {
    let qq = getFormBody("Ввести переменную");
    qq += '<form id="valForm">'
    qq += '<div>Тип переменной: <input type="text" id="typeName" name = "typeName" required></div><br>';
    qq += '<div>Имя переменной: <input type="text" id="valueName" name = "valueName" required></div>';
    qq += '<input class="btn btn-outline-dark submit_param" type="submit" value="Добавить"></form></div>';
    document.getElementById('parameters').innerHTML = qq;


    $('#valForm').submit(function (event) {
        event.preventDefault();
        const typeName = document.querySelector('#typeName').value;
        const valueName = document.querySelector('#valueName').value;

        let code = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close">';
        code += '<div class="ti2">' + typeName + ' ' + valueName + ';</div></div>';

        document.getElementById('valuesField').innerHTML += code;
        //$.post('/tasks', { name: name, description: description, deadline: deadline})
    });
});


//version
$('.versionFunc').click(function () {
    let qq = getFormBody("Выберите версию Solidity");
    qq += '<form id="versForm">';
    qq += '<select id="solidityVersion"><option>0.4.10</option><option>0.5.0</option><option>0.5.10</option></select>';
    qq += '<input class="btn btn-outline-dark submit_param" type="submit" value="Добавить"></form></div>';
    document.getElementById('parameters').innerHTML = qq;


    $('#versForm').submit(function (event) {
        event.preventDefault();

        var selectedVersion = document.getElementById('solidityVersion').selectedIndex;
        var options = document.getElementById('solidityVersion').options;

        let code = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close">';
        code += '<div>pragma solidity ^' + options[selectedVersion].value + ';</div>'
        document.getElementById('solidityVersionField').innerHTML = code;
    });
});


//contract body
$('.bodyFunc').click(function () {
    let qq = getFormBody("Создать основу контракта");
    qq += '<form id="contractBodyForm">';
    qq += '<input type="text" id="contractName" placeholder="Название (латиница, цифры)" name = "contractName" pattern="[A-Za-z0-9]{1,15}" required>';
    qq += '<input class="btn btn-outline-dark submit_param" type="submit" value="Добавить"></form></div>';

    document.getElementById('parameters').innerHTML += qq;


    $('#contractBodyForm').submit(function (event) {
        event.preventDefault();

        let contractName = document.getElementById('contractName').value;
        let code = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close">';
        code += '<div> contract ' + contractName + '{</div>'

        document.getElementById('baseFirst').innerHTML += code;

        let finCode = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close"><div>}</div></div>'
        document.getElementById('baseLast').innerHTML += finCode;
    });
});