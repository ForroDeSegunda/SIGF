import { supabaseClient } from "@/supabase/client";
import { TAttendanceInsert } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

const TABLE = "attendance";

export async function GET() {
  const { data, error } = await supabaseClient
    .from(TABLE)
    .select(`*, classDates(*)`);
  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body: TAttendanceInsert = await request.json();

  const { data, error } = await supabaseClient
    .from(TABLE)
    .insert(body)
    .select();

  if (error) {
    if (error.message.includes("duplicate key")) {
      return NextResponse.json(
        { message: "Already marked as present" },
        { status: 400 },
      );
    }

    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data as TAttendanceInsert[]);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const userIds: string[] = body.userIds;
  const classDateIds: string[] = body.classDateIds;

  const { data, error } = await supabaseClient
    .from(TABLE)
    .delete()
    .in("userId", userIds)
    .in("classDateId", classDateIds)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const { id, ...body } = await request.json();

  const { data, error } = await supabaseClient
    .from(TABLE)
    .update(body)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0]);
}
