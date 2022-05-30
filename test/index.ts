import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const CryptoDonations = await ethers.getContractFactory("Greeter");
    const cryptoDonations = await CryptoDonations.deploy("Hello, world!");
    await cryptoDonations.deployed();

    expect(await cryptoDonations.greet()).to.equal("Hello, world!");

    const setGreetingTx = await cryptoDonations.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await cryptoDonations.greet()).to.equal("Hola, mundo!");
  });
});
