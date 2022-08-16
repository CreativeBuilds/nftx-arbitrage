"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCollectionActivity = exports.GetCollectionStats = exports.GetSlug = exports.GetAllSudoSwapCollections = void 0;
const OpenSea_1 = require("./OpenSea");
Object.defineProperty(exports, "GetSlug", { enumerable: true, get: function () { return OpenSea_1.GetSlug; } });
Object.defineProperty(exports, "GetCollectionStats", { enumerable: true, get: function () { return OpenSea_1.GetCollectionStats; } });
const SudoSwap_1 = require("./SudoSwap");
Object.defineProperty(exports, "GetAllSudoSwapCollections", { enumerable: true, get: function () { return SudoSwap_1.GetAllSudoSwapCollections; } });
Object.defineProperty(exports, "GetCollectionActivity", { enumerable: true, get: function () { return SudoSwap_1.GetCollectionActivity; } });
