import { expect } from "chai";
import { constants, Signer } from "ethers";
import { ethers } from "hardhat";

export const shouldWithdrawETH = (): void => {

  context(`Withdrawing ETH from Campaigns`, async function () {

    // timeGoal is 1 week from now = current time in seconds + one week in seconds(604800s)
    const oneWeek = 604800;
    // const blockNumBefore = await ethers.provider.getBlockNumber();
    // const currentTime = (await ethers.provider.getBlock(blockNumBefore)).timestamp;
    const currentTime = Math.round(new Date().getTime() / 1000);
    const timeGoal = currentTime + oneWeek;
    const moneyRaisedGoal = 5000;
    const title: string = "May Charity Campaign";
    const description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ligula felis, tristique at sollicitudin et, tempus non enim. Vivamus tincidunt pharetra lectus nec ornare. Curabitur mauris ex, mattis vel enim quis, venenatis tempor dolor. Duis efficitur quam ut enim gravida vestibulum. Aliquam ullamcorper, libero non accumsan ornare, justo nisi semper mauris, non tempor diam risus non neque. Cras et aliquam sapien. Curabitur non purus bibendum, auctor elit a, ultricies magna. Duis nec nisi vehicula augue blandit suscipit vitae in ante. Aliquam aliquet elit dolor, mattis bibendum quam laoreet vitae. Mauris pharetra elit et consectetur accumsan";


    it("Should withdraw funds from campaign to address", async function () {

      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      const aliceBalanceBefore = ethers.utils.formatUnits(await this.signers.alice.getBalance(), "ether");  
      console.log(aliceBalanceBefore);

      //has to be inactive campaign in order to work -> current time has to be after the timeGoal
      await ethers.provider.send("evm_increaseTime", [oneWeek]); // add one week worth of seconds

      expect(await this.cryptoDonations.withdraw(
        constants.Zero, this.signers.alice.address, 50000
      ))
      .to.emit(this.cryptoDonations, `WithdrawStatus`)
        .withArgs(true, 50000, constants.Zero);

        const aliceBalanceAfter = ethers.utils.formatUnits(await this.signers.alice.getBalance(), "ether"); 
        console.log(aliceBalanceAfter);
        
        // expect(parseFloat(aliceBalanceAfter) - parseFloat(aliceBalanceBefore)).to.equal(50000);
    });

    it("Should revert if campaign is active", async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      //has to be inactive campaign in order to work
      await expect(this.cryptoDonations.withdraw(
        constants.Zero, this.signers.alice.address, 50000
      ))
      .to.be.revertedWith(`campaignIsActive`);
    });

  });
};
