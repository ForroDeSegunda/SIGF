"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TThreadsRow } from "./types";

const server = await useSupabaseServer();

export async function readThreads() {
  const { data, error } = await server.from("threads").select();

  if (error) throw error;
  return data as TThreadsRow[];
}
