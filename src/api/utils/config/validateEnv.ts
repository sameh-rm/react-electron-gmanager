import { str, cleanEnv, port, num } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    API_PORT: port(),
    HASH_SALT: num(),
    DATABASE_URL: str(),
    TOKEN_SECRET: str()
  });
};

export default validateEnv;
