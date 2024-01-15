import { BoatApiData, BookingStatusColor, BookingStatus, RequestAPIData } from '@/utils/types';

const today = new Date();
const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

class DummyRequests {
  all(): RequestAPIData[] {
    return [
      {
        id: '1',
        boatId: '1',
        boat: new DummyBoats().all()[0],
        companyName: 'Codescalers Egypt',
        contactPerson: 'Mahmoud Emad',
        status: BookingStatus.Request,
        requestStatusColor: BookingStatusColor.Request,
        start: today,
        startStr: todayStr,
        end: today,
        endStr: todayStr,
      },
      {
        id: '2',
        boatId: '3',
        boat: new DummyBoats().all()[2],
        companyName: 'Codescalers Egypt',
        contactPerson: 'Mahmoud Emad',
        status: BookingStatus.Request,
        requestStatusColor: BookingStatusColor.Request,
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        startStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 2}`,
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        endStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 7}`,
      },
      {
        id: '3',
        boatId: '1',
        boat: new DummyBoats().all()[0],
        companyName: 'Codescalers Egypt',
        contactPerson: 'Mahmoud Emad',
        status: BookingStatus.Request,
        requestStatusColor: BookingStatusColor.Request,
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        startStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 5}`,
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
        endStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 6}`,
      },
      {
        id: '4',
        boatId: '2',
        boat: new DummyBoats().all()[1],
        companyName: 'Codescalers Egypt',
        contactPerson: 'Mahmoud Emad',
        status: BookingStatus.Request,
        requestStatusColor: BookingStatusColor.Request,
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        startStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 5}`,
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
        endStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 6}`,
      },
      {
        id: '5',
        boatId: '3',
        boat: new DummyBoats().all()[2],
        companyName: 'Codescalers Egypt',
        contactPerson: 'Mahmoud Emad',
        status: BookingStatus.Request,
        requestStatusColor: BookingStatusColor.Request,
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        startStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 5}`,
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
        endStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 6}`,
      },
      {
        id: '6',
        boatId: '4',
        boat: new DummyBoats().all()[3],
        companyName: 'Codescalers Egypt',
        contactPerson: 'Mahmoud Emad',
        status: BookingStatus.Request,
        requestStatusColor: BookingStatusColor.Request,
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        startStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 5}`,
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
        endStr: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 6}`,
      },
    ];
  }
}
class DummyBoats {
  all(): BoatApiData[] {
    return [
      {
        id: '1',
        title: 'Veda 1',
        color: 'red',
        isAvailable: true,
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      {
        id: '2',
        color: 'orange',
        isAvailable: false,
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        title: 'Veda 2',
      },
      {
        id: '3',
        color: 'black',
        isAvailable: true,
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        title: 'Veda 3',
      },
      {
        id: '4',
        color: 'blue',
        isAvailable: false,
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        title: 'Veda 4',
      },
    ];
  }
}

export class DummyDataProvider {
  boats = new DummyBoats();
  requests = new DummyRequests();
}

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
