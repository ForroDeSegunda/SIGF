import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/db";

export async function GET() {
  const { data, error } = await supabase.from("enrollment").select();

  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("enrollment")
    .insert(body)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { userId, classId } = await request.json();

  const { data, error } = await supabase
    .from("enrollment")
    .delete()
    .eq("userId", userId)
    .eq("classId", classId);

  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data);
}
