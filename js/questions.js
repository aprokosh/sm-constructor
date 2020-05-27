function getVariablesList(that){
    let str = ''
    let blockList = document.querySelectorAll('#yourContract div.dataTypeBlock');
    for (var i = 0; i< blockList.length; ++i){
        let keyType = blockList[i].dataset.typeofkey;
        let varType = blockList[i].dataset.typeofvar;
        str += '<br><div> Тип ключа: ' + keyType + ', тип переменной: ' + varType;
        str += '<span class="ti1"><input type="text" id="varName' + i + '" placeholder="Назовите тип" class = "varName" pattern="[A-Za-z0-9]{1,15}"></span></div>';
    }

    return str;
}

function getQuestions(that) {
    $(document).find('block').hide(200)
    let newBlock = '<div id="questionBlock" class="push">';
    newBlock += '<div class="push_head"><img class="cross_image clickable" src="style/img/cross.svg" alt="close">';
    if (that.id==='generateEth')
        newBlock += '<h3 id="platformName" data-pl="Eth">Ethereum. ';
    else newBlock += '<h3  id="platformName" data-pl="HLF">Hyperledger Fabric. ';
    newBlock += 'Введите дополнительные параметры</h3></div>';
    newBlock += '<div class="push_body"><form id="questionForm">';
    newBlock += '<div>Названия могут включать только латинские буквы и/или цифры.</div><br>'
    newBlock += '<div>Введите название контракта: <span class="ti1"><input type="text" id="contractName" placeholder="Название контракта" name = "contractName" pattern="[A-Za-z0-9]{1,15}" required></span></div>'
    if (that.id ==='generateEth'){
        newBlock += '<br><div><span class="ati1">Выберите версию Solidity</span>';
        newBlock += '<select id="solidityVersion"><option>0.5.0</option><option>0.5.1</option><option>0.5.10</option></select></div>';
    }
    newBlock += getVariablesList(this);
    newBlock += '<br> <input class="btn btn-outline-dark submitType" type="submit" value="Сгенерировать"></form></div></div>'

    document.getElementById('placeForQuestionBlock').innerHTML = newBlock;

    $('#questionForm').submit(function (event) {
        event.preventDefault();

        $(document).find('block').hide(200)

        let platformName = document.getElementById('platformName').dataset.pl;
        let blockList = document.querySelectorAll('#yourContract div.dataTypeBlock');
        let structList = document.querySelectorAll('#yourContract div.structureBlock');
        let contractName = document.getElementById('contractName').value;
        var n = document.getElementById("solidityVersion").options.selectedIndex;
        var version = document.getElementById("solidityVersion").options[n].text;
        let varNamesInputs = document.querySelectorAll('.varName');
        let varNames = [];

        for (var i = 0; i < varNamesInputs.length; ++i){
            varNames.push(varNamesInputs[i].value)
        }

        $(this).parent().parent().toggleClass('deleteIt')
        $("div.deleteIt").remove()

        if (platformName === 'Eth') generateEth(contractName, blockList, varNames, structList, version);
        else generateHLF(contractName, blockList, varNames, structList);
    });
}




/*
function saveProject(that) {
    let newBlock = '<div id="questionBlock", class="push">'+
        '<div class="push_head"><h3>Сохранение. Введите название проекта</h3><img class="cross_image clickable" src="style/img/cross.svg" alt="close"></div>' +
        '<div class="push_body">лаолдыа</div>';

    document.getElementById('placeForQuestionBlock').innerHTML = newBlock;
}*/