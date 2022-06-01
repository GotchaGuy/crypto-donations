import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { BigNumber, constants, Signer } from "ethers";
import { ethers } from "hardhat";
import { CryptoDonations } from "../typechain";

describe("CryptoDonations", function () {

  let CryptoDonations;
  let cryptoDonationsContract: CryptoDonations;
  let owner: { address: string; };
  let addr1: string | Signer | Provider;
  let addr2: string | Signer | Provider;
  let addrs;

  

  beforeEach(async function () {
    CryptoDonations = await ethers.getContractFactory("CryptoDonations");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    cryptoDonationsContract = await CryptoDonations.deploy();
  });


  describe("Deployment", function () {
    

    it("Should set the right owner", async function () {
      expect(await cryptoDonationsContract.owner()).to.equal(owner.address);
    });

  });

  describe("Campaign creation and editing", async function () {
    // timeGoal is 1 week from now = current time in seconds + one week in seconds(604800s)
    const oneWeek = 604800;
    const timeGoal = Math.round(new Date().getTime() / 1000) + oneWeek;
    const moneyRaisedGoal = 500;
    const title: string = "May Charity Campaign";
    const description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ligula felis, tristique at sollicitudin et, tempus non enim. Vivamus tincidunt pharetra lectus nec ornare. Curabitur mauris ex, mattis vel enim quis, venenatis tempor dolor. Duis efficitur quam ut enim gravida vestibulum. Aliquam ullamcorper, libero non accumsan ornare, justo nisi semper mauris, non tempor diam risus non neque. Cras et aliquam sapien. Curabitur non purus bibendum, auctor elit a, ultricies magna. Duis nec nisi vehicula augue blandit suscipit vitae in ante. Aliquam aliquet elit dolor, mattis bibendum quam laoreet vitae. Mauris pharetra elit et consectetur accumsan";


    it("Should create a campaign", async function () {
      expect(await cryptoDonationsContract.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      ))
      .to.emit(cryptoDonationsContract, `CampaignCreated`)
        .withArgs(constants.Zero);
    });

    it("Should revert if not admin", async function () {
      await expect( cryptoDonationsContract.connect(addr1)
      .createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      ))
      .to.be.revertedWith(`Ownable: caller is not the owner`);
    });

    it("Should revert if no money goal set", async function () {
      await expect( cryptoDonationsContract.createCampaign(
        timeGoal, constants.Zero, title, description
      ))
      .to.be.revertedWith(`noFundsSet`);
    });

    it("Should revert if time goal is set in the past", async function () {
      await expect( cryptoDonationsContract.createCampaign(
        oneWeek, moneyRaisedGoal, title, description
      ))
      .to.be.revertedWith(`invalidTimeGoal`);
    });

    it("Should revert if title is empty", async function () {
      await expect( cryptoDonationsContract.createCampaign(
        timeGoal, moneyRaisedGoal, "", description
      ))
      .to.be.revertedWith(`emptyTitle`);
    });

    it("Should change a campaign money goal", async function () {
      const difference = 1000;

      const createCampaignTx = await cryptoDonationsContract.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await createCampaignTx.wait();

      const moneyGoalBefore = (await cryptoDonationsContract.campaigns(0)).moneyRaisedGoal;
      console.log(moneyGoalBefore);
      // const moneyGoalBefore = createCampaignTx.moneyRaisedGoal;

      const changeCampaignTx = await cryptoDonationsContract.changeCampaign(
        constants.Zero, timeGoal, moneyRaisedGoal + difference, title, description
      );
      
      await changeCampaignTx.wait();

      const moneyGoalAfter = (await cryptoDonationsContract.campaigns(0)).moneyRaisedGoal;
      console.log(moneyGoalAfter);

      expect(moneyGoalAfter).is.not.equal(moneyGoalBefore);
    });

    it("Change campaign should revert if campaign id is invalid", async function () {
      await expect( cryptoDonationsContract.changeCampaign(
        constants.Zero, timeGoal, moneyRaisedGoal, title, description
      ))
      .to.be.revertedWith(`invalidCampaign`);
    });

  });

  describe("Contributing funds to campaigns", async function () {
    // timeGoal is 1 week from now = current time in seconds + one week in seconds(604800s)
    const oneWeek = 604800;
    const currentTime = Math.round(new Date().getTime() / 1000);
    const timeGoal = currentTime + oneWeek;
    const moneyRaisedGoal = 5000;
    const title: string = "May Charity Campaign";
    const description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ligula felis, tristique at sollicitudin et, tempus non enim. Vivamus tincidunt pharetra lectus nec ornare. Curabitur mauris ex, mattis vel enim quis, venenatis tempor dolor. Duis efficitur quam ut enim gravida vestibulum. Aliquam ullamcorper, libero non accumsan ornare, justo nisi semper mauris, non tempor diam risus non neque. Cras et aliquam sapien. Curabitur non purus bibendum, auctor elit a, ultricies magna. Duis nec nisi vehicula augue blandit suscipit vitae in ante. Aliquam aliquet elit dolor, mattis bibendum quam laoreet vitae. Mauris pharetra elit et consectetur accumsan";


    it("Campaign should receive funds from contributor", async function () {
      const createCampaignTx = await cryptoDonationsContract.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await createCampaignTx.wait();

      expect(await cryptoDonationsContract.connect(addr1).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      ))
      .to.emit(cryptoDonationsContract, `Contributor`)
        .withArgs(constants.Zero, 1000000000000000000, addr1);
    });

    // it("Should revert if campaign is inactive", async function () {
    //   const createCampaignTx = await cryptoDonationsContract.createCampaign(
    //     currentTime + 5, moneyRaisedGoal, title, description
    //   );
  
    //   await createCampaignTx.wait();

    //   await expect( cryptoDonationsContract.connect(addr2)
    //   .donate(
    //     constants.Zero, { value: ethers.utils.parseEther("1") }
    //   ))
    //   .to.be.revertedWith(`campaignIsInactive`);
    // });

    it("CampaignSum should stack all contributed funds", async function () {
      const createCampaignTx = await cryptoDonationsContract.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await createCampaignTx.wait();

      await cryptoDonationsContract.connect(addr1).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      await cryptoDonationsContract.connect(addr2).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      await cryptoDonationsContract.connect(addr1).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      );

      const campaignSum = ethers.utils.formatUnits(await cryptoDonationsContract.getCampaignSum(0), "ether");
  

      expect(parseInt(campaignSum)).is.equal(3);

    });

    it("Campaign should receive funds from contributor", async function () {
      const createCampaignTx = await cryptoDonationsContract.createCampaign(
        timeGoal, moneyRaisedGoal, title, description
      );
  
      await createCampaignTx.wait();

      expect(await cryptoDonationsContract.connect(addr1).donate(
        constants.Zero, { value: ethers.utils.parseEther("1") }
      ))
      .to.emit(cryptoDonationsContract, `CampaignGoalMet`)
        .withArgs(constants.Zero);
    });

  });

});

