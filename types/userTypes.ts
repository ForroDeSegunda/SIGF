import { Database } from "@/database.types";

export type TUserViewRow = Database["public"]["Views"]["users_view"]["Row"];
export type TUserViewUpdate =
  Database["public"]["Views"]["users_view"]["Update"];
export type TUserViewInsert =
  Database["public"]["Views"]["users_view"]["Insert"];
