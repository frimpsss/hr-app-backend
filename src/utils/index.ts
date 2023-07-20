export function getDaysBetweenDates(date1: Date, date2: Date): number {
  // Check if the two dates are the same
  if (date1.getTime() === date2.getTime()) {
    throw new Error("The two dates are the same.");
  }
  const timeDifferenceMs = Math.abs(date2.getTime() - date1.getTime());

  const daysDifference = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));

  return daysDifference;
}
