"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TThreadsInsert, TThreadsRow } from "./types";

export async function readThreads() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("threads").select();

  if (error) throw error;
  return data as TThreadsRow[];
}

export async function createThreads(threads: TThreadsInsert[]) {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("threads").insert(threads).select();

  if (error) throw error;
  return data as TThreadsRow[];
}
