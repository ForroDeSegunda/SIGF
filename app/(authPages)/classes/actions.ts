"use server";

import { useSupabaseServer } from "@/supabase/server";

export async function readClasses() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("classes").select("*");
  if (error) throw error;
  return data;
}
