"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerContract = void 0;
const ethers_1 = require("ethers");
const router_1 = require("../_abis/router");
const provider = new ethers_1.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
exports.routerContract = new ethers_1.ethers.Contract("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", router_1.RouterABI, provider);
