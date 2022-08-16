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
const router_1 = require("./_abis/router");
const fs_1 = __importDefault(require("fs"));
const provider = new ethers_1.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
const routerContract = new ethers_1.ethers.Contract("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", router_1.RouterABI, provider);
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
        return (0, NFTx_1.GetNFTxTokens)().then(x => {
            console.log(`Found ${x.length} NFTx tokens...`);
            console.log(`Filtering out tokens with no token liquidity...`);
            const ys = x.filter((y) => Number(y.basePairs[0]?.reserve0 || 0) > 1);
            console.log(`Found ${ys.length} NFTx tokens with token liquidity...`);
            // const zs = ys.filter((y: NFTxToken) => collections.some(x => x.address === y.id));
            let promiseYs = ys.map(async (y) => {
                let vaultId = y.id;
                let { reserve0, reserve1 } = y.basePairs[0];
                let r0 = ethers_1.ethers.utils.parseEther(reserve0);
                let r1 = ethers_1.ethers.utils.parseEther(reserve1);
                // using the router contract calculate the amount of wETH needed to buy 1 token
                return routerContract.getAmountIn(ethers_1.ethers.utils.parseEther("1"), r1, r0).then((amount) => {
                    return {
                        ...y,
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
            Promise.all(promiseYs).then(x => x.filter(y => !!y.asset))
                .then(ys => {
                // filter out any tokens that aren't in SudoSwap
                const zs = ys.filter((y) => collections.some(x => x.address.toLowerCase() === y.asset?.toLowerCase()));
                console.log(`Found ${zs.length} NFTx tokens that also are in SudoSwap...`);
                return zs.map(y => {
                    return {
                        ...y,
                        collection: collections.find(x => x.address.toLowerCase() === y.asset.toLowerCase())
                    };
                });
            }).then((ys) => {
                // return all tokens that have a price below the AMM price
                const zs = ys.filter((y, index) => {
                    if (!y.collection) {
                        console.log(index, false);
                        return false;
                    }
                    let { sell_quote } = y.collection;
                    let { wethPrice } = y;
                    const sell_quote_formatted = Number(ethers_1.ethers.utils.formatEther(Math.floor(sell_quote / 1e9))) * 1e9;
                    return (sell_quote_formatted - 0.005) > Number(wethPrice);
                });
                return zs;
            })
                .then(ys => {
                console.log(`Found ${ys.length} NFTx tokens that are above the AMM price...`);
                console.log(`Finished! Took ${(0, moment_1.default)().diff(initTime, 'seconds')}s`);
                console.table(ys.map(y => {
                    let sell_quote = y.collection?.sell_quote;
                    const sell_quote_formatted = Number(ethers_1.ethers.utils.formatEther(Math.floor(sell_quote / 1e9))) * 1e9;
                    const difference = sell_quote_formatted - Number(y.wethPrice);
                    return {
                        collection: y.collection?.name,
                        address: y.asset,
                        NFTxPrice: Number(y.wethPrice).toFixed(5),
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
                fs_1.default.writeFileSync("./output/NFTx.json", JSON.stringify(ys, null, 4));
                console.log(`Output written to ${process.cwd()}\\output\\NFTx.json`);
                console.log(`\nThanks for using NFTxArbitrage! \n~ CreativeBuilds ♥\n`);
            });
        });
    }
}
