import { ethers, providers } from 'ethers';
import { RouterABI } from '../_abis/router';

const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/eth");
export const routerContract = new ethers.Contract(
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    RouterABI,
    provider
);
