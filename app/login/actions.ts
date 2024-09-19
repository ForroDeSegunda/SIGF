"use server";

import { useSupabaseServer } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const server = await useSupabaseServer();
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await server.auth.signInWithPassword(loginData);

  if (error) {
    redirect("/error");
  }
  redirect("/classes");
}

export async function signUp(formData: FormData) {
  const server = await useSupabaseServer();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await server.auth.signUp(data);

  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function loginGoole(origin: string) {
  const server = await useSupabaseServer();
  const { data, error } = await server.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) {
    redirect("/error");
  }
  redirect(data.url!);
}
