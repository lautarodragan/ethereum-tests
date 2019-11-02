pragma solidity ^0.5.0;

contract PoetRegistry {
  address public _owner;
  CID[] public cids;

  struct CID {
    string cid;
  }

  constructor() public {
    _owner = msg.sender;
  }

  function addCid(string memory cid) public {
    cids.push(CID(cid));
  }

  function getCidCount() public view returns (uint) {
    return cids.length;
  }

}
