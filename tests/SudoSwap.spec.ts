import { expect } from "chai";
import { GetCollectionActivity } from "../src/utils";

describe("SudoSwap", () => {
    describe("#GetCollectionActivity", () => {
        it("Should return all recent activity given a collection address", async () => {
            const {activity} = await GetCollectionActivity("0xA1D4657e0E6507D5a94d06DA93E94dC7C8c44b51");
            // type of activity should be an array of objects
            expect(activity).to.be.an("array");
        })
    })    
})