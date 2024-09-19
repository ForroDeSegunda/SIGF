"use client";

import { classesAtom } from "@/atoms/classesAtom";
import { periodsAtom } from "@/atoms/periodsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { TPeriodRow, TUserWithRole } from "@/utils/db";
import { useSetRecoilState } from "recoil";
import { TClassRow } from "./classes/types";
import { threadsAtom } from "./threads/atom";
import { TThreadsRow } from "./threads/types";

export function Content(p: {
  children: React.ReactNode;
  user: TUserWithRole;
  classes: TClassRow[];
  periods: TPeriodRow[];
  threads: TThreadsRow[];
}) {
  useSetRecoilState(usersAtom)(p.user);
  useSetRecoilState(classesAtom)(p.classes);
  useSetRecoilState(periodsAtom)(p.periods);
  useSetRecoilState(threadsAtom)(p.threads);

  return <div className="flex flex-grow">{p.children}</div>;
}
