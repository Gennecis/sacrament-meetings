import type { Hymn, MeetingType } from "./types";

export const meetingTypeLabels: Record<MeetingType, string> = {
  testimony: "Fast and Testimony Meeting",
  regular: "Sacrament Meeting",
  stake: "Stake Conference",
  general: "General Conference",
};

/** Formats a YYYY-MM-DD string without shifting it into the local time zone. */
export function formatMeetingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatHymn(hymn: Hymn): string {
  return `#${hymn.number} ${hymn.title}`;
}

/** Returns the most recent Sunday (today if today is Sunday) as YYYY-MM-DD. */
export function getMostRecentSunday(today: Date): string {
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, "0");
  const day = String(sunday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
