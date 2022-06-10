import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import { CryptoDonations } from "../../typechain";
import { DNPT } from "../../typechain";
import { deployMockGiftNFT, deployMockCryptoDonations } from "./mocks";


type UnitCryptoDonationsFixtureType = {
  cryptoDonations: CryptoDonations;
  mockGiftNFT: MockContract;
};

type UnitDNPTFixtureType = {
    dnpt: DNPT;
    mockCryptoDonations: MockContract;
  };  

  type IntegrationFixtureType = {
    dnpt: DNPT;
    cryptoDonations: CryptoDonations;
  };  


export const unitCryptoDonationsFixture: Fixture<UnitCryptoDonationsFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const cryptoDonationsFactory: ContractFactory = await ethers.getContractFactory(`CryptoDonations`);

  const cryptoDonations: CryptoDonations = (await cryptoDonationsFactory.connect(deployer).deploy()) as CryptoDonations;

  await cryptoDonations.deployed();

  const mockGiftNFT = await deployMockGiftNFT(deployer);

  await cryptoDonations.setGiftNFTAddress(mockGiftNFT.address);

  return { cryptoDonations, mockGiftNFT };
};

export const unitDNPTFixture: Fixture<UnitDNPTFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];
    const WhitelistedNftcontract: Wallet = signers[3] // garry's Wallet address
  
    
    const dnptFactory: ContractFactory = await ethers.getContractFactory(`DNPT`);
    
    const mockCryptoDonations = await deployMockCryptoDonations(deployer);

    await mockCryptoDonations.deployed();

    const dnpt: DNPT = (await dnptFactory.connect(deployer).deploy(WhitelistedNftcontract.address)) as DNPT;
  
    await dnpt.deployed();
  
    return { dnpt, mockCryptoDonations };
  };


export const integrationsFixture: Fixture<IntegrationFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];
  
  const cryptoDonationsFactory: ContractFactory = await ethers.getContractFactory(`CryptoDonations`);

  const cryptoDonations: CryptoDonations = (await cryptoDonationsFactory.connect(deployer).deploy()) as CryptoDonations;

  await cryptoDonations.deployed();

  const dnptFactory: ContractFactory = await ethers.getContractFactory(`DNPT`);

  const dnpt: DNPT = (await dnptFactory.connect(deployer).deploy(cryptoDonations.address)) as DNPT;

  await dnpt.deployed();

  await cryptoDonations.setGiftNFTAddress(dnpt.address);

  return { cryptoDonations, dnpt };
};