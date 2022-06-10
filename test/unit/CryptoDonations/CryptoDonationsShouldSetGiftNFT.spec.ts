import { expect } from "chai";

export const shouldSetGiftNFT = (): void => {

  context(`Setting Gift NFT Address`, async function () {

    it(`Should set Gift NFT Address to state variable`, async function () {
        await this.cryptoDonations.setGiftNFTAddress(this.signers.alice.address);

        expect(await this.cryptoDonations.giftNFT()).to.equal(this.signers.alice.address);
    });

    it("Should revert if not admin", async function () {
        await expect( this.cryptoDonations.connect(this.signers.alice)
        .setGiftNFTAddress(this.signers.bob.address))
        .to.be.revertedWith(`Ownable: caller is not the owner`);      
    });

  });
};
