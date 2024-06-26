import dotenv from "dotenv";

dotenv.config();
const config = {
  DBurl: process.env.MONGODB_URL,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
};

export default config;
