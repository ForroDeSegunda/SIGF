import { atom } from "recoil";

export const showMobileOptionsAtom = atom<boolean>({
  key: "showMobileOptionsAtom",
  default: false,
});
