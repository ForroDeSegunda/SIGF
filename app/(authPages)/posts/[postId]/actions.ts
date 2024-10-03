"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TCommentsInsert, TCommentsRow } from "./types";

const TABLE = "comments";

export async function readCommentsByPostId(postId?: string) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .select()
    .eq("postId", postId);
  if (error) throw error;
  return data as TCommentsRow[];
}

export async function createComment(comment: TCommentsInsert) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .insert(comment)
    .select()
    .single();
  if (error) throw error;
  return data as TCommentsRow;
}

export async function updateComment(comment: TCommentsRow) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .update(comment)
    .eq("id", comment.id)
    .select()
    .single();
  if (error) throw error;
  return data as TCommentsRow;
}

export async function deleteComment(comment: TCommentsRow) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .delete()
    .eq("id", comment.id)
    .select()
    .single();
  if (error) throw error;
  return data as TCommentsRow;
}
