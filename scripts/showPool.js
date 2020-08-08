require('dotenv').config()
const BigNumber = require('bignumber.js');

let initHmy = require('./createHmy')

const contractJson = require("../build/contracts/BPool.json")

const contractAddr = "0xdb3dbf70d2a08268b2103b69383bc228f6086566"
const tokenA = '0x9fb4098113b75ddfefc2071474ed49cbd6e6fd7c'
const tokenB = '0x26c65073294821fe0e7224b2ac5f9c4def85c74d'

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

async function getPoolData(hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.getController().call(gasOptions)
    console.log('Pool Controller: ' + JSON.stringify(resp))

    resp = await contract.methods.getNumTokens().call(gasOptions)
    console.log('Number of tokens bound to pool: ' + resp.toNumber())

    resp = await contract.methods.getCurrentTokens().call(gasOptions)
    console.log('Pool tokens: ' + JSON.stringify(resp))

    resp = await contract.methods.getBalance(tokenA).call(gasOptions)
    console.log(tokenA + ' tokens available: ' + resp.toNumber())

    resp = await contract.methods.getBalance(tokenB).call(gasOptions)
    console.log(tokenB + ' tokens available: ' + resp.toNumber())

    resp = await contract.methods.getSpotPrice(tokenA, tokenB).call(gasOptions)
    console.log('Spot price (A -> B): ' + new BigNumber(resp.toString()))

    resp = await contract.methods.getSwapFee().call(gasOptions)
    console.log('Swap fee: ' + resp.toNumber())

    resp = await contract.methods.isFinalized().call(gasOptions)
    console.log('Finalized pool: ' + JSON.stringify(resp))
}

initHmy(process.env.MNEMONIC_CREATOR).then((hmy) => {
    getPoolData(hmy).then(() => {
        process.exit(0)
    })
})