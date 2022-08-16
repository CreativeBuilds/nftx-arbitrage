import {SudoSwapCollection} from "./src/utils/SudoSwap";
import {OpenseaCollectionStats} from "./src/utils/OpenSea";

type NFTFiCollectionObject = {
    _id: string;
    count: number;
    imgSrc: string | null;
    label: string | null;
  };

type NFTFiProjectInfo = {
  _id: string;
  address: string;
  __v: number;
  description: string;
  disableAnimation: boolean;
  imgSrc: string;
  isWhitelisted: boolean;
  metadata: {
    contractAddress: string;
    name: string;
    description: string;
    imgSrc: string | null;
    collection?: {
      banner_image_url: string | null;
      chat_url: string | null;
      created_date: string;
      default_to_fiat: boolean;
      description: string;
      dev_buyer_fee_basis_points: string;
      dev_seller_fee_basis_points: string;
      discord_url: string;
      display_data: {
        card_display_style: "cover" | string;
      };
      external_url: string | null,
      featured: boolean;
      featured_image_url: string | null;
      hidden: boolean;
      safelist_request_status: "verified" | string;
      image_url: string | null;
      is_subject_to_whitelist: boolean;
      large_image_url: string | null;
      medium_username: string | null; 
      name: string;
      only_proxied_transfers: boolean;
      opensea_buyer_fee_basis_points: string;
      opensea_seller_fee_basis_points: string;
      payout_address: string;
      require_emai: boolean;
      short_description: string | null;
      slug: string;
      telegram_url: string | null;
      twitter_username: string | null;
      instagram_username: string | null;
      wiki_url: string | null;
      is_nsfw: boolean;
    },
    address: string,
    asset_contract_type: "non-fungible" | "fungible" | string;
    created_at: string;
    nft_version: "1.0" | "2.0" | "3.0";
    opensea_version: string | null;
    owner: number;
    schema_name: "ERC721" | string;
    symbol: string;
    total_supply: string | null;
    external_link: string;
    image_url: string;
    default_to_fiat: boolean;
    dev_buyer_fee_basis_points: number;
    dev_seller_fee_basis_points: number;
    only_proxied_transfers: boolean;
    opensea_buyer_fee_basis_points: number;
    opensea_seller_fee_basis_points: number;
    buyer_fee_basis_points: number;
    seller_fee_basis_points: number;
    payout_address: string;
  },
  name: string | null;
  twitterTags: string | null;
}

type NFTFiTraitInfo = {
  traitType: string;
  value: string;
};

type NFTFiAsset = {
  _id: string;
  nftCollateralContract: string;
  nftCollateralId: string;
  __v: numver;
  borrower: string;
  contractName: "v2.loan.fixed" | string;
  desiredLoanCurrency: "wETH" | string | null;
  desiredLoanCurrencyContract: string | null;
  desiredLoanDuration: string | null;
  desiredLoanPrincipalAmount: string | null;
  desiredRepaymentAmount: string | null;
  listedDate: string;
  loanInterestRateForDurationInBasisPoints: string;
  maxLoanDuration: number;
  maximumRepaymentAmount: string;
  minLoanDuration: number;
  nftKey: string;
  nonce: string;
  referralFeeInBasisPoints: string;
  status: "listed" | string;
  whitelisted: boolean;
  name: string;
  projectName: string;
  description: string;
  imageUrl: string;
  animationUrl: string;
  traits: Array<NFTFiTraitInfo>;
  dataUri: string;
}



type SudoSwapActivity = {
  _id: string;
  value: string;
  unix_time: number;
  tx_receiver: string;
  tx_hash: string;
  tx_caller: string;
  parsed_swaps: Array<{
    nft_collection: string;
    nft_ids: string;
    pool_address: string;
    value: string;
  }>;
  method_name: string;
  gas: {
    gas_used: number;
    effective_gas_price: number;
    transaction_cost: number;
  }
}

type NFTxToken = {
  id: string;
  derivedEth: string;
  quotePairs: Array<string>;
  basePairs: Array<{
    id: string;
    reserve0: string;
    token0: {
      id: string;
    };
    token1: {
      id: string;
    };
    reserve1: string;
  }>
}
