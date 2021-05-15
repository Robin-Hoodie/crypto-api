"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = require("./config");
const service_1 = require("./service");
const app = express_1.default();
let syncTask = null;
app.use(express_1.default.json());
app.get("/ping", (_, res) => res.send("pong"));
app.use((req, res, next) => {
    const apiKey = req.header("X-API-KEY");
    if (!apiKey) {
        throw new Error("No API key was set!");
    }
    if (!config_1.API_KEYS_WHITELIST?.includes(apiKey)) {
        throw new Error(`API key ${apiKey} is invalid!`);
    }
    next();
});
app.get("/market-prices", async (req, res) => {
    const marketPrices = await service_1.getLatestMarketPrices();
    return res.send(marketPrices);
});
app.get("/market-price-changes/twenty-four-hours", async (req, res) => {
    const marketPriceChangesTwentyFourHours = await service_1.getMarketPriceChangesTwentyFourHours();
    return res.send(marketPriceChangesTwentyFourHours);
});
app.get("/market-price-changes/seven-days", async (req, res) => {
    return res.send("Hello");
});
app.get("/supported-coins", async (req, res) => {
    const supportedCoins = await service_1.getSupportedCoins();
    return res.send(supportedCoins);
});
app.put("/supported-coins", async (req, res) => {
    const { coinsAdded, coinsRemoved } = await service_1.syncSupportedCoins(req.body);
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
    syncTask = node_cron_1.default.schedule(config_1.UPDATE_MARKET_PRICES_INTERVAL, async () => {
        await service_1.updateMarketPrices();
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
app.listen(config_1.SERVER_PORT, () => console.log(`Started Crypto API on port ${config_1.SERVER_PORT}`));
