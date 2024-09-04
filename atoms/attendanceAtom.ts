import { TAttendanceWithClassDates } from "@/utils/db";
import { atom } from "recoil";

export const attendancesAtom = atom<TAttendanceWithClassDates[] | []>({
  key: "attendancesAtom",
  default: [],
});
