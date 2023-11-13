import { RouteLocationNormalizedLoaded } from 'vue-router';
import { CalendarDates } from './types';

const SPECIAL_CHARS = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

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

export function containsSpecialChars(str: string) {
  return SPECIAL_CHARS.test(str);
}

export function containsNumbers(str: string) {
  return /\d/.test(str);
}

// Return true if current route related to auth routes and false if not.
export const checkRoute = (route: RouteLocationNormalizedLoaded): boolean => {
  const authRoutes = ['login', 'register'];
  if (route.name && authRoutes.includes(route.name.toString())) {
    return true;
  }
  return false;
};
