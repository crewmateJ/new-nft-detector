const EthereumJs = require('ethereumjs-util');
const HttpProvider = require('ethjs-provider-http');
const RPC = require('ethjs-rpc');
const config = require('./config/default.json');

const rpc = new RPC(new HttpProvider(config.rpcUrl));

/**
 * 
 * @param {*} tx 
 * @returns {Object} Object containing data about contract deployments
 *                   or false if the transaction is not a contract deployment
 */
async function txIsDeployment(tx) {
    // contract creation has no recipient
    if (!tx.to) {
        const response = await rpc.sendAsync({
            method: 'eth_getTransactionReceipt',
            params: [tx.hash],
            jsonrpc: '2.0',
            id: Date.now(),
        });
        tx.contractAddress = response.contractAddress;
        return tx;
    } else {
        return false;
    }
}

/**
 *  
 * @param {Number} blockNumber
 * @returns {Array} Array of objects containing data about contract deployments
 */
async function getDeployments(blockNumber) {
    let rtnArray = [];
    rpc.sendAsync({
        method: 'eth_getBlockByNumber',
        // The second parameter set to true indicates that we want to retrieve the full transaction objects
        params: [EthereumJs.intToHex(blockNumber), true],
        id: 1
    }, async (error, result) => {
        if (!error) {
            const transactions = result.transactions;
            console.log(`Block ${blockNumber} contains ${transactions.length} transactions`);
            transactions.forEach(async (tx) => {
                // console.log(`Checking transaction ${tx.hash}`);
                const txData = await txIsDeployment(tx);
                if (txData) {
                    rtnArray.push(txData);
                }
            });
        } else {
            console.error(error);
        }
    });
    return rtnArray;
}

module.exports = { getDeployments, txIsDeployment }