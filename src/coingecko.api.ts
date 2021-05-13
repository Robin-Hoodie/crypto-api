import axios from "axios";
import type { CoinId, CoinWithPrice } from "./types";

const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3/";
const CURRENCY_USD = "usd";

export const COINGECKO_API_BASE_URL_SIMPLE_PRICE = `${COINGECKO_API_BASE_URL}simple/price`;

type CoinGeckoSimplePriceResponse = {
  [coin in CoinId]: {
    [CURRENCY_USD]: number;
  };
};

export const fetchMarketPricesCurrent = async (coins: CoinId[]) => {
  const { data } = await axios.get<CoinGeckoSimplePriceResponse>(
    `${COINGECKO_API_BASE_URL_SIMPLE_PRICE}?ids=${coins}&vs_currencies=${CURRENCY_USD}`
  );
  return Object.entries(data).reduce<CoinWithPrice[]>(
    (coinsWithPrices, [coinId, prices]) => [
      ...coinsWithPrices,
      {
        coinId: coinId as CoinId,
        price: prices.usd,
      },
    ],
    []
  );
};
