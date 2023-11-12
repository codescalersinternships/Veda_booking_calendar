export type UserApiData = SignupBody & {
  id: number;
  role: UserRole;
  firstName: string;
  lastName: string;
};

type ResponseBody<T> = {};

export interface ResponseType<T = any> {
  message: string;
  status: number;
  data?: ResponseBody<T>;
}

export type SignupBody = {
  email: string;
  password: string;
};

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type VedaServerConfig = {
  PORT: number;
  HOST: string;
};

type OtherConfig<T> = {
  JWT_SECRET_KEY: string;
  VEDA_FRONTEND_DOMAIN: string;
};

export type VedaConfig<T = any> = {
  SERVER: VedaServerConfig;
  DATABASE: VedaDatabaseConfig;
  OTHER: OtherConfig<T>;
};

export type VedaDatabaseConfig = {
  HOST: string;
  USER: string;
  PASSWORD: string;
  NAME: string;
  PORT: number;

  dialect?: string;
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
};
