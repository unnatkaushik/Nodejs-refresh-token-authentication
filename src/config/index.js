import dotenv from "dotenv";

dotenv.config();
const config = {
  DBurl: process.env.MONGODB_URL,
};

export default config;
