"use client";

import { attendancesAtom } from "@/atoms/attendanceAtom";
import { currentClassAtom } from "@/atoms/currentClassAtom";
import { currentPeriodAtom } from "@/atoms/currentPeriod";
import { enrollmentCountAtom } from "@/atoms/enrollmentsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { useWindowWidth } from "@react-hook/window-size";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useRecoilValue, useResetRecoilState } from "recoil";
import ButtonNewCalendar from "../(authPages)/calendar/components/ButtonNewCalendar";
import GenerateClassDates from "../(authPages)/classes/[id]/attendance/components/CreateClassDates";
import { useModal } from "./MainModal";
import { cashflowBalanceAtom } from "../(authPages)/cashflow/atom";

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
  const resetCurrentClass = useResetRecoilState(currentClassAtom);
  const resetCurrentPeriod = useResetRecoilState(currentPeriodAtom);
  const cashflowBalance = useRecoilValue(cashflowBalanceAtom);
  const isAdmin = user?.userRole === "admin";
  const isDirector = isAdmin || user?.userRole === "director";
  const isTeacher = isDirector || user?.userRole === "teacher";

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
        {isDirector && (
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

  if (pathName === "/periods" && isDirector) {
    return (
      <>
        <button
          onClick={() => {
            resetCurrentPeriod();
            openModal("periods");
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Criar Período
        </button>
      </>
    );
  } else if (pathName === "/calendar" && isDirector) {
    return <ButtonNewCalendar />;
  } else if (pathName === "/classes" && isDirector) {
    return (
      <>
        <button
          onClick={() => {
            resetCurrentClass();
            openModal("classes");
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Criar Turma
        </button>
      </>
    );
  } else if (pathName.match(classesIdRegex)) {
    return (
      <div className={"flex " + (windowWidth < 350 ? "gap-1" : "gap-4")}>
        {isDirector && (
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
        {isDirector && (
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
  } else if (pathName.match(attendanceRegex) && isDirector) {
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
  } else if (pathName === "/posts") {
    return (
      <div className="flex gap-4 relative">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => openModal("posts")}
        >
          Criar Publicação
        </button>
        <Link
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          href="/threads"
        >
          Assuntos
        </Link>
      </div>
    );
  } else if (pathName === "/threads") {
    return (
      <div className="flex gap-4 relative">
        {userRole !== "student" && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => openModal("threads")}
          >
            Criar Assunto
          </button>
        )}
        <Link
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          href="/posts"
        >
          Publicações
        </Link>
      </div>
    );
  } else if (pathName === "/cashflow" && isAdmin) {
    return (
      <button
        className={`flex gap-2 text-white py-2 px-4 rounded 
        ${
          cashflowBalance === 0
            ? "bg-blue-500 hover:bg-blue-600"
            : cashflowBalance > 0
              ? "bg-green-500 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600"
        }`}
        onClick={() => openModal("cashflow")}
      >
        Balanço:
        <span className="font-bold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
          }).format(cashflowBalance / 100)}
        </span>
      </button>
    );
  }

  return;
}
