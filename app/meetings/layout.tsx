import Link from "next/link";

export default function MeetingsLayout({ children }: LayoutProps<"/meetings">) {
  return (
    <div className="space-y-6">
      <nav aria-label="Meetings" className="print:hidden">
        <ul className="flex flex-wrap gap-4 border-b border-line pb-3 text-sm">
          <li>
            <Link href="/meetings" className="font-medium text-brand hover:underline">
              Meeting list
            </Link>
          </li>
          <li>
            <Link href="/meetings/current" className="font-medium text-brand hover:underline">
              Most recent Sunday
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}
