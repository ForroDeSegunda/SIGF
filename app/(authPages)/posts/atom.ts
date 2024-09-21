import { atom } from "recoil";
import { TPostsRow } from "./types";

export const postsAtom = atom<TPostsRow[] | []>({
  key: "postsAtom",
  default: [],
});
