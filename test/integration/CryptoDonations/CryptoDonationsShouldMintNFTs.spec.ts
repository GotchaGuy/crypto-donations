import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { ethers } from "hardhat";

export const shouldMintNFTs = (): void => {

  context(`Minting NFTs for campaign contributors`, async function () {
    // timeGoal is 1 week from now = current time in seconds + one week in seconds(604800s)
    const oneWeek = 604800;
    let timeGoal: BigNumber;
    const moneyRaisedGoal = 5000;
    const title: string = "May Charity Campaign";
    const description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    before(async function(){
      const latestBlock = await ethers.provider.getBlock('latest');
      const currentTime = latestBlock.timestamp;
      timeGoal = BigNumber.from(currentTime + oneWeek);
    })
    
    it(`Contributor should receive NFT for first time donating to campaign`, async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      expect(await this.dnpt.balanceOf(this.signers.alice.address)).to.equal(constants.Zero);

      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      expect(await this.dnpt.ownerOf(constants.Zero)).to.equal(this.signers.alice.address);
      expect(await this.dnpt.balanceOf(this.signers.alice.address)).to.equal(constants.One);

      
    });

    it(`Contributor should not receive another NFT if contributor has already donated to campaign`, async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      expect(await this.dnpt.balanceOf(this.signers.alice.address)).to.equal(constants.Zero);

      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      expect(await this.dnpt.balanceOf(this.signers.alice.address)).to.equal(constants.One);

      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      expect(await this.dnpt.balanceOf(this.signers.alice.address)).to.equal(constants.One);

    });

    it("Gift NFT(DNPT) should emit event when contributor donates to campaign on CryptoDonations", async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      expect(await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      )).to.emit(this.dnpt, `MintedNFT`)
      .withArgs(constants.Zero, this.signers.alice);

    });

    it("CryptoDonations should emit minted false when contributor has already donated to campaign", async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      expect(await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      )).to.emit(this.cryptoDonations, `Contributor`)
      .withArgs(constants.Zero, 1000000000000000000, this.signers.alice, false);

    });

  });
};
