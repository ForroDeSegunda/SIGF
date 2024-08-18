"use client";

import { attendancesAtom } from "@/atoms/attendanceAtom";
import { enrollmentCountAtom } from "@/atoms/enrollmentsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { useWindowWidth } from "@react-hook/window-size";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";
import ButtonNewCalendar from "../(authPages)/calendar/components/ButtonNewCalendar";
import GenerateClassDates from "../(authPages)/classes/[id]/attendance/components/CreateClassDates";
import { useModal } from "./MainModal";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export function NavbarButtons() {
  const openModal = useModal();
  const enrollmentCount = useRecoilValue(enrollmentCountAtom);
  const attendances = useRecoilValue(attendancesAtom);
  const user = useRecoilValue(usersAtom);
  const userRole = user?.userRole;
  const pathName = usePathname();
  const actionButtonsRef = useRef<HTMLButtonElement>(null);
  const [isActionsButtonsVisible, setIsActionsButtonsVisible] = useState(false);
  const windowWidth = useWindowWidth();

  const classesIdRegex = new RegExp(
    /\/classes\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  );
  const attendanceRegex = new RegExp(
    /\/classes\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/attendance$/,
  );

  function handleClickOutside(event: MouseEvent) {
    if (
      actionButtonsRef.current &&
      !actionButtonsRef.current.contains(event.target as Node)
    ) {
      setIsActionsButtonsVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function ActionButtons() {
    return (
      <>
        {attendances.length > 0 && (
          <Link
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            href={`${pathName}/userAttendance`}
          >
            Minhas presenças
          </Link>
        )}
        {(userRole === "admin" || userRole === "teacher") && (
          <Link
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            href={`${pathName}/attendance`}
          >
            Presenças da turma
          </Link>
        )}
      </>
    );
  }

  if (pathName === "/periods" && userRole === "admin") {
    return (
      <>
        <button
          onClick={() => openModal("periods")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Criar Período
        </button>
      </>
    );
  } else if (pathName === "/calendar" && userRole === "admin") {
    return <ButtonNewCalendar />;
  } else if (pathName === "/classes" && userRole === "admin") {
    return (
      <>
        <button
          onClick={() => openModal("classes")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Criar Turma
        </button>
      </>
    );
  } else if (pathName.match(classesIdRegex)) {
    return (
      <div className={"flex " + (windowWidth < 350 ? "gap-1" : "gap-4")}>
        {(userRole === "admin" || userRole === "teacher") && (
          <div
            className={
              enrollmentCount.leader >= enrollmentCount.half
                ? "bg-blue-300  text-white py-2 px-4 rounded"
                : "bg-blue-500  text-white py-2 px-4 rounded"
            }
          >
            {windowWidth > 768 && <span>Condutores(as): </span>}
            <span className="font-bold">
              {enrollmentCount.leader} / {enrollmentCount.half}
            </span>
          </div>
        )}
        {windowWidth < 870 ? (
          <div className="relative">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded h-[33px]"
              ref={actionButtonsRef}
              onMouseDown={() =>
                setIsActionsButtonsVisible(!isActionsButtonsVisible)
              }
            >
              {isActionsButtonsVisible ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isActionsButtonsVisible && (
              <div className="absolute flex flex-col p-4 gap-2 bg-white right-1/2 translate-x-1/2 top-9 border rounded h-fit w-48 z-10">
                <ActionButtons />
              </div>
            )}
          </div>
        ) : (
          <ActionButtons />
        )}
        {(userRole === "admin" || userRole === "teacher") && (
          <div
            className={
              enrollmentCount.led >= enrollmentCount.half
                ? "bg-orange-300  text-white py-2 px-4 rounded"
                : "bg-orange-500  text-white py-2 px-4 rounded"
            }
          >
            {windowWidth > 768 && <span>Conduzidos(as): </span>}
            <span className="font-bold">
              {enrollmentCount.led} / {enrollmentCount.half}
            </span>
          </div>
        )}
      </div>
    );
  } else if (pathName.match(attendanceRegex) && userRole === "admin") {
    return <GenerateClassDates />;
  } else if (pathName.includes("/userAttendance")) {
    const totalRegistered = attendances.filter(
      (a) => a.presence !== "notRegistered",
    ).length;
    const totalPresent = attendances.filter(
      (a) => a.presence === "present",
    ).length;
    const totalJustified = attendances.filter(
      (a) => a.presence === "justified",
    ).length;
    const totalValidPresence = totalPresent + totalJustified;
    const attendancePercentage =
      totalValidPresence > 0
        ? (totalValidPresence / totalRegistered) * 100
        : 100;

    return (
      <div className="flex gap-4">
        <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          {totalValidPresence} / {totalRegistered}
        </div>
        <div
          className={
            attendancePercentage >= 75
              ? "bg-green-500 text-white font-bold py-2 px-4 rounded"
              : "bg-orange-500 text-white font-bold py-2 px-4 rounded"
          }
        >
          {attendancePercentage} %
        </div>
      </div>
    );
  }

  return;
}
