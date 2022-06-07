// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
// import "https://github.com/0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";
// import "https://github.com/0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

string constant name = "Donypto";
string constant symbol = "DNPT";
// string constant uri = "https://ipfs.io/ipfs/QmbN8UPLMXPqmroWXKXcp8PzZC161dcrf14jkNfCFJ2dkm?filename=nft.json";

contract newDNPT is Ownable, ERC721(name, symbol) {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    // string _uri;

    struct tokenMetaData{
        uint tokenId;
        uint timeStamp;
        string tokenURI;
    }

    mapping(address=>tokenMetaData[]) public ownershipRecord;

    // constructor(uri){
    //     _uri = uri;
    // }

    error AdminIsRecipient();

    function mintToken(address recipient) onlyOwner public {
        if(owner() == recipient) {
            revert AdminIsRecipient();
        }

        uint256 tokenId = _tokenId.current();

        _safeMint(recipient, tokenId);
        ownershipRecord[recipient].push(tokenMetaData(tokenId, block.timestamp, "https://ipfs.io/ipfs/QmbN8UPLMXPqmroWXKXcp8PzZC161dcrf14jkNfCFJ2dkm?filename=nft.json" ));
        _tokenId.increment();

}


}