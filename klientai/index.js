import Web3 from 'web3';
import configuration from '../build/contracts/Bilietai.json';
import 'bootstrap/dist/css/bootstrap.css';
// Image paths for each category
import conc from './conc.jpg';
import spor from './spor.jpg';
import teatr from './teatr.jpg';

const bilietuPav = {
  koncerto: conc,
  sporto: spor,
  teatro: teatr,
};

const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};

const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(window.ethereum || 'http://127.0.0.1:7545');
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

let account;

const accountEl = document.getElementById('account');
const bilietoEl = document.getElementById('bilietai');
const VISI_BILIETAI = 10; // Assuming you have 20 tickets
const tusciasAdresas = '0x0000000000000000000000000000000000000000';

let allTickets = []; // Store all tickets here

// Function to handle purchasing tickets
const pirktiBilietus = async (bilietas) => {
  try {
    await contract.methods.pirktiBilietus(bilietas.id).send({ from: account, value: bilietas.kaina });
    await atnaujintiBilieta(); // Update ticket list after purchase
  } catch (error) {
    console.error('Error purchasing ticket:', error);
  }
};

// Function to show event details in a modal
const showEventDetails = (bilietas) => {
  const modalTitleEl = document.getElementById('eventModalTitle');
  const modalBodyEl = document.getElementById('eventModalBody');
  const buyTicketBtn = document.getElementById('buyTicketBtn');

  // Set modal content with additional information (date and location)
  modalTitleEl.innerText = `${bilietas.kategorija} bilietas`;
  modalBodyEl.innerHTML = `
    <p><strong>Kategorija:</strong> ${bilietas.kategorija}</p>
    <p><strong>Kaina:</strong> ${Number(bilietas.kaina) / 1e18} ETH</p>
    <p><strong>Data:</strong> ${bilietas.data}</p>
    <p><strong>Vieta:</strong> ${bilietas.vieta}</p>
    <p><strong>Statusas:</strong> ${bilietas.kieno === tusciasAdresas ? 'Galimas' : 'Parduotas'}</p>
  `;

  // Set purchase button action
  buyTicketBtn.onclick = () => pirktiBilietus(bilietas);

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('eventModal'));
  modal.show();
};

// Function to render tickets on the page
const renderTickets = (tickets) => {
  bilietoEl.innerHTML = ''; // Clear previous tickets
  tickets
    .filter((bilietas) => bilietas.kieno === tusciasAdresas) // Exclude sold tickets
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
      bilietoCardEl.onclick = () => showEventDetails(bilietas); // Show event details on click
      bilietoEl.appendChild(bilietoCardEl);
    });
};


// Function to update the ticket list (fetching from the smart contract)
const atnaujintiBilieta = async () => {
  allTickets = []; // Clear previous tickets
  for (let i = 0; i < VISI_BILIETAI; i++) {
    const bilietas = await contract.methods.bilietai(i).call();
    bilietas.id = i;
    bilietas.kategorija = getBilietoKategorija(i); // Assign category to the ticket

    const additionalInfo = getBilietoInfo(i);
    bilietas.data = additionalInfo.data;
    bilietas.vieta = additionalInfo.vieta;

    bilietas.kieno = bilietas.kieno; // Ticket owner
    bilietas.kaina = bilietas.kaina; // Ticket price

    allTickets.push(bilietas); // Store all tickets in the array
  }
  renderTickets(allTickets); // Render all tickets initially
};

// Function to get the category of a ticket based on its ID
const getBilietoKategorija = (id) => {
  if (id % 3 === 0) return 'koncerto'; 
  if (id % 3 === 1) return 'sporto'; 
  return 'teatro'; 
};

const getBilietoInfo = (id) => {
  if (id % 3 === 0) {
    return { data: '2024-12-15', vieta: 'Compensa salė' }; // Concert ticket info
  }
  if (id % 3 === 1) {
    return { data: '2025-01-20', vieta: 'Žalgirio arena' }; // Sport ticket info
  }
  return { data: '2025-01-05', vieta: 'Keistuolių teatras' }; // Theater ticket info
};

// MetaMask connection logic
const connectMetaMask = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];

    const balanceInWei = await web3.eth.getBalance(account);
    const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');

    accountEl.innerText = `Prijungta paskyra: ${account} (Balansas: ${balanceInEth} ETH)`;
    console.log('MetaMask prijungta', account);
    console.log('Balansas:', balanceInEth, 'ETH');

    await atnaujintiBilieta(); // Fetch and display tickets after connecting
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

// Filter tickets by category
const filterTickets = (category) => {
  const filteredTickets = allTickets.filter((ticket) => ticket.kategorija === category);
  renderTickets(filteredTickets);
};

document.getElementById('allTicketsBtn').onclick = () => renderTickets(allTickets);
document.getElementById('koncertoBtn').onclick = () => filterTickets('koncerto');
document.getElementById('sportoBtn').onclick = () => filterTickets('sporto');
document.getElementById('teatroBtn').onclick = () => filterTickets('teatro');

// Function to toggle filter button visibility
const toggleFilterButtons = (show) => {
  const filterButtons = document.getElementById('filterButtons');
  filterButtons.style.display = show ? 'block' : 'none';
};

// Show all tickets and filter buttons
document.getElementById('allTicketsNavbarBtn').onclick = () => {
  toggleFilterButtons(true); // Show filter buttons
  renderTickets(allTickets); // Show all tickets

  const titleEl = document.querySelector('h2'); // Assuming the title is an h2 element
  if (titleEl) {
    titleEl.textContent = 'Bilietų Pardavimas';
  }
};

// Show only purchased tickets and hide filter buttons
document.getElementById('purchasedTicketsNavbarBtn').onclick = () => {
  toggleFilterButtons(false); // Hide filter buttons

  const purchasedTickets = allTickets.filter(
    (ticket) => ticket.kieno.toLowerCase() === account.toLowerCase()
  );
  
  // Render the purchased tickets
  renderPurchasedTickets(purchasedTickets);
  
  // Update the title from "Bilietų Pirkimas" to "Jūsų Bilietai"
  const titleEl = document.querySelector('h2'); // Assuming the title is an h2 element
  if (titleEl) {
    titleEl.textContent = 'Jūsų Bilietai';
  }
};


// Initial filter buttons visibility
toggleFilterButtons(true); // Show by default


const renderPurchasedTickets = (tickets) => {
  bilietoEl.innerHTML = ''; // Clear previous tickets
  if (tickets.length === 0) {
    bilietoEl.innerHTML = '<p>Jūs neturite įsigytų bilietų.</p>'; // Message if no tickets bought
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
          </div>
        </div>`
      );
      bilietoEl.appendChild(bilietoCardEl);
    });
  }
};

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask instaliuota!');
    connectMetaMask(); // Connect on page load
  } else {
    console.log('Please install MetaMask!');
  }
});
