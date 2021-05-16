import dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

export const API_KEYS_WHITELIST = process.env.API_KEYS_WHITELIST?.split(",");
export const MONGODB_ADMIN_USER = process.env.MONGODB_ADMIN_USER;
export const MONGODB_ADMIN_PASSWORD = process.env.MONGODB_ADMIN_PASSWORD;
export const MONGODB_HOST = process.env.MONGODB_HOST || "127.0.0.1";
export const MONGODB_PORT = Number(process.env.MONGODB_PORT || 27017);
export const SERVER_PORT = Number(process.env.SERVER_PORT || 8080);
export const UPDATE_MARKET_PRICES_INTERVAL = process.env.UPDATE_MARKET_PRICES_INTERVAL || "*/5 * * * *";
