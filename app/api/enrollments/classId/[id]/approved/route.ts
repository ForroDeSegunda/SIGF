import { supabaseClient } from "@/supabase/client";
import { TApprovedEnrollment } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(_: any, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseClient
    .from("enrollment")
    .select("*, users_view(*)")
    .eq("classId", params.id)
    .eq("status", "approved");

  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data as TApprovedEnrollment[]);
}
