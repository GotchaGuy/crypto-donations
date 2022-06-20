import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { ethers } from "hardhat";

export const shouldReceiveETH = (): void => {

  context(`Campaigns receiving ETH`, async function () {
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

    it("Campaign should receive funds from contributor", async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      expect(await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      ))
      .to.emit(this.cryptoDonations, `Contributor`)
        .withArgs(constants.Zero, ethers.utils.parseEther("1"), this.signers.alice, true);
    });

    it("Should revert if campaign is inactive", async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );

      await ethers.provider.send("evm_increaseTime", [oneWeek]); // add one week worth of seconds
      // await ethers.provider.send("evm_mine", [7200]); // works either way

      await expect(this.cryptoDonations.connect(this.signers.bob)
      .donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      ))
      .to.be.revertedWith(`campaignIsInactive`);
    });

    it("CampaignSum should stack all contributed funds", async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      var donationSum: number = 0;
      const donationAmount = 1;

      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther(donationAmount.toString()) }
      );

      donationSum += donationAmount;

      await this.cryptoDonations.connect(this.signers.bob).donate(
        constants.Zero, { value: ethers.utils.parseEther(donationAmount.toString()) }
      );

      donationSum += donationAmount;

      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther(donationAmount.toString()) }
      );

      donationSum += donationAmount;

      const campaignSum = ethers.utils.formatUnits(await this.cryptoDonations.getCampaignSum(0), "ether");
  
      expect(parseInt(campaignSum)).is.equal(donationSum);

    });

    it("Should emit special event if money goal is surpassed", async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      expect(await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      ))
      .to.emit(this.cryptoDonations, `CampaignGoalMet`)
        .withArgs(constants.Zero);
    });

  });
};
