import { supabaseClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: any, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseClient
    .from("enrollment")
    .select("*, users_view(*)")
    .eq("classId", params.id);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabaseClient
    .from("enrollment")
    .update(body)
    .eq("classId", body.classId)
    .eq("userId", body.userId)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}
