import { Database } from "@/database.types";
import { supabaseClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export type TClasses = Database["public"]["Tables"]["classes"]["Insert"];
export type TClassAndPeriod = TClasses & {
  period: Database["public"]["Tables"]["period"]["Insert"];
};

const table = "classes";

export async function DELETE(_: NextRequest, { params }: any) {
  const { data, error } = await supabaseClient
    .from(table)
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: any) {
  const { name, weekDays } = await request.json();

  const { data, error } = await supabaseClient
    .from(table)
    .update({ name, weekDays })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function GET(_, { params }) {
  const { data, error } = await supabaseClient
    .from(table)
    .select("*, period(*)")
    .eq("id", params.id);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0] as TClassAndPeriod);
}
