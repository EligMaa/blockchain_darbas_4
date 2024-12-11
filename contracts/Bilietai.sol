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
