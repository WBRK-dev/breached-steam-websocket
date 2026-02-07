import { config } from "dotenv";
config();

export const LARAVEL_URL = process.env.LARAVEL_URL;

export const CACHE_DRIVER = process.env.CACHE_DRIVER || 'memory';
