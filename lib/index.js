"use strict";
// Program description
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Periodicially fetch data from NFTx
// if prices of a given collection are below that of an AMM (SudoSwap) alert user to perform arbitrage
const utils_1 = require("./utils");
const moment_1 = __importDefault(require("moment"));
const NFTx_1 = require("./utils/NFTx");
const ethers_1 = require("ethers");
const fs_1 = __importDefault(require("fs"));
const routerContract_1 = require("./routerContract");
main();
async function main(retry = 0) {
    if (retry > 0) {
        if (retry >= 3) {
            console.error("Failed to fetch data after 3 attempts. Exiting...");
            return;
        }
        console.log(`A failure has occurred, retrying (attempt #${retry})`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    init().catch(err => main(retry + 1));
    async function init() {
        let initTime = Date.now();
        // first step, get all collections from SudoSwap
        const collections = await (0, utils_1.GetAllSudoSwapCollections)();
        console.log(`Found ${collections.length} collections on SudoSwap...`);
        // second step, get all collections from NFTx
        return (0, NFTx_1.GetNFTxTokens)().then(NFTxTokens => {
            console.log(`Found ${NFTxTokens.length} NFTx tokens...`);
            console.log(`Filtering out tokens with no token liquidity...`);
            const tokens = NFTxTokens.filter((token) => Number(token.basePairs[0]?.reserve0 || 0) > 1);
            console.log(`Found ${tokens.length} NFTx tokens with token liquidity...`);
            let ExtendedTokens = tokens.map(async (token) => {
                let vaultId = token.id;
                let { reserve0, reserve1 } = token.basePairs[0];
                let r0 = ethers_1.ethers.utils.parseEther(reserve0);
                let r1 = ethers_1.ethers.utils.parseEther(reserve1);
                // using the router contract calculate the amount of wETH needed to buy 1 token
                return routerContract_1.routerContract.getAmountIn(ethers_1.ethers.utils.parseEther("1"), r1, r0).then((amount) => {
                    return {
                        ...token,
                        wethPrice: ethers_1.ethers.utils.formatEther(amount)
                    };
                }).then(async (y) => {
                    let mintsRedeemsAndSwaps = await (0, NFTx_1.GetMintsRedeemsAndSwaps)(vaultId);
                    return {
                        ...y,
                        asset: mintsRedeemsAndSwaps.mints[0]?.vault.asset.id || null,
                        mints: mintsRedeemsAndSwaps.mints,
                        redeems: mintsRedeemsAndSwaps.redeems,
                        swaps: mintsRedeemsAndSwaps.swaps,
                    };
                }).catch((err) => {
                    console.error(err);
                });
            });
            Promise.all(ExtendedTokens).then(Tokens => Tokens.filter(ExtendedToken => !!ExtendedToken.asset))
                .then(Tokens => {
                // filter out any tokens that aren't in SudoSwap
                const FilteredTokens = Tokens.filter((Token) => collections.some(collection => collection.address.toLowerCase() === Token.asset?.toLowerCase()));
                console.log(`Found ${FilteredTokens.length} NFTx tokens that also are in SudoSwap...`);
                return FilteredTokens.map(FilteredToken => {
                    return {
                        ...FilteredToken,
                        collection: collections.find(x => x.address.toLowerCase() === FilteredToken.asset.toLowerCase())
                    };
                });
            }).then((Tokens) => {
                // return all tokens that have a price below the AMM price
                const ProfitableTokens = Tokens.filter((y, index) => {
                    if (!y.collection) {
                        console.log(index, false);
                        return false;
                    }
                    let { sell_quote } = y.collection;
                    let { wethPrice } = y;
                    const sell_quote_formatted = Number(ethers_1.ethers.utils.formatEther(Math.floor(sell_quote / 1e9))) * 1e9;
                    return (sell_quote_formatted - 0.005) > Number(wethPrice);
                });
                return ProfitableTokens;
            })
                .then(ProfitableTokens => {
                console.log(`Found ${ProfitableTokens.length} NFTx tokens that are above the AMM price...`);
                console.log(`Finished! Took ${(0, moment_1.default)().diff(initTime, 'seconds')}s`);
                console.table(ProfitableTokens.map(Token => {
                    let sell_quote = Token.collection?.sell_quote;
                    const sell_quote_formatted = Number(ethers_1.ethers.utils.formatEther(Math.floor(sell_quote / 1e9))) * 1e9;
                    const difference = sell_quote_formatted - Number(Token.wethPrice);
                    return {
                        collection: Token.collection?.name,
                        address: Token.asset,
                        NFTxPrice: Number(Token.wethPrice).toFixed(5),
                        SudoSwapPrice: sell_quote_formatted.toFixed(5),
                        difference: difference,
                        profitAfterGas: difference - 0.005,
                    };
                }));
                // if output folder doesnt exist, create it
                if (!fs_1.default.existsSync("./output")) {
                    fs_1.default.mkdirSync("./output");
                }
                // write data to file
                fs_1.default.writeFileSync("./output/NFTx.json", JSON.stringify(ProfitableTokens, null, 4));
                console.log(`Output written to ${process.cwd()}\\output\\NFTx.json`);
                console.log(`\nThanks for using NFTxArbitrage! \n~ CreativeBuilds ♥\n`);
            });
        });
    }
}
