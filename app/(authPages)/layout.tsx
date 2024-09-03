"use client";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { readUserWithRole } from "../api/users/service";
import { periodsAtom } from "@/atoms/periodsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { readPeriods } from "../api/periods/service";
import MainModal from "../components/MainModal";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100dvh-4rem)]">
      <SideBar />
      <div className="flex-grow flex">{children}</div>
    </div>
  );
}

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setPeriods = useSetRecoilState(periodsAtom);
  const setUsers = useSetRecoilState(usersAtom);

  useEffect(() => {
    async function handleLoadGlobalStates() {
      const periods = await readPeriods();
      const user = await readUserWithRole();

      setPeriods(periods);
      setUsers(user);
    }
    handleLoadGlobalStates();
  }, []);

  return (
    <div className="bg-white w-full h-dvh flex flex-col">
      <MainModal />
      <Navbar />
      <Content children={children} />
    </div>
  );
}
