"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TUserWithRole } from "@/utils/db";

export async function readClasses() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("classes").select("*");
  if (error) throw error;
  return data;
}

export async function readPeriods() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("period").select("*");
  if (error) throw error;
  return data;
}

export async function readUserWithRole() {
  const server = await useSupabaseServer();
  const privateUser = await server.auth.getUser();

  if (privateUser.error) {
    console.error("Error reading user session:", privateUser.error);
    throw privateUser.error;
  }
  const publicUser = await server
    .from("user")
    .select("*")
    .eq("id", privateUser.data.user.id);

  if (publicUser.error) {
    console.error("Error reading user:", publicUser.error);
    throw publicUser.error;
  }

  const userPlum = {
    ...privateUser.data.user,
    userRole: publicUser.data[0].role,
  };
  return userPlum as TUserWithRole;
}
