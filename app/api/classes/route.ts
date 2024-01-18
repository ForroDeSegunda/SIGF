import supabase from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { TClasses } from "./[id]/route";

const table = "classes";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase.from(table).insert([body]).select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const body: TClasses = await request.json();

  const { data, error } = await supabase
    .from(table)
    .update({ ...body })
    .eq("id", body.id)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0] as TClasses);
}

export async function GET() {
  const { data, error } = await supabase.from(table).select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data as TClasses[]);
}
