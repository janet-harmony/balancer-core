const { Harmony } = require('@harmony-js/core')
const { ChainID, ChainType } = require('@harmony-js/utils')

function createHmy(wallet) {
    let hmy = new Harmony("https://api.s0.b.hmny.io",
        {
            chainType: ChainType.Harmony,
            chainId: ChainID.HmyTestnet,
        },
    )
    const deployer = hmy.wallet.addByMnemonic(wallet)
    hmy.wallet.setSigner(deployer.address)
    return hmy
}

async function setSharding(hmy) {
    const res = await hmy.blockchain.getShardingStructure();
    hmy.shardingStructures(res.result);
}

/**
 * Initialize the harmony instance with the given environment
 *
 * @returns {Promise<Harmony>}
 */
module.exports = async function (wallet) {
    const hmy = createHmy(wallet)
    await setSharding(hmy)
    return hmy
}
