import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const now = new Date();
  const inputDate = date instanceof Date ? date : new Date(date);
  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 60) {
    return "just now";
  }

  let counter;
  if (seconds >= intervals.year) {
    counter = Math.floor(seconds / intervals.year);
    return `${counter} year${counter > 1 ? 's' : ''} ago`;
  }
  if (seconds >= intervals.month) {
    counter = Math.floor(seconds / intervals.month);
    return `${counter} month${counter > 1 ? 's' : ''} ago`;
  }
  if (seconds >= intervals.week) {
    counter = Math.floor(seconds / intervals.week);
    return `${counter} week${counter > 1 ? 's' : ''} ago`;
  }
  if (seconds >= intervals.day) {
    counter = Math.floor(seconds / intervals.day);
    return `${counter} day${counter > 1 ? 's' : ''} ago`;
  }
  if (seconds >= intervals.hour) {
    counter = Math.floor(seconds / intervals.hour);
    return `${counter} hour${counter > 1 ? 's' : ''} ago`;
  }
  if (seconds >= intervals.minute) {
    counter = Math.floor(seconds / intervals.minute);
    return `${counter} minute${counter > 1 ? 's' : ''} ago`;
  }
  return "just now";
}
