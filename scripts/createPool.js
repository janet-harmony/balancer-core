require('dotenv').config()

let initHmy = require('./createHmy')

initHmy(process.env.MNEMONIC_CREATOR).then((hmy) => {
    const contractAddr = "0x89783bdba42a801bee95880a05ef3a3a56a7525b"
    const contractJson = require("../build/contracts/BFactory.json");
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

    console.log('Creating new pool')

    contract.methods.newBPool().send(gasOptions).then((response) => {
        if (response.transaction.txStatus == "REJECTED") {
            console.log("Pool creation rejected");
            process.exit(0);
        }
        console.log(JSON.stringify(response, null, 2))
        process.exit(0);
    });
})
