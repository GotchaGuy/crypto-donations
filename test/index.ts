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
  let addr2: { address: string; };
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

  describe("Campaign creation", function () {
    // timeGoal is 1 week from now = current time in seconds + one week in seconds(604800s)
    const timeGoal = Math.round(new Date().getTime() / 1000) + 604800;
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
    });


});
