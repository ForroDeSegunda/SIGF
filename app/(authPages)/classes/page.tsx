"use client";

import { TClasses } from "@/app/api/classes/[id]/route";
import { readClasses } from "@/app/api/classes/controller";
import { readEnrollmentsByUser } from "@/app/api/enrollments/service";
import { classesAtom, sortedClassesSelector } from "@/atoms/classesAtom";
import { enrollmentsAtom } from "@/atoms/enrollmentsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ButtonEnrollment from "./components/ButtonEnrollment";
import ButtonOptions from "./components/ButtonOptions";
import { weekDaysOptions, weekDaysOrder } from "./components/ModalClasses";

export default function ClassesPage() {
  const user = useRecoilValue(usersAtom);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const setEnrollmentIds = useSetRecoilState(enrollmentsAtom);
  const setClasses = useSetRecoilState(classesAtom);
  const sortedClasses = useRecoilValue(sortedClassesSelector);

  const columnDefsBase: ColDef<TClasses>[] = [
    {
      headerName: "Dias de Aula",
      field: "weekDays",
      flex: 1,
      valueFormatter: ({ value }) =>
        value
          .split(",")
          .sort(
            (a: string, b: string) =>
              weekDaysOrder.indexOf(a) - weekDaysOrder.indexOf(b),
          )
          .map((v: string) => weekDaysOptions[v])
          .join(", "),
    },
    {
      headerName: "Inscrição",
      flex: 1,
      cellRenderer: (p: any) => <ButtonEnrollment id={p.data.id} />,
    },
  ];
  const columnDefsAdmin: ColDef<TClasses>[] = [
    {
      headerName: "Ativa | Nome",
      field: "isActive",
      sort: "desc",
      cellRenderer: (p: any) => (
        <Link
          className="font-bold flex items-center gap-2"
          href={`/classes/${p.data.id}`}
        >
          {p.data.isActive ? (
            <FaCheck className="fill-green-500" />
          ) : (
            <FaXmark className="fill-orange-500" />
          )}
          {p.data.name}
        </Link>
      ),
    },
    ...columnDefsBase,
    {
      headerName: "Ações",
      flex: 1,
      cellRenderer: (p: any) => <ButtonOptions id={p.data.id} />,
    },
  ];
  const columnDefs: ColDef<TClasses>[] = [
    {
      headerName: "Nome",
      field: "name",
      flex: 1,
      cellRenderer: (p: any) => (
        <Link className="font-bold" href={`/classes/${p.data.id}`}>
          {p.data.name}
        </Link>
      ),
    },
    ...columnDefsBase,
  ];

  async function handleSetClasses() {
    const classes = await readClasses();
    if (user?.userRole === "admin") setClasses(classes);
    else setClasses(classes.filter((c) => c.isActive));
  }

  async function handleUpdateGlobalStates() {
    handleSetClasses();
    setEnrollmentIds(await readEnrollmentsByUser());
    setShouldUpdate(false);
  }

  useEffect(() => {
    handleUpdateGlobalStates();
  }, [shouldUpdate, user]);

  return (
    <AgGridReact
      className="w-full p-4"
      rowData={sortedClasses}
      columnDefs={user?.userRole === "admin" ? columnDefsAdmin : columnDefs}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
