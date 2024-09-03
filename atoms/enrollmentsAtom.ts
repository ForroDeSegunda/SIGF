import { TEnrollmentRow } from "@/utils/db";
import { atom } from "recoil";

export interface IEnrollmentCounts {
  max: number;
  half: number;
  led: number;
  leader: number;
}

export const enrollmentsAtom = atom<TEnrollmentRow[] | []>({
  key: "enrollmentsAtom",
  default: [],
});

export const enrollmentCountAtom = atom<IEnrollmentCounts>({
  key: "enrollmentLedCountAtom",
  default: { max: 30, half: 15, led: 0, leader: 0 },
});
