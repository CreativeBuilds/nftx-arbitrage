"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSlug = exports.GetCollectionStats = void 0;
/**
 *
 * @param slug the unique id of the opensea collection
 * @returns a collection stats object
 */
const GetCollectionStats = async (slug) => {
    return fetch(`https://api.opensea.io/api/v1/collection/${slug}/stats`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "if-modified-since": "Thu, 11 Aug 2022 22:59:22 GMT",
            "x-api-key": "fbb33cd31dcf4624b4205021e21be2df"
        },
        "referrer": "https://app.nftfi.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    }).then(x => x.json());
};
exports.GetCollectionStats = GetCollectionStats;
const GetSlug = async (address) => {
    return fetch(`https://api.opensea.io/api/v1/asset_contract/${address}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "if-modified-since": "Thu, 11 Aug 2022 23:22:20 GMT",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1",
            "x-api-key": "fbb33cd31dcf4624b4205021e21be2df"
        },
        "referrer": "https://app.nftfi.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    }).then(x => x.json()).then(x => x?.collection?.slug).then(x => {
        if (!x)
            throw new Error("No slug found for address");
        return x;
    });
};
exports.GetSlug = GetSlug;
