import { supabaseClient } from "@/supabase/client";
import { TEnrollmentRow } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(_: any, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseClient
    .from("enrollment")
    .select("*")
    .eq("userId", params.id);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data as unknown as TEnrollmentRow[]);
}
