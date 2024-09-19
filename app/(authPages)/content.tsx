"use client";

import { classesAtom } from "@/atoms/classesAtom";
import { periodsAtom } from "@/atoms/periodsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { useSetRecoilState } from "recoil";

export default function RecoilProvider({
  children,
  classes,
  periods,
  users,
}: {
  children: React.ReactNode;
  classes: any;
  periods: any;
  users: any;
}) {
  const setClasses = useSetRecoilState(classesAtom);
  const setPeriods = useSetRecoilState(periodsAtom);
  const setUsers = useSetRecoilState(usersAtom);

  setClasses(classes);
  setPeriods(periods);
  setUsers(users);

  return <>{children}</>;
}
