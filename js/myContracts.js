function  goToRedactor(button) {
    let id = 'inv' + button.value;
    let text = document.getElementById(id).innerHTML;
    document.getElementById('redactorPlace').innerText = text;
}

function DeleteThis(button) {
    let id = button.value;
    $.post('/deleteText', { id: id });
    $(button).parent().remove();
}

function getContracts (){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/gettextes', true);

    xhr.onload = function () {
        let contracts = JSON.parse(xhr.responseText);
        let qq = '';
        if (contracts.data.length == 0){
            qq += '<div><h4>Вы не сохранили ни одного контракта</h4>';
        }
        for (let i = 0; i < contracts.data.length; ++i) {
            let this_id = contracts.data[i].id;
            if (contracts.data[i].platform==="Ethereum") qq += '<div class="contract leftBlock">';
            else qq += '<div class="contract rightBlock">';
            qq += '<h3>' + contracts.data[i].platform + ': "' + contracts.data[i].name + '"</h3>';
            qq += '<button type="button" onclick="goToRedactor(this)" value="' + this_id + '" class="btn btn-outline-dark">К редактору</button>';
            qq += '<button type="button" onclick="DeleteThis(this)" value="' + this_id + '" class="btn btn-outline-dark">Удалить</button>';
            qq += '<div class="invisibleBlock" id="inv' + this_id + '">'+ contracts.data[i].text +'</div>' +
                '</div>';
        }

        document.getElementById('putContractsHere').innerHTML = qq;
    }
    xhr.send()
}

getContracts();