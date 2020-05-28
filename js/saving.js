function saveProject(that) {
    $(document).find('block').hide(200);

    let newBlock = '<div id="questionBlock" class="push">';
    newBlock += '<div class="push_head"><img class="cross_image clickable" src="style/img/cross.svg" alt="close">';
    newBlock += '<h3>Сохранение проекта. Введите название</h3></div>';

    newBlock += '<div class="push_body"><form id="questionForm">';
    newBlock += '<div>Название может включать только латинские буквы и/или цифры.</div><br>'
    newBlock += '<div><span class="ti1"><input type="text" id="contractName" placeholder="Название контракта" name = "contractName" pattern="[A-Za-z0-9]{1,15}" required></span></div>'
    newBlock += '<br> <input class="btn btn-outline-dark submitType" type="submit" value="Сохранить"></form></div></div>'
    document.getElementById('placeForQuestionBlock').innerHTML = newBlock;


    $('#questionForm').submit(function (event) {
        event.preventDefault();
        let contractName = document.getElementById('contractName').value;
        let contractCode = document.getElementById('yourContract').innerHTML;
        $.post('/save', {name: contractName, htmlCodeOfContract: contractCode});
    });
}
