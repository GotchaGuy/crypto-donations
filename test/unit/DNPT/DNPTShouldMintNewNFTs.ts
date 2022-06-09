import { expect } from "chai";
import { constants, Signer } from "ethers";

export const shouldMintNewNFTs = (): void => {

  context(`Minting NFTs`, async function () {

    it("Should revert if address is not whitelisted", async function () {

      const contributorAddress:string = this.signers.alice.address; // mora se mockuje admin adresa koja zove fju mintToken ovde? or does it

      await expect(this.dnpt.connect(this.signers.alice)
      .mintToken(contributorAddress))
      .to.be.revertedWith(`AddressNotWhitelisted`);
    });

    it("Should revert if admin attempts to send NFT to themselves", async function () {

      const donationsContractAddress:string = this.signers.garry.address; // mora se mockuje admin adresa koja zove fju mintToken ovde? or does it

      await expect(this.dnpt.connect(this.signers.garry)
      .mintToken(donationsContractAddress))
      .to.be.revertedWith(`AdminIsRecipient`);
    });

    it("Should mint new NFT to recipient address", async function () {

      const contributorAddress:string = this.signers.alice.address;

      const mintTokenTx = await this.dnpt.connect(this.signers.garry)
        .mintToken(contributorAddress);

      mintTokenTx.wait(); 

      expect(await this.dnpt.ownerOf(constants.Zero)).to.equal(contributorAddress);
    });

    it("Should emit event when minting new NFT", async function () {

      const contributorAddress:string = this.signers.alice.address; 

      expect(await this.dnpt.connect(this.signers.garry)
        .mintToken(contributorAddress))
      .to.emit(this.dnpt, `MintedNFT`)
        .withArgs(constants.Zero, contributorAddress);
    });

  });
};
