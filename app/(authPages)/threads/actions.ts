"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TThreadsRow } from "./types";

export async function readThreads() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("threads").select();

  if (error) throw error;
  return data as TThreadsRow[];
}
