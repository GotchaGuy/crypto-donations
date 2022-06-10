import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";

export const shouldCreateCampaign = (): void => {

  context(`Campaign creation`, async function () {
    // timeGoal is 1 week from now = current time in seconds + one week in seconds(604800s)
    const oneWeek = 604800;
    // const blockNumBefore = await ethers.provider.getBlockNumber();
    // const currentTime = (await ethers.provider.getBlock(blockNumBefore)).timestamp;
    const currentTime = Math.round(new Date().getTime() / 1000);
    const timeGoal = currentTime + oneWeek;
    const moneyRaisedGoal = 5000;
    const title: string = "May Charity Campaign";
    const description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ligula felis, tristique at sollicitudin et, tempus non enim. Vivamus tincidunt pharetra lectus nec ornare. Curabitur mauris ex, mattis vel enim quis, venenatis tempor dolor. Duis efficitur quam ut enim gravida vestibulum. Aliquam ullamcorper, libero non accumsan ornare, justo nisi semper mauris, non tempor diam risus non neque. Cras et aliquam sapien. Curabitur non purus bibendum, auctor elit a, ultricies magna. Duis nec nisi vehicula augue blandit suscipit vitae in ante. Aliquam aliquet elit dolor, mattis bibendum quam laoreet vitae. Mauris pharetra elit et consectetur accumsan";

    it("Should create a campaign", async function () {
        expect(await this.cryptoDonations.createCampaign(
          timeGoal, moneyRaisedGoal, title, description
        ))
        .to.emit(this.cryptoDonations, `CampaignCreated`)
          .withArgs(constants.Zero);
      });
  
      it("Should revert if not admin", async function () {
        await expect( this.cryptoDonations.connect(this.signers.alice)
        .createCampaign(
          timeGoal, moneyRaisedGoal, title, description
        ))
        .to.be.revertedWith(`Ownable: caller is not the owner`);
      });
  
      it("Should revert if no money goal set", async function () {
        await expect( this.cryptoDonations.createCampaign(
          timeGoal, constants.Zero, title, description
        ))
        .to.be.revertedWith(`noFundsSet`);
      });
  
      it("Should revert if time goal is set in the past", async function () {
        await expect( this.cryptoDonations.createCampaign(
          oneWeek, moneyRaisedGoal, title, description
        ))
        .to.be.revertedWith(`invalidTimeGoal`);
      });
  
      it("Should revert if title is empty", async function () {
        await expect( this.cryptoDonations.createCampaign(
          timeGoal, moneyRaisedGoal, "", description
        ))
        .to.be.revertedWith(`emptyTitle`);
      });

  });
};
