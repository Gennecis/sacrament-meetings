import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getMeetings } from "@/lib/meetings-db";
import { getMostRecentSunday } from "@/lib/format";

export default async function CurrentMeetingPage() {
  // Wait for the request so "today" is computed at request time instead of build time.
  await connection();

  const sunday = getMostRecentSunday(new Date());
  const [match] = getMeetings(sunday);

  if (match) {
    redirect(`/meetings/${match.id}`);
  }

  // No program for this Sunday yet: fall back to the latest meeting on or before it.
  const latestPast = getMeetings().find((meeting) => meeting.date <= sunday);
  redirect(latestPast ? `/meetings/${latestPast.id}` : "/meetings");
}
