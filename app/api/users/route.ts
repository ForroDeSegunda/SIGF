import supabase from "@/app/utils/db";
import { Database } from "@/database.types";
import { NextResponse } from "next/server";

export type TUser = Database["public"]["Tables"]["user"]["Insert"];
export type TUserViewPlusRole = {
  email: string;
  id: string;
  name: string;
} & {
  user: TUser;
};

const table = "user";

export async function GET() {
  const { data, error } = await supabase
    .from("users_view")
    .select("*, user(*)");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data as TUserViewPlusRole[]);
}

export async function POST(request: Request) {
  const body: TUser = await request.json();

  const { data, error } = await supabase.from(table).insert(body).select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0] as TUser);
}

export async function PATCH(request: Request) {
  const body: TUser = await request.json();

  const { data, error } = await supabase
    .from(table)
    .update(body)
    .eq("id", body.id)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0] as TUser);
}
