import supabase, { TUser, TUserViewPlusRole } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

const TABLE = "user";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const emails = params.getAll("emails[]");

  const { data, error } = await supabase
    .from("users_view")
    .select("*, user(*)");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  if (emails.length > 0) {
    const filteredData = data!.filter((user) => emails.includes(user.email));
    return NextResponse.json(filteredData as TUserViewPlusRole[]);
  }
  return NextResponse.json(data as TUserViewPlusRole[]);
}

export async function POST(request: Request) {
  const body: TUser = await request.json();

  const { data, error } = await supabase.from(TABLE).insert(body).select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0] as TUser);
}

export async function PATCH(request: Request) {
  const body: TUser = await request.json();

  const { data, error } = await supabase
    .from(TABLE)
    .update(body)
    .eq("id", body.id)
    .select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(data[0] as TUser);
}
