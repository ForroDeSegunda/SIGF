"use client";

import { sidebarMainAtom } from "@/atoms/sidebarsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import {
  FaCalendar,
  FaHourglassHalf,
  FaMessage,
  FaPeopleGroup,
  FaUserGear,
} from "react-icons/fa6";
import { useRecoilValue } from "recoil";
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
      className={`bg-white shrink md:block w-52 min-w-32 border-gray-300 border-r overflow-hidden ${
        sidebarIsOpen ? "block" : "hidden"
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
      <ThreadsButton />
    </aside>
  );
}

function ThreadsButton() {
  return (
    <>
      <SideBarButton text="Tópicos" icon={<FaMessage />} href="/threads" />
    </>
  );
}
