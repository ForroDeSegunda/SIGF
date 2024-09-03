"use client";

import { periodsAtom } from "@/atoms/periodsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { readPeriods } from "../api/periods/service";
import { readUserWithRole } from "../api/users/service";
import MainModal from "../components/MainModal";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

const Main = tw.main`flex-bg-white w-full h-dvh flex flex-col`;
const Container = tw.div`flex h-[calc(100dvh-4rem)]`;
const Content = tw.div`flex-grow flex`;

export default function PagesLayout(props: { children: React.ReactNode }) {
  const setPeriods = useSetRecoilState(periodsAtom);
  const setUsers = useSetRecoilState(usersAtom);

  async function handleLoadGlobalStates() {
    const periods = await readPeriods();
    const user = await readUserWithRole();

    setPeriods(periods);
    setUsers(user);
  }

  useEffect(() => {
    handleLoadGlobalStates();
  }, []);

  return (
    <Main>
      <MainModal />
      <Navbar />
      <Container>
        <SideBar />
        <Content>{props.children}</Content>
      </Container>
    </Main>
  );
}
