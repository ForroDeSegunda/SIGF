import { Database } from "@/database.types";

export type TClassRow = Database["public"]["Tables"]["classes"]["Row"];
export type TClassInsert = Database["public"]["Tables"]["classes"]["Insert"];
export type TClassUpdate = Database["public"]["Tables"]["classes"]["Update"];

export type TClassDatesRow = Database["public"]["Tables"]["classDates"]["Row"];
export type TClassDatesInsert =
  Database["public"]["Tables"]["classDates"]["Insert"];
export type TClassDatesUpdate =
  Database["public"]["Tables"]["classDates"]["Update"];
