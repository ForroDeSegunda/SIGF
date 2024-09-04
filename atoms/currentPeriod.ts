import { TPeriodInsert } from "@/utils/db";
import { atom } from "recoil";

export const currentPeriodAtom = atom<TPeriodInsert>({
  key: "currentPeriodAtom",
  default: {
    semester: "first",
    year: Number(new Date().toISOString().split("-")[0]!),
    startDate: new Date().toISOString().split("T")[0]!,
    endDate: new Date().toISOString().split("T")[0]!,
  },
});
