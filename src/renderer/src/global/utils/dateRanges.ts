import { DateRange } from '../services/analyticsService';

export function getTodayRange(): DateRange {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.getTime(), end: end.getTime() };
}

export function getWeekRange(): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return { start: start.getTime(), end: end.getTime() };
}

export function getMonthRange(): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);
  return { start: start.getTime(), end: end.getTime() };
}

export function getAllTimeRange(): DateRange {
  return { start: 0, end: Date.now() };
}
