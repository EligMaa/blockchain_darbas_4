# 4-asis darbas: išmaniosios sutarties ir decentralizuotos aplikacijos kūrimas

## Tikslas
* Pagrindinis šios užduoties tikslas yra sukurti išmaniąją sutartį (angl. smart
contract), kuri įgyvendintų tam tikrą verslo logiką ir galėtų užtikrinti jos "saugų"
ir "patikimą" funkcionavimą decentralizuotame viešąjame tinkle. Išmaniosios sutarties
valdymui ir verslo proceso dalyvių tarpusavio sąveikai palengvinti bus kuriama
decentralizuota aplikacija su Front-End. 
* Šioje užduotyje išmanioji sutartis įgyvendinama Solidyti programavimo kalba ir turi
būti adaptuota Ethereum blockchain tinklui. Šiai užduočiai atlikti Jums reikės:
Išmaniosios sutarties kūrimui rekomenduojama naudoti "on-line" įrankį Remix
IDE, o testavimui ir diegimui Truffle IDE, kurį reikia įdiegti į savo
kompiuterį.
* Decentralizuotos aplikacijos testavimui galite naudoti Ganache įrankį, kuris
sukuria lokalų Ethereum tinklą.
Jums taip pat prireiks kliento MetaMask, kuris įgalins sąsają su Ethereum
tinklu.
* Išmaniosios sutarties testavimui naudokite ir vieną iš viešųjų Ethereum
testinių tinklų (angl. testnet), pvz., Goerli.

## Reikalingi įrankiai
* Node (v18.20.5) ir Truffle (v5.11.5) galima instaliuoti pagal šią [nuorodą](https://archive.trufflesuite.com/docs/truffle/how-to/install/#requirements).
* Ganachi (v7.9.1) instaliuoti pagal [nuorodą](https://github.com/trufflesuite/ganache-ui/releases/tag/v2.7.1#user-content-2.7.1-How-to-Upgrade).
* Solidity (v0.8.11) kompiliatorius.
* MetaMask susikurti pagal [nuorodą](https://nftnow.com/guides/how-to-set-up-metamask-wallet/).
## 1. Verslo modelio logikos aprašymas
Šios išmaniosios sutarties pagrindinė verslo logika sukasi apie bilietų pardavimą ir grąžinimą per Ethereum blockchain. Ji įgyvendina bilietų pardavimo platformą, kurioje vartotojai gali įsigyti bilietus ir susigrąžinti pinigus, jei nusprendžia bilietą grąžinti prieš renginį. Ši verslo logika remiasi šiais pagrindiniais aspektais:
#### 1. Bilietų pardavimas:
* Išmanioji sutartis valdo iš anksto nustatytą bilietų skaičių, kurių kiekvienas turi bazinę kainą (1 ETH).
* Bilietai priskirti trim kategorijoms: koncertai, sporto renginiai ir spektakliai, su tam tikrais renginio datos ir vietos duomenimis.
* Vartotojas gali įsigyti bilietą, siųsdamas reikiamą sumą į išmaniąją sutartį. Bilieto savininkas yra registruojamas pagal jo Ethereum adresą.
* Vartotojai gauna ankstyvų pirkėjų nuolaidą (50 %), jei jie perka vieną iš pirmųjų trijų bilietų. Tai skatina greitesnį bilietų pardavimą ir sukuria „early bird“ skatinimo mechanizmą.
#### 2. Bilieto grąžinimas:
* Vartotojai gali grąžinti bilietą, jei renginys dar neprasidėjo.
* Pirkėjui grąžinama suma, kuri buvo sumokėta už bilietą (fiksuojama bilieto kaina pirkimo metu). Tai suteikia vartotojui lankstumą.
* Grąžintas bilietas tampa vėl prieinamas kitiems vartotojams.
#### 3. Sutarties valdytojo pajamos:
* Sutarties valdytojas (platformos savininkas) gali nustatyti komisinį mokestį (5 %) už bilietų perpardavimą, jei šis funkcionalumas būtų pridėtas ateityje. Tai užtikrintų platformos pelningumą iš bilietų perpardavimų.
#### 4. Skaidrumas ir decentralizacija:
* Visa bilietų pirkimo ir grąžinimo veikla yra atliekama blockchain tinkle, kas užtikrina skaidrumą, decentralizuotą valdymą ir neabejotiną savininkystę.
* Tai suteikia patikimumą tiek vartotojams, tiek platformai, nes nėra centralizuoto tarpininko, kuris galėtų kontroliuoti ar manipuliuoti bilietų pardavimo procesu.
#### Verslo modelio privalumai
* Ankstyvų pirkėjų nuolaidos skatina vartotojus pirkti bilietus anksčiau, padidinant platformos naudojimo aktyvumą.
* Grąžinimo sistema leidžia vartotojams jaustis saugiai dėl savo investicijų, o platforma efektyviai valdo grąžinimus.
* Skaidrus decentralizavimas suteikia didesnį pasitikėjimą tiek bilietų pirkėjams, tiek platformai.
## 2. Išmanioji sutartis Solidyti kalba
Atidarius komandinę eilutę reikia sukurti aplankalą, kuriame bus talpinami visi reikalingi išmaniosios sutarties failai.<br>
```mkdir laboras```<br>
```cd laboras```<br>
```truffle init```<br>
Paskutinė komanda inicializuoja naują Truffle projektą. Kai ją įvykdai kataloge, ji sukuria pagrindinę projekto struktūrą ir konfigūracijos failus, reikalingus pradėti kurti bei testuoti Ethereum išmaniąsias sutartis naudojant Truffle.
Štai ką ji sukuria:

* ```contracts/```: Katalogas, kuriame rašomi Solidity išmaniųjų sutarčių failai. Pagal nutylėjimą įtrauktas failas Migrations.sol, kuris padeda valdyti sutarčių migracijas (t.y., sutarčių diegimo pokyčius laikui bėgant).

* ```migrations/```: Čia laikomi JavaScript failai, skirti sutarčių migracijoms. Jie naudojami sutartims diegti Ethereum tinkle. Įtraukiamas failas 1_initial_migration.js, skirtas valdyti pradinę sutarčių migraciją.

* ```test/```: Katalogas, kuriame rašomi sutarčių testai (naudojant JavaScript arba Solidity). Galima naudoti testavimo karkasus, tokius kaip Mocha ar Chai, kad parašytum testus.

* ```truffle-config.js```: Tai konfigūracijos failas, skirtas nustatyti tinklo parametrus, pvz., kaip prisijungti prie Ethereum blokų grandinės, pritaikyti kompiliatoriaus nustatymus ar sukonfigūruoti sutarčių diegimą.

Tada reikėjo susikurti ```2_bilietai.js``` <br>
```
const Bilietai = artifacts.require("Bilietai");
module.exports = function (deployer) {
    deployer.deploy(Bilietai);
};
```
Taip pat reikėjo Ganache. Ganache yra Ethereum blokų grandinės simuliatorius, kurį galima naudoti kūrimo ir testavimo aplinkoje. Jis leidžia simuliuoti Ethereum tinklą kompiuteryje, suteikiant prieigą prie vietinių paskyrų, balansų ir išmaniosioms sutartims vykdyti skirtų funkcijų, be būtinybės naudotis tikra Ethereum mainų arba testavimo grandine. Tai sukūriau ```NEW WORKSPACE``` ir prie truffle projects nurodžiau savo projekto ```truffle-config.js``` failą.
![image](https://github.com/user-attachments/assets/1017ffe8-62af-4577-b684-b98da64ce9b3)
![image](https://github.com/user-attachments/assets/f8ae4039-8a04-41c1-b98f-0a1ae3c30a37)
<br>

Taip pat susikūriau ```MetaMask``` piniginę ir įdėjau kelis adresus iš Ganache.

![image](https://github.com/user-attachments/assets/b5e0d0b3-e640-458d-9bc9-99816d9955b4)
<br>
Tada sukūriau Solidity kalba failą, kuriame aprašoma išmanioji sutartis:

<details>
<summary>Bilietai.sol</summary>
<br>
  
```
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// Pastovus kintamasis, nurodantis visų bilietų skaičių
uint256 constant VISI_BILIETAI = 10;

contract Bilietai {
    address public owner; // Sutarties savininkas
    uint256 public earlyBirdDiscount = 50; // Ankstyvo pirkimo nuolaidos procentai pirmiesiems 3 bilietams
    uint256 public ticketsSold = 0; // Skaitiklis, sekantis parduotų bilietų kiekį

    // Struktūra, apibrėžianti bilieto savybes
    struct Bilietas {
        uint256 kaina; // Bilieto bazinė kaina
        uint256 moketaKaina; // Faktinė pirkėjo sumokėta kaina
        address kieno; // Bilieto savininkas (adresas)
        string data; // Renginio data
        string vieta; // Renginio vieta
    }

    // Masyvas, talpinantis visus bilietus
    Bilietas[VISI_BILIETAI] public bilietai;

    // Konstruktorius, nustatantis pradinį sutarties savininką ir inicijuojantis bilietų savybes
    constructor() {
        owner = msg.sender; // Sutartį įkėlęs vartotojas tampa savininku
        for (uint256 i = 0; i < VISI_BILIETAI; i++) {
            bilietai[i].kaina = 1e18; // Pradinė kaina: 1 ETH
            bilietai[i].kieno = address(0x0); // Bilietas nepriklauso niekam (laisvas)
            bilietai[i].data = ""; // Pradinė tuščia data
            bilietai[i].vieta = ""; // Pradinė tuščia vieta
        }
    }

    // Modifikatorius, užtikrinantis, kad funkcijas gali kviesti tik savininkas
    modifier onlyOwner() {
        require(msg.sender == owner, "Jus nesate savininkas.");
        _;
    }

    // Įvykis, užregistruojantis bilieto pirkimo informaciją
    event TicketPurchased(address buyer, uint256 finalPrice, uint256 ticketsSoldCount);

    // Funkcija bilietui įsigyti
    function pirktiBilietus(uint256 _index) external payable {
        require(_index < VISI_BILIETAI && _index >= 0, "Neteisingas bilieto indeksas.");
        require(bilietai[_index].kieno == address(0x0), "Bilietas jau parduotas.");
        
        uint256 finalPrice = bilietai[_index].kaina;

        // Taikoma ankstyvo pirkimo nuolaida, jei parduota mažiau nei 3 bilietai
        if (ticketsSold < 3) {
            finalPrice = 5e17; // 50% nuolaida nuo pradinės kainos (0.5 ETH)
        }

        require(msg.value >= finalPrice, "Nepakanka lesu bilietui isigyti.");

        bilietai[_index].kieno = msg.sender; // Nustatomas bilieto savininkas
        bilietai[_index].moketaKaina = finalPrice; // Išsaugoma pirkėjo sumokėta kaina

        // Didinamas parduotų bilietų skaičius
        ticketsSold++;

        // Sukuriamas įvykis pirkimo užfiksavimui
        emit TicketPurchased(msg.sender, finalPrice, ticketsSold);

        // Grąžinami pertekliniai mokėjimai (jei vartotojas sumokėjo daugiau nei reikėjo)
        if (msg.value > finalPrice) {
            payable(msg.sender).transfer(msg.value - finalPrice);
        }
    }

    // Funkcija bilietui grąžinti (prieš renginio pradžią)
    function grazintiBilietas(uint256 _index) external {
        require(_index < VISI_BILIETAI, "Neteisingas bilieto indeksas.");
        require(bilietai[_index].kieno == msg.sender, "Jus nesate sio bilieto savininkas.");
        
        uint256 refundAmount = bilietai[_index].moketaKaina; // Grąžinama pirkėjo sumokėta suma

        // Bilietas vėl tampa laisvas
        bilietai[_index].kieno = address(0x0);
        bilietai[_index].moketaKaina = 0; // Nustatoma sumokėta kaina į 0
        payable(msg.sender).transfer(refundAmount); // Lėšų grąžinimas pirkėjui
    }
}

```
</details>

Tam, kad paleisti viską veikti į terminalą reikia suvesti: <br>
```
truffle compile
```
```
truffle migrate
```
![image](https://github.com/user-attachments/assets/1819d5fc-c429-43eb-9645-daac32bffe5e)
![image](https://github.com/user-attachments/assets/06ae9b8d-7fbc-4690-975b-af3d3c4bef1e)
<br>
Tada sukūriau aplankalą ```klientai``` Front-End'ui ir į terminalą suvedžiau ```npm init -f```. Ši komanda inicijuoja Node.js projektą, sukurdama package.json failą, jei jo dar nėra. Tai yra svarbus žingsnis, kuriant bet kokią Node.js arba frontend programą, nes package.json failas saugo visą svarbią informaciją apie projektą ir jo priklausomybes. Tada terminale paleidau ```npm install --save-dev parcel``` komandą, kuri įdiegia Parcel ir leidžia naudoti ```Web3``` biblioteką. Tuoment susikūriau index.js, index.html, stilius.css. ```npm run start``` vykdo skriptą, apibrėžtą package.json faile, kuris paleidžia svetainę.
![image](https://github.com/user-attachments/assets/3e91b966-24a4-4f49-9b6a-e98e960dc777)<br>
<br>
Paspaudus ant norimo bilieto, parodoma informacija apie renginį ir mygtukas, kurį paspaudus galima nusipirti bilietą.
<br>
![image](https://github.com/user-attachments/assets/dba0f810-c79d-4332-875b-15f1e9e298f9)<br>
<br>
Jau nusipirktus bilietus galima pažiūrėti paspaudus ant ```Mano bilietai```. Taip pat jau nusipirktą bilietą galima grąžinti, jei renginys dar neįvykęs.<br>
![image](https://github.com/user-attachments/assets/4d93e33a-f491-43cc-b028-abcf8c40b427)<br>

<br>

## 3. Išmaniosios sutarties testavimas 
#### Ethereum lokaliame tinkle

Testo faile ```testukas.js``` yra naudojama Truffle testavimo aplinka, skirta tikrinti Solidity išmaniąją sutartį ```Bilietai```. Šio failo paskirtis – užtikrinti, kad išmanioji sutartis veikia pagal numatytą logiką, kaip apibrėžta jos kode.<br><br>
Bilieto informacijos pradinė būsena:
* Ar bilieto savininkas pradžioje yra „0x0“ (t. y., niekas nėra bilieto savininkas).
* Ar bilieto kaina ir kita informacija atitinka numatytą pradinę būseną.

Bilieto pirkimo logika:
* Ar pirkėjas gali nupirkti bilietą, jei pateikiami tinkami parametrai.
* Ar sistema priima tiksliai reikalingą sumą (ETH), skirtą bilieto kainai padengti.

Bilieto savininko pakeitimas po pirkimo:
* Ar bilieto savininko adresas (laukas kieno) buvo sėkmingai atnaujintas į pirkėjo adresą.

Bilieto kaina nepasikeitė:
* Ar bilieto savybės (pvz., kaina) nepasikeičia be pagrindo.

Sandorio sėkmė naudojant konkretų adresą:
* Ar galima naudoti skirtingus sąskaitų adresus iš „Ganache“ ir atlikti sėkmingus sandorius.
* Ar pirkimas nepavyksta, jei pirkėjas neturi pakankamai lėšų.
<br><br>
Tam, kad paleisti testavimą į terminalą reikia suvesti: ```truffle test test/testukas.js```.
<br>
<details>
<summary>testukas.js</summary>
<br>
  
```
const Bilietai = artifacts.require('Bilietai');
const assert = require('assert');

contract('Bilietai', (accounts) => {
  const savininkas = accounts[0]; // Sutarties savininkas
  const pirkejas = accounts[1];  // Pirkėjas
  const kitasPirkejas = accounts[2]; // Kitas pirkėjas
  const Bilieto_ID = 0; // Bilieto ID
  const Kitas_Bilieto_ID = 1; // Kitas bilieto ID

  let instance;

  // Prieš pradedant testus, inicijuojama išmanioji sutartis
  before(async () => {
    instance = await Bilietai.deployed();
  });

  // Tikrinama, ar sutarties savininkas buvo nustatytas tinkamai
  it('Savininkas yra nustatytas tinkamai', async () => {
    const sutartiesSavininkas = await instance.owner();
    assert.equal(sutartiesSavininkas, savininkas, 'Savininkas turi būti priskirtas tinkamai');
  });

  // Tikrinama, ar galima pirkti bilietą su tinkama suma
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

  // Tikrinama, ar negalima pirkti jau parduoto bilieto
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

  // Tikrinama, ar galima grąžinti bilietą ir atlaisvinti jį
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

  // Tikrinama, ar atlaisvintą bilietą galima vėl nusipirkti
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

  // Tikrinama, ar tinkamai taikoma ankstyvo pirkimo nuolaida
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

  // Tikrinama, ar negalima pirkti bilieto už mažesnę sumą nei reikalinga
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

  // Tikrinama pradinė bilieto būsena
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

  // Tikrinama, ar negalima grąžinti bilieto, kuris nepriklauso vartotojui
  it('Neleidžia grąžinti bilieto, kuris nepriklauso vartotojui', async () => {
    try {
      await instance.grazintiBilietas(Bilieto_ID, { from: pirkejas });
      assert.fail('Tikimasi, kad nepavyks grąžinti bilieto, kuris nepriklauso vartotojui');
    } catch (error) {
      assert(error.message.includes('Jus nesate sio bilieto savininkas'), 'Gautas netinkamas klaidos pranešimas');
    }
  });
});

```
</details>

![image](https://github.com/user-attachments/assets/0b4b5337-2e0d-4f0d-ab07-b8bb8347bb26)

<br><br>
#### Ethereum testiniame tinkle
Testavimas Ethereum testiniame tinkle nepavyko, nes Goerli nebepalaiko, o bandant su Sepolia reikia jau turėti ETH jei norima jų gauti daugiau, tad reikėtų juos pirkti.<br>
![image](https://github.com/user-attachments/assets/3421c645-d4b2-4291-b1ec-8c222c03db30)<br>
![image](https://github.com/user-attachments/assets/e25a86c1-d9a1-4623-889e-1258b63250f8)
![image](https://github.com/user-attachments/assets/10fe7afb-8583-4624-bd4b-ac91c2f43428)




