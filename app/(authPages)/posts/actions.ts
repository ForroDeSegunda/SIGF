"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TPostsInsert, TPostsRow } from "./types";

const TABLE = "posts";

export async function readPosts() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from(TABLE).select();
  if (error) throw error;
  return data as TPostsRow[];
}

export async function readPost(postId: string) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .select()
    .eq("id", postId)
    .single();
  if (error) throw error;
  return data as TPostsRow;
}

export async function readPostsByThreadId(threadId: string) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .select()
    .eq("threadId", threadId);
  if (error) throw error;
  return data as TPostsRow[];
}

export async function createPosts(posts: TPostsInsert[]) {
  const server = await useSupabaseServer();
  const { data, error } = await server.from(TABLE).insert(posts).select();
  if (error) throw error;
  return data as TPostsRow[];
}

export async function updatePosts(posts: TPostsRow[]) {
  const server = await useSupabaseServer();
  const { data, error } = await server.from(TABLE).upsert(posts).select();
  if (error) throw error;
  return data as TPostsRow[];
}

export async function deletePosts(posts: TPostsRow[]) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .delete()
    .eq(
      "id",
      posts.map((post) => post.id),
    )
    .select();
  if (error) throw error;
  return data as TPostsRow[];
}

export async function deletePost(post: TPostsRow) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .delete()
    .eq("id", post.id)
    .select()
    .single();
  if (error) throw error;
  return data as TPostsRow;
}
