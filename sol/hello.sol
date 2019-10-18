pragma solidity ^0.5.0;

contract HelloWorld {
  address public _owner;
  uint256 public totalSupply;

  constructor() public {
    _owner = msg.sender;
    totalSupply = 3141592653;
  }

  function helloWorld() external pure returns (string memory) {
    return "Hello, World!";
  }

  function world() public view returns (address) {
    return _owner;
  }

  function addSupply() public returns (uint) {
    totalSupply = totalSupply + 1;
    return totalSupply;
  }
}
