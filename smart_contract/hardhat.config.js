require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/tfcOsWcWdGBNk8T48TctAnlYUG50MbpN",
      accounts: [
        "70dcb1918708ee2ad96e9d9ef633ad9ca5f35373214c71d9a6132f86eeace915",
      ],
    },
  },
};
