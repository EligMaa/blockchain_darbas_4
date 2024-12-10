const Bilietai = artifacts.require('Bilietai');
const assert = require('assert');


contract('Bilietai', (accounts) => {
  const pirkejas = accounts[1];
  const Bilieto_ID = 0;

  it('Leidžia pirkti bilietą', async () => {
    const instance = await Bilietai.deployed();
    const padinis_bilietas = await instance.bilietai(
      Bilieto_ID
    );
    await instance.pirktiBilietus(Bilieto_ID, {
      from: pirkejas,
      value: padinis_bilietas.kaina,
    });
    const atnaujintiBilieta = await instance.bilietai(Bilieto_ID);
    assert.equal(
      atnaujintiBilieta.kieno,
      pirkejas,
      'pirkejas turi bilietą'
    );
  });
});