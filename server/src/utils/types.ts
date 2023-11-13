import { Sequelize, ModelStatic, Model } from 'sequelize';

export type UserApiData = SignupBody & {
  id: number;
  role: UserRole;
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
  firstName: string;
  lastName: string;
};

export type RequestBody = {
  boat: number;
  start: Date;
  end: Date;
  status: BookingStatus;
};

export type BoatBody = {
  title: string;
  description?: string;
  isAvailable: boolean;
};

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum BoatNames {
  Veda1 = 'veda_1',
  Veda2 = 'veda_2',
  Veda3 = 'veda_3',
  Veda4 = 'veda_4',
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

export type Database = {
  sequelize?: Sequelize;
  users?: ModelStatic<Model<any, any>>;
  requests?: ModelStatic<Model<any, any>>;
  boats?: ModelStatic<Model<any, any>>;
};

export enum BookingStatus {
  NotSet = 'no_status',
  Tentative = 'tentative',
  Request = 'requested',
  deposit = 'confirmed_with_deposit',
}

export type UserAuthFormResponse = {
  id: number;
  role: UserRole;
  email: string;
  password: string;
  updatedAt: Date;
  createdAt: Date;
  vedaAccessToken: string;
  firstName: string;
  lastName: string;
};
