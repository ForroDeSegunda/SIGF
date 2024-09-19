import { useSupabaseServer } from "@/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Index() {
  const server = await useSupabaseServer();
  const { data, error } = await server.auth.getSession();
  console.log("data", data);
  console.log("error", error);

  if (error || !data.session) return redirect("/login");
  redirect("/classes");
}
