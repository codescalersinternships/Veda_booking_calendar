import { VedaConfig } from '../utils/types';
import dotenv from 'dotenv';

const _config = dotenv.config().parsed;

export const config: VedaConfig = {
  DATABASE: {
    NAME: _config!.DATABASE_NAME,
    HOST: _config!.DATABASE_HOST,
    USER: _config!.DATABASE_USER,
    PASSWORD: _config!.DATABASE_PASSWORD,
    PORT: +_config!.DATABASE_PORT,
  },
  SERVER: {
    HOST: _config!.SERVER_HOST,
    PORT: +_config!.SERVER_PORT,
  },
  OTHER: {
    JWT_SECRET_KEY: _config!.JWT_SECRET_KEY,
    VEDA_FRONTEND_DOMAIN: _config!.VEDA_FRONTEND_DOMAIN,
  },
};
