import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { artifacts, waffle } from "hardhat";
import { Artifact } from "hardhat/types";
import GiftNFT from "../../artifacts/contracts/DNPT.sol/DNPT.json";
import CryptoDonations from "../../artifacts/contracts/CryptoDonations.sol/CryptoDonations.json"

export async function deployMockGiftNFT(deployer: Signer): Promise<MockContract> {
  const giftnft: MockContract = await waffle.deployMockContract(deployer, GiftNFT.abi);

  await giftnft.mock.name.returns(`Donypto Tokens`);
  await giftnft.mock.symbol.returns(`DNPT`);
  await giftnft.mock.mintToken.returns(true);

  return giftnft;
}

export async function deployMockCryptoDonations(deployer: Signer): Promise<MockContract> {
  const cryptoDonations: MockContract = await waffle.deployMockContract(deployer, CryptoDonations.abi);

  return cryptoDonations;
}