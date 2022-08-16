// includes all code needed to fetch relevant information from NFTFi

/**
 * 
 * @returns An array for each project in NFTFi with the following fields:
 *  - _id: The project id
 *  - count: The number of listings for the project
 *  - imgSrc: The url of the project's image if it has one
 *  - label: The project's name
 * 
 */
export const NFTFiTotalListings = async (): Promise<Array<NFTFiCollectionObject>> => {
  return fetch("https://api.nftfi.com/listings/distinctValues/nftCollateralContract", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "authorization": "Bearer null",
      "if-none-match": "W/\"5bbe-ANLOzHT2qdUtPHbT3A4/1oqvnFU\"",
      "Referer": "https://app.nftfi.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  }).then(res => res.json());
}

/**
 * 
 * @returns An array for all projects containing base information needed to fetch the listings for the project
 * 
 */
export const NFTFiProjects = async (): Promise<Array<NFTFiProjectInfo>> => {
  return fetch("https://api.nftfi.com/projects", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "authorization": "Bearer null",
      "if-none-match": "W/\"158714-Vsgfn+5tENCPtHokmfKFT2K1B+c\"",
    },
    "referrer": "https://app.nftfi.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(res => res.json());
}

/**
 * 
 * @param verified_projects A filtered array from NFTFiProjects containing the projects to fetch listings for
 * @param listings An array from NFTFiTotalListings to filter (Only verified projects are kept)
 * @returns An array of listings for only verified projects
 */
export const VerifyNTFfiListings = (verified_projects: Array<NFTFiProjectInfo>, listings: Array<NFTFiCollectionObject>): Array<NFTFiCollectionObject> => {
  return listings.filter((l: NFTFiCollectionObject) => verified_projects.map(p => p.address).includes(l._id))
}

/**
 * 
 * @param projects An array of projects to filter
 * @returns An array of projects that have been verified by NFTFi
 */
export const VerifyNFTfiProjects = (projects: Array<NFTFiProjectInfo>): Array<NFTFiProjectInfo> => {
  return projects.filter(p => p.metadata?.collection?.safelist_request_status == "verified")
}

/**
 * 
 * @param address The address of the NFTFi contract
 * @param skip The number of listings to skip (used for pagination)
 * @returns An array of up to 20 listings for the project address given
 */
export const NFTFiListingsForProject = async (address: string, skip: number = 0) => {
  return fetch("https://api.nftfi.com/listings", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "if-none-match": "W/\"a63c-rLEw92Jm+dsX7nH7LtRdbcOjsQQ\"",
      "x-filters": `{\"nftCollateralContract\":[\"${address}\"]}`,
      "x-paging": `{\"limit\":20,\"skip\":${skip},\"sort\":null}`
    },
    "referrer": "https://app.nftfi.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(x => x.json())
}

/**
 * 
 * @param address The address of the NFTFi contract
 * @param max The maximum number of listings to return
 * @returns An array of up to max listings for the project address given
 */
export const AllNFTFiListingsForProject = async (address: string, max: number) => {
  let listings: Array<NFTFiAsset> = [];
  let skip = 0;
  let done = false;

  listings = await Promise.all(new Array(Math.ceil(max / 20)).fill(null).map((_, i) => {
    return NFTFiListingsForProject(address, i * 20);
  })).then(x => x.flat());

  return listings;
}

/**
 * 
 * @param contract The address of the NFTFi contract
 * @param id The id of the listing to fetch
 * @returns Information about the listing with the given id & contract address
 */
export const FetchNFTFiListing = async (contract: string, id: string) => {
    // fetch from NFTfi
    return fetch(`https://api.nftfi.com/listings/${contract}/${id}`, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "if-none-match": "W/\"37d-aqec0VFP7HcGUgC8Ct5AExdR96s\"",
      },
      "referrer": "https://app.nftfi.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    }).then(x => x.json())
}