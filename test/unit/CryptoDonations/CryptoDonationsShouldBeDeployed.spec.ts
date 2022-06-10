import { expect } from "chai";

export const shouldDeployCD = (): void => {

  context(`Deployment`, async function () {

    it(`Contract address is valid`, async function () {
      expect(this.cryptoDonations.address).to.be.properAddress;
    });

    it("Should set the right owner", async function () {
        expect(await this.cryptoDonations.owner()).to.equal(this.signers.deployer.address);
      });

  });
};
