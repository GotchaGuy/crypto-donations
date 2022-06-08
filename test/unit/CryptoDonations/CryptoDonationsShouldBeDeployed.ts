import { expect } from "chai";

export const shouldDeployCD = (): void => {

  context(`Deployment`, async function () {

    it(`Contract address is valid`, async function () {
      expect(this.cryptoDonations.address).to.be.properAddress;
    });

  });
};
