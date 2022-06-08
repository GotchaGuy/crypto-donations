import { expect } from "chai";
import { constants, Signer } from "ethers";
import { ethers } from "hardhat";
import { DNPT } from "../../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// let owner: SignerWithAddress;
// let alice: SignerWithAddress;
// let bob: SignerWithAddress;

// [owner, alice, bob] = await ethers.getSigners();

describe("DNPT", function () {

    let DNPT;
    let dnptContract: DNPT;
    let owner: { address: string; };
    // let addr1: string | Signer;
    let addr2: string | Signer;
    // let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    // let addr2: SignerWithAddress;
    let addrs;
  
  
    beforeEach(async function () {
      DNPT = await ethers.getContractFactory("DNPT");
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  
      dnptContract = await DNPT.deploy();
    });
  
  
    describe("Deployment", function () {
      
  
      it("Should set the right owner", async function () {
        expect(await dnptContract.owner()).to.equal(owner.address);
      });
  
    });

    describe("Minting new NFTs", function () {

      it("Should revert if admin attempts to send NFT to themselves", async function () {

        const donationsContractAddress:string = owner.address; // mora se mockuje admin adresa koja zove fju mintToken ovde? or does it

        await expect(dnptContract
        .mintToken(donationsContractAddress))
        .to.be.revertedWith(`AdminIsRecipient`);
      });

      it("Should mint new NFT to recipient address", async function () {

        const donationsContractAddress:string = addr1.address;

        const mintTokenTx = await dnptContract
          .mintToken(donationsContractAddress);

        mintTokenTx.wait(); 

        expect(await dnptContract.ownerOf(constants.Zero)).to.equal(donationsContractAddress);
      });

      it("Should emit event when minting new NFT", async function () {

        const donationsContractAddress:string = addr1.address; 

        expect(await dnptContract
          .mintToken(donationsContractAddress))
        .to.emit(dnptContract, `MintedNFT`)
          .withArgs(constants.Zero, donationsContractAddress);
      });
  
    });

});
