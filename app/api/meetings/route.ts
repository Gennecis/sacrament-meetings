import type { NextRequest } from "next/server";
import { getMeetings, getMeetingsByDate } from "@/lib/meetings-db";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const date = params.get("date");
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ error: "Date must use the YYYY-MM-DD format." }, { status: 400 });
    }
    return Response.json(await getMeetingsByDate(date));
  }

  const query = params.get("query") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  return Response.json(await getMeetings(query, page));
}
