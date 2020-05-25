$("#saveContract").click(function(event){
    event.preventDefault();
    let contractName = document.getElementById('contractName').value;
    let contractCode = document.getElementById('yourContract').innerHTML;
    $.post('/save', { name: contractName, htmlCodeOfContract: contractCode});
});


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