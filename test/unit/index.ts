import { waffle } from "hardhat";
import { unitCryptoDonationsFixture, unitDNPTFixture } from "../shared/fixtures";
import { Mocks, Signers } from "../shared/types";

import { shouldDeployCD } from "./CryptoDonations/CryptoDonationsShouldBeDeployed.spec"; 
import { shouldCreateCampaign } from "./CryptoDonations/CryptoDonationsShouldCreateCampaign.spec"; 
import { shouldChangeCampaign } from "./CryptoDonations/CryptoDonationsShouldChangeCampaign.spec"; 
import { shouldSetGiftNFT } from "./CryptoDonations/CryptoDonationsShouldSetGiftNFT.spec";
import { shouldReceiveETH } from "./CryptoDonations/CryptoDonationsShouldReceiveETH.spec";
import { shouldWithdrawETH } from "./CryptoDonations/CryptoDonationsShouldWithdrawETH.spec";

import { shouldDeployDNPT } from "./DNPT/DNPTShouldBeDeployed.spec"; 
import { shouldMintNewNFTs } from "./DNPT/DNPTShouldMintNewNFTs.spec";
import { shouldChangeWhitelistedNFTAddress } from "./DNPT/DNPTShouldChangeWhitelistedNFTAddress.spec";

describe(`Unit tests`, async () => {
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

  describe(`CryptoDonations - main contract`, async () => {
    beforeEach(async function () {
      const { cryptoDonations, mockGiftNFT } = await this.loadFixture(unitCryptoDonationsFixture);

      this.cryptoDonations = cryptoDonations;
      this.mocks = {} as Mocks;
      this.mocks.mockGiftNFT = mockGiftNFT;
    });

    shouldDeployCD();
    shouldCreateCampaign();
    shouldChangeCampaign();
    shouldSetGiftNFT();
    shouldReceiveETH();
    shouldWithdrawETH();

  });

  describe(`DNPT - Gift NFT Contract`, async () => {
    beforeEach(async function () {
      const { dnpt, mockCryptoDonations } = await this.loadFixture(unitDNPTFixture);

      this.dnpt = dnpt;

      this.mocks = {} as Mocks;
      this.mocks.mockCryptoDonations = mockCryptoDonations;
    });

    shouldDeployDNPT();
    shouldChangeWhitelistedNFTAddress();
    shouldMintNewNFTs();
  });
});
