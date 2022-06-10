import { expect } from "chai";

export const shouldDeployDNPT = (): void => {

  context(`Deployment`, async function () {

    it(`Contract address is valid`, async function () {
      expect(this.dnpt.address).to.be.properAddress;
    });

  });
};
