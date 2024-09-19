"use server";

import { useSupabaseServer } from "@/supabase/server";

export async function readPeriods() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("period").select("*");
  if (error) throw error;
  return data;
}
