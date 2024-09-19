import { Database } from "@/database.types";

export type TPostsRow = Database["public"]["Tables"]["posts"]["Row"];
export type TPostsInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type TPostsUpdate = Database["public"]["Tables"]["posts"]["Update"];
