"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSudoSwapCollections = exports.GetCollectionListings = exports.GetCollectionActivity = void 0;
const GetCollectionActivity = async (collection = "0xA1D4657e0E6507D5a94d06DA93E94dC7C8c44b51") => {
    return fetch(`https://sudoapi.xyz/v1/activity/collection/${collection}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "Referer": "https://sudoswap.xyz/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(x => x.json());
};
exports.GetCollectionActivity = GetCollectionActivity;
const GetCollectionListings = async (collection = "0xA1D4657e0E6507D5a94d06DA93E94dC7C8c44b51") => {
    return fetch(`https://sudoapi.xyz/v1/pairs/nft/${collection}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
        },
        "referrer": "https://sudoswap.xyz/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
    }).then(x => x.json());
};
exports.GetCollectionListings = GetCollectionListings;
const GetAllSudoSwapCollections = async (collections = []) => {
    return fetch(`https://sudoapi.xyz/v1/collections?sort=offer_tvl&desc=true${collections.length ? `&lastId=${collections[collections.length - 1]._id}` : ``}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
        },
        "referrer": "https://sudoswap.xyz/",
        "method": "GET",
    }).then(x => x.json()).then(x => x.collections).then(x => {
        if (x.length == 50) {
            return (0, exports.GetAllSudoSwapCollections)(collections.concat(x));
        }
        else {
            return collections.concat(x);
        }
    });
};
exports.GetAllSudoSwapCollections = GetAllSudoSwapCollections;
