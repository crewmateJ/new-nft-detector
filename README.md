# NFT Monitor

## Overview

I wrote this repository in April 2023, and the NFT free-mint meta faded shortly after. I am open-sourcing it because I no longer use it and do not see it being useful in the near future.

This repository contains a Node.js-based program for monitoring and tracking new NFT (Non-Fungible Token) deployments on the Ethereum blockchain. It provides functionality to distinguish between different types of NFTs, such as free mints, open editions, and other NFTs, and sends notifications to different Discord channels based on these distinctions.

## Features

- Monitors Ethereum blockchain for new NFT deployments.
- Differentiates between free mints, open editions, and other NFTs.
- Sends notifications to Discord channels based on NFT type.

## Configuration

Before using the program, you need to configure it by modifying the `config/default.json` file. Replace the placeholders in the configuration file with your specific values:

- `rpcUrl`: Replace with your Ethereum RPC (Remote Procedure Call) URL.
- `discordWebhookUrl`: Replace with your Discord webhook URL for standard NFT notifications.
- `discordWebhookUrlOpenEdition`: Replace with your Discord webhook URL for open edition NFT notifications.
- `discordWebhookUrlFreeMint`: Replace with your Discord webhook URL for free mint NFT notifications.

## Installation and Usage

1. Clone this repository to your local machine.

2. Install Node.js dependencies by running:

   ```bash
   npm install
