import { expect } from "chai";
import { constants, Signer } from "ethers";

export const shouldMintNewNFTs = (): void => {

  context(`Minting NFTs`, async function () {

    it("Should revert if admin attempts to send NFT to themselves", async function () {

      const donationsContractAddress:string = this.signers.deployer.address; // mora se mockuje admin adresa koja zove fju mintToken ovde? or does it

      await expect(this.dnpt
      .mintToken(donationsContractAddress))
      .to.be.revertedWith(`AdminIsRecipient`);
    });

    it("Should mint new NFT to recipient address", async function () {

      const donationsContractAddress:string = this.signers.alice.address;

      const mintTokenTx = await this.dnpt
        .mintToken(donationsContractAddress);

      mintTokenTx.wait(); 

      expect(await this.dnpt.ownerOf(constants.Zero)).to.equal(donationsContractAddress);
    });

    it("Should emit event when minting new NFT", async function () {

      const donationsContractAddress:string = this.signers.alice.address; 

      expect(await this.dnpt
        .mintToken(donationsContractAddress))
      .to.emit(this.dnpt, `MintedNFT`)
        .withArgs(constants.Zero, donationsContractAddress);
    });

  });
};
