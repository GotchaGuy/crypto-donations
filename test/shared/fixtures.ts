// import { Fixture, MockContract } from "ethereum-waffle";
// import { ContractFactory, Wallet } from "ethers";
// import { ethers } from "hardhat";
// import { CryptoDonations } from "../../typechain";
// import { NewDNPT } from "../../typechain";
// // import { deployMockUsdc } from "./mocks";


// type UnitCryptoDonationsFixtureType = {
//   cryptoDonations: CryptoDonations;
//   mockUsdc: MockContract;
// };

// export const unitCryptoDonationsFixture: Fixture<UnitCryptoDonationsFixtureType> = async (signers: Wallet[]) => {
//   const deployer: Wallet = signers[0];

//   const cryptoDonations: ContractFactory = await ethers.getContractFactory(`CryptoDonations`);

//   const cryptoDonations: CryptoDonations = (await cryptoDonationsFactory.connect(deployer).deploy(RECEIVER_LIMIT)) as CryptoDonations;

//   await cryptoDonations.deployed();

// //   const mockUsdc = await deployMockUsdc(deployer);

//   return { cryptoDonations };
// //   return { cryptoDonations, mockUsdc };

// };
