import { expect } from "chai";
import { constants } from "ethers";

export const shouldChangeCampaign = (): void => {

  context(`Campaign Editing`, async function () {
    // timeGoal is 1 week from now = current time in seconds + one week in seconds(604800s)
    const oneWeek = 604800;
    const currentTime = Math.round(new Date().getTime() / 1000);
    const timeGoal = currentTime + oneWeek;
    const moneyRaisedGoal = 5000;
    const title: string = "May Charity Campaign";
    const description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ligula felis, tristique at sollicitudin et, tempus non enim. Vivamus tincidunt pharetra lectus nec ornare. Curabitur mauris ex, mattis vel enim quis, venenatis tempor dolor. Duis efficitur quam ut enim gravida vestibulum. Aliquam ullamcorper, libero non accumsan ornare, justo nisi semper mauris, non tempor diam risus non neque. Cras et aliquam sapien. Curabitur non purus bibendum, auctor elit a, ultricies magna. Duis nec nisi vehicula augue blandit suscipit vitae in ante. Aliquam aliquet elit dolor, mattis bibendum quam laoreet vitae. Mauris pharetra elit et consectetur accumsan";

    it("Should change a campaign money goal", async function () {
      const difference = 1000;

      const createCampaignTx = await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await createCampaignTx.wait();

      const moneyGoalBefore = (await this.cryptoDonations.campaigns(0)).moneyRaisedGoal;
      console.log("moneyGoalBefore: " + moneyGoalBefore.toNumber());
      // const moneyGoalBefore = createCampaignTx.moneyRaisedGoal;

      const changeCampaignTx = await this.cryptoDonations.changeCampaign(
        constants.Zero, timeGoal, moneyRaisedGoal + difference, title, description
      );
      
      await changeCampaignTx.wait();

      const moneyGoalAfter = (await this.cryptoDonations.campaigns(0)).moneyRaisedGoal;
      console.log("moneyGoalAfter: " + moneyGoalAfter.toNumber());

      expect(moneyGoalAfter).is.not.equal(moneyGoalBefore);
    });

    it("Change campaign should revert if campaign id is invalid", async function () {
      await expect( this.cryptoDonations.changeCampaign(
        constants.Zero, timeGoal, moneyRaisedGoal, title, description
      ))
      .to.be.revertedWith(`invalidCampaign`);
    });
  });
};