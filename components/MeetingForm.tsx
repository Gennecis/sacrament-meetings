"use client";

import { useActionState, useState, type ReactNode } from "react";
import Link from "next/link";
import type { MeetingFormValues, State } from "@/lib/actions";
import { meetingTypeLabels } from "@/lib/format";
import type { MeetingType, SacramentMeeting } from "@/lib/types";

type MeetingAction = (prevState: State, formData: FormData) => Promise<State>;

interface MeetingFormProps {
  action: MeetingAction;
  meeting?: SacramentMeeting;
  submitLabel: string;
  cancelHref: string;
}

interface SpeakerRow {
  key: number;
  name: string;
  topic: string;
  type: string;
}

const emptyValues: MeetingFormValues = {
  date: "",
  meetingType: "regular",
  presiding: "",
  conducting: "",
  announcements: "",
  openingHymnNumber: "",
  openingHymnTitle: "",
  openingPrayer: "",
  wardBusiness: "",
  stakeBusiness: false,
  sacramentHymnNumber: "",
  sacramentHymnTitle: "",
  speakers: [{ name: "", topic: "", type: "speaker" }],
  closingHymnNumber: "",
  closingHymnTitle: "",
  closingPrayer: "",
};

function toFormValues(meeting: SacramentMeeting): MeetingFormValues {
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: (meeting.announcements ?? []).join("\n"),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join("\n"),
    stakeBusiness: meeting.stakeBusiness,
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers.map(({ name, topic, type }) => ({ name, topic, type })),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}

let nextRowKey = 0;
function toRows(speakers: MeetingFormValues["speakers"]): SpeakerRow[] {
  return speakers.map((speaker) => ({ key: nextRowKey++, ...speaker }));
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand";
const labelClass = "block text-sm font-semibold text-ink";
const hintClass = "mt-1 text-sm text-muted";
const fieldsetClass = "rounded-lg border border-line p-4";
const legendClass = "px-1 font-heading text-lg font-bold text-brand";

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm font-medium text-red-700">
          {error}
        </p>
      ))}
    </div>
  );
}

function TextField({
  id,
  label,
  defaultValue,
  errors,
  type = "text",
  hint,
}: {
  id: keyof MeetingFormValues;
  label: string;
  defaultValue: string;
  errors?: string[];
  type?: string;
  hint?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        defaultValue={defaultValue}
        aria-describedby={hint ? `${id}-hint ${id}-error` : `${id}-error`}
        aria-invalid={errors ? true : undefined}
        className={inputClass}
      />
      {hint ? (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      ) : null}
      <FieldErrors id={`${id}-error`} errors={errors} />
    </div>
  );
}

function HymnFields({
  field,
  legend,
  number,
  title,
  errors,
}: {
  field: "openingHymn" | "sacramentHymn" | "closingHymn";
  legend: string;
  number: string;
  title: string;
  errors?: string[];
}) {
  return (
    <fieldset className={fieldsetClass}>
      <legend className={legendClass}>{legend}</legend>
      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <div>
          <label htmlFor={`${field}Number`} className={labelClass}>
            Number
          </label>
          <input
            id={`${field}Number`}
            name={`${field}Number`}
            type="number"
            min={1}
            max={1500}
            required
            defaultValue={number}
            aria-describedby={`${field}-error`}
            aria-invalid={errors ? true : undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${field}Title`} className={labelClass}>
            Title
          </label>
          <input
            id={`${field}Title`}
            name={`${field}Title`}
            type="text"
            required
            defaultValue={title}
            aria-describedby={`${field}-error`}
            aria-invalid={errors ? true : undefined}
            className={inputClass}
          />
        </div>
      </div>
      <FieldErrors id={`${field}-error`} errors={errors} />
    </fieldset>
  );
}

/** The create and edit form for a meeting, validated on the server. */
export default function MeetingForm({ action, meeting, submitLabel, cancelHref }: MeetingFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(action, initialState);
  const values = state.values ?? (meeting ? toFormValues(meeting) : emptyValues);

  const [rows, setRows] = useState(() => toRows(values.speakers));
  const [rowsSource, setRowsSource] = useState(state.values);
  // After a failed submit, show the speakers exactly as they were sent.
  if (state.values !== rowsSource) {
    setRowsSource(state.values);
    setRows(toRows(values.speakers));
  }

  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="date" label="Meeting date" type="date" defaultValue={values.date} errors={errors.date} />
        <div>
          <label htmlFor="meetingType" className={labelClass}>
            Meeting type
          </label>
          <select
            id="meetingType"
            name="meetingType"
            required
            defaultValue={values.meetingType}
            aria-describedby="meetingType-error"
            aria-invalid={errors.meetingType ? true : undefined}
            className={inputClass}
          >
            {(Object.keys(meetingTypeLabels) as MeetingType[]).map((type) => (
              <option key={type} value={type}>
                {meetingTypeLabels[type]}
              </option>
            ))}
          </select>
          <FieldErrors id="meetingType-error" errors={errors.meetingType} />
        </div>
        <TextField id="presiding" label="Presiding" defaultValue={values.presiding} errors={errors.presiding} />
        <TextField id="conducting" label="Conducting" defaultValue={values.conducting} errors={errors.conducting} />
      </div>

      <div>
        <label htmlFor="announcements" className={labelClass}>
          Announcements (optional)
        </label>
        <textarea
          id="announcements"
          name="announcements"
          rows={3}
          defaultValue={values.announcements}
          aria-describedby="announcements-hint announcements-error"
          className={inputClass}
        />
        <p id="announcements-hint" className={hintClass}>
          Put each announcement on its own line.
        </p>
        <FieldErrors id="announcements-error" errors={errors.announcements} />
      </div>

      <HymnFields
        field="openingHymn"
        legend="Opening hymn"
        number={values.openingHymnNumber}
        title={values.openingHymnTitle}
        errors={errors.openingHymn}
      />
      <TextField
        id="openingPrayer"
        label="Opening prayer"
        defaultValue={values.openingPrayer}
        errors={errors.openingPrayer}
      />

      <div>
        <label htmlFor="wardBusiness" className={labelClass}>
          Ward business (optional)
        </label>
        <textarea
          id="wardBusiness"
          name="wardBusiness"
          rows={3}
          defaultValue={values.wardBusiness}
          aria-describedby="wardBusiness-hint wardBusiness-error"
          className={inputClass}
        />
        <p id="wardBusiness-hint" className={hintClass}>
          Put each release or sustaining on its own line.
        </p>
        <FieldErrors id="wardBusiness-error" errors={errors.wardBusiness} />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="stakeBusiness"
          name="stakeBusiness"
          type="checkbox"
          defaultChecked={values.stakeBusiness}
          className="h-5 w-5 accent-brand"
        />
        <label htmlFor="stakeBusiness" className="text-sm font-semibold text-ink">
          Stake business will be conducted
        </label>
      </div>

      <HymnFields
        field="sacramentHymn"
        legend="Sacrament hymn"
        number={values.sacramentHymnNumber}
        title={values.sacramentHymnTitle}
        errors={errors.sacramentHymn}
      />

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Speakers and musical numbers</legend>
        <p className={hintClass}>List them in program order. Leave this empty for a testimony meeting.</p>
        <ol className="mt-3 space-y-4">
          {rows.map((row, index) => (
            <li key={row.key} className="grid gap-3 rounded-md bg-surface p-3 sm:grid-cols-[1fr_1fr_11rem_auto] sm:items-end">
              <div>
                <label htmlFor={`speakerName-${row.key}`} className={labelClass}>
                  Name
                </label>
                <input
                  id={`speakerName-${row.key}`}
                  name="speakerName"
                  type="text"
                  defaultValue={row.name}
                  aria-describedby="speakers-error"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor={`speakerTopic-${row.key}`} className={labelClass}>
                  Topic or song
                </label>
                <input
                  id={`speakerTopic-${row.key}`}
                  name="speakerTopic"
                  type="text"
                  defaultValue={row.topic}
                  aria-describedby="speakers-error"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor={`speakerType-${row.key}`} className={labelClass}>
                  Type
                </label>
                <select
                  id={`speakerType-${row.key}`}
                  name="speakerType"
                  defaultValue={row.type}
                  className={inputClass}
                >
                  <option value="speaker">Speaker</option>
                  <option value="musical-number">Musical number</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setRows(rows.filter((item) => item.key !== row.key))}
                className="rounded-md border border-gray-400 px-3 py-2 text-sm font-medium text-ink hover:bg-white focus-visible:outline-2 focus-visible:outline-brand"
              >
                Remove<span className="sr-only"> program item {index + 1}</span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setRows([...rows, ...toRows([{ name: "", topic: "", type: "speaker" }])])}
          className="mt-4 rounded-md border border-brand px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-brand"
        >
          Add speaker or musical number
        </button>
        <FieldErrors id="speakers-error" errors={errors.speakers} />
      </fieldset>

      <HymnFields
        field="closingHymn"
        legend="Closing hymn"
        number={values.closingHymnNumber}
        title={values.closingHymnTitle}
        errors={errors.closingHymn}
      />
      <TextField
        id="closingPrayer"
        label="Closing prayer"
        defaultValue={values.closingPrayer}
        errors={errors.closingPrayer}
      />

      <div aria-live="polite" aria-atomic="true">
        {state.message ? <p className="font-medium text-red-700">{state.message}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-brand px-5 py-2 font-semibold text-white hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
        <Link href={cancelHref} className="font-medium text-brand hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
