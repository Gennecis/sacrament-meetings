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

/** The fields a meeting form submits: everything except the generated id. */
export type MeetingInput = Omit<SacramentMeeting, "id">;

/** Inserts a meeting and returns its new id. */
export async function addMeeting(data: MeetingInput): Promise<number> {
  const rows = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${data.date}, ${data.meetingType}, ${data.presiding}, ${data.conducting}, ${data.announcements ?? []},
      ${JSON.stringify(data.openingHymn)}::jsonb, ${data.openingPrayer},
      ${JSON.stringify(data.wardBusiness)}::jsonb, ${data.stakeBusiness},
      ${JSON.stringify(data.sacramentHymn)}::jsonb, ${JSON.stringify(data.speakers)}::jsonb,
      ${JSON.stringify(data.closingHymn)}::jsonb, ${data.closingPrayer}
    )
    RETURNING id
  `;
  return rows[0].id as number;
}

/** Replaces every field of a meeting. Returns false when no meeting has that id. */
export async function updateMeeting(id: number, data: MeetingInput): Promise<boolean> {
  const rows = await sql`
    UPDATE meetings SET
      date = ${data.date},
      meeting_type = ${data.meetingType},
      presiding = ${data.presiding},
      conducting = ${data.conducting},
      announcements = ${data.announcements ?? []},
      opening_hymn = ${JSON.stringify(data.openingHymn)}::jsonb,
      opening_prayer = ${data.openingPrayer},
      ward_business = ${JSON.stringify(data.wardBusiness)}::jsonb,
      stake_business = ${data.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(data.sacramentHymn)}::jsonb,
      speakers = ${JSON.stringify(data.speakers)}::jsonb,
      closing_hymn = ${JSON.stringify(data.closingHymn)}::jsonb,
      closing_prayer = ${data.closingPrayer}
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

/** Deletes a meeting. Returns false when no meeting has that id. */
export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
