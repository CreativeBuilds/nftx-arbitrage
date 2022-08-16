import { expect } from "chai";
import { GetNFTxTokens } from "../src/utils/NFTx";

describe("NFTx", () => {
    describe("GetNFTxTokens", () => {
        it("should return an array of NFTx tokens", async () => {
            const tokens = await GetNFTxTokens();
            expect(!!tokens).to.equal(true);
            expect(tokens.length).to.be.greaterThan(0);
        }).timeout(10000);
    });
})