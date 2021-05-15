import { format, subHours } from "date-fns";
import { fetchMarketPricesCurrent } from "../coingecko.api";
import {
  findMarketPricesLatest,
  findSupportedCoins,
  insertMarketPrices,
  insertSupportedCoins,
  deleteSupportedCoins,
  countSupportedCoins,
  findMarketPricesBetweenDatesWithLimitSortedByDateDesc,
  deleteHistoricalPricesForCoins,
} from "../db";
import type {
  CoinId,
  CoinWithPrice,
  CoinsSyncedResponse,
  CoinWithChange,
} from "../types";

export const logTimestamp = () => {
  const timestamp = format(new Date(), "dd-MM-yyy HH:mm:ss");
  return `[${timestamp}]`;
};

export const logWithTimestamp = (msg: string) => {
  console.log(`${logTimestamp()} ${msg}`);
};

export const getLatestMarketPrices = async (): Promise<CoinWithPrice[]> => {
  const supportedCoins = await getSupportedCoins();
  const coinIds = await findMarketPricesLatest(supportedCoins);
  return coinIds.map((coin) => ({
    coinId: coin.coinId,
    price: coin.price,
  }));
};

export const getMarketPriceChangesTwentyFourHours = async (): Promise<
  CoinWithChange[]
> => {
  const amountOfSupportedCoins = await countSupportedCoins();
  const twentyFourHoursAgo = subHours(new Date(), 24);
  const twentyFiveHoursAgo = subHours(new Date(), 25);
  const latestMarketPrices = await getLatestMarketPrices();
  const twentyFourHoursAgoMarketPrices =
    await findMarketPricesBetweenDatesWithLimitSortedByDateDesc(
      twentyFiveHoursAgo,
      twentyFourHoursAgo,
      amountOfSupportedCoins
    );
  const twentyFourHoursAgoCoinIds = twentyFourHoursAgoMarketPrices.map(
    ({ coinId }) => coinId
  );
  return latestMarketPrices
    .filter(({ coinId }) =>
      // Don't attempt to calculate change for coins without data
      twentyFourHoursAgoCoinIds.includes(coinId)
    )
    .map(({ coinId, price }) => ({
      coinId,
      change:
        price /
          twentyFourHoursAgoMarketPrices.find(
            (marketPrice) => marketPrice.coinId === coinId
          )!.price -
        1,
    }));
};

export const updateMarketPrices = async (): Promise<void> => {
  logWithTimestamp("Updating market prices: START");
  const supportedCoins = await getSupportedCoins();
  const coinsWithPrices = await fetchMarketPricesCurrent(supportedCoins);
  const insertedMarketPrices = await insertMarketPrices(coinsWithPrices);
  logWithTimestamp(
    `Updating market prices: DONE - ${JSON.stringify(insertedMarketPrices)}`
  );
};

export const getSupportedCoins = async (): Promise<CoinId[]> => {
  const supportedCoins = await findSupportedCoins();
  return supportedCoins.map((coin) => coin.coinId);
};

export const syncSupportedCoins = async (
  coinIds: CoinId[]
): Promise<CoinsSyncedResponse> => {
  logWithTimestamp("Synchronizing supported coins: START");
  const documentsCurrentCoinIds = await findSupportedCoins();
  const currentCoinIds = documentsCurrentCoinIds.map(
    (document) => document.coinId
  );
  const coinsToAdd = coinIds.filter(
    (coinId) => !currentCoinIds.includes(coinId)
  );
  const coinsToRemove = currentCoinIds.filter(
    (coinId) => !coinIds.includes(coinId)
  );
  if (coinsToAdd.length) {
    await insertSupportedCoins(coinsToAdd);
  }
  if (coinsToRemove.length) {
    await deleteSupportedCoins(coinsToRemove);
    await deleteHistoricalPricesForCoins(coinsToRemove);
  }
  logWithTimestamp("Synchronizing supported coins: DONE");
  return {
    coinsAdded: coinsToAdd,
    coinsRemoved: coinsToRemove,
  };
};
