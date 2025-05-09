// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract SoulboundToken is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    mapping(address => uint256) public addressToTokenId;

    constructor() ERC721("SocialFi SBT", "SBT") {
        _tokenIdCounter = 1;
    }

    /// @notice Mint a new SBT or update the metadata if already minted
    /// @param tokenURI The metadata URI (IPFS)
    function mintOrUpdate(string memory tokenURI) external {
        uint256 tokenId = addressToTokenId[msg.sender];
        if (tokenId == 0) {
            // Mint new SBT
            tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            _safeMint(msg.sender, tokenId);
            addressToTokenId[msg.sender] = tokenId;
        }
        // Set or update tokenURI
        _setTokenURI(tokenId, tokenURI);
    }

    // --- Soulbound: Block all transfers ---
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        require(from == address(0) || to == address(0), "SBT: non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function approve(address to, uint256 tokenId) public override(ERC721, IERC721) {
        revert("SBT: non-transferable");
    }

    function setApprovalForAll(address operator, bool approved) public override(ERC721, IERC721) {
        revert("SBT: non-transferable");
    }

    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        revert("SBT: non-transferable");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        revert("SBT: non-transferable");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override(ERC721, IERC721) {
        revert("SBT: non-transferable");
    }
} 