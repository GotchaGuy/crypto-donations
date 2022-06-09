import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { artifacts, waffle } from "hardhat";
import { Artifact } from "hardhat/types";
import GiftNFT from "../../artifacts/contracts/DNPT.sol/DNPT.json";
import CryptoDonations from "../../artifacts/contracts/CryptoDonations.sol/CryptoDonations.json"

export async function deployMockGiftNFT(deployer: Signer): Promise<MockContract> {
  const giftnft: MockContract = await waffle.deployMockContract(deployer, GiftNFT.abi);

  // await erc721.mock.name.returns(`Donypto Tokens`);
  // await erc721.mock.symbol.returns(`DNPT`);
  // await erc721.mock._safeMint.returns(true);
  // await giftnft.mock.mintToken.returns(true);


  return giftnft;
}
// mockCryptoDonations

export async function deployMockCryptoDonations(deployer: Signer): Promise<MockContract> {
  const cryptoDonations: MockContract = await waffle.deployMockContract(deployer, CryptoDonations.abi);


  return cryptoDonations;
}