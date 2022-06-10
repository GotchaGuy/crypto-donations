import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { ethers } from "hardhat";

export const shouldCreateCampaign = (): void => {

  context(`Campaign creation`, async function () {
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
