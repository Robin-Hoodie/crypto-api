"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMarketPricesCurrent = exports.COINGECKO_API_BASE_URL_SIMPLE_PRICE = void 0;
const axios_1 = __importDefault(require("axios"));
const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3/";
const CURRENCY_USD = "usd";
exports.COINGECKO_API_BASE_URL_SIMPLE_PRICE = `${COINGECKO_API_BASE_URL}simple/price`;
const fetchMarketPricesCurrent = async (coins) => {
    const { data } = await axios_1.default.get(`${exports.COINGECKO_API_BASE_URL_SIMPLE_PRICE}?ids=${coins}&vs_currencies=${CURRENCY_USD}`);
    return Object.entries(data).reduce((coinsWithPrices, [coinId, prices]) => [
        ...coinsWithPrices,
        {
            coinId: coinId,
            price: prices.usd,
        },
    ], []);
};
exports.fetchMarketPricesCurrent = fetchMarketPricesCurrent;
