const { getDeployments } = require('./getDeployments');
const Web3 = require('web3');
const { sleep, formatAndSendMessage } = require('./utils');
const config = require('./config/default.json');

const web3 = new Web3(config.rpcUrl);

async function main() {
    while (true) {
        let latestDeployments = [];
        while (latestDeployments.length===0) {
            const lastestBlockNumber = await web3.eth.getBlockNumber();
            latestDeployments = await getDeployments(lastestBlockNumber);
            //wait for a new block
            while (lastestBlockNumber === await web3.eth.getBlockNumber()) {
                await sleep(3000);
            }
        }
        //now go through all deployments and check if they are ERC721
        for (let i = 0; i < latestDeployments.length; i++) {
            await formatAndSendMessage(latestDeployments[i].contractAddress, web3);
        }
    }
};

main();