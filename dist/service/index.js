"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSupportedCoins = exports.getSupportedCoins = exports.updateMarketPrices = exports.getMarketPriceChangesTwentyFourHours = exports.getLatestMarketPrices = exports.logWithTimestamp = exports.logTimestamp = void 0;
const date_fns_1 = require("date-fns");
const coingecko_api_1 = require("../coingecko.api");
const db_1 = require("../db");
const logTimestamp = () => {
    const timestamp = date_fns_1.format(new Date(), "dd-MM-yyy HH:mm:ss");
    return `[${timestamp}]`;
};
exports.logTimestamp = logTimestamp;
const logWithTimestamp = (msg) => {
    console.log(`${exports.logTimestamp()} ${msg}`);
};
exports.logWithTimestamp = logWithTimestamp;
const getLatestMarketPrices = async () => {
    const supportedCoins = await exports.getSupportedCoins();
    const coinIds = await db_1.findMarketPricesLatest(supportedCoins);
    return coinIds.map((coin) => ({
        coinId: coin.coinId,
        price: coin.price,
    }));
};
exports.getLatestMarketPrices = getLatestMarketPrices;
const getMarketPriceChangesTwentyFourHours = async () => {
    const amountOfSupportedCoins = await db_1.countSupportedCoins();
    const twentyFourHoursAgo = date_fns_1.subHours(new Date(), 24);
    const twentyFiveHoursAgo = date_fns_1.subHours(new Date(), 25);
    const latestMarketPrices = await exports.getLatestMarketPrices();
    const twentyFourHoursAgoMarketPrices = await db_1.findMarketPricesBetweenDatesWithLimitSortedByDateDesc(twentyFiveHoursAgo, twentyFourHoursAgo, amountOfSupportedCoins);
    const twentyFourHoursAgoCoinIds = twentyFourHoursAgoMarketPrices.map(({ coinId }) => coinId);
    return latestMarketPrices
        .filter(({ coinId }) => 
    // Don't attempt to calculate change for coins without data
    twentyFourHoursAgoCoinIds.includes(coinId))
        .map(({ coinId, price }) => ({
        coinId,
        change: price /
            twentyFourHoursAgoMarketPrices.find((marketPrice) => marketPrice.coinId === coinId).price -
            1,
    }));
};
exports.getMarketPriceChangesTwentyFourHours = getMarketPriceChangesTwentyFourHours;
const updateMarketPrices = async () => {
    exports.logWithTimestamp("Updating market prices: START");
    const supportedCoins = await exports.getSupportedCoins();
    const coinsWithPrices = await coingecko_api_1.fetchMarketPricesCurrent(supportedCoins);
    const insertedMarketPrices = await db_1.insertMarketPrices(coinsWithPrices);
    exports.logWithTimestamp(`Updating market prices: DONE - ${JSON.stringify(insertedMarketPrices)}`);
};
exports.updateMarketPrices = updateMarketPrices;
const getSupportedCoins = async () => {
    const supportedCoins = await db_1.findSupportedCoins();
    return supportedCoins.map((coin) => coin.coinId);
};
exports.getSupportedCoins = getSupportedCoins;
const syncSupportedCoins = async (coinIds) => {
    exports.logWithTimestamp("Synchronizing supported coins: START");
    const documentsCurrentCoinIds = await db_1.findSupportedCoins();
    const currentCoinIds = documentsCurrentCoinIds.map((document) => document.coinId);
    const coinsToAdd = coinIds.filter((coinId) => !currentCoinIds.includes(coinId));
    const coinsToRemove = currentCoinIds.filter((coinId) => !coinIds.includes(coinId));
    if (coinsToAdd.length) {
        await db_1.insertSupportedCoins(coinsToAdd);
    }
    if (coinsToRemove.length) {
        await db_1.deleteSupportedCoins(coinsToRemove);
        await db_1.deleteHistoricalPricesForCoins(coinsToRemove);
    }
    exports.logWithTimestamp("Synchronizing supported coins: DONE");
    return {
        coinsAdded: coinsToAdd,
        coinsRemoved: coinsToRemove,
    };
};
exports.syncSupportedCoins = syncSupportedCoins;
