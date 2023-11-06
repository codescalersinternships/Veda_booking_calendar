import { EventDetails } from '@/utils/types';
import { EventApi } from '@fullcalendar/core';
import { handelDates } from '@/utils/helpers';

export const eventReserved = (event: EventDetails): EventApi | null => {
  const dates = handelDates({
    end: event.end,
    start: event.start,
    endStr: event.endStr,
    startStr: event.startStr,
    add: true,
  });

  const id = 'randomUUID()';
  if (event.calendar) {
    return event.calendar.addEvent({
      id: id,
      title: event.boat?.title,
      start: dates.start,
      startStr: dates.startStr,
      endStr: dates.endStr,
      end: dates.end,
      allDay: true,
    });
  }
  return null;
};
