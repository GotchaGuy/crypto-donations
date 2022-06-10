import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";

export const shouldMintNFTs = (): void => {

  context(`Minting NFTs for campaign contributors`, async function () {
    // timeGoal is 1 week from now = current time in seconds + one week in seconds(604800s)
    const oneWeek = 604800;
    // const blockNumBefore = await ethers.provider.getBlockNumber();
    // const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    // const currentTime = blockBefore.timestamp;
    const currentTime = Math.round(new Date().getTime() / 1000);
    const timeGoal = currentTime + oneWeek;
    const moneyRaisedGoal = 5000;
    const title: string = "May Charity Campaign";
    const description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ligula felis, tristique at sollicitudin et, tempus non enim. Vivamus tincidunt pharetra lectus nec ornare. Curabitur mauris ex, mattis vel enim quis, venenatis tempor dolor. Duis efficitur quam ut enim gravida vestibulum. Aliquam ullamcorper, libero non accumsan ornare, justo nisi semper mauris, non tempor diam risus non neque. Cras et aliquam sapien. Curabitur non purus bibendum, auctor elit a, ultricies magna. Duis nec nisi vehicula augue blandit suscipit vitae in ante. Aliquam aliquet elit dolor, mattis bibendum quam laoreet vitae. Mauris pharetra elit et consectetur accumsan";



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
