import { TModalOptions } from "@/app/components/MainModal";
import { atom } from "recoil";

export const modalOptionsAtom = atom<TModalOptions>({
  key: "modalOptionsAtom",
  default: "classes",
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
