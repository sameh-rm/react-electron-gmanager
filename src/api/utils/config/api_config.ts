import * as dotenv from 'dotenv';
dotenv.config();

type Config = {
  NODE_ENV: string;
  API_PORT: number;
  API_URL: string;
  HASH_SALT: number;
  DATABASE_URL: string;
  TOKEN_SECRET: string;
};

const apiConfig: Config = {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.API_URL,
  API_PORT: +process.env.API_PORT,
  HASH_SALT: +process.env.HASH_SALT,
  DATABASE_URL: process.env.DATABASE_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET
};
export default apiConfig;
