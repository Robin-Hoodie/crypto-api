"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMarketPricesBetweenDatesWithLimitSortedByDateDesc = exports.findMarketPricesLatest = exports.insertMarketPrices = exports.deleteHistoricalPricesForCoins = exports.deleteSupportedCoins = exports.insertSupportedCoins = exports.countSupportedCoins = exports.findSupportedCoins = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
const connectionString = `mongodb://${config_1.MONGODB_ADMIN_USER}:${config_1.MONGODB_ADMIN_PASSWORD}@${config_1.MONGODB_HOST}:${config_1.MONGODB_PORT}/?writeConcern=majority`;
const mongoClient = new mongodb_1.MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connectToCryptoDb = async () => {
    if (!mongoClient.isConnected()) {
        await mongoClient.connect();
    }
    return mongoClient.db("crypto");
};
const getCollectionSupportedCoins = async () => {
    const db = await connectToCryptoDb();
    return db.collection("supported_coins");
};
const getCollectionHistoricalPrices = async () => {
    const db = await connectToCryptoDb();
    return db.collection("historical_prices");
};
const findSupportedCoins = async () => {
    const collectionSupportedCoins = await getCollectionSupportedCoins();
    return await collectionSupportedCoins.find({}).toArray();
};
exports.findSupportedCoins = findSupportedCoins;
const countSupportedCoins = async () => {
    const collectionSupportedCoins = await getCollectionSupportedCoins();
    return await collectionSupportedCoins.countDocuments();
};
exports.countSupportedCoins = countSupportedCoins;
const insertSupportedCoins = async (coinIds) => {
    const collectionSupportedCoins = await getCollectionSupportedCoins();
    const documentsToInsert = coinIds.map((coinId) => ({
        coinId,
    }));
    const { insertedIds } = await collectionSupportedCoins.insertMany(documentsToInsert, {
        ordered: true,
    });
    return documentsToInsert.map((document, index) => ({
        ...document,
        _id: insertedIds[index],
    }));
};
exports.insertSupportedCoins = insertSupportedCoins;
const deleteSupportedCoins = async (coinIds) => {
    const collectionSupportedCoins = await getCollectionSupportedCoins();
    await collectionSupportedCoins.deleteMany({
        coinId: {
            $in: coinIds,
        },
    });
};
exports.deleteSupportedCoins = deleteSupportedCoins;
const deleteHistoricalPricesForCoins = async (coinIds) => {
    const collectionHistoricalPrices = await getCollectionHistoricalPrices();
    await collectionHistoricalPrices.deleteMany({
        coinId: {
            $in: coinIds,
        },
    });
};
exports.deleteHistoricalPricesForCoins = deleteHistoricalPricesForCoins;
const insertMarketPrices = async (coinsWithPrices) => {
    const documentsToInsert = coinsWithPrices.map((coinWithPrice) => ({
        ...coinWithPrice,
        date: new Date(),
    }));
    const collectionHistoricalPrices = await getCollectionHistoricalPrices();
    const { insertedIds } = await collectionHistoricalPrices.insertMany(documentsToInsert, {
        ordered: true,
    });
    return documentsToInsert.map((document, index) => ({
        ...document,
        _id: insertedIds[index],
    }));
};
exports.insertMarketPrices = insertMarketPrices;
const findMarketPricesLatest = async (coinIds) => {
    const collectionHistoricalPrices = await getCollectionHistoricalPrices();
    return await collectionHistoricalPrices
        .find({
        coinId: {
            $in: coinIds,
        },
    })
        .sort({
        date: -1,
    })
        .limit(coinIds.length)
        .toArray();
};
exports.findMarketPricesLatest = findMarketPricesLatest;
const findMarketPricesBetweenDatesWithLimitSortedByDateDesc = async (fromDate, toDate, limit) => {
    const collectionHistoricalPrices = await getCollectionHistoricalPrices();
    return await collectionHistoricalPrices
        .find({
        date: {
            $lte: fromDate,
            $gte: toDate,
        },
    })
        .sort({
        date: -1,
    })
        .limit(limit)
        .toArray();
};
exports.findMarketPricesBetweenDatesWithLimitSortedByDateDesc = findMarketPricesBetweenDatesWithLimitSortedByDateDesc;
