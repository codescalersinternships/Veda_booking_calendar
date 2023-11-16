import { BoatApiData, RequestAPIData, BookingStatusColor, BookingStatus } from '@/utils/types';

const today = new Date();
const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

export const boatData: BoatApiData = {
  id: '',
  title: undefined,
  description: undefined,
  color: '',
  isAvailable: false,
};

export const requestData: RequestAPIData = {
  id: '',
  boat: boatData,
  end: today,
  endStr: todayStr,
  start: today,
  startStr: todayStr,
  status: BookingStatus.NotSet,
  requestStatusColor: BookingStatusColor.NotSet,
  companyName: '',
  contactPerson: '',
  boatId: '',
};
