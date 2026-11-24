"use client";

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

function getToday(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getServerToday(): string {
  return "";
}

// Rendered on the client so the date matches the viewer's own time zone.
export default function CurrentDate() {
  const today = useSyncExternalStore(subscribe, getToday, getServerToday);
  return <time className="text-sm text-brand-light">{today}</time>;
}
