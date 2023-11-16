export type BoatApiData = {
  id?: string;
  title?: string;
  description?: string;
  color: string;
  isAvailable: boolean;
};

export type RequestPaymentFee = {
  total: number;
  deposit: number;
};

export type RequestAPIData = {
  id: string;
  boatId: string;
  boat: BoatApiData;
  end: Date;
  endStr: string;
  start: Date;
  startStr: string;
  companyName: string;
  contactPerson: string;
  status: BookingStatus;
  requestStatusColor: BookingStatusColor;
  fee?: RequestPaymentFee;
};

export enum BookingStatus {
  NotSet = 'no_status',
  Tentative = 'tentative',
  Request = 'requested',
  Deposit = 'confirmed_with_deposit',
}

export enum BookingStatusColor {
  NotSet = '#0277BD',
  Tentative = '#BF360C',
  Request = '#AD1457',
  Deposit = '#66BB6A',
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
