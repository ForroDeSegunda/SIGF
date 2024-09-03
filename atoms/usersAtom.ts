import { TUserWithRole } from "@/utils/db";
import { atom } from "recoil";

export const usersAtom = atom<TUserWithRole | null>({
  key: "usersAtom",
  default: null,
});
