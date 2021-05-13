import dotenv from "dotenv";

dotenv.config();

export const API_KEYS_WHITELIST = process.env.API_KEYS_ALLOWED?.split(",");
export const MONGODB_ADMIN_USER = process.env.MONGODB_ADMIN_USER;
export const MONGODB_ADMIN_PASSWORD = process.env.MONGODB_ADMIN_PASSWORD;
export const MONGODB_HOST = process.env.MONGODB_HOST || "127.0.0.1";
export const MONGODB_PORT = Number(process.env.MONGODB_PORT || 27017);
export const PORT = Number(process.env.PORT || 8080);
export const HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
