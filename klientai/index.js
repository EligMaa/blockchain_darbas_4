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
  teatro: teatr 
}


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
const VISI_BILIETAI = 20;  // Assuming you have 20 tickets
const tusciasAdresas = '0x0000000000000000000000000000000000000000';

let allTickets = [];  // Store all tickets here

// Function to handle purchasing tickets
const pirktiBilietus = async (bilietas) => {
  await contract.methods.pirktiBilietus(bilietas.id).send({ from: account, value: bilietas.kaina });
};

// Function to render tickets on the page
const renderTickets = (tickets) => {
  bilietoEl.innerHTML = '';  // Clear previous tickets
  tickets.forEach(bilietas => {
    if (bilietas.kieno === tusciasAdresas) {  // Check if the ticket is available
      const bilietoCardEl = createElementFromString(
        `<div class="bilietas card" style="width: 18rem;">
          <img src="${bilietuPav[bilietas.kategorija]}" class="card-img-top" alt="${bilietas.kategorija} image">
          <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
            <h5 class="card-title">${bilietas.kategorija} bilietas</h5>
            <p class="card-text">${Number(bilietas.kaina) / 1e18} Eth</p>
            <button class="btn btn-primary" style="margin-top: auto;">Pirkti bilietą</button>
          </div>
        </div>`
      );
      bilietoCardEl.onclick = pirktiBilietus.bind(null, bilietas);
      bilietoEl.appendChild(bilietoCardEl);
    }
  });
};

// Function to update the ticket list (fetching from the smart contract)
const atnaujintiBilieta = async () => {
  allTickets = [];  // Clear previous tickets
  for (let i = 0; i < VISI_BILIETAI; i++) {
    const bilietas = await contract.methods.bilietai(i).call();
    bilietas.id = i;
    bilietas.kategorija = getBilietoKategorija(i);  // Assign category to the ticket
    allTickets.push(bilietas);  // Store all tickets in the array
  }
  renderTickets(allTickets);  // Render all tickets initially
};

// Function to get the category of a ticket based on its ID
const getBilietoKategorija = (id) => {
  if (id % 3 === 0) return 'koncerto';   // Every 3rd ticket is a concert ticket
  if (id % 3 === 1) return 'sporto';     // Every 3rd ticket + 1 is a sporto ticket
  return 'teatro';                      // The rest are teatro tickets
};

// MetaMask connection logic
const connectMetaMask = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];
    
    // Fetch the balance of the connected account
    const balanceInWei = await web3.eth.getBalance(account);
    const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether'); // Convert Wei to Ether
    
    // Update the DOM with the account and balance
    accountEl.innerText = `Prijungta paskyra: ${account} (Balansas: ${balanceInEth} ETH)`;
    console.log("MetaMask prijungta", account);
    console.log("Balansas:", balanceInEth, "ETH");

    await atnaujintiBilieta();  // Fetch and display tickets after connecting
  } catch (error) {
    console.error("MetaMask prijungimas nepavyko:", error);
  }
};


// Listen for account changes in MetaMask
if (window.ethereum) {
  window.ethereum.on('accountsChanged', function (accounts) {
    account = accounts[0];
    accountEl.innerText = `Prijungta paskyra: ${account}`;
  });
}

// Filter tickets by category
const filterTickets = (category) => {
  const filteredTickets = allTickets.filter(ticket => ticket.kategorija === category);
  renderTickets(filteredTickets);  // Render only filtered tickets
};

// Event listeners for filter buttons
document.getElementById('allTicketsBtn').onclick = () => renderTickets(allTickets);
document.getElementById('koncertoBtn').onclick = () => filterTickets('koncerto');
document.getElementById('sportoBtn').onclick = () => filterTickets('sporto');
document.getElementById('teatroBtn').onclick = () => filterTickets('teatro');

// Main function to initialize the app
window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    console.log("MetaMask instaliuota!");
    connectMetaMask();  // Connect on page load
  } else {
    console.log("Please install MetaMask!");
  }
});
