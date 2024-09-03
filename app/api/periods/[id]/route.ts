import supabase, { TPeriod } from "@/utils/db";
import { NextResponse } from "next/server";

const TABLE = "period";

export async function GET(_: any, { params }) {
  const { data, error } = await supabase
    .from(TABLE)
    .select()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0] as TPeriod);
}
