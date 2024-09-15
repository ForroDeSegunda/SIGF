"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TUserViewPlusRole } from "@/utils/db";
import { createHash } from "crypto";

export type TUserCreate = {
  email: string;
  full_name: string;
  created_at: string;
};

export async function createUsersForXlsxImport(
  users: TUserCreate[],
): Promise<TUserViewPlusRole[]> {
  if (users.length === 0) return [];

  const supabaseServer = useSupabaseServer();
  const session = await supabaseServer.auth.getSession();

  let createdUsers: TUserViewPlusRole[] = [];

  for (const user of users) {
    const { data, error } = await supabaseServer.auth.signUp({
      email: user.email,
      password: createHash("sha256").update("password").digest("hex"),
    });
    if (error) {
      console.error("Error creating user:", error);
      continue;
    }

    await supabaseServer.auth.updateUser({
      data: {
        full_name: user.full_name,
      },
    });

    const newUser: TUserViewPlusRole = {
      id: data.user?.id!,
      email: data.user?.email!,
      full_name: user.full_name,
      user: {
        id: data.user?.id!,
        role: "student",
      },
    };
    createdUsers.push(newUser);

    supabaseServer.auth.resetPasswordForEmail(data.user?.email!);
  }

  await supabaseServer.auth.setSession({
    refresh_token: session.data.session?.refresh_token!,
    access_token: session.data.session?.access_token!,
  });

  return createdUsers;
}
