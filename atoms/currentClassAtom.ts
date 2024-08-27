import { Database } from "@/database.types";
import { atom } from "recoil";

export type TClassRow = Database["public"]["Tables"]["classes"]["Row"];

export const currentClassAtom = atom<TClassRow | null>({
  key: "currentClassAtom",
  default: null,
});
