import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <section className="space-y-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-brand">Meeting not found</h1>
      <p className="text-muted">We could not find a meeting with that ID. It may have been deleted.</p>
      <Link href="/meetings" className="inline-block font-medium text-brand hover:underline">
        Back to all meetings
      </Link>
    </section>
  );
}
