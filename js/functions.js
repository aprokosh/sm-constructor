//get
$('.getFunc').click(function () {
    let qq = '';
    qq += '<div class="push">';
    qq += '<div class="push_head"><h3>Получить значения</h3><img class="cross_image clickable" src="style/img/cross.svg" alt="close"></div>';
    qq += '<div id="getFuncValue" class="push_body"><div><input type="checkbox" id="checkOwnerGet" name="checkIt" value="1"> Проверять разрешение</div>';
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
        //$.post('/tasks', { name: name, description: description, deadline: deadline})
    });
});


//set
$('.setFunc').click(function () {
    let qq = '';
    qq += '<div class="push">';
    qq += '<div class="push_head"><h3>Задать значение</h3><img class="cross_image clickable" src="style/img/cross.svg" alt="close"></div>';
    qq += '<div id="setFuncValue" class="push_body">'
    qq += '<form id="setForm">'
    qq += '<div>Тип переменной: <input type="text" id="typeName" name = "typeName" required></div><br>';
    qq += '<div>Имя переменной: <input type="text" id="valueName" name = "valueName" required></div>';
    qq += '<div><input type="checkbox" id="checkOwnerSet" name="checkIt" value="1"> Проверять разрешение</div>'
    qq += '<input id="setFuncSubmit" class="btn btn-outline-dark submit_param" type="submit" value="Добавить"></form></div>';
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
        //$.post('/tasks', { name: name, description: description, deadline: deadline})
    });
});


//owner
$('.ownerFunc').click(function () {
    let qq = '';
    qq += '<div class="push">';
    qq += '<div class="push_head"><h3>Задать значение owner</h3><img class="cross_image clickable" src="style/img/cross.svg" alt="close"></div>';
    qq += '<div id="ownerFuncValue" class="push_body">';
    qq += '<input type="radio" id="sender" name="whoIsOwner" value="sender" checked>';
    qq += '<label for="sender"> Автор запроса</label><br>';
    qq += '<input type="radio" id="own" name="whoIsOwner" value="own">';
    qq += '<label for="own"> Ввести адрес</label><br>';
    qq += '<button id="ownerFuncSubmit" class="btn btn-outline-dark submit_param" type="submit">Добавить</button></div>';

    document.getElementById('parameters').innerHTML += qq;


    $('#ownerFuncSubmit').on('click', function (event) {
        event.preventDefault();

        let code = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close">';
        code += '<div class="ti1">adress owner</div>'
        code += '<div class="ti1">constructor () public {</div>'
        let whoOwns = document.getElementsByName('whoIsOwner');
        if(whoOwns[0].checked)
            code += '<div class="ti2">owner = msg.sender;</div>'
        else if (whoOwns[1].checked)
            code += '<div class="ti2">owner = <input type="text" id="ownerAdress" placeholder="Адрес владельца" name = "ownerAdress" required></div>';
        code += '<div class="ti1">}</div></div></div>';

        document.getElementById('valuesField').innerHTML += code;
        //$.post('/tasks', { name: name, description: description, deadline: deadline})
    });
});

//values
$('.valFunc').click(function () {
    let qq = '';
    qq += '<div class="push">';
    qq += '<div class="push_head"><h3>Задать значение</h3><img class="cross_image clickable" src="style/img/cross.svg" alt="close"></div>';
    qq += '<div id="setFuncValue" class="push_body">'
    qq += '<form id="valForm">'
    qq += '<div>Тип переменной: <input type="text" id="typeName" name = "typeName" required></div><br>';
    qq += '<div>Имя переменной: <input type="text" id="valueName" name = "valueName" required></div>';
    qq += '<input id="valFuncSubmit" class="btn btn-outline-dark submit_param" type="submit" value="Добавить"></form></div>';
    document.getElementById('parameters').innerHTML = qq;


    $('#valForm').submit(function (event) {
        event.preventDefault();
        const tN = document.querySelector('#typeName')
        let typeName = tN.value;
        const vN = document.querySelector('#valueName')
        let valueName = vN.value;

        let code = '<div><img class="cross_image funcBlock clickable" src="style/img/cross.svg" alt="close">';
        code += '<div class="ti2">' + typeName + ' ' + valueName + ';</div></div>';

        document.getElementById('valuesField').innerHTML += code;
        //$.post('/tasks', { name: name, description: description, deadline: deadline})
    });
});