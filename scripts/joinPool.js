require('dotenv').config()

let initHmy = require('./createHmy')

const tokenJson = require("../build/contracts/ERC20.json")
const contractJson = require("../build/contracts/BPool.json")

const tokenA = '0x9fb4098113b75ddfefc2071474ed49cbd6e6fd7c'
const tokenB = '0x26c65073294821fe0e7224b2ac5f9c4def85c74d'
const contractAddr = "0xdb3dbf70d2a08268b2103b69383bc228f6086566";

const joinAmount = 50000

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

async function joinPool(token, amount, hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.joinswapExternAmountIn(token, amount, 0).send(gasOptions)
    if (resp.status === "called") {
        console.log('Pool joined.')
    } else {
        console.log('Failed to join pool')
    }
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

initHmy(process.env.MNEMONIC_PARTICIPANT).then((hmy) => {
    approveToken(tokenA, joinAmount, hmy).then(() => {
        return approveToken(tokenB, joinAmount, hmy)
    }).then(() => {
        return joinPool(tokenA, joinAmount, hmy)
    }).then(() => {
        return joinPool(tokenB, joinAmount, hmy)
    }).then(() => {
        process.exit(0)
    })
})