require('dotenv').config()

let initHmy = require('./createHmy')

const tokenJson = require("../build/contracts/ERC20.json")
const contractJson = require("../build/contracts/BPool.json")

const contractAddr = "0xdb3dbf70d2a08268b2103b69383bc228f6086566"
const tokenA = '0x9fb4098113b75ddfefc2071474ed49cbd6e6fd7c'
const tokenB = '0x26c65073294821fe0e7224b2ac5f9c4def85c74d'

const bindAmount = 10000000
const tokenWeight = 1

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

async function getPoolData(hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.getController().call(gasOptions)
    console.log('Pool Controller: ' + JSON.stringify(resp))

    resp = await contract.methods.getNumTokens().call(gasOptions)
    console.log('Number of tokens bound to pool: ' + resp.toNumber())

    resp = await contract.methods.getCurrentTokens().call(gasOptions)
    console.log('Pool tokens: ' + JSON.stringify(resp))

    resp = await contract.methods.getSwapFee().call(gasOptions)
    console.log('Swap fee: ' + resp.toNumber())

    resp = await contract.methods.isFinalized().call(gasOptions)
    console.log('Finalized pool: ' + JSON.stringify(resp))
}

async function getTokenWeight(token, hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.getNormalizedWeight(token).call(gasOptions)
    console.log('Token weight: ' + resp.toNumber())
}

async function approveToken(token, amount, hmy) {
    let tokenContract = hmy.contracts.createContract(tokenJson.abi, token)

    let resp = await tokenContract.methods.approve(contractAddr, amount).send(gasOptions)
    if (resp.status === 'called') {
        console.log('Token approved: ' + token)
    } else {
        console.log('Token approval failed: ' + token)
    }
}

async function bindToken(token, amount, hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.bind(token, amount, tokenWeight).send(gasOptions)
    if (resp.status === 'called') {
        console.log('Token bound: ' + token)
    } else {
        console.log('Token binding failed.')
    }
}

async function finalizePool(hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.finalize().send(gasOptions)
    if (resp.status === 'called') {
        console.log('Pool finalized')
    } else {
        console.log('Finalize failed.')
    }
}

initHmy(process.env.MNEMONIC_CREATOR).then((hmy) => {
    getPoolData(hmy).then(() => {
        return approveToken(tokenA, bindAmount, hmy)
    }).then(() => {
        return bindToken(tokenA, bindAmount, hmy)
    }).then(() => {
        return approveToken(tokenB, bindAmount, hmy)
    }).then(() => {
        return bindToken(tokenB, bindAmount, hmy)
    }).then(() => {
        return finalizePool(hmy)
    }).then(() => {
        return getPoolData((hmy))
    }).then(() => {
        return getTokenWeight(tokenA, hmy)
    }).then(() => {
        return getTokenWeight(tokenB, hmy)
    }).then(() => {
        process.exit(0)
    })
})