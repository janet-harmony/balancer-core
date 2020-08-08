require('dotenv').config()

let initHmy = require('./createHmy')

const contractJson = require("../build/contracts/BPool.json")

const tokenA = '0x9fb4098113b75ddfefc2071474ed49cbd6e6fd7c'
const tokenB = '0x26c65073294821fe0e7224b2ac5f9c4def85c74d'
const contractAddr = "0xdb3dbf70d2a08268b2103b69383bc228f6086566";

const exitAmount = 500000
const maxAmount = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

async function exitPool(token, amount, hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.exitswapExternAmountOut(token, amount, maxAmount).send(gasOptions)
    if (resp.status === "called") {
        console.log('Pool exited.')
    } else {
        console.log('Failed to exit pool')
    }
}

initHmy(process.env.MNEMONIC_PARTICIPANT).then((hmy) => {
   exitPool(tokenA, exitAmount, hmy).then(() => {
       process.exit(0)
   })
})