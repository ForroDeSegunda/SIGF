import { TPeriodInsert } from "@/utils/db";
import { atom } from "recoil";

export const periodsAtom = atom<TPeriodInsert[] | []>({
  key: "periodsAtom",
  default: [],
});
