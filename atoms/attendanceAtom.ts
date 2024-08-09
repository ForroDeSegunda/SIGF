import { TAttendanceWithClassDates } from "@/app/api/attendance/service";
import { atom } from "recoil";

export const attendancesAtom = atom<TAttendanceWithClassDates[] | []>({
  key: "attendancesAtom",
  default: [],
});
