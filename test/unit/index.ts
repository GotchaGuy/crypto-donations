import { waffle } from "hardhat";
import { unitCryptoDonationsFixture, unitDNPTFixture } from "../shared/fixtures";
import { Mocks, Signers } from "../shared/types";

import { shouldDeployCD } from "./CryptoDonations/CryptoDonationsShouldBeDeployed"; 

import { shouldDeployDNPT } from "./DNPT/DNPTShouldBeDeployed"; 

describe(`Unit tests`, async () => {
  before(async function () {
    const wallets = waffle.provider.getWallets();
    const provider = waffle;

    this.signers = {} as Signers;
    this.signers.deployer = wallets[0];
    this.signers.alice = wallets[1];
    this.signers.bob = wallets[2];

    this.loadFixture = waffle.createFixtureLoader(wallets);
  });

  describe(`CryptoDonations - main contract`, async () => {
    beforeEach(async function () {
      const { cryptoDonations, mockGiftNFT } = await this.loadFixture(unitCryptoDonationsFixture);

      this.cryptoDonations = cryptoDonations;

      this.mocks = {} as Mocks;
      this.mocks.mockGiftNFT = mockGiftNFT;
    });

    shouldDeployCD();
  });

  describe(`DNPT - Gift NFT Contract`, async () => {
    beforeEach(async function () {
      const { dnpt } = await this.loadFixture(unitDNPTFixture);

      this.dnpt = dnpt;

      // this.mocks = {} as Mocks;
      // this.mocks.mockCryptoDonations = mockCryptoDonations;
    });

    shouldDeployDNPT();
  });
});
