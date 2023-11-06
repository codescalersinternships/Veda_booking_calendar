import { CalendarApi, EventInput } from '@fullcalendar/core';
import { ref } from 'vue';

const today = new Date();
const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

export type BoatObject = EventInput;
export type EventDetails = {
  start: Date;
  startStr: string;
  end: Date;
  endStr: string;
  boat: BoatObject;
  calendar?: CalendarApi;
};

export enum BoatNames {
  Veda1 = 'Veda 1',
  Veda2 = 'Veda 2',
  Veda3 = 'Veda 3',
  Veda4 = 'Veda 4',
}

export const reserveBoatInitializer = ref<EventDetails>({
  start: today,
  startStr: todayStr,
  end: today,
  endStr: todayStr,
  boat: {},
});

export type CalendarDates = {
  start?: Date;
  startStr?: string;
  end?: Date;
  endStr?: string;
  cut?: boolean;
  add?: boolean;
};
