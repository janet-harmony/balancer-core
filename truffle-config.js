require('dotenv').config()
const {endpoint, chainID} = require(__dirname + "/config")
const {ChainType} = require('@harmony-js/utils')
const {TruffleProvider} = require('@harmony-js/core')

module.exports = {
    networks: {
        network: {
            network_id: "*",
            // Relevant params are defined from env file & config
            provider: new TruffleProvider(
                endpoint,
                // Harmony wallets/accounts are implicitly the 0-th account of the menmonic
                // Harmony does NOT currently support n-th account from the menmonic
                {menmonic: process.env.MNEMONIC, index: 0, addressCount: 1},
                {shardID: parseInt(process.env.SHARD), chainId: chainID, chainType: ChainType.Harmony},
                {gasLimit: process.env.GASLIMIT, gasPrice: process.env.GASPRICE}
            )
        }
    },
    compilers: {
        solc: {
            version: '0.5.12',
            settings: { // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 2000,
                },
                evmVersion: 'byzantium',
            },
        },
    },
}
