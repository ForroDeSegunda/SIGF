import { Database } from "@/database.types";

export type TAttendanceRow = Database["public"]["Tables"]["attendance"]["Row"];
export type TAttendanceInsert =
  Database["public"]["Tables"]["attendance"]["Insert"];
export type TAttendanceUpdate =
  Database["public"]["Tables"]["attendance"]["Update"];
