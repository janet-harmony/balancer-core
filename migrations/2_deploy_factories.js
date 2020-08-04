const BToken = artifacts.require('BToken');
const BFactory = artifacts.require('BFactory');
const BPool = artifacts.require('BPool');

module.exports = async function (deployer) {
    // deployer.deploy(BPool);
    // deployer.deploy(BToken);
    deployer.deploy(BFactory, {gas: 800000000, gasPrice: 1});
};
