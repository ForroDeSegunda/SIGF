import { Database } from "@/database.types";

export type TUserRow = Database["public"]["Tables"]["user"]["Row"];
export type TUserInsert = Database["public"]["Tables"]["user"]["Insert"];
export type TUserUpdate = Database["public"]["Tables"]["user"]["Update"];
