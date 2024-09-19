import { Database } from "@/database.types";

export type TThreadsRow = Database["public"]["Tables"]["threads"]["Row"];
export type TThreadsInsert = Database["public"]["Tables"]["threads"]["Insert"];
export type TThreadsUpdate = Database["public"]["Tables"]["threads"]["Update"];
