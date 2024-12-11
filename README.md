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
* Grąžinimo sistema leidžia vartotojams jaustis saugiai dėl savo investicijų, o platforma efektyviai valdo grąžinimus.
* Skaidrus decentralizavimas suteikia didesnį pasitikėjimą tiek bilietų pirkėjams, tiek platformai.
## 2. Išmanioji sutartis Solidyti kalba
Atidarius komandinę eilutę reikia sukurti aplankalą, kuriame bus talpinami visi reikalingi išmaniosios sutarties failai.<br>
```mkdir laboras```<br>
```cd laboras```<br>
```truffle init```<br>


