import { Database } from "@/database.types";
import { atom } from "recoil";

export type TClassRow = Database["public"]["Tables"]["classes"]["Row"];
export type TClassInsert = Database["public"]["Tables"]["classes"]["Insert"];

export const currentClassAtom = atom<TClassInsert>({
  key: "currentClassAtom",
  default: {
    name: "",
    periodId: "",
    size: 30,
    weekDays: "",
  },
});
