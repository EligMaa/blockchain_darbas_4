import Web3 from 'web3';
import configuration from '../build/contracts/Bilietai.json';
import 'bootstrap/dist/css/bootstrap.css';
// Vaizdų keliai kiekvienai kategorijai
import conc from './conc.jpg';
import spor from './spor.jpg';
import teatr from './teatr.jpg';

const bilietuPav = {
  koncerto: conc,
  sporto: spor,
  teatro: teatr,
};

// Funkcija, kuri sukuria elementą iš HTML eilutės
const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};

const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(window.ethereum || 'http://127.0.0.1:7545');
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
console.log(contract.methods);

let account;

const accountEl = document.getElementById('account');
const bilietoEl = document.getElementById('bilietai');
const VISI_BILIETAI = 10; // Nustatykite bendrą bilietų skaičių, pavyzdžiui, 10
const tusciasAdresas = '0x0000000000000000000000000000000000000000';

let allTickets = []; // Saugo visus bilietus

// Funkcija bilietų pirkimui
const pirktiBilietus = async (bilietas) => {
  try {
    await contract.methods.pirktiBilietus(bilietas.id).send({ from: account, value: bilietas.kaina });
    await atnaujintiBilieta(); // Atnaujina bilietų sąrašą po pirkimo
  } catch (error) {
    console.error('Klaida perkant bilietą:', error);
  }
};

// Funkcija, kuri rodo renginio detales modale
const showEventDetails = (bilietas) => {
  const modalTitleEl = document.getElementById('eventModalTitle');
  const modalBodyEl = document.getElementById('eventModalBody');
  const buyTicketBtn = document.getElementById('buyTicketBtn');

  // Nustato modalų turinį su papildoma informacija (data, vieta)
  modalTitleEl.innerText = `${bilietas.kategorija} bilietas`;
  modalBodyEl.innerHTML = `
    <p><strong>Kategorija:</strong> ${bilietas.kategorija}</p>
    <p><strong>Kaina:</strong> ${Number(bilietas.kaina) / 1e18} ETH</p>
    <p><strong>Data:</strong> ${bilietas.data}</p>
    <p><strong>Vieta:</strong> ${bilietas.vieta}</p>
    <p><strong>Statusas:</strong> ${bilietas.kieno === tusciasAdresas ? 'Galimas' : 'Parduotas'}</p>
  `;

  // Nustato pirkimo mygtuko veiksmą
  buyTicketBtn.onclick = () => pirktiBilietus(bilietas);

  // Parodo modalą
  const modal = new bootstrap.Modal(document.getElementById('eventModal'));
  modal.show();
};

// Funkcija, kuri renderuoja bilietus puslapyje
const renderTickets = (tickets) => {
  bilietoEl.innerHTML = ''; // Išvalo ankstesnius bilietus
  tickets
    .filter((bilietas) => bilietas.kieno === tusciasAdresas) // Išfiltruoja tik laisvus bilietus
    .forEach((bilietas) => {
      const bilietoCardEl = createElementFromString(
        `<div class="bilietas card" style="width: 18rem; cursor: pointer;">
          <img src="${bilietuPav[bilietas.kategorija]}" class="card-img-top" alt="${bilietas.kategorija} image">
          <div class="card-body">
            <h5 class="card-title">${bilietas.kategorija} bilietas</h5>
            <p class="card-text">${Number(bilietas.kaina) / 1e18} ETH</p>
          </div>
        </div>`
      );
      bilietoCardEl.onclick = () => showEventDetails(bilietas); // Parodo renginio detales paspaudus
      bilietoEl.appendChild(bilietoCardEl);
    });
};


// Funkcija atnaujinti bilietų sąrašą (gaunama iš išmaniojo kontrakto)
const atnaujintiBilieta = async () => {
  allTickets = []; // Išvalo ankstesnius bilietus
  for (let i = 0; i < VISI_BILIETAI; i++) {
    const bilietas = await contract.methods.bilietai(i).call();
    bilietas.id = i;
    bilietas.kategorija = getBilietoKategorija(i); // Paskiria kategoriją bilietui

    const additionalInfo = getBilietoInfo(i);
    bilietas.data = additionalInfo.data;
    bilietas.vieta = additionalInfo.vieta;

    bilietas.kieno = bilietas.kieno; // Bilieto savininkas
    bilietas.kaina = bilietas.kaina; // Bilieto kaina

    allTickets.push(bilietas); // Prideda bilietą į sąrašą
  }
  renderTickets(allTickets); // Renderuoja visus bilietus pradžioje
};

// Funkcija gauti bilieto kategoriją pagal ID
const getBilietoKategorija = (id) => {
  if (id % 3 === 0) return 'koncerto'; 
  if (id % 3 === 1) return 'sporto'; 
  return 'teatro'; 
};

// Funkcija gauti papildomą informaciją apie bilietą pagal ID
const getBilietoInfo = (id) => {
  if (id % 3 === 0) {
    return { data: '2024-12-15', vieta: 'Compensa salė' }; // Koncerto bilieto informacija
  }
  if (id % 3 === 1) {
    return { data: '2025-01-20', vieta: 'Žalgirio arena' }; // Sporto bilieto informacija
  }
  return { data: '2025-01-05', vieta: 'Keistuolių teatras' }; // Teatro bilieto informacija
};

// MetaMask prisijungimo logika
const connectMetaMask = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];

    const balanceInWei = await web3.eth.getBalance(account);
    const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');

    accountEl.innerText = `Prijungta paskyra: ${account} (Balansas: ${balanceInEth} ETH)`;
    console.log('MetaMask prijungta', account);
    console.log('Balansas:', balanceInEth, 'ETH');

    await atnaujintiBilieta(); // Gauna ir rodo bilietus po prisijungimo
  } catch (error) {
    console.error('MetaMask prijungimas nepavyko:', error);
  }
};

if (window.ethereum) {
  window.ethereum.on('accountsChanged', function (accounts) {
    account = accounts[0];
    accountEl.innerText = `Prijungta paskyra: ${account}`;
  });
}

// Funkcija filtruoti bilietus pagal kategoriją
const filterTickets = (category) => {
  const filteredTickets = allTickets.filter((ticket) => ticket.kategorija === category);
  renderTickets(filteredTickets);
};

document.getElementById('allTicketsBtn').onclick = () => renderTickets(allTickets);
document.getElementById('koncertoBtn').onclick = () => filterTickets('koncerto');
document.getElementById('sportoBtn').onclick = () => filterTickets('sporto');
document.getElementById('teatroBtn').onclick = () => filterTickets('teatro');

// Funkcija perjungti filtravimo mygtukų matomumą
const toggleFilterButtons = (show) => {
  const filterButtons = document.getElementById('filterButtons');
  filterButtons.style.display = show ? 'block' : 'none';
};

// Rodo visus bilietus ir filtravimo mygtukus
document.getElementById('allTicketsNavbarBtn').onclick = () => {
  toggleFilterButtons(true); // Rodo filtravimo mygtukus
  renderTickets(allTickets); // Rodo visus bilietus

  const titleEl = document.querySelector('h2'); // Jei pavadinimas yra h2 elementas
  if (titleEl) {
    titleEl.textContent = 'Bilietų Pardavimas';
  }
};

// Rodyti tik įsigytus bilietus ir paslėpti filtravimo mygtukus
document.getElementById('purchasedTicketsNavbarBtn').onclick = () => {
  toggleFilterButtons(false); // Paslėpti filtravimo mygtukus

  const purchasedTickets = allTickets.filter(
    (ticket) => ticket.kieno.toLowerCase() === account.toLowerCase()
  );
  
  // Renderuoti įsigytus bilietus
  renderPurchasedTickets(purchasedTickets);
  
  // Atnaujinti pavadinimą iš "Bilietų Pirkimas" į "Jūsų Bilietai"
  const titleEl = document.querySelector('h2'); // Tikėtina, kad pavadinimas yra h2 elementas
  if (titleEl) {
    titleEl.textContent = 'Jūsų Bilietai';
  }
};

// Inicializuoti filtravimo mygtukų matomumą
toggleFilterButtons(true); // Rodyti pagal nutylėjimą


// Funkcija renderuoti įsigytus bilietus
const renderPurchasedTickets = (tickets) => {
  bilietoEl.innerHTML = ''; // Išvalyti ankstesnius bilietus

  if (tickets.length === 0) {
    bilietoEl.innerHTML = '<p>Jūs neturite įsigytų bilietų.</p>'; // Pranešimas, jei nėra įsigytų bilietų
  } else {
    tickets.forEach((bilietas) => {
      const bilietoCardEl = createElementFromString(
        `<div class="bilietas card" style="width: 18rem;">
          <img src="${bilietuPav[bilietas.kategorija]}" class="card-img-top" alt="${bilietas.kategorija} image">
          <div class="card-body">
            <h5 class="card-title">${bilietas.kategorija} bilietas</h5>
            <p class="card-text">Data: ${bilietas.data}</p>
            <p class="card-text">Vieta: ${bilietas.vieta}</p>
            <p class="card-text">Kaina: ${Number(bilietas.kaina) / 1e18} ETH</p>
            <button class="btn btn-danger refund-button">Grąžinti Bilietą</button>
          </div>
        </div>`
      );

      const refundButton = bilietoCardEl.querySelector('.refund-button');
      refundButton.onclick = async () => {
        try {
          // Iškviečiame išmaniojo kontrakto funkciją bilieto grąžinimui
          await contract.methods.grazintiBilietas(bilietas.id).send({ from: account });
          alert('Bilietas buvo sėkmingai grąžintas!'); // Rodyti sėkmės pranešimą
          await atnaujintiBilieta(); // Atnaujinti bilietų sąrašą po grąžinimo
        } catch (error) {
          console.error('Klaida grąžinant bilietą:', error);
          alert('Bilieto grąžinimas nepavyko.'); // Rodyti klaidos pranešimą
        }
      };

      bilietoEl.appendChild(bilietoCardEl);
    });
  }
};

// Tikriname, kuris puslapis yra atidarytas ir pritaikome aktyvią būseną mygtukams
document.addEventListener("DOMContentLoaded", () => {
  // Gauti dabartinį URL kelią
  const currentPath = window.location.pathname;

  // Pasirenkame mygtukus
  const bilietaiBtn = document.getElementById("allTicketsNavbarBtn");
  const manoBilietaiBtn = document.getElementById("purchasedTicketsNavbarBtn");

  // Pašaliname aktyvią būseną iš abiejų mygtukų
  bilietaiBtn.classList.remove("active-btn");
  manoBilietaiBtn.classList.remove("active-btn");

  // Taikome aktyvią būseną pagal dabartinį kelią
  if (currentPath.includes("bilietai")) {
    bilietaiBtn.classList.add("active-btn");
  } else if (currentPath.includes("mano-bilietai")) {
    manoBilietaiBtn.classList.add("active-btn");
  }
});

// Kai puslapis yra užkrautas, bandome prisijungti prie MetaMask
window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask instaliuota!');
    connectMetaMask(); // Prisijungti puslapio užkrovimo metu
  } else {
    console.log('Prašome įdiegti MetaMask!');
  }
});

