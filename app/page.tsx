import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-brand">Sacrament Meeting Planner</h1>
      <p className="max-w-2xl text-lg text-muted">
        Leaders can review each Sunday&apos;s program, move between current and past meetings, and print a
        clean copy of the program to hand out.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/meetings/current"
          className="rounded-md bg-brand px-5 py-3 font-medium text-white hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          View this Sunday&apos;s program
        </Link>
        <Link
          href="/meetings"
          className="rounded-md border border-brand px-5 py-3 font-medium text-brand hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Browse all meetings
        </Link>
      </div>
    </section>
  );
}
