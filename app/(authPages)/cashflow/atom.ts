import { atom } from "recoil";
import { TTransactionRow } from "./types";

export const cashflowBalanceAtom = atom<number>({
  key: "cashflowBalanceAtom",
  default: 0,
});

export const transactionsAtom = atom<TTransactionRow[]>({
  key: "transactionsAtom",
  default: [],
});

export const currentTransactionAtom = atom<TTransactionRow | null>({
  key: "currentTransactionAtom",
  default: undefined,
});
