import { atom } from "recoil";
import { TThreadsRow } from "./types";

export const threadsAtom = atom<TThreadsRow[] | []>({
  key: "threadsAtom",
  default: [],
});
