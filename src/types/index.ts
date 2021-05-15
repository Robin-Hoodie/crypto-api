export type CoinId =
  | "cardano"
  | "ethereum"
  | "bitcoin"
  | "binancecoin"
  | "litecoin"
  | "avalanche-2"
  | "polkadot"
  | "dai"
  | "thorchain"
  | "ripple"
  | "etoro-euro"
  | "chainlink";
export interface CoinWithPrice {
  coinId: CoinId;
  price: number;
}

export interface CoinWithChange {
  coinId: CoinId;
  change: number;
}

export interface CoinsSyncedResponse {
  coinsAdded: CoinId[];
  coinsRemoved: CoinId[];
}
