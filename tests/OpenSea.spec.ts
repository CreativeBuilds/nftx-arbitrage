import { GetCollectionStats, GetSlug } from "../src/utils";

const assert = require('assert');

describe("OpenSea", () => {
    let slug: string;
    describe("#GetSlug", () => {
        it("should return a slug", async () => {
            slug = await GetSlug("0xc0cf5b82ae2352303b2ea02c3be88e23f2594171");
            console.log(slug);
            assert.equal(slug, "the-fungible-by-pak");
        }).timeout(5000);
    })

    describe("#GetCollectionStats", () => {
        it("should return a collection stats object", async () => {
            const {stats} = await GetCollectionStats(slug);
            assert.equal(stats.floor_price > 0, true);
        });
    })
})