import express from "express";
import cron, { ScheduledTask } from "node-cron";
import { SERVER_PORT, UPDATE_MARKET_PRICES_INTERVAL } from "./config";
import {
  getLatestMarketPrices,
  getMarketPriceChangesTwentyFourHours,
  getSupportedCoins,
  syncSupportedCoins,
  updateMarketPrices,
} from "./service";
import type { CoinId } from "./types";

const app = express();
app.use(express.json());

let syncTask: ScheduledTask | null = null;

app.get("/ping", (_, res) => res.send("pong"));

app.get("/market-prices", async (req, res) => {
  const marketPrices = await getLatestMarketPrices();
  return res.send(marketPrices);
});

app.get("/market-price-changes/twenty-four-hours", async (req, res) => {
  const marketPriceChangesTwentyFourHours =
    await getMarketPriceChangesTwentyFourHours();
  return res.send(marketPriceChangesTwentyFourHours);
});

app.get("/market-price-changes/seven-days", async (req, res) => {
  return res.send("Hello");
});

app.get("/supported-coins", async (req, res) => {
  const supportedCoins = await getSupportedCoins();
  return res.send(supportedCoins);
});

app.put("/supported-coins", async (req, res) => {
  const { coinsAdded, coinsRemoved } = await syncSupportedCoins(
    req.body as CoinId[]
  );
  return res.send({
    message: "Synced coins",
    details: {
      coinsAdded,
      coinsRemoved,
    },
  });
});

app.post("/market-prices/start-sync", async (req, res) => {
  if (syncTask) {
    res.send({
      message: "Sync was already started, not starting again",
    });
    return;
  }
  syncTask = cron.schedule(UPDATE_MARKET_PRICES_INTERVAL, async () => {
    await updateMarketPrices();
  });
  res.send({
    message: "Syncing prices started",
  });
});

app.post("/market-prices/stop-sync", async (req, res) => {
  if (!syncTask) {
    res.send({
      message: "Sync was already stopped",
    });
    return;
  }
  syncTask.stop();
  syncTask = null;
  res.send({
    message: "Syncing prices stopped",
  });
});

app.listen(SERVER_PORT, () =>
  console.log(`Started Crypto API on port ${SERVER_PORT}`)
);
