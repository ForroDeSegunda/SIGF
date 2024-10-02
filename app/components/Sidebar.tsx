"use client";

import { sidebarMainAtom } from "@/atoms/sidebarsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import {
  FaCalendar,
  FaHourglassHalf,
  FaMessage,
  FaPeopleGroup,
  FaRegMessage,
  FaUserGear,
} from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import { threadsAtom } from "../(authPages)/threads/atom";
import { TThreadsRow } from "../(authPages)/threads/types";
import SideBarButton from "./SideBarButton";

export default function Sidebar() {
  const user = useRecoilValue(usersAtom);
  const sidebarIsOpen = useRecoilValue(sidebarMainAtom);
  const isAdmin = user?.userRole === "admin";

  const buttons = [
    {
      text: "Turmas",
      icon: <FaPeopleGroup />,
      href: "/classes",
    },
    {
      text: "Calendários",
      icon: <FaCalendar />,
      href: "/calendar",
    },
    isAdmin && {
      text: "Períodos",
      icon: <FaHourglassHalf />,
      href: "/periods",
    },
    isAdmin && {
      text: "Usuários",
      icon: <FaUserGear />,
      href: "/users",
    },
  ];

  return (
    <aside
      className={`bg-white flex flex-col shrink-0 w-52 min-w-52 border-gray-300 border-r overflow-auto z-50 h-full ${
        sidebarIsOpen ? "absolute md:relative" : "hidden md:block"
      }`}
    >
      {buttons.map((button, index) => {
        if (!button) return null;
        return (
          <SideBarButton
            key={index}
            text={button.text}
            icon={button.icon}
            href={button.href}
          />
        );
      })}
      <ForumButton />
    </aside>
  );
}

function ForumButton() {
  const threads = useRecoilValue(threadsAtom);

  return (
    <>
      <SideBarButton text="Fórum" icon={<FaMessage />} href="/posts" />
      <div className="flex flex-col ml-4 overflow-y-auto">
        {threads.map((thread: TThreadsRow) => (
          <SideBarButton
            key={thread.id}
            text={thread.id.charAt(0).toUpperCase() + thread.id.slice(1)}
            icon={<FaRegMessage />}
            href={`/posts?thread=${thread.id}`}
          />
        ))}
      </div>
    </>
  );
}
