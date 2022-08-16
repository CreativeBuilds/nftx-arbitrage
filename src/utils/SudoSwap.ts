export const GetCollectionActivity = async (collection: string = "0xA1D4657e0E6507D5a94d06DA93E94dC7C8c44b51"): Promise<any> => {
    return fetch(`https://sudoapi.xyz/v1/activity/collection/${collection}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "Referer": "https://sudoswap.xyz/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(x => x.json())
}

export const GetCollectionListings = async (collection: string = "0xA1D4657e0E6507D5a94d06DA93E94dC7C8c44b51"): Promise<any> => {
    return fetch(`https://sudoapi.xyz/v1/pairs/nft/${collection}`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
        },
        "referrer": "https://sudoswap.xyz/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
      }).then(x => x.json())
}

export const GetAllSudoSwapCollections = async (collections: Array<SudoSwapCollection> = []): Promise<Array<SudoSwapCollection>> => {
    return fetch(`https://sudoapi.xyz/v1/collections?sort=offer_tvl&desc=true${collections.length ? `&lastId=${collections[collections.length - 1]._id}` : ``}`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
        },
        "referrer": "https://sudoswap.xyz/",
        "method": "GET",
      }).then(x => x.json()).then(x => x.collections).then(x => {
        if(x.length == 50) {
            return GetAllSudoSwapCollections(collections.concat(x));
        } else {
            return collections.concat(x);
        }
      });
}


export type SudoSwapCollection = {
  _id: string;
  address: string;
  name: string;
  symbol: string;
  isVerified: boolean;
  images: {
    image_url: string;
    banner_image_url: string;
    large_image_url: string;
  };
  buy_quote: number;
  sell_quote: number;
  pool_count: number;
  item_count: number;
  offer_tvl: number;
  analytics: {
    volume_24_hour: number;
    volume_all_time: number;
  }
}