import { DateTime } from "luxon";

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Get first two words initials from name
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const formatDate = (date: string | Date): string => {
  const dt =
    date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date);
  return dt.toFormat("MMM d, yyyy"); // e.g., "Jan 5, 2025"
};
