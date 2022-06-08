import { expect } from "chai";

export const shouldDeployDNPT = (): void => {

  context(`Deployment`, async function () {

    it(`Contract address is valid`, async function () {
      expect(this.dnpt.address).to.be.properAddress;
    });

    // za integration test testirati da li je admin adresa DNPTa zapravo adresa CDa
    // it(`Owner address is deployer address`, async function () {
    //   expect(await this.dnpt.owner()).is.equal(this.cryptoDonations.address);
    // });
  });
};
