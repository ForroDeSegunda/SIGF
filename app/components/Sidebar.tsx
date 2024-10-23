"use client";
import { sidebarMainAtom } from "@/atoms/sidebarsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import {
  FaCalendar,
  FaHourglassHalf,
  FaMoneyBillTransfer,
  FaPeopleGroup,
  FaUserGear,
} from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import { ForumButton } from "./ForumButton";
import SideBarButton from "./SideBarButton";

export default function Sidebar() {
  const user = useRecoilValue(usersAtom);
  const sidebarIsOpen = useRecoilValue(sidebarMainAtom);
  const isAdmin = user?.userRole === "admin";
  const isDirector = isAdmin || user?.userRole === "director";

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
    isDirector && {
      text: "Fluxo de Caixa",
      icon: <FaMoneyBillTransfer />,
      href: "/cashflow",
    },
    isDirector && {
      text: "Períodos",
      icon: <FaHourglassHalf />,
      href: "/periods",
    },
    isDirector && {
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
