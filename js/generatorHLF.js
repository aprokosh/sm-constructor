function generateHLF (contractName, blockList, varNames, structList){
    for (let i=0; i<varNames.length; ++i) {
        let thisType = blockList[i].dataset.type;
        if (varNames[i] === "") varNames[i] = thisType + i;
    }

    let code = '<div id="codeBlock">';
    code += '<h2>Код контракта</h2>';

    code += generateHLFBase(contractName);
    code += generateHLFInterface(contractName, blockList, varNames);
    code += generateHLFStructs(varNames, structList);
    code += generateHLFFunctions(blockList, varNames);
    code += '<div>}</div>';
    code += '</div>';

    document.getElementById('inputRedactorHere').innerHTML = code;
}

function generateHLFBase(contractName){
    let baseCode = "";
    baseCode += '<div>package main;</div>';

    baseCode += '<div>import (</div>';
    baseCode += '<div class="ti1">"encoding/json",</div>' +
        '<div class=""ti1">"github.com/s7techlab/cckit/extensions/owner",</div>' +
        '<div class="ti1">"fmt",</div>' +
        '<div class="ti1">"github.com/hyperledger/fabric/core/chaincode/shim",</div>' +
        '<div class="ti1">github.com/hyperledger/fabric/protos/peer"</div>' +
        '<div>)</div><br>';

    baseCode += '<div> type ' + contractName + '{</div>';
    baseCode += '<div>}</div><br>'

    baseCode += '<div>func main() {</div>' +
        '<div class="ti1">shim.Start(new(' + contractName +'))</div>' +
        '<div>}</div>';
    return baseCode;
}
/*
function generateHLFInterface(contractName, blockList, varNames){
    let intCode = "";
    let call = 'shim.' + contractName + 'StubInterface';

    intCode += '<div>func (ptr *'+contractName + ') Init(stub' + call + ') peer.Response {</div>';
    intCode += '<div class="ti1">return owner.SetFromCreator(ptr.router.Context(`init`, stub))</div>';
    intCode += '<div>}</div>;

    let funcList = blockList.dataset.type;
    let n = funcList.length;

    intCode += '<div>func (ptr *' + contractName + ') Invoke(stub ' + call + ') peer.Response {</div>';
    intCode += '<div class="ti1">function, args := stub.GetFunctionAndParameters()</div>';
    intCode += '<div class="ti1">switch function {</div>';
    for (let i=0; i<n; ++i){
        if (blockList[i].dataset.get === "open" || blockList[i].dataset.get === "close") {
            intCode += '<div class="ti1">case "get_' + varNames[i] + '": < /div>';
            intCode += '<div class="ti2">return get_' + varNames[i] + '(stub, args)</div>';
        }
        if (blockList[i].dataset.set === "open" || blockList[i].dataset.set === "close") {
            intCode += '<div class="ti1">case "set_' + varNames[i] + '": < /div>';
            intCode += '<div class="ti2">return set_' + varNames[i] + '(stub, args)</div>';
        }
        if (blockList[i].dataset.delete === "open" || blockList[i].dataset.delete === "close") {
            intCode += '<div class="ti1">case "delete_' + varNames[i] + '": < /div>';
            intCode += '<div class="ti2">return delete_' + varNames[i] + '(stub, args)</div>';
        }
    }
    intCode += '<div class="ti1">default:</div>';
    intCode += '<div class="ti2">return shim.Error("Invalid function name")</div>';
    intCode += '<div>}</div>'

    return intCode;
}
*/
function generateHLFStructs(varNames, structList) {
    let code = "";
    let n = structList.length;

    for (let i = 0; i<n; ++i){
        let name = structList[i].dataset.structname;

        code += '<div>type '+ name + ' struct{</div>';
        let k = structList[i].dataset.length;

        let types = structList[i].dataset.structtypes.split(',');
        let names = structList[i].dataset.structnames.split(',');
        for (let j = 0; j<k; ++j){
            code += '<div class="ti1">' + names[j] + ' ' + types[j] + '</div>';
        }
        code += '<div>}</div><br>';
    }
    return code;
}
