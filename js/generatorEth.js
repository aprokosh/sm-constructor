function generateEth (contractName, blockList, varNames, structList, version){

    for (let i=0; i<blockList.length; ++i) {
        if (blockList[i].dataset.typeofvar === "float") {
            blockList[i].dataset.typeofvar = "int";
            blockList[i].dataset.type = blockList[i].dataset.type.replace("float", "int");
        }
    }

    let headerCode = '<div class="codeBlock"><br>';
    headerCode += '<h4>Поле для редактирования кода</h4></div>';
    document.getElementById('placeForHeader').innerHTML = headerCode;

    let code = '<div id="wholeContract" class="codeBlock">';
    code += generateEthBase(contractName, version);
    code += generateEthStructs(varNames, structList);
    code += generateEthFunctions(blockList, varNames, structList);
    code += '<div>}</div>';
    code += '</div>';

    document.getElementById('mytextarea').innerHTML = code;

    let buttonCode = '<div class="codeBlock"><button id="saveToDB" onclick="saveCodeToDB(this)" class="btn btn-outline-light">Сохранить</button></div>';
    document.getElementById('placeForSaveButton').innerHTML = buttonCode;
}

function generateEthBase(contractName, version){
    let baseCode = "";
    baseCode += '<div>pragma solidity ^' + version + ';</div>';

    baseCode += '<div> contract ' + contractName + '{</div>'

    baseCode += '<div class="ti1">address owner;</div>';
    baseCode += '<div class="ti1">constructor () public {</div>';
    baseCode += '<div class="ti2">owner = msg.sender;</div>';
    baseCode += '<div class="ti1">}</div>';
    return baseCode;
}

function generateEthStructs(varNames, structList) {
    let code = "";
    let n = structList.length;

    for (let i = 0; i<n; ++i){
       let name = structList[i].dataset.structname;

       code += '<div class="ti1">struct '+ name + '{</div>';
       let k = structList[i].dataset.length;

       let types = structList[i].dataset.structtypes.split(',');
       let names = structList[i].dataset.structnames.split(',');
       for (let j = 0; j<k; ++j){
           if (types[j]==="float") types[j]="int"
           code += '<div class="ti2">' + types[j] + ' ' + names[j] + ';</div>';
       }
       code += '<div class="ti1">}</div><br>';
    }
    return code;
}

function generateEthFunctions(blockList, varNames, structList) {
    let n = blockList.length;
    let funcCode = "";
    for (let i = 0; i < n; ++i){
        let thisType = blockList[i].dataset.type;
        let thisKeyType = blockList[i].dataset.typeofkey;
        let thisVarType = blockList[i].dataset.typeofvar;
        let thisGetFunc = blockList[i].dataset.get;
        let thisSetFunc = blockList[i].dataset.set;
        let thisDeleteFunc = blockList[i].dataset.delete;

        if (varNames[i] === "") varNames[i] = thisType + '_' + i;
        let thisName = varNames[i]

        funcCode += '<div class="ti1"> mapping(' + thisKeyType + '=>' + thisVarType + ') ' + thisName + ';</div>';

        if (blockList[i].dataset.isstruct === "yes"){
            for (let j=0; j<structList.length; ++j) {
                if(structList[j].dataset.structname === blockList[i].dataset.typeofvar) {
                    let struct = structList[j];
                    funcCode += EthStructFunc(thisName, thisKeyType, thisVarType, blockList[i], struct);
                }
            }
        }
        else {
            if (thisKeyType === "string") thisKeyType = "string memory";
            if (thisVarType === "string") thisVarType = "string memory";
            else if (thisVarType === "float") thisVarType = "int";
            if (thisGetFunc === "open" || thisGetFunc === "close") funcCode += EthGet(thisName, thisKeyType, thisVarType, thisGetFunc);
            if (thisSetFunc === "open" || thisSetFunc === "close") funcCode += EthSet(thisName, thisKeyType, thisVarType, thisSetFunc);
            if (thisDeleteFunc === "open" || thisDeleteFunc === "close") funcCode += EthDelete(thisName, thisKeyType, thisVarType, thisDeleteFunc);
        }
    }

    return funcCode;
}

/**
 * @return {string}
 */
function EthStructFunc (name, keyType, varType, block, struct){
    let code = "";
    let structName = struct.dataset.structname;
    if (keyType === "string") keyType = "string memory";
    let n = struct.dataset.length;
    let types = struct.dataset.structtypes.split(',');
    for (let i = 0; i<n; ++i) {
        if (types[i]==="string") types[i]="string memory";
        if (types[i]==="float") types[i]="int"
    }
    let names = struct.dataset.structnames.split(',');
    if (block.dataset.get === "open" || block.dataset.get === "close"){
        code += '<div class="ti1"> function get_' + name + '(' +  keyType + ' key) public view returns (';
        for (let i = 0; i<n-1; ++i)
            code += types[i] + ', ';
        code += types[n-1] + ') {</div>';
        if (block.dataset.get === "close")
            code += '<div class="ti2">require (msg.sender==owner, "Access to get this type is only for owner");</div>'
        code += '<div class="ti2">return (';
        for (let i = 0; i<n-1; ++i)
            code += name + '[key].' + names[i] + ', ';
        code += name + '[key].' + names[n-1] + ');</div>';
        code += '<div class="ti1">}</div>';
    }
    if (block.dataset.set === "open" || block.dataset.set === "close"){
        code += '<div class="ti1">function set_' + name + '(' + keyType + ' key';
        for (let i = 0; i<n; ++i)
            code += ', ' + types[i] + ' arg_' + names[i];
        code += ') public {</div>';
        if (block.dataset.set === "close")
            code += '<div class="ti2">require (msg.sender==owner, "Access to set this type is only for owner");</div>'
        code += '<div class="ti2">' + structName + ' memory newItem = ' + name + '[key];</div>';
        for (let i = 0; i<n; ++i)
            code += '<div class="ti2"> newItem.' + names[i] + ' = arg' + i + ';</div>';
        code += '<div class="ti1">}</div>';
    }
    if (block.dataset.delete === "open" || block.dataset.delete === "close"){
        code += '<div class="ti1"> function delete_' + name + '(' +  keyType + ' key) public {</div>';
        if (block.dataset.delete === "close")
            code += '<div class="ti2">require (msg.sender==owner, "Access to delete this type is only for owner");</div>'
        code += '<div class="ti2">delete '+ name + '[key];</div>';
        code += '<div class="ti1">}</div>';
    }
    return code;
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

    setCode += '<div class="ti2">' + name + '[key] = data;</div>';
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
    deleteCode += '<div class="ti2">delete ' + name + '[key];</div>';
    deleteCode += '<div class="ti1">}</div>';

    return deleteCode;
}