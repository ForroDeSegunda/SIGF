"use server";
import { useSupabaseServer } from "@/supabase/server";
import {
  TTransactionInsert,
  TTransactionRow,
  TTransactionUpdate,
} from "./types";

const TABLE = "transaction";

export async function readTransactions() {
  const server = await useSupabaseServer();
  const { data, error } = await server.from(TABLE).select();
  if (error) throw error;
  return data as TTransactionRow[];
}

export async function createTransaction(transaction: TTransactionInsert) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .insert(transaction)
    .select()
    .single();
  if (error) throw error;
  return data as TTransactionRow;
}

export async function deleteTransaction(transaction: TTransactionRow) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .delete()
    .eq("id", transaction.id)
    .select()
    .single();
  if (error) throw error;
  return data as TTransactionRow;
}

export async function updateTransaction(transaction: TTransactionUpdate) {
  const server = await useSupabaseServer();
  const { data, error } = await server
    .from(TABLE)
    .update(transaction)
    .eq("id", transaction.id)
    .select()
    .single();
  if (error) throw error;
  return data as TTransactionRow;
}
