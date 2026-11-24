"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface NavListProps {
  pathname: string | null;
}

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/meetings", label: "All Meetings" },
  { href: "/meetings/current", label: "This Sunday" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (pathname === null) return false;
  if (href === "/") return pathname === "/";
  if (href === "/meetings") return pathname === "/meetings";
  return pathname.startsWith(href);
}

/** Renders the links. pathname is null while the current route is still unknown. */
export function NavList({ pathname }: NavListProps) {
  return (
    <nav aria-label="Primary">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active ? "bg-accent text-brand" : "text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function NavLinks() {
  const pathname = usePathname();
  return <NavList pathname={pathname} />;
}
