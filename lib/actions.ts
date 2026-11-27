"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { addMeeting, deleteMeeting as removeMeeting, updateMeeting as saveMeeting } from "./meetings-db";

const name = (label: string) =>
  z.string().trim().min(2, `${label} must be at least 2 characters.`).max(255, `${label} is too long.`);

const hymn = (label: string) =>
  z.object({
    number: z.coerce
      .number({ error: `${label} number must be a number.` })
      .int(`${label} number must be a whole number.`)
      .min(1, `${label} number must be 1 or more.`)
      .max(1500, `${label} number must be 1500 or less.`),
    title: z.string().trim().min(1, `Enter the ${label.toLowerCase()} title.`).max(255, `${label} title is too long.`),
  });

const MeetingFormSchema = z.object({
  date: z.iso.date("Choose a valid meeting date."),
  meetingType: z.enum(["regular", "testimony", "stake", "general", "special"], {
    error: "Choose a meeting type.",
  }),
  presiding: name("Presiding"),
  conducting: name("Conducting"),
  announcements: z.array(z.string().max(500, "Each announcement must be 500 characters or less.")),
  openingHymn: hymn("Opening hymn"),
  openingPrayer: name("Opening prayer"),
  wardBusiness: z.array(
    z.object({ description: z.string().max(500, "Each ward business item must be 500 characters or less.") }),
  ),
  stakeBusiness: z.boolean(),
  sacramentHymn: hymn("Sacrament hymn"),
  speakers: z.array(
    z.object({
      name: z.string().trim().min(2, "Each program item needs a name of at least 2 characters."),
      topic: z.string().trim().min(2, "Each program item needs a topic or song title."),
      type: z.enum(["speaker", "musical-number"], { error: "Choose speaker or musical number." }),
    }),
  ),
  closingHymn: hymn("Closing hymn"),
  closingPrayer: name("Closing prayer"),
});

type MeetingFormFields = keyof z.infer<typeof MeetingFormSchema>;

/** What the form submitted, kept as text so the fields can be refilled after an error. */
export type MeetingFormValues = {
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  announcements: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  wardBusiness: string;
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakers: { name: string; topic: string; type: string }[];
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
};

export type State = {
  errors?: Partial<Record<MeetingFormFields, string[]>>;
  message?: string | null;
  values?: MeetingFormValues;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** One trimmed entry per non-empty line of a textarea. */
function lines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function readForm(formData: FormData): MeetingFormValues {
  const speakerNames = formData.getAll("speakerName").map(String);
  const speakerTopics = formData.getAll("speakerTopic").map(String);
  const speakerTypes = formData.getAll("speakerType").map(String);

  return {
    date: text(formData, "date"),
    meetingType: text(formData, "meetingType"),
    presiding: text(formData, "presiding"),
    conducting: text(formData, "conducting"),
    announcements: text(formData, "announcements"),
    openingHymnNumber: text(formData, "openingHymnNumber"),
    openingHymnTitle: text(formData, "openingHymnTitle"),
    openingPrayer: text(formData, "openingPrayer"),
    wardBusiness: text(formData, "wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness") === "on",
    sacramentHymnNumber: text(formData, "sacramentHymnNumber"),
    sacramentHymnTitle: text(formData, "sacramentHymnTitle"),
    speakers: speakerNames
      .map((speakerName, index) => ({
        name: speakerName,
        topic: speakerTopics[index] ?? "",
        type: speakerTypes[index] ?? "speaker",
      }))
      // A row left completely blank is ignored rather than reported as an error.
      .filter((speaker) => speaker.name.trim() || speaker.topic.trim()),
    closingHymnNumber: text(formData, "closingHymnNumber"),
    closingHymnTitle: text(formData, "closingHymnTitle"),
    closingPrayer: text(formData, "closingPrayer"),
  };
}

function validate(values: MeetingFormValues) {
  return MeetingFormSchema.safeParse({
    date: values.date,
    meetingType: values.meetingType,
    presiding: values.presiding,
    conducting: values.conducting,
    announcements: lines(values.announcements),
    openingHymn: { number: values.openingHymnNumber, title: values.openingHymnTitle },
    openingPrayer: values.openingPrayer,
    wardBusiness: lines(values.wardBusiness).map((description) => ({ description })),
    stakeBusiness: values.stakeBusiness,
    sacramentHymn: { number: values.sacramentHymnNumber, title: values.sacramentHymnTitle },
    speakers: values.speakers,
    closingHymn: { number: values.closingHymnNumber, title: values.closingHymnTitle },
    closingPrayer: values.closingPrayer,
  });
}

function isDuplicateDate(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

const duplicateDateState = (values: MeetingFormValues): State => ({
  errors: { date: ["A meeting is already planned for this date."] },
  message: "Please fix the highlighted fields.",
  values,
});

export async function createMeeting(prevState: State, formData: FormData): Promise<State> {
  const values = readForm(formData);
  const validatedFields = validate(values);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: "Missing or invalid fields. Failed to create meeting.",
      values,
    };
  }

  try {
    await addMeeting(validatedFields.data);
  } catch (error) {
    if (isDuplicateDate(error)) return duplicateDateState(values);
    console.error("Error creating meeting:", error);
    throw new Error("Failed to create the meeting. Please try again later.");
  }

  revalidatePath("/meetings", "layout");
  redirect("/meetings");
}

export async function updateMeeting(id: number, prevState: State, formData: FormData): Promise<State> {
  const values = readForm(formData);
  const validatedFields = validate(values);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: "Missing or invalid fields. Failed to update meeting.",
      values,
    };
  }

  let updated: boolean;
  try {
    updated = await saveMeeting(id, validatedFields.data);
  } catch (error) {
    if (isDuplicateDate(error)) return duplicateDateState(values);
    console.error("Error updating meeting:", error);
    throw new Error("Failed to update the meeting. Please try again later.");
  }

  if (!updated) {
    return { message: "This meeting no longer exists. It may have been deleted.", values };
  }

  revalidatePath("/meetings", "layout");
  redirect(`/meetings/${id}`);
}

export async function deleteMeeting(id: number) {
  try {
    await removeMeeting(id);
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw new Error("Failed to delete the meeting. Please try again later.");
  }

  revalidatePath("/meetings", "layout");
  redirect("/meetings");
}
