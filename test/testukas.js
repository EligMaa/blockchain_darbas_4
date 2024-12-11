const Bilietai = artifacts.require('Bilietai');
const assert = require('assert');

contract('Bilietai', (accounts) => {
  const savininkas = accounts[0]; // Contract owner
  const pirkejas = accounts[1];  // Buyer
  const kitasPirkejas = accounts[2]; // Another buyer
  const Bilieto_ID = 0;
  const Kitas_Bilieto_ID = 1;

  let instance;

  before(async () => {
    instance = await Bilietai.deployed();
  });

  it('Savininkas yra nustatytas tinkamai', async () => {
    const sutartiesSavininkas = await instance.owner();
    assert.equal(sutartiesSavininkas, savininkas, 'Savininkas turi būti priskirtas tinkamai');
  });

  it('Leidžia pirkti bilietą su tinkama suma', async () => {
    const bilietas = await instance.bilietai(Bilieto_ID);
    await instance.pirktiBilietus(Bilieto_ID, {
      from: pirkejas,
      value: bilietas.kaina,
    });
    const atnaujintiBilieta = await instance.bilietai(Bilieto_ID);
    assert.equal(
      atnaujintiBilieta.kieno,
      pirkejas,
      'Pirkejas turi būti bilieto savininkas'
    );
  });

  it('Neleidžia pirkti jau parduoto bilieto', async () => {
    try {
      await instance.pirktiBilietus(Bilieto_ID, {
        from: kitasPirkejas,
        value: web3.utils.toWei('1', 'ether'),
      });
      assert.fail('Tikimasi, kad nepavyks pirkti jau parduoto bilieto');
    } catch (error) {
      assert(error.message.includes('Bilietas jau parduotas'), 'Gautas netinkamas klaidos pranešimas');
    }
  });

  it('Grąžina bilietą ir atlaisvina jį pirkimui', async () => {
    const bilietas = await instance.bilietai(Bilieto_ID);
    await instance.grazintiBilietas(Bilieto_ID, { from: pirkejas });
    const atnaujintiBilieta = await instance.bilietai(Bilieto_ID);
    assert.equal(
      atnaujintiBilieta.kieno,
      '0x0000000000000000000000000000000000000000',
      'Bilietas turi būti atlaisvintas'
    );
  });

  it('Leidžia pirkti atlaisvintą bilietą', async () => {
    const bilietas = await instance.bilietai(Bilieto_ID);
    await instance.pirktiBilietus(Bilieto_ID, {
      from: kitasPirkejas,
      value: bilietas.kaina,
    });
    const atnaujintiBilieta = await instance.bilietai(Bilieto_ID);
    assert.equal(
      atnaujintiBilieta.kieno,
      kitasPirkejas,
      'Kitas pirkejas turi būti bilieto savininkas'
    );
  });

  it('Tinkamai taiko ankstyvo pirkimo nuolaidą', async () => {
    const bilietas = await instance.bilietai(Kitas_Bilieto_ID);
    const pradineKaina = bilietas.kaina;
    const expectedPrice = web3.utils.toWei('0.5', 'ether');

    // Pirkti bilietą su nuolaida
    await instance.pirktiBilietus(Kitas_Bilieto_ID, {
      from: pirkejas,
      value: expectedPrice,
    });
    const atnaujintiBilieta = await instance.bilietai(Kitas_Bilieto_ID);

    assert.equal(
      atnaujintiBilieta.moketaKaina,
      expectedPrice,
      'Nuolaida turi būti tinkamai taikoma'
    );
  });

  it('Neleidžia pirkti bilieto už mažesnę nei reikalingą sumą', async () => {
    try {
      await instance.pirktiBilietus(2, {
        from: pirkejas,
        value: web3.utils.toWei('0.1', 'ether'),
      });
      assert.fail('Tikimasi, kad nepavyks pirkti bilieto už mažesnę sumą');
    } catch (error) {
      assert(error.message.includes('Nepakanka lesu bilietui isigyti'), 'Gautas netinkamas klaidos pranešimas');
    }
  });

  it('Tikrina pradinį bilieto būseną', async () => {
    const naujasBilietas = await instance.bilietai(3);
    assert.equal(
      naujasBilietas.kieno,
      '0x0000000000000000000000000000000000000000',
      'Pradžioje bilietas turi būti laisvas'
    );
    assert.equal(
      naujasBilietas.kaina,
      web3.utils.toWei('1', 'ether'),
      'Pradinė bilieto kaina turi būti 1 ETH'
    );
  });

  it('Neleidžia grąžinti bilieto, kuris nepriklauso vartotojui', async () => {
    try {
      await instance.grazintiBilietas(Bilieto_ID, { from: pirkejas });
      assert.fail('Tikimasi, kad nepavyks grąžinti bilieto, kuris nepriklauso vartotojui');
    } catch (error) {
      assert(error.message.includes('Jus nesate sio bilieto savininkas'), 'Gautas netinkamas klaidos pranešimas');
    }
  });
});
