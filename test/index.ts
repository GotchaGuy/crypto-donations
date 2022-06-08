import { waffle } from "hardhat";
// import { unitBizzSplitFixture } from "../shared/fixtures";
// import { Mocks, Signers } from "../shared/types";

// import { shouldDeploy } from "./CryptoDonations/CryptoDonationsShouldBeDeployed.spec";
// import { shouldCreateMerchant } from "./BizzSplit/BizzSplitShouldCreateMerchant";
// import { shouldChangeMerchant } from "./BizzSplit/BizzSplitShouldChangeMerchant";

// describe(`Unit tests`, async () => {
//   before(async function () {
//     const wallets = waffle.provider.getWallets();
//     const provider = waffle;

//     this.signers = {} as Signers;
//     this.signers.deployer = wallets[0];
//     this.signers.alice = wallets[1];
//     this.signers.bob = wallets[2];

//     this.loadFixture = waffle.createFixtureLoader(wallets);
//   });

//   describe(`CryptoDonations`, async () => {
//     beforeEach(async function () {
//       const { bizzSplit, mockUsdc } = await this.loadFixture(unitBizzSplitFixture);

//       this.bizzSplit = bizzSplit;

//       this.mocks = {} as Mocks;
//       this.mocks.mockUsdc = mockUsdc;
//     });

//     shouldDeploy();
//     shouldCreateMerchant();
//     shouldChangeMerchant();
//   });
// });
