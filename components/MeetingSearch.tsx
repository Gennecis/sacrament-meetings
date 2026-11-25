"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="print:hidden">
      <label htmlFor="meeting-search" className="sr-only">
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        aria-label="Search meetings"
        placeholder="Search by speaker, presiding, conducting or meeting type"
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(event) => handleSearch(event.target.value)}
        className="w-full rounded-md border border-line bg-white px-4 py-2 text-ink placeholder:text-muted focus:border-brand focus:outline-2 focus:outline-brand"
      />
    </div>
  );
}
