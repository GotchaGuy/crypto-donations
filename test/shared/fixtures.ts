import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import { CryptoDonations } from "../../typechain";
import { DNPT } from "../../typechain";
import { deployMockGiftNFT } from "./mocks";


type UnitCryptoDonationsFixtureType = {
  cryptoDonations: CryptoDonations;
  mockGiftNFT: MockContract;
};

type UnitDNPTFixtureType = {
    dnpt: DNPT;
    // mockCryptoDonations: MockContract;
  };

export const unitCryptoDonationsFixture: Fixture<UnitCryptoDonationsFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const cryptoDonationsFactory: ContractFactory = await ethers.getContractFactory(`CryptoDonations`);

  const cryptoDonations: CryptoDonations = (await cryptoDonationsFactory.connect(deployer).deploy()) as CryptoDonations;

  await cryptoDonations.deployed();

  const mockGiftNFT = await deployMockGiftNFT(deployer);

  return { cryptoDonations, mockGiftNFT };
};

export const unitDNPTFixture: Fixture<UnitDNPTFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];
  
    const dnptFactory: ContractFactory = await ethers.getContractFactory(`DNPT`);
  
    const dnpt: DNPT = (await dnptFactory.connect(deployer).deploy()) as DNPT;
  
    await dnpt.deployed();
  
    // const mockCryptoDonations = await deployMockCryptoDonations(deployer);
  
    return { dnpt };
  };