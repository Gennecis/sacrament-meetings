import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import CurrentDate from "./CurrentDate";
import NavLinks, { NavList } from "./NavLinks";

export const WARD_NAME = "Riverside Ward";

export default function Header() {
  return (
    <header className="bg-brand text-white print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/ward-logo.svg" alt="Riverside Ward chapel logo" width={48} height={48} priority />
          <div>
            <p className="font-heading text-xl font-bold leading-tight">{WARD_NAME}</p>
            <CurrentDate />
          </div>
        </Link>
        <Suspense fallback={<NavList pathname={null} />}>
          <NavLinks />
        </Suspense>
      </div>
    </header>
  );
}
