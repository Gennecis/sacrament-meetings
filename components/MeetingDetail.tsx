import { formatHymn, formatMeetingDate, meetingTypeLabels } from "@/lib/format";
import type { SacramentMeeting } from "@/lib/types";
import { WARD_NAME } from "./Header";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

interface ProgramRowProps {
  label: string;
  children: React.ReactNode;
}

function ProgramRow({ label, children }: ProgramRowProps) {
  return (
    <div className="grid gap-1 border-b border-line py-3 sm:grid-cols-[12rem_1fr] print:grid-cols-[12rem_1fr]">
      <dt className="font-semibold text-brand">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const program = meeting.speakers;

  return (
    <article className="rounded-lg border border-line bg-white p-6 shadow-sm print:border-0 print:p-0 print:shadow-none">
      <header className="mb-4 text-center">
        <p className="text-sm text-muted">{WARD_NAME}</p>
        <h1 className="font-heading text-2xl font-bold text-brand">{meetingTypeLabels[meeting.meetingType]}</h1>
        <p className="text-muted">{formatMeetingDate(meeting.date)}</p>
      </header>

      <dl>
        <ProgramRow label="Presiding">{meeting.presiding}</ProgramRow>
        <ProgramRow label="Conducting">{meeting.conducting}</ProgramRow>
        <ProgramRow label="Announcements">
          {meeting.announcements && meeting.announcements.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {meeting.announcements.map((announcement) => (
                <li key={announcement}>{announcement}</li>
              ))}
            </ul>
          ) : (
            "None"
          )}
        </ProgramRow>
        <ProgramRow label="Opening Hymn">{formatHymn(meeting.openingHymn)}</ProgramRow>
        <ProgramRow label="Opening Prayer">{meeting.openingPrayer}</ProgramRow>
        <ProgramRow label="Ward Business">
          {meeting.wardBusiness.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {meeting.wardBusiness.map((item) => (
                <li key={item.description}>{item.description}</li>
              ))}
            </ul>
          ) : (
            "None"
          )}
        </ProgramRow>
        <ProgramRow label="Stake Business">{meeting.stakeBusiness ? "Yes" : "No"}</ProgramRow>
        <ProgramRow label="Sacrament Hymn">
          {formatHymn(meeting.sacramentHymn)}
        </ProgramRow>
        <ProgramRow label="Speakers and Music">
          {program.length > 0 ? (
            <ol className="space-y-2">
              {program.map((item) => (
                <li key={`${item.name}-${item.topic}`}>
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent-dark">
                    {item.type === "speaker" ? "Speaker" : "Musical Number"}
                  </span>
                  <br />
                  <span className="font-medium">{item.name}</span> &ndash; {item.topic}
                </li>
              ))}
            </ol>
          ) : meeting.meetingType === "testimony" ? (
            "Testimonies from the congregation"
          ) : (
            "None scheduled"
          )}
        </ProgramRow>
        <ProgramRow label="Closing Hymn">{formatHymn(meeting.closingHymn)}</ProgramRow>
        <ProgramRow label="Closing Prayer">{meeting.closingPrayer}</ProgramRow>
      </dl>
    </article>
  );
}
