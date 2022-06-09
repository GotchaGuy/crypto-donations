import { waffle } from "hardhat";
import { integrationsFixture } from "../shared/fixtures";
import { Mocks, Signers } from "../shared/types";

import { shouldDeploy } from "./CryptoDonations/CryptoDonationsShouldBeDeployed";
import { shouldMintNFTs } from "./CryptoDonations/CryptoDonationsShouldMintNFTs";


describe(`Integration tests`, async () => {
  before(async function () {
    const wallets = waffle.provider.getWallets();
    const provider = waffle;

    this.signers = {} as Signers;
    this.signers.deployer = wallets[0];
    this.signers.alice = wallets[1];
    this.signers.bob = wallets[2];
    this.signers.garry = wallets[3];

    this.loadFixture = waffle.createFixtureLoader(wallets);
  });

  describe(`CryptoDonations and DNPT`, async () => {
    beforeEach(async function () {
      const { cryptoDonations, dnpt } = await this.loadFixture(integrationsFixture);

      this.cryptoDonations = cryptoDonations;
      this.dnpt = dnpt;

    });

    shouldDeploy();
    shouldMintNFTs();
    
  });
});
