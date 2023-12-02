const { Webhook } = require('discord-webhook-node');
const config = require('./config/default.json');
const { getSymbol, getName, getMintData, checkIfERC721, isOpenEdition } = require('./erc721');

const hookOpenEdition = new Webhook(config.discordWebhookUrlOpenEdition);
const hookNewMint = new Webhook(config.discordWebhookUrl);
const hookFreeMint = new Webhook(config.discordWebhookFreeMint);


function sendDiscordMessage(message, hook=hookNewMint) {
    hook.send(message);
}


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function formatAndSendMessage(contractAddress, web3) {
    const isERC721 = await checkIfERC721(contractAddress, web3);
    if (!isERC721) {
        console.log(`Contract ${contractAddress} is not an ERC721`);
        return;
    }
    const symbol = await getSymbol(contractAddress, web3);
    const name = await getName(contractAddress, web3);
    const { mintDataMsg, mintData} = await getMintData(contractAddress, web3);
    if (symbol === null || name === null || symbol === "" || name === "") {
        return;
    }
    //separate OEs from normal NFTs since they don't do as well
    if (await isOpenEdition(contractAddress, web3)) {
        console.log(`New Open Edition: ${name} (${symbol}) deployed at ${contractAddress.slice(0,6)}..,` + 
            `${mintDataMsg}\n${contractAddress}\n⠀`);
        sendDiscordMessage(`New Open Edition: ${name} (${symbol}) deployed at ${contractAddress.slice(0,6)},` + 
            `${mintDataMsg}\n${contractAddress}\n⠀`, hookOpenEdition);
    } else if (mintData.maxFree != null || mintData.maxFreePerWallet != null || mintData.cost === 0) {
        console.log(`New Free Mint: ${name} (${symbol}) deployed at ${contractAddress.slice(0,6)}..,` + 
            `${mintDataMsg}\n${contractAddress}\n⠀`);
        sendDiscordMessage(`${name} (${symbol}) deployed at ${contractAddress.slice(0,6)}..,` + 
            `${mintDataMsg}\n${contractAddress}\n⠀`, hookFreeMint);
        sendDiscordMessage(`${name} (${symbol}) deployed at ${contractAddress.slice(0,6)}..,` + 
            `${mintDataMsg}\n${contractAddress}\n⠀`);
    } else {
        console.log(`${name} (${symbol}) deployed at ${contractAddress}, ${mintDataMsg}\n⠀`);
        sendDiscordMessage(`${name} (${symbol}) deployed at ${contractAddress.slice(0,6)}..,` + 
            `${mintDataMsg}\n${contractAddress}\n⠀`);
    }

}

module.exports = { sendDiscordMessage, sleep, formatAndSendMessage}