import { DateTime } from "luxon";

/**
 * Convert an IST datetime string to a UTC JS Date.
 * Use this before saving to the database.
 */
export function ISTtoUTC(dateString: string): Date {
  return DateTime.fromISO(dateString, { zone: "Asia/Kolkata" })
    .toUTC()
    .toJSDate();
}

/**
 * Convert a UTC JS Date to an IST ISO string.
 * Use this before returning to the frontend.
 */
export function UTCtoIST(date: Date): string | null{
  return DateTime.fromJSDate(date)
    .setZone("Asia/Kolkata")
    .toISO(); // or .toFormat("dd MMM yyyy, hh:mm a") for display
}
