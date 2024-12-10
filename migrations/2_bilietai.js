const Bilietai = artifacts.require("Bilietai");

module.exports = function (deployer) {
    deployer.deploy(Bilietai);
};