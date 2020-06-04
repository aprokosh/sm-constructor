function generateEth2 (contractName, blockList, structList, version){

    let typesList = []
    for (let i=0; i<blockList.length; ++i){
        if (blockList[i].dataset.typeofvar==="float") blockList[i].dataset.typeofvar = "int";
        if (typesList.includes(blockList[i].dataset.typeofvar)===false)
            typesList.push(blockList[i].dataset.typeofvar);
    }

    let headerCode = '<div class="codeBlock"><br>';
    headerCode += '<h4>Поле для редактирования кода</h4></div>';
    document.getElementById('placeForHeader').innerHTML = headerCode;
    let code = '<div id="wholeContract" class="codeBlock">';
    code += generateEthBase(contractName, version);
    code += generateEthStructs(structList);
    code += generateEthFunctions2(blockList, structList, typesList);
    code += '<div>}</div>';
    code += '</div>';
    document.getElementById('mytextarea').innerHTML = code;

    let buttonCode = '<div class="codeBlock"><button id="saveToDB" onclick="saveCodeToDB(this)" class="btn btn-outline-light">Сохранить</button></div>';
    document.getElementById('placeForSaveButton').innerHTML = buttonCode;
}


function generateEthFunctions2(blockList, structList, typesList) {
    let n = blockList.length;
    let funcCode = "";
    //проходим по каждому элементу в блоклист
    //когда добавили ему одну из функций, добавляем typeofkey-typeofvar-get-open в массив
    //для каждого проверяем, нет ли такого уже в массиве
    funcCode += '<div class="ti1">mapping(string => string) typeMapping;</div>'
    let addedFuncs = [];
    let addedMap = []
    for (let i = 0 ; i<n; ++i) {
        let thisVarType = blockList[i].dataset.typeofvar;
        if (thisVarType === "float") thisVarType = "int";

        let thisGetFunc = blockList[i].dataset.get;
        let thisSetFunc = blockList[i].dataset.set;
        let thisDeleteFunc = blockList[i].dataset.delete;
        let check1 = "";
        let check2 = "";
        let check3 = "";

        check1 = 'get_' + thisGetFunc + '_' + thisVarType;
        check2 = 'set_' + thisSetFunc + '_' + thisVarType;
        check3 = 'delete_' + thisDeleteFunc + '_' + thisVarType;

        if (addedMap.includes(thisVarType) === false) {
            funcCode += '<div class="ti1"> mapping(string => ' + thisVarType + ') ' + thisVarType + '_;</div>';
            addedMap.push(thisVarType);
        }

        if (blockList[i].dataset.isstruct === "yes"){
            for (let j=0; j<structList.length; ++j) {
                if(structList[j].dataset.structname === blockList[i].dataset.typeofvar) {
                    let struct = structList[j];
                    funcCode += EthStructFunc2(blockList[i], struct, typesList);
                }
            }
        }
        else{
            if (addedFuncs.includes(check1)===false && (thisGetFunc === "open" || thisGetFunc === "close")) {
                funcCode += EthGet2(thisVarType, thisGetFunc);
                addedFuncs.push(check1);
            }
            if (addedFuncs.includes(check2)===false && (thisSetFunc === "open" || thisSetFunc === "close")){
                funcCode += EthSet2(thisVarType, thisSetFunc, typesList);
                addedFuncs.push(check2);
            }
            if (addedFuncs.includes(check3)===false && (thisDeleteFunc === "open" || thisDeleteFunc === "close")){
                funcCode += EthDelete2(thisVarType, thisDeleteFunc);
                addedFuncs.push(check3);
            }
        }
    }
    return funcCode;
}

/**
 * @return {string}
 */
function EthStructFunc2 (block, struct, typesList){
    let code = "";
    let structName = struct.dataset.structname;
    let name = structName + '_';

    let n = struct.dataset.length;
    let types = struct.dataset.structtypes.split(',');
    for (let i = 0; i<n; ++i) {
        if (types[i]==="string") types[i]="string memory";
        if (types[i]==="float") types[i]="int"
    }
    let names = struct.dataset.structnames.split(',');
    if (block.dataset.get === "open" || block.dataset.get === "close"){
        code += '<div class="ti1"> function get_' + block.dataset.get + '_' + name + '(string memory key) public view returns (';
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
        code += '<div class="ti1">function set_' + block.dataset.set + '_' + name + '(string memory key';
        for (let i = 0; i<n; ++i)
            code += ', ' + types[i] + ' arg_' + names[i];
        code += ') public {</div>';
        if (block.dataset.set === "close")
            code += '<div class="ti2">require (msg.sender==owner, "Access to set this type is only for owner");</div>'

        code += '<div class=ti2>string deleteType = typeMapping[key];</div>';
        for (let i = 0; i<typesList.length; ++i){
            code += '<div class="ti3">if (deleteType == ' + typesList[i] + ') delete ' + typesList[i] + '_[key];</div>'
        }

        code += '<div class="ti2">' + structName + ' memory newItem = ' + name + '[key];</div>';
        for (let i = 0; i<n; ++i)
            code += '<div class="ti2"> newItem.' + names[i] + ' = arg' + i + ';</div>';
        code += '<div class="ti1">}</div>';
    }
    if (block.dataset.delete === "open" || block.dataset.delete === "close"){
        code += '<div class="ti1"> function delete_' + block.dataset.delete + '_' + name + '(string memory key) public {</div>';
        if (block.dataset.delete === "close")
            code += '<div class="ti2">require (msg.sender==owner, "Access to delete this type is only for owner");</div>'
        code += '<div class="ti2">delete '+ name + '[key];</div>' +
                '<div class="ti2">delete typeMapping[key];</div>'
        code += '<div class="ti1">}</div>';
    }
    return code;
}

/**
 * @return {string}
 */
function EthGet2(varType, getFunc){
    let name = varType + '_'
    if (varType === "string") varType = "string memory";
    let getCode = "";
    getCode += '<div class="ti1">function get_' + getFunc + '_' + name + '( string memory key) public view returns (' + varType +') {</div>';

    if(getFunc === "close")
        getCode += '<div class="ti2">require (msg.sender==owner, "Access to get this type is only for owner");</div>'
    getCode += '<div class="ti2">return ' + name + '[key];</div>';
    getCode += '<div class="ti1">}</div>';

    return getCode;
}


/**
 * @return {string}
 */
function EthSet2(varType, setFunc, typesList){
    let name = varType + '_'
    if (varType === "string") varType = "string memory";
    let setCode = "";
    setCode += '<div class="ti1">function set_' + setFunc + '_' + name +'(string memory key, ' + varType + ' data) public {</div>';

    if(setFunc === "close")
        setCode += '<div class="ti2">require (msg.sender==owner, "Access to set this type is only for owner");</div>'

    setCode += '<div class=ti2>string deleteType = typeMapping[key];</div>';
    for (let i = 0; i<typesList.length; ++i)
    {
        setCode += '<div class="ti3">if (deleteType == ' + typesList[i] + ') delete ' + typesList[i] + '_[key];</div>'
    }

    setCode += '<div class="ti2">' + name + '[key] = data;</div>' +
            '<div class="ti2">typeMapping[key] = ' + varType + ';</div>';
    setCode += '<div class="ti1">}</div>';

    return setCode;
}


/**
 * @return {string}
 */
function EthDelete2(varType, deleteFunc){
    let name = varType + '_'
    let deleteCode = "";
    deleteCode += '<div class="ti1">function delete_' + deleteFunc + '_' + name + '(string memory key) public {</div>';

    if(deleteFunc === "close")
        deleteCode += '<div class="ti2">require (msg.sender==owner, "Access to delete this type is only for owner");</div>'
    deleteCode += '<div class="ti2">delete ' + name + '[key];</div>' +
                    '<div class="ti2">delete typeMapping[key];</div>';
    deleteCode += '<div class="ti1">}</div>';

    return deleteCode;
}