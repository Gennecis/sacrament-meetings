import type { Metadata } from "next";
import MeetingCard from "@/components/MeetingCard";
import { getBaseUrl } from "@/lib/base-url";
import type { SacramentMeeting } from "@/lib/types";

export const metadata: Metadata = {
  title: "All Meetings",
};

async function fetchMeetings(): Promise<SacramentMeeting[]> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load meetings.");
  }
  return (await response.json()) as SacramentMeeting[];
}

export default async function MeetingsPage() {
  const meetings = await fetchMeetings();

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-brand">All Meetings</h1>
      {meetings.length === 0 ? (
        <p className="text-muted">No meetings have been planned yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <MeetingCard meeting={meeting} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
