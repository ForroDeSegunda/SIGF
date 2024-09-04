import supabase, { TClassDatesInsert } from "@/utils/db";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<TClassDatesInsert[] | PostgrestError>> {
  const body = await request.json();

  const { data, error } = await supabase
    .from("classDates")
    .insert(body)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { classId } = await request.json();

  const { data, error } = await supabase
    .from("classDates")
    .delete()
    .eq("classId", classId)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data as TClassDatesInsert[]);
}
