pragma solidity ^0.5.0;

contract HelloWorld {
  address public _owner;
  uint256 public totalSupply;
  bytes32[] public things;

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

  function addThing(bytes32 thing) public {
    things.push(thing);
  }

  function getThings() public view returns (bytes32[] memory) {
    return things;
  }
}
