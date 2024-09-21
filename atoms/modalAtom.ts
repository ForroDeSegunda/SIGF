import { atom } from "recoil";

export type TModalOptions =
  | ""
  | "confirmation"
  | "classes"
  | "calendar"
  | "periods"
  | "classDate"
  | "classEnrollment"
  | "profile"
  | "threads"
  | "posts";

export const modalOptionsAtom = atom<TModalOptions>({
  key: "modalOptionsAtom",
  default: "",
});

export const modalFunctionAtom = atom<Function>({
  key: "modalFunctionAtom",
  default: (): void => {},
});

export const modalIdAtom = atom<string>({
  key: "modalIdAtom",
  default: "",
});

export const modalIsOpenAtom = atom<boolean>({
  key: "modalAtom",
  default: false,
});
