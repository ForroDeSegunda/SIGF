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
  const supabaseServer = useSupabaseServer();
  return await supabaseServer.auth.updateUser(user);
}
