import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { artifacts, waffle } from "hardhat";
import { Artifact } from "hardhat/types";
import ERC721_ABI from "../../abis/erc721.abi.json";


export async function deployMockGiftNFT(deployer: Signer): Promise<MockContract> {
  const erc721: MockContract = await waffle.deployMockContract(deployer, ERC721_ABI);

//   await erc721.mock.name.returns(`Donypto Tokens`);
//   await erc721.mock.symbol.returns(`DNPT`);

  return erc721;
}
