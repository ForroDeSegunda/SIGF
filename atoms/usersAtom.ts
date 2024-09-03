import { atom } from "recoil";
import { TUserWithRole } from "../app/api/users/service";

export const usersAtom = atom<TUserWithRole | null>({
  key: "usersAtom",
  default: null,
});
