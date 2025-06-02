import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUrl:
    process.env.MONGO_URI || "mongodb://localhost:27017/crypto_listings", // Default added
  scrapeInterval: process.env.SCRAPE_INTERVAL || "0 * * * *",
  apiKey:
    process.env.COINMARKETCAL_API_KEY ||
    "'https://developers.coinmarketcal.com/v1/events'",
  apiUrl: process.env.API_URL || "",
  botToken: process.env.BOT_TOKEN || ""
};
