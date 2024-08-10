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

  const columnDefsNonAdmin: ColDef<TClasses>[] = [
    {
      headerName: "Nome",
      filter: true,
      flex: 1,
      sortIndex: 0,
      cellRenderer: (p: any) => (
        <Link className="font-bold" href={`/classes/${p.data.id}`}>
          {p.data.name}
        </Link>
      ),
    },
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
  const columnDefs: ColDef<TClasses>[] = [
    {
      headerName: "Ativa",
      field: "isActive",
      maxWidth: 88,
      sortIndex: 0,
      sort: "desc",
    },
    ...columnDefsNonAdmin,
    {
      headerName: "Ações",
      flex: 1,
      cellRenderer: (p: any) => <ButtonOptions id={p.data.id} />,
    },
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
      columnDefs={user?.userRole === "admin" ? columnDefs : columnDefsNonAdmin}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
