import { MongoClient, Timestamp, WithId } from "mongodb";
import type { CoinId, CoinWithPrice } from "../types";
import {
  MONGODB_ADMIN_USER,
  MONGODB_ADMIN_PASSWORD,
  MONGODB_HOST,
  MONGODB_PORT,
} from "../config";
import type { CoinsSyncedResponse } from "../types";

const connectionString = `mongodb://${MONGODB_ADMIN_USER}:${MONGODB_ADMIN_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/?writeConcern=majority`;

interface SchemaSupportedCoin {
  coinId: CoinId;
}

interface SchemaHistoricalPrice {
  coinId: CoinId;
  price: number;
  timestamp: Timestamp;
}

const mongoClient = new MongoClient(connectionString, {
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
  return db.collection<WithId<SchemaSupportedCoin>>("supported_coins");
};

const getCollectionHistoricalPrices = async () => {
  const db = await connectToCryptoDb();
  return db.collection<WithId<SchemaHistoricalPrice>>("historical_prices");
};

export const findSupportedCoins = async (): Promise<
  WithId<SchemaSupportedCoin>[]
> => {
  const collectionSupportedCoins = await getCollectionSupportedCoins();
  return await collectionSupportedCoins.find({}).toArray();
};

export const insertSupportedCoins = async (
  coinIds: CoinId[]
): Promise<SchemaSupportedCoin[]> => {
  const collectionSupportedCoins = await getCollectionSupportedCoins();
  const documentsToInsert = coinIds.map((coinId) => ({
    coinId,
  }));
  const { insertedIds } = await collectionSupportedCoins.insertMany(
    documentsToInsert,
    {
      ordered: true,
    }
  );
  return documentsToInsert.map((document, index) => ({
    ...document,
    _id: insertedIds[index],
  }));
};

export const deleteSupportedCoins = async (
  coinIds: CoinId[]
): Promise<void> => {
  const collectionSupportedCoins = await getCollectionSupportedCoins();
  await collectionSupportedCoins.deleteMany({
    coinId: {
      $in: coinIds,
    },
  });
};

export const deleteHistoricalPricesForCoins = async (
  coinIds: CoinId[]
): Promise<void> => {
  const collectionHistoricalPrices = await getCollectionHistoricalPrices();
  await collectionHistoricalPrices.deleteMany({
    coinId: {
      $in: coinIds,
    },
  });
};

export const insertMarketPrices = async (
  coinsWithPrices: CoinWithPrice[]
): Promise<WithId<SchemaHistoricalPrice>[]> => {
  const documentsToInsert = coinsWithPrices.map((coinWithPrice) => ({
    ...coinWithPrice,
    timestamp: Timestamp.ZERO,
  }));

  const collectionHistoricalPrices = await getCollectionHistoricalPrices();
  const { insertedIds } = await collectionHistoricalPrices.insertMany(
    documentsToInsert,
    {
      ordered: true,
    }
  );
  return documentsToInsert.map((document, index) => ({
    ...document,
    _id: insertedIds[index],
  }));
};

export const findMarketPricesLatest = async (
  coinIds: CoinId[]
): Promise<WithId<SchemaHistoricalPrice>[]> => {
  const collectionHistoricalPrices = await getCollectionHistoricalPrices();
  return await collectionHistoricalPrices
    .find({
      coinId: {
        $in: coinIds,
      },
    })
    .sort({
      timestamp: -1,
    })
    .limit(coinIds.length)
    .toArray();
};
