"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TPostsRow } from "./types";

export async function readPosts() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("posts").select();
  if (error) throw error;
  return data as TPostsRow[];
}
