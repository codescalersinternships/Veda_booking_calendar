import { CalendarDates } from './types';

export const handelDates = (dates: CalendarDates): CalendarDates => {
  const endDate = new Date(dates.end || '');
  if (dates.cut) {
    endDate.setDate(endDate.getDate() - 1);
  } else if (dates.add) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const endStr = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
  const startStr = `${dates.start!.getFullYear()}-${dates.start!.getMonth() + 1}-${dates.start!.getDate()}`;

  dates.end = endDate;
  // dates.start = dates.start;
  dates.endStr = endStr;
  dates.startStr = startStr;
  return dates;
};
