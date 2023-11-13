import { CalendarApi } from '@fullcalendar/core';

export type BoatApiData = {
  id: number;
  title: string;
  description?: string;
  color: string;
  isAvailable: boolean;
};

export type RequestAPIData = {
  id: number;
  boat: BoatApiData;
  end: Date;
  endStr: string;
  start: Date;
  startStr: string;
  calendar?: CalendarApi;
  status: BookingStatus;
  requestStatusColor: BookingStatusColor;
};

export enum BoatNames {
  Veda1 = 'Veda 1',
  Veda2 = 'Veda 2',
  Veda3 = 'Veda 3',
  Veda4 = 'Veda 4',
}

export enum BoatColor {
  Veda1 = '#4A148C',
  Veda2 = '#3E2723',
  Veda3 = '#00897B',
  Veda4 = '#303F9F',
}

export enum BookingStatus {
  NotSet = 'no status',
  Tentative = 'Tentative',
  Request = 'Requested',
  deposit = 'Confirmed with deposit',
}

export enum BookingStatusColor {
  NotSet = '#212121',
  Tentative = '#BF360C',
  Request = '#AD1457',
  deposit = '#66BB6A',
}

export type CalendarDates = {
  start: Date;
  startStr: string;
  end: Date;
  endStr: string;
  cut?: boolean;
  add?: boolean;
};

type ResponseBody<T> = T;

export type ResponseWrapper<T> = {
  status?: number;
  data?: ResponseBody<T>;
  isError?: boolean;
  message?: string;
};

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type UserLoginForm = {
  email: string;
  password: string;
};

export type UserRegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type UserAuthFormResponse = {
  id: number;
  role: UserRole;
  email: string;
  password: string;
  updatedAt: Date;
  createdAt: Date;
  vedaAccessToken: string;
};
