// Using mocha create test to see if fetching data from NFTFi is working

import { AllNFTFiListingsForProject, NFTFiListingsForProject, NFTFiTotalListings, NFTFiProjects, FetchNFTFiListing } from "../src/utils";

const assert = require('assert');

const LOG = false;

describe('NFTFi', () => {
    let projects: Array<NFTFiProjectInfo>;
    let listings: Array<NFTFiCollectionObject>;
    let allListings: Array<NFTFiAsset>;

    describe("#NFTFiProjects", async () => {
        it("should return an array of projects", async () => {
            projects = await NFTFiProjects();
            assert.equal(Array.isArray(projects), true);
        }).timeout(5000);

        it("should return at least one project", async () => {
            assert.equal(projects.length > 0, true);
        }).timeout(5000);

        it("should have a valid address for each project", async () => {
            assert.equal(projects.map(p => p.address).filter(n => n != null).length, projects.length);
        })
    })
    describe("#NFTFiTotalListings", async () => {
        // before test, gather data from NFTFi
        before(async () => {
            listings = await NFTFiTotalListings();
        })

        it("Should contain an array of collection objects", async () => {
            assert.equal(Array.isArray(listings), true);
        })

        it("Should contain an array of collection objects with a _id property", async () => {
            assert.equal(listings[0]._id !== undefined, true);
        })

        after(() => {
            LOG ? console.table(listings.map((a) => {
                // for each string field, limit length to 12 characters followed by an ellipsis
                return {
                    label: a.label ? a.label.length > 20 ? a.label?.substring(0, 20) + "..." : a.label : undefined,
                    count: a.count,
                    _id: a._id,
                    imgSrc: a.imgSrc ? a.imgSrc.length > 12 ? a.imgSrc?.substring(0, 12) + "..." : a.imgSrc : undefined,
                }
            })) : undefined;
        })
    })
    describe("#NFTFiListingsForProject", async () => {
        let projectListings: any;
        it("Should return the listings for a given address", async () => {
            projectListings = await NFTFiListingsForProject(listings[0]._id);
            assert.equal(Array.isArray(projectListings), true);
        })
        it("Should paginate the listings for a given address given a skip amount", async () => {
            const SKIP = 20;

            assert.equal(listings[0].count > SKIP, true)

            let secondPage = await NFTFiListingsForProject(listings[0]._id, SKIP);

            assert.equal(Array.isArray(secondPage), true);
            assert.equal(secondPage.length > 0, true);
            assert.equal(secondPage[0]._id !== listings[0]._id, true);
        })
    })

    describe("#AllNFTFiListingsForProject", async () => {

        it("Should return all listings for a given address", async () => {
            allListings = await AllNFTFiListingsForProject(listings[0]._id, listings[0].count);
            assert.equal(Array.isArray(allListings), true);
        }).timeout(20000);

        it("Should return all listings for a given address (give or take a few for cache)", async () => {
            assert.equal(allListings.length >= listings[0].count - 1, true);
        }).timeout(5000);
    })

    // No longer needed, but keeping for reference
    // describe("#FetchNFTFiListing", async () => {
    //     it("Should return the listing for a given address", async () => {
    //         const listing = await FetchNFTFiListing(allListings[0].nftCollateralContract, allListings[0]._id, true);
    //         assert.equal(listing._id === listings[0]._id, true);
    //     }).timeout(5000);
    // })
})