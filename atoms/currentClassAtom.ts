import { TClassInsert } from "@/types/classTypes";
import { atom } from "recoil";

export const currentClassAtom = atom<TClassInsert>({
  key: "currentClassAtom",
  default: {
    name: "",
    periodId: "",
    size: 30,
    weekDays: "",
  },
});
