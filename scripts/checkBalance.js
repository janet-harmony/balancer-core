require('dotenv').config()

let initHmy = require('./createHmy')

const tokenJson = require("../build/contracts/ERC20.json")

const tokenA = '0x9fb4098113b75ddfefc2071474ed49cbd6e6fd7c'
const tokenB = '0x26c65073294821fe0e7224b2ac5f9c4def85c74d'

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

async function checkBalance(token, hmy) {
    let tokenContract = hmy.contracts.createContract(tokenJson.abi, token)

    let resp = await tokenContract.methods.balanceOf(hmy.wallet.accounts[0]).call(gasOptions)
    console.log(token + ' balance: ' + resp.toNumber())
}

initHmy(process.env.MNEMONIC_SWAP).then((hmy) => {
    checkBalance(tokenA, hmy).then(() => {
        return checkBalance(tokenB, hmy)
    }).then(() => {
        process.exit(0)
    })
})