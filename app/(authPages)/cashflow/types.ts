import { Database } from "@/database.types";

export type TTransactionRow =
  Database["public"]["Tables"]["transaction"]["Row"];
export type TTransactionInsert =
  Database["public"]["Tables"]["transaction"]["Insert"];
export type TTransactionUpdate =
  Database["public"]["Tables"]["transaction"]["Update"];

export type TTransactionType = Database["public"]["Enums"]["transactionType"];
