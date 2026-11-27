"use client";

import type { FormEvent } from "react";
import { deleteMeeting } from "@/lib/actions";

interface DeleteMeetingButtonProps {
  id: number;
  label: string;
}

export default function DeleteMeetingButton({ id, label }: DeleteMeetingButtonProps) {
  const deleteMeetingWithId = deleteMeeting.bind(null, id);

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete the meeting on ${label}? This cannot be undone.`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteMeetingWithId} onSubmit={confirmDelete}>
      <button
        type="submit"
        className="font-medium text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Delete<span className="sr-only"> meeting on {label}</span>
      </button>
    </form>
  );
}
