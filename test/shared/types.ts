import { Fixture, MockContract } from "ethereum-waffle";
import { Wallet } from "@ethersproject/wallet";
import { CryptoDonations } from "../../typechain";
import { DNPT } from "../../typechain";
    
declare module "mocha" {
  export interface Context {
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    mocks: Mocks;
    cryptoDonations: CryptoDonations;
    dnpt: DNPT;
  }
}

export interface Signers {
  deployer: Wallet;
  alice: Wallet;
  bob: Wallet;
  garry: Wallet;
}

export interface Mocks {
  mockGiftNFT: MockContract;
}
