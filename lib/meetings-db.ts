import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 5;

// Read queries cast date to text so it stays a YYYY-MM-DD string
// and alias snake_case columns to the camelCase SacramentMeeting fields.

export async function getMeetings(query: string = "", currentPage: number = 1): Promise<SacramentMeeting[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const pattern = `%${query}%`;

  const rows = await sql`
    SELECT
      id,
      date::text AS date,
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE
      presiding ILIKE ${pattern} OR
      conducting ILIKE ${pattern} OR
      meeting_type ILIKE ${pattern} OR
      speakers::text ILIKE ${pattern}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;

  return rows as SacramentMeeting[];
}

export async function getMeetingsTotalPages(query: string = ""): Promise<number> {
  const pattern = `%${query}%`;

  const rows = await sql`
    SELECT COUNT(*) AS count
    FROM meetings
    WHERE
      presiding ILIKE ${pattern} OR
      conducting ILIKE ${pattern} OR
      meeting_type ILIKE ${pattern} OR
      speakers::text ILIKE ${pattern}
  `;

  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      date::text AS date,
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE id = ${id}
  `;

  return (rows[0] as SacramentMeeting | undefined) ?? null;
}

/** Meetings held on one date (YYYY-MM-DD). Used by the API date filter and /meetings/current. */
export async function getMeetingsByDate(date: string): Promise<SacramentMeeting[]> {
  const rows = await sql`
    SELECT
      id,
      date::text AS date,
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE date = ${date}
  `;

  return rows as SacramentMeeting[];
}

/** Id of the latest meeting on or before the given date, or null when there is none. */
export async function getLatestMeetingIdOnOrBefore(date: string): Promise<number | null> {
  const rows = await sql`
    SELECT id FROM meetings WHERE date <= ${date} ORDER BY date DESC LIMIT 1
  `;

  return rows.length > 0 ? Number(rows[0].id) : null;
}

// Create, update and delete are implemented in Week 04.

export async function addMeeting(data: Omit<SacramentMeeting, "id">): Promise<SacramentMeeting> {
  void data;
  throw new Error("addMeeting is not implemented yet.");
}

export async function updateMeeting(id: number, updates: Partial<SacramentMeeting>): Promise<SacramentMeeting | null> {
  void id;
  void updates;
  throw new Error("updateMeeting is not implemented yet.");
}

export async function deleteMeeting(id: number): Promise<boolean> {
  void id;
  throw new Error("deleteMeeting is not implemented yet.");
}
