import dotenv from "dotenv";

dotenv.config();

export const API_KEYS_WHITELIST = process.env.API_KEYS_ALLOWED?.split(",");
export const MONGODB_ADMIN_USER = process.env.MONGODB_ADMIN_USER;
export const MONGODB_ADMIN_PASSWORD = process.env.MONGODB_ADMIN_PASSWORD;
export const MONGODB_HOST = process.env.MONGODB_HOST;
export const MONGODB_PORT = process.env.MONGODB_PORT;
export const PORT = process.env.PORT;
