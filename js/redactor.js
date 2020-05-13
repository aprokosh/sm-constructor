$("#generateContractForm").submit(function(event){
    event.preventDefault();
    let contractName = document.getElementById('contractName').value;
    let contractCode = document.getElementById('yourContract').innerHTML;

    let contractText = document.getElementById('yourContract').outerHTML;
    let contract1 = document.getElementById('yourContract').innerText;
    let contract2 = document.getElementById('yourContract').outerText;
    document.getElementById('functionsField').innerHTML = contractCode;
    document.getElementById('functionsField').innerHTML += contractText;
    document.getElementById('functionsField').innerHTML += contract1;
    document.getElementById('functionsField').innerHTML += contract2;
    //$.post('/save', { name: contractName, htmlCodeOfContract: contractCode});


});

/*форма с редактором кода
$("#айдиформы").submit(function(event){
    event.preventDefault();

    let contractText = document.getElementById('#yourContract').innerHTML;
    $.post('/save', { textCodeOfContract: contractText});

});
*/