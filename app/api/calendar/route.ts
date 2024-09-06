import { supabaseClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseClient.from("calendar").select("*");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabaseClient
    .from("calendar")
    .insert([{ ...body }])
    .select("*");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabaseClient
    .from("calendar")
    .update({ ...body })
    .eq("id", body.id)
    .select("*");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabaseClient
    .from("calendar")
    .delete()
    .eq("id", body.id)
    .select("*");
  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}
