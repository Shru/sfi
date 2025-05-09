// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SoulboundToken is ERC721 {
    uint256 public counter;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        counter = 1;
    }

    function mint() external {
        _safeMint(msg.sender, counter);
        counter++;
    }

    // Override transfer functions to make the token non-transferable
    function transferFrom(address from, address to, uint256 tokenId) public pure override {
        revert("SBT: non-transferable");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public pure override {
        revert("SBT: non-transferable");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public pure override {
        revert("SBT: non-transferable");
    }

    function approve(address to, uint256 tokenId) public pure override {
        revert("SBT: non-transferable");
    }

    function setApprovalForAll(address operator, bool approved) public pure override {
        revert("SBT: non-transferable");
    }

    // Optional: override baseURI for metadata
    function _baseURI() internal view override returns (string memory) {
        return "https://your-metadata-base-uri/";
    }
} 