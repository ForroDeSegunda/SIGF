import { supabaseClient } from "@/supabase/client";

export default async function useUser() {
  return await supabaseClient.auth.getUser();
}
