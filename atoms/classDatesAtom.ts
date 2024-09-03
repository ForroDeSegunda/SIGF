import { atom } from "recoil";
import { Database } from "../database.types";

type TClassDates = Database["public"]["Tables"]["classDates"]["Insert"];

export const classDatesAtom = atom<TClassDates[] | []>({
  key: "classDatesAtom",
  default: [],
});
