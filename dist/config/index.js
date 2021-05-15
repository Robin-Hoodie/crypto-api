"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_MARKET_PRICES_INTERVAL = exports.SERVER_PORT = exports.MONGODB_PORT = exports.MONGODB_HOST = exports.MONGODB_ADMIN_PASSWORD = exports.MONGODB_ADMIN_USER = exports.API_KEYS_WHITELIST = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV === "development") {
    dotenv_1.default.config();
}
exports.API_KEYS_WHITELIST = process.env.API_KEYS_ALLOWED?.split(",");
exports.MONGODB_ADMIN_USER = process.env.MONGODB_ADMIN_USER;
exports.MONGODB_ADMIN_PASSWORD = process.env.MONGODB_ADMIN_PASSWORD;
exports.MONGODB_HOST = process.env.MONGODB_HOST || "127.0.0.1";
exports.MONGODB_PORT = Number(process.env.MONGODB_PORT || 27017);
exports.SERVER_PORT = Number(process.env.SERVER_PORT || 8080);
exports.UPDATE_MARKET_PRICES_INTERVAL = process.env.UPDATE_MARKET_PRICES_INTERVAL || "*/5 * * * *";
