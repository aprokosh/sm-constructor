function generateEth (contractName, blockList, varNames, version){

    let code = '<div id="codeBlock">';
    code += '<h2>Код контракта</h2>';

    code += generateEthBase(contractName, version);
    code += generateEthFunctions(blockList, varNames);
    code += '<div>}</div>';
    code += '</div>';

    document.getElementById('inputRedactorHere').innerHTML = code;
}

function generateEthBase(contractName, version){
    let baseCode = "";
    baseCode += '<div>pragma solidity ^' + version + ';</div>';

    baseCode += '<div> contract ' + contractName + '{</div>'

    baseCode += '<div class="ti1">address owner</div>';
    baseCode += '<div class="ti1">constructor () public {</div>';
    baseCode += '<div class="ti2">owner = msg.sender;</div>';
    baseCode += '<div class="ti1">}</div>';
    return baseCode;
}


function generateEthFunctions(blockList, varNames) {
    let n = blockList.length;
    let funcCode = "";

    for (var i = 0; i < n; ++i){
        let thisType = blockList[i].dataset.type;
        let thisKeyType = blockList[i].dataset.typeofkey;
        let thisVarType = blockList[i].dataset.typeofvar;
        let thisGetFunc = blockList[i].dataset.get;
        let thisSetFunc = blockList[i].dataset.set;
        let thisDeleteFunc = blockList[i].dataset.delete;

        if (varNames[i] === "") varNames[i] = thisType + i;
        let thisName = varNames[i]

        funcCode += '<div class="ti1"> mapping(' + thisKeyType + '=>' + thisVarType + ') ' + thisName + ';</div>';

        if (thisGetFunc === "open" || thisGetFunc === "close") funcCode += EthGet(thisName, thisKeyType, thisVarType, thisGetFunc);
        if (thisSetFunc === "open" || thisSetFunc === "close") funcCode += EthSet(thisName, thisKeyType, thisVarType, thisSetFunc);
        if (thisDeleteFunc === "open" || thisDeleteFunc === "close") funcCode += EthDelete(thisName, thisKeyType, thisVarType, thisDeleteFunc);
    }

    return funcCode;
}

/**
 * @return {string}
 */
function EthGet(name, keyType, varType, getFunc){
    let getCode = "";

    getCode += '<div class="ti1">function get_' + name + '(' + keyType + ' key) public view returns (' + varType +') {</div>';

    if(getFunc === "close")
        getCode += '<div class="ti2">require (msg.sender==owner, "Access to get this type is only for owner");</div>'
    getCode += '<div class="ti2">return ' + name + '[key];</div>';
    getCode += '<div class="ti1">}</div>';

    return getCode;
}


/**
 * @return {string}
 */
function EthSet(name, keyType, varType, setFunc){
    let setCode = "";

    setCode += '<div class="ti1">function set_' + name + '(' + keyType + ' key, ' + varType + ' data) public {</div>';

    if(setFunc === "close")
        setCode += '<div class="ti2">require (msg.sender==owner, "Access to set this type is only for owner");</div>'

    setCode += '<div class="ti2">return ' + name + '[key];</div>';
    setCode += '<div class="ti1">}</div>';

    return setCode;
}


/**
 * @return {string}
 */
function EthDelete(name, keyType, varType, deleteFunc){
    let deleteCode = "";

    deleteCode += '<div class="ti1">function delete_' + name + '(' + keyType + ' key) public {</div>';

    if(deleteFunc === "close")
        deleteCode += '<div class="ti2">require (msg.sender==owner, "Access to delete this type is only for owner");</div>'
    deleteCode += '<div class="ti2">return ' + name + '[key];</div>';
    deleteCode += '<div class="ti1">}</div>';

    return deleteCode;
}