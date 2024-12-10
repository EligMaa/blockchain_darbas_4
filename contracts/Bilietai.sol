// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

uint256 constant VISI_BILIETAI = 20;

contract Bilietai {
  address public kieno = msg.sender;

  struct Bilietas {
    uint256 kaina;
    address kieno;
  }

  Bilietas[VISI_BILIETAI] public bilietai;

  constructor() {
    for (uint256 i = 0; i < VISI_BILIETAI; i++) {
      bilietai[i].kaina = 1e17; // 0.1 ETH
      bilietai[i].kieno = address(0x0);
    }
  }

  function pirktiBilietus(uint256 _index) external payable {
    require(_index < VISI_BILIETAI && _index >= 0);
    require(bilietai[_index].kieno == address(0x0));
    require(msg.value >= bilietai[_index].kaina);
    bilietai[_index].kieno = msg.sender;
  }
}