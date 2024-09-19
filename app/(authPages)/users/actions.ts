"use server";

import { useSupabaseServer } from "@/supabase/server";

type TUser = {
  email?: string;
  password?: string;
  data?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export async function updateUser(user: TUser) {
  const server = await useSupabaseServer();
  return await server.auth.updateUser(user);
}
