import { expect } from "chai";

export const shouldDeploy = (): void => {

  context(`Deployment of CryptoDonations and DNPT contract`, async function () {

    it(`should deploy DNPT Contract along with deploying CryptoDonations Contract`, async function () {
      expect(await this.cryptoDonations.address).to.be.properAddress;
      expect(await this.dnpt.address).to.be.properAddress;
    });

    it(`should have matching giftNFT address and DNPT contract address`, async function () {
      expect(await this.cryptoDonations.giftNFT()).to.equal(this.dnpt.address);
    });

    it(`should have matching whitelistedNftContract address and CryptoDonations contract address`, async function () {
      expect(await this.dnpt.whitelistedNftContract()).to.equal(this.cryptoDonations.address);
    });

  });
};
