function saveProject(that) {
    $(document).find('block').hide(200);

    let newBlock = '<div id="questionBlock" class="push">';
    newBlock += '<div class="push_head"><img class="cross_image clickable" src="style/img/cross.svg" alt="close">';
    newBlock += '<h3>Hyperledger Fabric. ';
    newBlock += 'Введите дополнительные параметры</h3></div>';

    newBlock += '<div class="push_body"><form id="questionForm">';
    newBlock += '<div>Название может включать только латинские буквы и/или цифры.</div><br>'
    newBlock += '<div>Введите название контракта: <span class="ti1"><input type="text" id="contractName" placeholder="Название контракта" name = "contractName" pattern="[A-Za-z0-9]{1,15}" required></span></div>'
    newBlock += '<br> <input class="btn btn-outline-dark submitType" type="submit" value="Сгенерировать"></form></div></div>'

    let contractName = document.getElementById('contractName').value;
    let contractCode = document.getElementById('yourContract').innerHTML;
    $.post('/save', {name: contractName, htmlCodeOfContract: contractCode});
}


//форма с редактором кода
$("#generateContract").click(function(event){
    event.preventDefault();
    let contractText = document.getElementById('yourContract').textContent;
    let contractCode = document.getElementById('yourContract').innerHTML;
    let code = '<h4>Редактор кода</h4><div class="redactor">';
    code += contractCode;
    code += '</div>';

    document.getElementById('inputRedactorHere').innerHTML = code;
});

//кнопка у редактора
//$.post('/save', { textCodeOfContract: contractText});