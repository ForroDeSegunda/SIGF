"use client";

import { classesAtom } from "@/atoms/classesAtom";
import { periodsAtom } from "@/atoms/periodsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { useSetRecoilState } from "recoil";

export default function RecoilProvider(p: {
  children: React.ReactNode;
  classes: any;
  periods: any;
  users: any;
}) {
  const setClasses = useSetRecoilState(classesAtom);
  const setPeriods = useSetRecoilState(periodsAtom);
  const setUsers = useSetRecoilState(usersAtom);

  setClasses(p.classes);
  setPeriods(p.periods);
  setUsers(p.users);

  return <>{p.children}</>;
}
