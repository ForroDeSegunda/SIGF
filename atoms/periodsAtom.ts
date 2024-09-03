import { TPeriod } from "@/utils/db";
import { atom } from "recoil";

export const periodsAtom = atom<TPeriod[] | []>({
  key: "periodsAtom",
  default: [],
});
