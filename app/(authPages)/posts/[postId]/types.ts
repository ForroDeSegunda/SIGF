import { Database } from "@/database.types";

export type TCommentsRow = Database["public"]["Tables"]["comments"]["Row"];
export type TCommentsInsert =
  Database["public"]["Tables"]["comments"]["Insert"];
export type TCommentsUpdate =
  Database["public"]["Tables"]["comments"]["Update"];
