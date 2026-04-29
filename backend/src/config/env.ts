import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",
  EDITORS: process.env.EDITORS || "Gariik Gutman, Chris Justice",
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",
};