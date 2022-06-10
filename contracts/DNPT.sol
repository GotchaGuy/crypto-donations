// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

string constant name = "Donypto Tokens";
string constant symbol = "DNPT";
string constant uri = "https://ipfs.io/ipfs/QmbN8UPLMXPqmroWXKXcp8PzZC161dcrf14jkNfCFJ2dkm?filename=nft.json";

contract DNPT is Ownable, ERC721(name, symbol)
 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

/// @dev whitelisted NFT contract address
    address public whitelistedNftContract;

    struct tokenMetaData{
        uint tokenId;
        uint timeStamp;
        string tokenURI;
    }

    mapping(address=>tokenMetaData[]) public ownershipRecord;

    constructor(address _whitelistedNftContract){
        whitelistedNftContract = _whitelistedNftContract;
    }

    event MintedNFT(uint256 _tokenId, address _recipient);

    error AdminIsRecipient();
    error AddressNotWhitelisted();

    function changeWhitelistedNftContract(address _address) public onlyOwner {
        whitelistedNftContract = _address;
    }

    function mintToken(address recipient) public returns(bool minted){
        if(msg.sender != whitelistedNftContract){
            revert AddressNotWhitelisted();
        }
        if(msg.sender == recipient) {
            revert AdminIsRecipient();
        }

        uint256 tokenId = _tokenId.current();

        _safeMint(recipient, tokenId);
        ownershipRecord[recipient].push(tokenMetaData(tokenId, block.timestamp, uri ));

        emit MintedNFT(tokenId, recipient);

        _tokenId.increment();
        return true;
}


}