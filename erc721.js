const config = require('./config/default.json');
const Web3 = require('web3');

const ABI = config.IERC165_ABI;
const variablesAbi  = config.variablesInterface;
const ERC721_INTERFACE_ID = config.ERC721_INTERFACE_ID;
const ERC721_METADATA_INTERFACE_ID = config.ERC721_METADATA_INTERFACE_ID;
const ERC721_ENUMERABLE_INTERFACE_ID = config.ERC721_ENUMERABLE_INTERFACE_ID;

/**
 * @notes This function checks if a contract is ERC721 or ERC721Metadata
 * using the ERC165 standard.
 */
async function checkIfERC721(contractAddress, web3=new Web3(config.rpcUrl)) {
    const contract = new web3.eth.Contract(ABI, contractAddress);
    try {
        return await contract.methods.supportsInterface(ERC721_INTERFACE_ID).call();
    } catch (e) {
        try {
            return await contract.methods.supportsInterface(ERC721_METADATA_INTERFACE_ID).call();
        } catch (e) {
            try {
                return await contract.methods.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID).call();
            } catch (e) {
                return false;
            }
        }
    }
}

async function getSymbol(contractAddress, web3=new Web3(config.rpcUrl)) {
    try {
        return await (new web3.eth.Contract(ABI, contractAddress)).methods.symbol().call();
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getName(contractAddress, web3=new Web3(config.rpcUrl)) {
    try {
        return await (new web3.eth.Contract(ABI, contractAddress)).methods.name().call();
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * @notes Function must be a view function with no parameters and must return a uint256
 */
async function functionCallWithName(contractAddress, functionName, web3=new Web3(config.rpcUrl)) {
    const ABI_2 = [{
        "inputs": [],
        "name": functionName,
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }];
    return await (new web3.eth.Contract(ABI_2, contractAddress)).methods[functionName]().call();
}

/**
 * @notes Gets the cost, max supply, and max free mints for a contract
 * @returns A string with the data
 */
async function getMintData(contractAddress, web3=new Web3(config.rpcUrl)) {
    let mintData = {
        maxSupply: null,
        cost: null,
        maxFree: null,
        maxFreePerWallet: null
    }
    let mintDataMsg = '';
    const mintFunctionNames = config.mintFunctionNames;
    //for each function
    for (let i = 0; i < mintFunctionNames.length; i++) {
        //for each possible name of the function
        for (let j = 0; j < mintFunctionNames[i].length; j++) {
            try {
                console.log(`Testing: ${mintFunctionNames[i][j]}`)
                //the first function name in the array is the name of the variable
                mintData[mintFunctionNames[i][0]] = await functionCallWithName(contractAddress, mintFunctionNames[i][j]);
                //convert cost from wei to eth
                if (mintFunctionNames[i][0] === 'cost') { 
                    mintData.cost = mintData.cost / 1000000000000000000;
                }
                mintDataMsg += `${mintFunctionNames[i][0]}: ${mintData[mintFunctionNames[i][0]]}, `;
                break;
            } catch (e) {}
        }
    }
    return { mintDataMsg, mintData };
}

async function isOpenEdition(contractAddress, web3=new Web3(config.rpcUrl)) {
    try {
        await new web3.eth.Contract([
                {
                    "inputs": [],
                    "name": "getAdmins",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "admins",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ], contractAddress)
            .methods.getAdmins().call();
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = { checkIfERC721, getSymbol, getName, getMintData, isOpenEdition };