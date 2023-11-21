import { VedaConfig } from '../utils/types';
import dotenv from 'dotenv';

type DotEnvConf = {
  DATABASE_NAME: string;
  DATABASE_HOST: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: string;
  SERVER_HOST: string;
  SERVER_PORT: string;
  JWT_SECRET_KEY: string;
  VEDA_FRONTEND_DOMAIN: string;
};

const _config: DotEnvConf = dotenv.config().parsed as unknown as DotEnvConf;

export const config: VedaConfig = {
  DATABASE: {
    NAME: _config.DATABASE_NAME || 'veda',
    HOST: _config.DATABASE_HOST || 'localhost',
    USER: _config.DATABASE_USER || 'postgres',
    PASSWORD: _config.DATABASE_PASSWORD || 'postgres',
    PORT: +_config.DATABASE_PORT || 5432,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  SERVER: {
    HOST: _config.SERVER_HOST,
    PORT: +_config.SERVER_PORT,
  },
  OTHER: {
    JWT_SECRET_KEY: _config.JWT_SECRET_KEY,
    VEDA_FRONTEND_DOMAIN: _config.VEDA_FRONTEND_DOMAIN,
  },
};
