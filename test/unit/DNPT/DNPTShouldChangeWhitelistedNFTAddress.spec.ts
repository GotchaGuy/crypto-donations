import { expect } from "chai";

export const shouldChangeWhitelistedNFTAddress = (): void => {

  context(`Changing whitelisted contract address to mint NFTs`, async function () {

    it(`Should change Contract Address to whitelist it`, async function () {
      await this.dnpt.changeWhitelistedNftContract(this.mocks.mockCryptoDonations.address);

      expect(await this.dnpt.whitelistedNftContract()).to.equal(this.mocks.mockCryptoDonations.address);
  });

  it("Should revert if not admin", async function () {
      await expect( this.dnpt.connect(this.signers.alice)
      .changeWhitelistedNftContract(this.signers.bob.address))
      .to.be.revertedWith(`Ownable: caller is not the owner`);      
  });

  });
};
