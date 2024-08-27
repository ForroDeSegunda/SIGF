import supabase from "@/utils/db";
import { Database } from "@/database.types";
import { NextRequest, NextResponse } from "next/server";

export type TAttendanceInsert =
  Database["public"]["Tables"]["attendance"]["Insert"];

const TABLE = "attendance";

export async function GET() {
  const { data, error } = await supabase.from(TABLE).select(`*, classDates(*)`);
  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body: TAttendanceInsert = await request.json();

  const { data, error } = await supabase.from(TABLE).insert(body).select();

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
  const { classId } = await request.json();

  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("classId", classId)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const { id, ...body } = await request.json();

  const { data, error } = await supabase
    .from(TABLE)
    .update(body)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0]);
}
