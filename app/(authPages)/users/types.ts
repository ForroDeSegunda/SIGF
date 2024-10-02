import { Database } from "@/database.types";

export type TUserRow = Database["public"]["Tables"]["user"]["Row"];
export type TUserInsert = Database["public"]["Tables"]["user"]["Insert"];
export type TUserUpdate = Database["public"]["Tables"]["user"]["Update"];

export type TUserViewRow = Database["public"]["Views"]["users_view"]["Row"];
export type TUserViewInsert =
  Database["public"]["Views"]["users_view"]["Insert"];
export type TUserViewUpdate =
  Database["public"]["Views"]["users_view"]["Update"];
