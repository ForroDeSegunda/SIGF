import { supabaseClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseClient.from("enrollment").select();

  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabaseClient
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

  const { data, error } = await supabaseClient
    .from("enrollment")
    .delete()
    .eq("userId", userId)
    .eq("classId", classId);

  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data);
}
