import { supabaseClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

const TABLE = "attendance";

export async function GET(_: any, { params }) {
  const { data, error } = await supabaseClient
    .from(TABLE)
    .select("*, classDates(*), users_view(*)")
    .eq("classDateId", params.classDateId);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
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
