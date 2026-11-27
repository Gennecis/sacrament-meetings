import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { formatMeetingDate } from "@/lib/format";
import { getMeetingById } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Edit Meeting",
};

export default async function EditMeetingPage(props: PageProps<"/meetings/[id]/edit">) {
  const params = await props.params;
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const meeting = await getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand">Edit Meeting</h1>
        <p className="mt-1 text-muted">{formatMeetingDate(meeting.date)}</p>
      </div>
      <MeetingForm
        action={updateMeeting.bind(null, id)}
        meeting={meeting}
        submitLabel="Save changes"
        cancelHref={`/meetings/${id}`}
      />
    </section>
  );
}
