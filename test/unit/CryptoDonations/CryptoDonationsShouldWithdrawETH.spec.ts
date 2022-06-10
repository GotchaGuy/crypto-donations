import { expect } from "chai";
import { BigNumber, constants, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

export const shouldWithdrawETH = (): void => {

  context(`Withdrawing ETH from Campaigns`, async function () {
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

    it("Should withdraw funds from campaign to address", async function () {

      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      const aliceBalanceBefore = await this.signers.alice.getBalance();  

      //has to be inactive campaign in order to work -> current time has to be after the timeGoal
      await ethers.provider.send("evm_increaseTime", [oneWeek]); // add one week worth of seconds

      expect(await this.cryptoDonations.withdraw(
        constants.Zero, this.signers.alice.address, 50000
      ))
      .to.emit(this.cryptoDonations, `WithdrawStatus`)
        .withArgs(true, 50000, constants.Zero);

        const aliceBalanceAfter = await this.signers.alice.getBalance(); 
        
        expect(aliceBalanceAfter.sub(aliceBalanceBefore)).to.equal(50000);
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

    it("Should revert if requested withdraw amount is too high", async function () {
      await this.cryptoDonations.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await this.cryptoDonations.connect(this.signers.alice).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      //has to be inactive campaign in order to work -> current time has to be after the timeGoal
      await ethers.provider.send("evm_increaseTime", [oneWeek]); // add one week worth of seconds

      await expect(this.cryptoDonations.withdraw(
        constants.Zero, this.signers.alice.address, parseEther("2")
      ))
      .to.be.revertedWith(`withdrawAmountTooHigh`);
    });


  });
};
