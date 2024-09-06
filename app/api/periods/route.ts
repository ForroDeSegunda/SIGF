import { supabaseClient } from "@/supabase/client";
import { TPeriodInsert } from "@/utils/db";
import { NextResponse } from "next/server";

const TABLE = "period";

export async function GET() {
  const { data, error } = await supabaseClient.from(TABLE).select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data as TPeriodInsert[]);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabaseClient
    .from(TABLE)
    .insert(body)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { data, error } = await supabaseClient
    .from(TABLE)
    .delete()
    .eq("id", body.id);

  if (error) {
    if (error.code === "23503")
      return NextResponse.json(error.message, { status: 409 });

    return NextResponse.json(error.message, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const { data, error } = await supabaseClient
    .from(TABLE)
    .update(body)
    .eq("id", body.id)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}
