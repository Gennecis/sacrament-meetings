"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

const linkClass =
  "rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-brand hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
const disabledClass = "rounded-md border border-line px-4 py-2 text-sm font-medium text-muted";

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  // Keeps the current search query when moving between pages.
  function createPageUrl(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 print:hidden">
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Previous
        </span>
      )}
      <p className="text-sm text-muted">
        Page {currentPage} of {totalPages}
      </p>
      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)} className={linkClass}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Next
        </span>
      )}
    </nav>
  );
}
