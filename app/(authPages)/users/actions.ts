"use server";

import { useSupabaseServer } from "@/supabase/server";
import { TUserWithRole } from "@/utils/db";
import { TUserInsert, TUserRow, TUserViewRow, TUserViewUpdate } from "./types";
import { createClient } from "@supabase/supabase-js";

type TUser = {
  email?: string;
  password?: string;
  data?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export async function createUser(user: TUserInsert) {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("user").insert(user).select("*");

  if (error) throw error;
  return data as TUserRow[];
}

export async function updateUser(user: TUser) {
  const server = await useSupabaseServer();
  return await server.auth.updateUser(user);
}

export async function updateUserWithoutName(users: TUserViewUpdate[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const server = createClient(supabaseUrl, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    for (const user of users) {
      server.auth.admin.updateUserById(user.id!, {
        user_metadata: {
          full_name: user.full_name,
        },
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function readUsersView() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from("users_view").select("*");
  if (error) throw error;
  return data as TUserViewRow[];
}

export async function readUsersViewById(userIds: string[]) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from("users_view")
    .select("*")
    .in("id", userIds);
  if (error) throw error;
  return data as TUserViewRow[];
}

export async function readUsersViewByEmail(emails: string[]) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from("users_view")
    .select("*")
    .in("email", emails);
  if (error) throw error;
  return data as TUserViewRow[];
}

export async function readUserWithRole() {
  const server = await useSupabaseServer();
  const privateUser = await server.auth.getUser();

  if (privateUser.error) {
    console.error("Error reading user session:", privateUser.error);
    throw privateUser.error;
  }
  const publicUser = await server
    .from("user")
    .select("*")
    .eq("id", privateUser.data.user.id);

  if (publicUser.error) {
    console.error("Error reading user:", publicUser.error);
    throw publicUser.error;
  }

  const publicUserData = publicUser.data[0];

  const user = {
    ...privateUser.data.user,
    userRole: publicUserData ? publicUserData.role : "student",
  };
  return user as TUserWithRole;
}
