import { supabaseClient } from "@/supabase/client";
import { TPeriodInsert } from "@/utils/db";
import { NextResponse } from "next/server";

const TABLE = "period";

export async function GET(_: any, { params }) {
  const { data, error } = await supabaseClient
    .from(TABLE)
    .select()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0] as TPeriodInsert);
}
