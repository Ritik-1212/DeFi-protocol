require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-deploy");

const MAINNET_RPC_URL = process.env.RPC_URL || "your url here";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
    localhost: {
      chainId: 31337,
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.17" },
      { version: "0.4.19" },
      { version: "0.6.12" },
      { version: "0.6.6" },
      { version: "0.6.0" },
    ],
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
