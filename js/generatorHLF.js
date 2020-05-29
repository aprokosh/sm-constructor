function generateHLF (contractName, blockList, structList){
    for (let i=0; i<blockList.length; ++i){
        if (blockList[i].dataset.typeofvar === "address") {
            blockList[i].dataset.typeofvar = "string";
            blockList[i].dataset.type = blockList[i].dataset.type.replace("address", "string");
        }
        if (blockList[i].dataset.typeofkey === "address") {
            blockList[i].dataset.typeofkey = "string";
            blockList[i].dataset.type = blockList[i].dataset.type.replace("address", "string");
        }
    }

    for (let i=0; i<structList.length; ++i)
        if (structList[i].dataset.typeofkey === "address")
            structList[i].dataset.typeofkey = "string";

    let headerCode = '<div class="codeBlock"><br>';
    headerCode += '<h4>Поле для редактирования кода</h4></div>';
    document.getElementById('placeForHeader').innerHTML = headerCode;

    let code = '<div id="wholeContract" class="codeBlock">';
    code += generateHLFBase(contractName);
    code += generateHLFStructs(structList);
    code += generateHLFBase2(contractName);
    code += generateHLFFunctions(contractName, blockList, structList);
    code += '</div></div>';

    document.getElementById('mytextarea').innerHTML = code;

    let buttonCode = '<div class="codeBlock"><button id="saveToDB" onclick="saveCodeToDB(this)" class="btn btn-outline-light">Сохранить</button></div>';
    document.getElementById('placeForSaveButton').innerHTML = buttonCode;
}

function generateHLFBase(contractName) {
    let baseCode = "";
    baseCode += '<div>package main</div><br>';

    baseCode += '<div>import (</div>';
    baseCode += '<div class="ti1">"bytes"</div>' +
        '<div class="ti1">"encoding/json"</div>' +
        '<div class="ti1">"strconv"</div>' +
        '<div class="ti1">"strings"</div>' +
        '<div class="ti1">"github.com/s7techlab/cckit/extensions/owner"</div>' +
        '<div class="ti1">"fmt"</div>' +
        '<div class="ti1">"github.com/hyperledger/fabric/core/chaincode/shim"</div>' +
        '<div class="ti1">"github.com/hyperledger/fabric/protos/peer"</div>' +
        '<div>)</div><br>';

    baseCode += '<div> type ' + contractName + ' struct{</div>';
    baseCode += '<div>}</div><br>'

    return baseCode;
}

function generateHLFBase2(contractName){
    let baseCode = '<div>func main() {</div>' +
        '<div class="ti1">shim.Start(new(' + contractName +'))</div>' +
        '<div>}</div><br>';

    baseCode += '<div>func (ptr *'+contractName + ') Init(stub shim.ChaincodeStubInterface) peer.Response {</div>';
    baseCode += '<div class="ti1">return owner.SetFromCreator(ptr.router.Context(`init`, stub))</div>';
    baseCode += '<div>}</div><br>';
    return baseCode;
}

function generateHLFStructs(structList) {
    let code = "";
    let n = structList.length;
    for (let i = 0; i<n; ++i){
        let name = structList[i].dataset.structname;

        code += '<div>type '+ name + ' struct{</div>';
        let k = structList[i].dataset.length;

        let types = structList[i].dataset.structtypes.split(',');
        let names = structList[i].dataset.structnames.split(',');
        for (let j = 0; j<k; ++j){
            if (types[j]==="address") types[j]="string";
            code += '<div class="ti1">' + names[j] + ' ' + types[j] + '</div>';
        }
        code += '<div>}</div><br>';
    }
    return code;
}

function generateHLFFunctions(contractName, blockList, structList){
   let funcCode = "";
   let invokeCode = "";
   let n = blockList.length;
   //проходим по каждому элементу в блоклист
    //когда добавили ему одну из функций, добавляем typeofkey-typeofvar-get-open в массив
    //для каждого проверяем, нет ли такого уже в массиве

    let addedFuncs = [];

    for (let i = 0 ; i<n; ++i){
        let thisKeyType = blockList[i].dataset.typeofkey;
        let thisVarType = blockList[i].dataset.typeofvar;
        let thisGetFunc = blockList[i].dataset.get;
        let thisSetFunc = blockList[i].dataset.set;
        let thisDeleteFunc = blockList[i].dataset.delete;

        let check1 = 'get_' + thisGetFunc + '_' + thisKeyType + '_' + thisVarType;
        let check2 = 'set_' + thisSetFunc + '_' + thisKeyType + '_' + thisVarType;
        let check3 = 'delete_' + thisDeleteFunc + '_' + thisKeyType + '_' + thisVarType;

        let struct = structList[0];
        if (blockList[i].dataset.isstruct === "yes"){
            for (let j=0; j<structList.length; ++j)
                if(structList[j].dataset.structname === blockList[i].dataset.typeofvar)
                    struct = structList[j];
        }

        if (addedFuncs.includes(check1)===false && (thisGetFunc === "open" || thisGetFunc === "close")) {
            if (blockList[i].dataset.isstruct === "yes") funcCode += HLF_structGet(check1, contractName, thisKeyType, thisGetFunc, struct)
            else funcCode += HLF_get(check1, contractName, thisKeyType, thisVarType, thisGetFunc);
            addedFuncs.push(check1);
        }
        if (addedFuncs.includes(check2)===false && (thisSetFunc === "open" || thisSetFunc === "close")) {
            if (blockList[i].dataset.isstruct === "yes") funcCode += HLF_structSet(check2, contractName, thisKeyType, thisSetFunc, struct)
            else funcCode += HLF_set(check2, contractName, thisKeyType, thisVarType, thisSetFunc)
            addedFuncs.push(check2);
        }
        if (addedFuncs.includes(check3)===false && (thisDeleteFunc === "open" || thisDeleteFunc === "close")){
            if (blockList[i].dataset.isstruct === "yes") funcCode += HLF_structDelete(check3, contractName, thisKeyType, thisDeleteFunc, struct)
            else funcCode += HLF_delete(check3, contractName, thisKeyType, thisVarType, thisDeleteFunc);
            addedFuncs.push(check3);
        }
    }
    invokeCode = generateHLFInvoke(contractName, addedFuncs);
    let resCode = invokeCode + funcCode;
   return resCode;
}


function generateHLFInvoke(contractName, addedFuncs){
    let invoke = "";

    let n = addedFuncs.length;

    invoke += '<div>func (ptr *' + contractName + ') Invoke(stub shim.ChaincodeStubInterface) peer.Response {</div>';
    invoke += '<div class="ti1">function, args := stub.GetFunctionAndParameters()</div>';
    invoke += '<div class="ti1">switch function {</div>';

    for (let i=0; i<n; ++i){
        invoke += '<div class="ti1">case "' + addedFuncs[i] + '": </div>';
        invoke += '<div class="ti2">return ' + addedFuncs[i] + '(stub, args)</div>';
    }

    invoke += '<div class="ti1">default:</div>';
    invoke += '<div class="ti2">return shim.Error("Invalid function name")</div>';
    invoke += '<div>}</div><br>'

    return invoke;
}


function convertingFunc(fromType, toType, varName){
    if (fromType==="string")
        switch (toType){
            case "int":
                return 'strconv.Atoi(' + varName + ')';
            case "uint":
                return 'strconv.FormatUint(' + varName + ', 16)';
            case "bool":
                return 'strconv.FormatBool(' + varName + ')';
            case "float":
                return 'strconv.FormatFloat(' + varName + ', "E", -1, 64)';
            default:
                return "";
        }
}

/**
 * @return {string}
 */
function HLF_get(functionName, contractName, keyType, varType, getFunc){
    let getCode = "";

    getCode += '<div>func (t *' + contractName + ') ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) pb.Response ';
    if (getFunc === "close") getCode += 'owner.Only {</div>';
    else getCode += '{</div>';

    getCode += '<div class="ti1"> var key ' + keyType + '</div>' +
                '<div class="ti1">var jsonResp string</div>' +
                '<div class="ti1"> var err error</div>' +
                '<div class="ti1"> var key ' + keyType + '</div>' +
                '<div class="ti1"> var data_string string </div>' +
                '<div class="ti1"> var data ' + varType + '</div>';

    getCode += '<div class="ti1">if len(args) != 1 {</div>' +
                '<div class="ti2">return shim.Error("Incorrect number of arguments. Expecting 1")</div>' +
                '<div class="ti1">}</div>';

    let conv = convertingFunc("string", keyType, "args[0]");
    getCode += '<div class="ti1">key = ' + conv + '</div>';
    getCode += '<div class="ti1">valAsbytes, err := stub.GetState(key)</div>';
    getCode += '<div class="ti1">if err != nil {</div>' +
        '<div class="ti2">jsonResp = "{\"Error\":\"Failed to get state for " + key + "}"</div>' +
        '<div class="ti2">return shim.Error(jsonResp)</div>' +
        '<div class="ti1">} else if valAsbytes == nil {</div>' +
        '<div class="ti2">jsonResp = "{\"Error\":\"Struct does not exist: " + key + "}"</div>' +
        '<div class="ti2">return shim.Error(jsonResp)</div>' +
        '<div class="ti1">}</div>';

    getCode += '<div class="ti1">data_string = []string(valAsBytes) </div>';
    conv = convertingFunc("string", varType, "data_string");
    getCode += '<div class="ti1">data = ' + conv + '</div>';

    getCode += '<div class="ti1">return shim.Success(data)</div>';
    getCode += '<div>}</div><br>';

    return getCode;
}
/**
 * @return {string}
 */
function HLF_set(functionName, contractName, keyType, varType, setFunc){
    let setCode = "";

    setCode += '<div>func (t *' + contractName + ') ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) pb.Response ';
    if (setFunc === "close") setCode += 'owner.Only {</div>';
    else setCode += '{</div>';

    setCode += '<div class="ti1"> var err error</div>' +
                '<div class="ti1"> var key ' + keyType + '</div>' +
                '<div class="ti1"> var data ' + varType + '</div>';

    setCode += '<div class="ti1">if len(args) != 2{</div>' +
            '<div class="ti2">return shim.Error("Incorrect number of arguments. Expecting 2.")</div>' +
            '<div class="ti1">}</div>';

    let conv = convertingFunc("string", keyType, "args[0]");
    setCode += '<div class="ti1">var key = ' + conv + '</div>';
    conv = convertingFunc("string", varType, "args[1]");
    setCode += '<div class="ti1">var data = ' + conv + '</div>';

    setCode += '<div class="ti1">err = stub.PutState(key, data)</div>' +
        '<div class="ti1">if err != nil {</div>' +
        '<div class="ti2">return shim.Error(err.Error())</div>' +
        '<div class="ti1">}</div>';
    setCode += '<div class="ti1">return shim.Success(nil)</div>';
    setCode += '<div>}</div><br>';

    return setCode;
}

/**
 * @return {string}
 */
function HLF_delete(functionName, contractName, keyType, varType, delFunc){
    let delCode = "";

    delCode += '<div>func (t *' + contractName + ') ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) pb.Response ';
    if (delFunc === "close") delCode += 'owner.Only {</div>';
    else delCode += '{</div>';
    delCode += '<div class="ti1">var jsonResp string</div>' +
        '<div class="ti1">var key ' + keyType + '</div>';

    delCode += '<div class="ti1">if len(args) != 1 {</div>' +
        '<div class="ti2">return shim.Error("Incorrect number of arguments. Expecting 1")</div>' +
        '<div class="ti1">}</div>';

    let conv = convertingFunc("string", keyType, "args[0]");
    delCode += '<div class="ti1"> key := ' + conv + '</div>';

    delCode += '<div class="ti1">valAsbytes, err := stub.GetState(key)</div>'

    delCode += '<div class="ti1">if err != nil {</div>' +
        '<div class="ti2">jsonResp = "{\"Error\":\"Failed to get state for " + key + "}"</div>' +
        '<div class="ti2">return shim.Error(jsonResp)</div>' +
        '<div class="ti1">} else if valAsbytes == nil {</div>' +
        '<div class="ti2">jsonResp = "{\"Error\":\"Structure does not exist: " + key + "}"</div>' +
        '<div class="ti2">return shim.Error(jsonResp)</div>' +
        '<div class="ti1">}</div>';

    delCode += '<div class="ti1">err = stub.DelState(key)</div>' +
        '<div class="ti1">if err != nil {</div>' +
        '<div class="ti2">return shim.Error("Failed to delete state:" + err.Error())</div>' +
        '<div class="ti1">}</div>';

    delCode += '<div class="ti1">return shim.Success(nil)</div>' +
        '<div>}</div><br>';
    return delCode;
}

/**
 * @return {string}
 */
function HLF_structGet(functionName, contractName, keyType, getFunc, struct){
    let getCode = "";
    let structName = struct.dataset.structname;

    getCode += '<div>func (t *' + contractName + ') ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) pb.Response ';
    if (getFunc === "close") getCode += 'owner.Only {</div>';
    else getCode += '{</div>';
    getCode += '<div class="ti1"> var key ' + keyType + '</div>' +
                '<div class="ti1">var jsonResp string</div>' +
                '<div class="ti1"> var err error</div>';

    getCode += '<div class="ti1">if len(args) != 1 {</div>' +
                '<div class="ti2">return shim.Error("Incorrect number of arguments. Expecting 1")</div>' +
                '<div class="ti1">}</div>';

    let conv = convertingFunc("string", keyType, "args[0]");
    getCode += '<div class="ti1">key = ' + conv + '</div>';
    getCode += '<div class="ti1">valAsbytes, err := stub.GetState(key)</div>';
    getCode += '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">jsonResp = "{\"Error\":\"Failed to get state for " + key + "}"</div>' +
                '<div class="ti2">return shim.Error(jsonResp)</div>' +
                '<div class="ti1">} else if valAsbytes == nil {</div>' +
                '<div class="ti2">jsonResp = "{\"Error\":\"Struct does not exist: " + key + "}"</div>' +
                '<div class="ti2">return shim.Error(jsonResp)</div>' +
                '<div class="ti1">}</div>';
    getCode += '<div class="ti1">' + structName + '_JSON := ' + structName + '{}</div>';
    getCode += '<div class="ti1">err = json.Unmarshal(valAsBytes, &' + structName + '_JSON)</div>';

    getCode += '<div class="ti1">return shim.Success([]string ' + structName + '_JSON)</div>';
    getCode += '<div class="ti1">}</div><br>';

    return getCode;
}

/**
 * @return {string}
 */
function HLF_structSet(functionName, contractName, keyType, setFunc, struct){
    let setCode = "";
    let n = struct.dataset.length;
    let structName = struct.dataset.structname;
    let n_1 = Number(n)+Number(1);
    let types = struct.dataset.structtypes.split(',');
    for (let j = 0; j<n; ++j) if (types[j]==="address") types[j]="string";
    let names = struct.dataset.structnames.split(',');

    setCode += '<div>func (t *' + contractName + ') ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) pb.Response ';
    if (setFunc === "close") setCode += 'owner.Only {</div>';
    else setCode += '{</div>';
    setCode += '<div class="ti1"> var err error</div>';

    setCode += '<div class="ti1">if len(args) != ' + n_1 + '{</div>' +
        '<div class="ti2">return shim.Error("Incorrect number of arguments. Expecting ' + n + '")</div>' +
        '<div class="ti1">}</div>';

    let conv = convertingFunc("string", keyType, "args[0]");
    setCode += '<div class="ti1">var key = ' + conv + '</div>';

    for (let i=1; i<=n; ++i) {
        let argName = 'args[' + i + ']';
        conv = convertingFunc("string", types[i-1], argName);
        setCode += '<div class="ti1">var ' + names[i-1] + ' = ' + conv + '</div>';
    }

    setCode += '<div class="ti1">objectType := "' + structName + '"</div>';
    setCode += '<div class="ti1">' + structName +' := &' + structName + '{objectType, key';
    for (let i=0; i<n; ++i) setCode += ', ' + names[i];
    setCode += '}</div>';

    setCode += '<div class="ti1">' + structName + 'JSONasBytes, err := json.Marshal(' + structName + ')</div>';
    setCode += '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return shim.Error(err.Error())</div>' +
                '<div class="ti1">}</div>';

    setCode += '<div class="ti1">err = stub.PutState(key, ' + structName + 'JSONasBytes)</div>' +
                '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return shim.Error(err.Error())</div>' +
                 '<div class="ti1">}</div>';
    setCode += '<div class="ti1">return shim.Success(nil)</div>';
    setCode += '<div>}</div><br>';

    return setCode;
}

/**
 * @return {string}
 */
function HLF_structDelete(functionName, contractName, keyType, delFunc, struct){
    let delCode = "";
    let structName = struct.dataset.structname;

    delCode += '<div>func (t *' + contractName + ') ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) pb.Response ';
    if (delFunc === "close") delCode += 'owner.Only {</div>';
    else delCode += '{</div>';
    delCode += '<div class="ti1">var jsonResp string</div>' +
                '<div class="ti1">var ' + structName + '_JSON ' + structName + '</div>' +
                '<div class="ti1">var key </div>';

    delCode += '<div class="ti1">if len(args) != 1 {</div>' +
                '<div class="ti2">return shim.Error("Incorrect number of arguments. Expecting 1")</div>' +
                '<div class="ti1">}</div>';

    delCode += '<div class="ti1"> key := args[0]</div>';

    delCode += '<div class="ti1">valAsbytes, err := stub.GetState(key)</div>'

    delCode += '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">jsonResp = "{\"Error\":\"Failed to get state for " + key + "}"</div>' +
                '<div class="ti2">return shim.Error(jsonResp)</div>' +
                '<div class="ti1">} else if valAsbytes == nil {</div>' +
                '<div class="ti2">jsonResp = "{\"Error\":\"Structure does not exist: " + key + "}"</div>' +
                '<div class="ti2">return shim.Error(jsonResp)</div>' +
                '<div class="ti1">}</div>';

    delCode += '<div class="ti1">err = json.Unmarshal([]byte(valAsbytes), &' + structName + '_JSON)</div>' +
                '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">jsonResp = "{\"Error\":\"Failed to decode JSON of: " + key + "}"</div>' +
                '<div class="ti2">return shim.Error(jsonResp)</div>' +
                '<div class="ti1">}</div>';

    delCode += '<div class="ti1">err = stub.DelState(key)</div>' +
                '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return shim.Error("Failed to delete state:" + err.Error())</div>' +
                 '<div class="ti1">}</div>';

    delCode += '<div class="ti1">return shim.Success(nil)</div>' +
                '<div>}</div><br>';
    return delCode;
}