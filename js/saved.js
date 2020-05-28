function  goToCreate(button) {
    let id = 'saved_inv' + button.value;
    let code = document.getElementById(id).innerHTML;
    localStorage.setItem('savedProject', code)
    window.location = '/create';
}

function saved_DeleteThis(button) {
    let id = button.value;
    $.post('/deleteCode', { id: id });
    $(button).parent().remove();
}

function getSavedContracts (){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getcodes', true);

    xhr.onload = function () {
        let contracts = JSON.parse(xhr.responseText);
        let qq = '';
        if (contracts.data.length == 0){
            qq += '<div><h4>Вы не сохранили ни одного проекта</h4>';
        }
        for (let i = 0; i < contracts.data.length; ++i) {
            let this_id = contracts.data[i].id;
            if (i%2===1) qq += '<div class="contract leftBlock">';
            else qq += '<div class="contract rightBlock">';
            qq += '<h3>' + contracts.data[i].name + '</h3>';
            qq += '<button type="button" onclick="goToCreate(this)" value="' + this_id + '" class="btn btn-outline-dark">Продолжить</button>';
            qq += '<button type="button" onclick="saved_DeleteThis(this)" value="' + this_id + '" class="btn btn-outline-dark">Удалить</button>';
            qq += '<div class="invisibleBlock" id="saved_inv' + this_id + '">'+ contracts.data[i].code +'</div>' +
                '</div>';
        }

        document.getElementById('putSavedContractsHere').innerHTML = qq;
    }
    xhr.send()
}

getSavedContracts();