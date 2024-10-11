"use server";
import { useSupabaseServer } from "@/supabase/server";
import { TUserViewPlusRole } from "@/utils/db";
import { createHash } from "crypto";
import { TAttendanceRow } from "./types";
import { TClassDatesRow } from "../types";

export type TUserCreate = {
  email: string;
  full_name: string;
  created_at: string;
};

export async function readAttendancesByClassDates(
  classDates: TClassDatesRow[],
) {
  const server = await useSupabaseServer();
  const classDatesIds = classDates.map((classDate) => classDate.id);
  const { data, error } = await server
    .from("attendance")
    .select("*")
    .in("classDateId", classDatesIds);
  if (error) throw error;
  return data as TAttendanceRow[];
}

export async function updateAttendances(attendances: TAttendanceRow[]) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from("attendance")
    .upsert(attendances)
    .select("*");
  if (error) throw error;
  return data as TAttendanceRow[];
}

export async function createUsersForXlsxImport(
  users: TUserCreate[],
): Promise<TUserViewPlusRole[]> {
  if (users.length === 0) return [];

  const supabaseServer = await useSupabaseServer();
  const session = await supabaseServer.auth.getSession();

  // Helper function to handle user creation and updates concurrently
  async function createUser(
    user: TUserCreate,
  ): Promise<TUserViewPlusRole | null> {
    try {
      const { data, error } = await supabaseServer.auth.signUp({
        email: user.email,
        password: createHash("sha256").update("password").digest("hex"),
      });

      if (error) {
        console.error("Error creating user:", error);
        return null;
      }

      const newUser: TUserViewPlusRole = {
        id: data.user?.id!,
        email: data.user?.email!,
        full_name: user.full_name,
        user: {
          id: data.user?.id!,
          role: "student",
        },
      };

      // Send reset password email
      await supabaseServer.auth.resetPasswordForEmail(data.user?.email!);

      return newUser;
    } catch (err) {
      console.error("Unexpected error:", err);
      return null;
    }
  }

  // Use Promise.all to create users concurrently
  const createdUsers = await Promise.all(users.map(createUser));

  // Filter out any null results (for cases where user creation failed)
  const validCreatedUsers = createdUsers.filter(
    (user) => user !== null,
  ) as TUserViewPlusRole[];

  // Restore the session
  await supabaseServer.auth.setSession({
    refresh_token: session.data.session?.refresh_token!,
    access_token: session.data.session?.access_token!,
  });

  return validCreatedUsers;
}
