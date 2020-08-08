require('dotenv').config()

let initHmy = require('./createHmy')

const tokenJson = require("../build/contracts/ERC20.json")
const contractJson = require("../build/contracts/BPool.json")

const tokenA = '0x9fb4098113b75ddfefc2071474ed49cbd6e6fd7c'
const tokenB = '0x26c65073294821fe0e7224b2ac5f9c4def85c74d'
const contractAddr = "0xdb3dbf70d2a08268b2103b69383bc228f6086566";

const swapAmount = 1000
const maxPrice = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

async function swapToken(tokenSend, tokenReceive, amount, hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    // Set minAmountOut to 0 & maxPrice to very high
    let resp = await contract.methods.swapExactAmountIn(tokenSend, amount, tokenReceive, 0, maxPrice).send(gasOptions)
    if (resp.status === "called") {
        console.log('Swap succeeded.')
    } else {
        console.log('Swap failed.')
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

initHmy(process.env.MNEMONIC_SWAP).then((hmy) => {
    approveToken(tokenA, swapAmount, hmy).then(() => {
        return swapToken(tokenA, tokenB, swapAmount, hmy)
    }).then(() => {
        process.exit(0)
    })
})