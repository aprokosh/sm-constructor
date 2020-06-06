function generateHLF (contractName, blockList, structList){
    let isClosed = false;

    for (let i=0; i<blockList.length; ++i){
        if (blockList[i].dataset.typeofvar === "address") {
            blockList[i].dataset.typeofvar = "string";
            blockList[i].dataset.type = blockList[i].dataset.type.replace("address", "string");
        }
        if (blockList[i].dataset.typeofkey === "address") {
            blockList[i].dataset.typeofkey = "string";
            blockList[i].dataset.type = blockList[i].dataset.type.replace("address", "string");
        }
        if ((blockList[i].dataset.get === "close") ||
                    (blockList[i].dataset.set === "close") || (blockList[i].dataset.delete === "close")) {
            isClosed = true;
        }
    }

    for (let i=0; i<structList.length; ++i)
        if (structList[i].dataset.typeofkey === "address")
            structList[i].dataset.typeofkey = "string";

    let headerCode = '<div class="codeBlock"><br>';
    headerCode += '<h4>Поле для редактирования кода</h4></div>';
    document.getElementById('placeForHeader').innerHTML = headerCode;

    let code = '<div id="wholeContract" class="codeBlock">';
    code += generateHLFBase(contractName, isClosed);
    code += generateHLFStructs(structList);
    code += generateHLFBase2(contractName);
    code += generateHLFFunctions(contractName, blockList, structList);
    code += '</div></div>';

    document.getElementById('mytextarea').innerHTML = code;

    let buttonCode = '<div class="codeBlock"><button id="saveToDB" onclick="saveCodeToDB(this)" class="btn btn-outline-light">Сохранить</button></div>';
    document.getElementById('placeForSaveButton').innerHTML = buttonCode;
}

function generateHLFBase(contractName, isClosed) {
    let baseCode = "";
    baseCode += '<div>package main</div><br>';

    baseCode += '<div>import (</div>';
    baseCode += '<div class="ti1">"encoding/json"</div>' +
                '<div class="ti1">"strconv"</div>';

    if (isClosed) baseCode += '<div class="ti1">"github.com/hyperledger/fabric-chaincode-go/pkg/cid"</div>';

    baseCode += '<div class="ti1">"fmt"</div>' +
                '<div class="ti1">"github.com/hyperledger/fabric-chaincode-go/shim"</div>' +
                '<div class="ti1">"github.com/hyperledger/fabric-protos-go/peer"</div>' +
                '<div>)</div><br>';

    baseCode += '<div> type ' + contractName + ' struct{</div>';
    baseCode += '<div>}</div><br>' +
        '<div>func BytesToString(data []byte) string {</div>' +
        '<div class="ti1">return string(data[:])</div>' +
        '<div>}</div><br>';
    return baseCode;
}

function generateHLFBase2(contractName){
    let baseCode = '<div>func main() {</div>' +
        '<div class="ti1">shim.Start(new(' + contractName +'))</div>' +
        '<div>}</div><br>';

    baseCode += '<div>func (ptr *'+contractName + ') Init(stub shim.ChaincodeStubInterface) peer.Response {</div>';
    baseCode += '<div class="ti1">return shim.Success(nil)</div>';
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
            if (types[j]==="uint") types[j]="uint64";
            code += '<div class="ti1">' + capitalizeFirst(names[j]) + ' ' + types[j] + '</div>';
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
        let thisVarType = blockList[i].dataset.typeofvar;
        let thisGetFunc = blockList[i].dataset.get;
        let thisSetFunc = blockList[i].dataset.set;
        let thisDeleteFunc = blockList[i].dataset.delete;
        let check1 = "";
        let check2 = "";
        let check3 = "";

        if (blockList[i].dataset.isstruct === "yes"){
            check1 = 'get_' + thisGetFunc + '_' + thisVarType;
            check2 = 'set_' + thisSetFunc + '_' + thisVarType;
            check3 = 'delete_' + thisDeleteFunc + '_' + thisVarType;
        }else {
            check1 = 'get_' + thisGetFunc;
            check2 = 'set_' + thisSetFunc;
            check3 = 'delete_' + thisDeleteFunc;
        }

        let struct = structList[0];
        if (blockList[i].dataset.isstruct === "yes"){
            for (let j=0; j<structList.length; ++j)
                if(structList[j].dataset.structname === blockList[i].dataset.typeofvar)
                    struct = structList[j];
        }

        if (addedFuncs.includes(check1)===false && (thisGetFunc === "open" || thisGetFunc === "close")) {
            if (blockList[i].dataset.isstruct === "yes") funcCode += HLF_structGet(check1, contractName, thisGetFunc, struct);
            else funcCode += HLF_get(check1, contractName, thisGetFunc);
            addedFuncs.push(check1);
        }
        if (addedFuncs.includes(check2)===false && (thisSetFunc === "open" || thisSetFunc === "close")) {
            if (blockList[i].dataset.isstruct === "yes") funcCode += HLF_structSet(check2, contractName, thisSetFunc, struct);
            else funcCode += HLF_set(check2, contractName, thisSetFunc)
            addedFuncs.push(check2);
        }
        if (addedFuncs.includes(check3)===false && (thisDeleteFunc === "open" || thisDeleteFunc === "close")){
            if (blockList[i].dataset.isstruct === "yes") funcCode += HLF_structDelete(check3, contractName, thisDeleteFunc, struct);
            else funcCode += HLF_delete(check3, contractName, thisDeleteFunc);
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
    invoke += '<div class="ti1">var result string</div>' +
                '<div class="ti1">var err error</div>';

    invoke += '<div class="ti1">if function == "' + addedFuncs[0] + '"{ </div>' +
                '<div class="ti2">result, err = ' + addedFuncs[0] + '(stub, args)</div>' +
                '<div class="ti1">}';

    for (let i=1; i<n; ++i) {
        invoke += ' else if function == "' + addedFuncs[i] + '"{ </div>' +
                '<div class="ti2">result, err = ' + addedFuncs[i] + '(stub, args)</div>' +
                '<div class="ti1">}';
    }
    invoke += '</div>';

    invoke += '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return  shim.Error(err.Error())</div>' +
                '<div class="ti1">}</div><br>';
    invoke += '<div class="ti1">return shim.Success([]byte(result))</div><br>'
    invoke += '<div>}</div><br>'

    return invoke;
}

function capitalizeFirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertingFunc(fromType, toType, varName){
    if (fromType==="string")
        switch (toType){
            case "int":
                return 'strconv.Atoi(' + varName + ')';
            case "uint64":
                return 'strconv.ParseUint(' + varName + ', 10, 64)';
            case "bool":
                return 'strconv.ParseBool(' + varName + ')';
            case "float":
                return 'strconv.ParseFloat(' + varName + ', 64)';
            default:
                return varName;
        }
}

function ownerCheck(){
    let ownerCode = '<div class="ti1">owner_id, err := stub.GetCreator()</div>' +
    '<div class="ti1">this_id, err := cid.GetID(stub)</div>' +
    '<div class="ti1">if this_id != BytesToString(owner_id) {</div>' +
        '<div class="ti2">return "", fmt.Errorf("Access to this method is only for creator")</div>' +
    '<div class="ti1">}</div>';
    return ownerCode;
}

/**
 * @return {string}
 */
function HLF_get(functionName, contractName, getFunc){
    let getCode = "";

    getCode += '<div> func ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) (string, error) {';
    if (getFunc === "close") getCode += ownerCheck();
    else getCode += '<div class="ti1"> var err error</div>';
    getCode += '<div class="ti1">var valAsbytes []byte</div>';

    getCode += '<div class="ti1">if len(args) != 1 {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Incorrect number of arguments. Expecting a key")</div>' +
                '<div class="ti1">}</div>';


    getCode += '<div class="ti1">valAsbytes, err = stub.GetState(args[0])</div>';
    getCode += '<div class="ti1">if err != nil {</div>' +
        '<div class="ti2">return "", fmt.Errorf("Failed to get: %s with error:  %s", args[0], err)</div>' +
        '<div class="ti1">} else if valAsbytes == nil {</div>' +
        '<div class="ti2">return "", fmt.Errorf("Not Found: %s", args[0])</div>' +
        '<div class="ti1">}</div>';

    getCode += '<div class="ti1">return string(valAsbytes), nil</div>';
    getCode += '<div>}</div><br>';

    return getCode;
}
/**
 * @return {string}
 */
function HLF_set(functionName, contractName, setFunc){
    let setCode = "";

    setCode += '<div> func ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) (string, error) {';
    if (setFunc === "close") setCode += ownerCheck();
    else setCode += '<div class="ti1"> var err error</div>';

    setCode += '<div class="ti1">if len(args) != 2{</div>' +
            '<div class="ti2">return "", fmt.Errorf("Incorrect number of arguments. Expecting a key and a value")</div>' +
            '<div class="ti1">}</div>';

    setCode += '<div class="ti1">err = stub.PutState(args[0], []byte(args[1]))</div>' +
        '<div class="ti1">if err != nil {</div>' +
        '<div class="ti2">return "", fmt.Errorf("Failed to set: %s", args[0])</div>' +
        '<div class="ti1">}</div>';
    setCode += '<div class="ti1">return args[1], nil</div>';
    setCode += '<div>}</div><br>';

    return setCode;
}

/**
 * @return {string}
 */
function HLF_delete(functionName, contractName, delFunc){
    let delCode = "";

    delCode += '<div>func ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) (string, error) {';
    if (delFunc === "close") delCode += ownerCheck();
    else delCode += '<div class="ti1"> var err error</div>';
    delCode += '<div class="ti1">var valAsbytes []byte</div>';
    delCode += '<div class="ti1">if len(args) != 1 {</div>' +
        '<div class="ti2">return "", fmt.Errorf("Incorrect number of arguments. Expecting a key")</div>' +
        '<div class="ti1">}</div>';

    delCode += '<div class="ti1">valAsbytes, err = stub.GetState(args[0])</div>'

    delCode += '<div class="ti1">if err != nil {</div>' +
        '<div class="ti2">return "", fmt.Errorf("Not Found")</div>' +
        '<div class="ti1">} else if valAsbytes == nil {</div>' +
        '<div class="ti2">return "", fmt.Errorf("Not Found")</div>' +
        '<div class="ti1">}</div>';

    delCode += '<div class="ti1">err = stub.DelState(args[0])</div>' +
        '<div class="ti1">if err != nil {</div>' +
        '<div class="ti2">return "", fmt.Errorf("Failed to delete: %s", args[0])</div>' +
        '<div class="ti1">}</div>';

    delCode += '<div class="ti1">return "Deleted", nil</div>' +
        '<div>}</div><br>';
    return delCode;
}

/**
 * @return {string}
 */
function HLF_structGet(functionName, contractName, getFunc, struct){
    let getCode = "";
    let structName = struct.dataset.structname;

    getCode += '<div>func ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) (string, error) {';
    if (getFunc === "close") getCode += ownerCheck();
    else getCode += '<div class="ti1"> var err error</div>';
    getCode += '<div class="ti1">var valAsbytes []byte</div>';

    getCode += '<div class="ti1">if len(args) != 1 {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Incorrect number of arguments. Expecting a key")</div>' +
                '<div class="ti1">}</div>';

    getCode += '<div class="ti1">valAsbytes, err = stub.GetState(args[0])</div>';
    getCode += '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Failed to get: %s with error:  %s", args[0], err)</div>' +
                '<div class="ti1">} else if valAsbytes == nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Not Found: %s", args[0])</div>' +
                '<div class="ti1">}</div>';

    getCode += '<div class="ti1">return string(valAsbytes), nil</div>';
    getCode += '<div class="ti1">}</div><br>';

    return getCode;
}

/**
 * @return {string}
 */
function HLF_structSet(functionName, contractName, setFunc, struct){
    let setCode = "";
    let n = struct.dataset.length;
    let structName = struct.dataset.structname;
    let n_1 = Number(n)+Number(1);
    let types = struct.dataset.structtypes.split(',');
    for (let j = 0; j<n; ++j) {
        if (types[j]==="address") types[j]="string";
        if (types[j]==="uint") types[j]="uint64";
    }
    let names = struct.dataset.structnames.split(',');

    setCode += '<div>func ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) (string, error) {';
    if (setFunc === "close") setCode += ownerCheck();
    else setCode += '<div class="ti1"> var err error</div>';
    for (let i=0; i<n; ++i) {
        setCode += '<div class="ti1">var ' + names[i] + ' ' + types[i] + '</div>';
    }
    setCode += '<div class="ti1"> var ' + structName + 'JSONasBytes []byte</div>';

    setCode += '<div class="ti1">if len(args) != ' + n_1 + '{</div>' +
        '<div class="ti2">return "", fmt.Errorf("Incorrect number of arguments. Expecting ' + n_1 + ': a key and struct arguments")</div>' +
        '<div class="ti1">}</div>';

    for (let i=1; i<=n; ++i) {
        let argName = 'args[' + i + ']';
        if (types[i-1] !== "string") {
            let conv = convertingFunc("string", types[i - 1], argName);
            setCode += '<div class="ti1">' + names[i - 1] + ', err = ' + conv + '</div>';
            setCode += '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Incorrect argument type. Expected ' + types[i-1] + '")</div>' +
                '<div class="ti1">}</div>';
        }
        else setCode += '<div class="ti1">' + names[i - 1] + ' = ' + argName + '</div>';
    }

    setCode += '<div class="ti1">' + structName +' := &' + structName + '{' + names[0];
    for (let i=1; i<n; ++i) setCode += ', ' + names[i];
    setCode += '}</div>';

    setCode += '<div class="ti1">' + structName + 'JSONasBytes, err = json.Marshal(' + structName + ')</div>';
    setCode += '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Trouble while making JSON")</div>' +
                '<div class="ti1">}</div>';

    setCode += '<div class="ti1">err = stub.PutState(args[0], ' + structName + 'JSONasBytes)</div>' +
                '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Error")</div>' +
                 '<div class="ti1">}</div>';
    setCode += '<div class="ti1">return "Created", nil</div>';
    setCode += '<div>}</div><br>';

    return setCode;
}

/**
 * @return {string}
 */
function HLF_structDelete(functionName, contractName, delFunc, struct){
    let delCode = "";
    let structName = struct.dataset.structname;

    delCode += '<div>func ' + functionName + '(stub shim.ChaincodeStubInterface, args []string) (string, error) {';
    if (delFunc === "close") delCode += ownerCheck();
    else delCode += '<div class="ti1"> var err error</div>';
    delCode += '<div class="ti1">var valAsbytes []byte</div>';
    delCode += '<div class="ti1">var ' + structName + '_JSON ' + structName + '</div>';

    delCode += '<div class="ti1">if len(args) != 1 {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Incorrect number of arguments. Expecting a key")</div>' +
                '<div class="ti1">}</div>';

    delCode += '<div class="ti1">valAsbytes, err = stub.GetState(args[0])</div>'

    delCode += '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Not Found")</div>' +
                '<div class="ti1">} else if valAsbytes == nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Not Found")</div>' +
                '<div class="ti1">}</div>';

    delCode += '<div class="ti1">err = json.Unmarshal([]byte(valAsbytes), &' + structName + '_JSON)</div>' +
                '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("JSON Is Not Valid")</div>' +
                '<div class="ti1">}</div>';

    delCode += '<div class="ti1">err = stub.DelState(args[0])</div>' +
                '<div class="ti1">if err != nil {</div>' +
                '<div class="ti2">return "", fmt.Errorf("Failed to delete: %s", args[0])</div>' +
                 '<div class="ti1">}</div>';

    delCode += '<div class="ti1">return "Deleted", nil</div>' +
                '<div>}</div><br>';
    return delCode;
}