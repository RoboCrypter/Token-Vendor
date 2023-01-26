// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;


import "@openzeppelin/contracts/access/Ownable.sol";
import "./YourToken.sol";


/**
*@title Token Vendor.
*@author ABossOfMyself.
*@notice Created a Token Vendor smart contract.
*/


contract Vendor is Ownable {

  event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

  event SellTokens(address seller, uint256 amountOfTokens, uint256 amountOfETH);


  YourToken public yourToken;

  uint256 public constant tokensPerEth = 100;
  


  constructor(address tokenAddress) {
    
    yourToken = YourToken(tokenAddress);
  }



  function buyTokens() public payable {

    uint256 amountOfTokens = msg.value * tokensPerEth;

    yourToken.transfer(msg.sender, amountOfTokens);

    emit BuyTokens(msg.sender, msg.value, amountOfTokens);
  }



  function withdraw() public onlyOwner {

    (bool success, ) = msg.sender.call{value: address(this).balance}("");

    require(success, "Transfer failed!");
  }



  function sellTokens(uint256 amount) public {

    yourToken.approve(address(this), amount);

    yourToken.transferFrom(msg.sender, address(this), amount);

    uint256 ethToSend = amount / tokensPerEth;

    (bool success, ) = msg.sender.call{value: ethToSend}("");

    require(success, "Transfer failed!");

    emit SellTokens(msg.sender, amount, ethToSend);
  }
}