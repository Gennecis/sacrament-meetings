import Link from "next/link";
import DeleteMeetingButton from "./DeleteMeetingButton";
import { formatMeetingDate, meetingTypeLabels } from "@/lib/format";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const speakerCount = meeting.speakers.filter((item) => item.type === "speaker").length;
  const dateLabel = formatMeetingDate(meeting.date);

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-dark">
        {meetingTypeLabels[meeting.meetingType]}
      </p>
      <h2 className="mt-1 font-heading text-lg font-bold text-brand">
        <Link
          href={`/meetings/${meeting.id}`}
          className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {dateLabel}
        </Link>
      </h2>
      <dl className="mt-3 space-y-1 text-sm text-muted">
        <div className="flex gap-2">
          <dt className="font-medium text-ink">Conducting:</dt>
          <dd>{meeting.conducting}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-ink">Speakers:</dt>
          <dd>{speakerCount === 0 ? "None scheduled" : speakerCount}</dd>
        </div>
      </dl>
      <div className="mt-4 flex gap-4 border-t border-line pt-3 text-sm print:hidden">
        <Link
          href={`/meetings/${meeting.id}/edit`}
          className="font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Edit<span className="sr-only"> meeting on {dateLabel}</span>
        </Link>
        <DeleteMeetingButton id={meeting.id} label={dateLabel} />
      </div>
    </article>
  );
}
