import { BoatApiData, RequestAPIData, BookingStatusColor, BookingStatus } from '@/utils/types';
// BoatNames, BoatColor,
// import { ref } from 'vue';

const today = new Date();
const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

// export const boats: BoatApiData[] = [
//   {
//     id: 1,
//     title: BoatNames.Veda1,
//     color: BoatColor.Veda1,
//     description: 'This is a description',
//     isAvailable: true,
//   },
//   {
//     id: 2,
//     title: BoatNames.Veda2,
//     color: BoatColor.Veda2,
//     description: 'This is a description',
//     isAvailable: true,
//   },
//   {
//     id: 3,
//     title: BoatNames.Veda3,
//     color: BoatColor.Veda3,
//     description: 'This is a description',
//     isAvailable: false,
//   },
//   {
//     id: 4,
//     title: BoatNames.Veda4,
//     color: BoatColor.Veda4,
//     description: 'This is a description',
//     isAvailable: true,
//   },
// ];

// export const requestsDummeyData = ref<RequestAPIData[]>([
//   {
//     id: 1,
//     boat: boats[0],
//     start: new Date('11-01-2023'), // MDY
//     end: new Date('11-05-2023'),
//     startStr: '11-01-2023',
//     endStr: '11-05-2023',
//     requestStatusColor: BookingStatusColor.Request,
//     status: BookingStatus.NotSet,
//     companyName: 'Star X',
//     contactPerson: '(+226) - 996 - 13',
//   },
//   {
//     id: 2,
//     boat: boats[1],
//     start: new Date('11-11-2023'),
//     end: new Date('11-18-2023'),
//     startStr: '11-11-2023',
//     endStr: '11-18-2023',
//     requestStatusColor: BookingStatusColor.Tentative,
//     status: BookingStatus.Tentative,
//     companyName: 'Sponser Z',
//     contactPerson: '(+226) - 996 - 13',
//   },
//   {
//     id: 3,
//     boat: boats[2],
//     start: new Date('11-13-2023'),
//     end: new Date('11-15-2023'),
//     startStr: '11-11-2023',
//     endStr: '11-18-2023',
//     requestStatusColor: BookingStatusColor.Tentative,
//     status: BookingStatus.Tentative,
//     companyName: 'Amazing sa',
//     contactPerson: '(+226) - 996 - 13',
//   },
//   {
//     id: 4,
//     boat: boats[3],
//     start: new Date('11-20-2023'),
//     end: new Date('11-22-2023'),
//     startStr: '11-20-2023',
//     endStr: '11-22-2023',
//     requestStatusColor: BookingStatusColor.Deposit,
//     status: BookingStatus.Deposit,
//     companyName: 'Cloudyhost',
//     contactPerson: 'mango@gmail.com',
//     fee: {
//       deposit: 50,
//       total: 100,
//     },
//   },
// ]);

export const boatData: BoatApiData = {
  id: 0,
  title: undefined,
  description: undefined,
  color: '',
  isAvailable: false,
};

export const requestData: RequestAPIData = {
  id: 0,
  boat: boatData,
  end: today,
  endStr: todayStr,
  start: today,
  startStr: todayStr,
  status: BookingStatus.NotSet,
  requestStatusColor: BookingStatusColor.NotSet,
  companyName: '',
  contactPerson: '',
};
