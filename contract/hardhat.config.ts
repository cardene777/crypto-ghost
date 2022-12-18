import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"

require("dotenv").config();

// ALCHEMY API KEY
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY

// GOERLI PRIVATE KEY
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: 30_000_000,
    },
    goerli: {
      url: ALCHEMY_API_KEY,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`]
    },
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
    currency: 'USD',
    gasPrice: 21
  }
};

export default config;
