"use client";

import { TClasses } from "@/app/api/classes/[id]/route";
import { readClasses } from "@/app/api/classes/service";
import { readEnrollmentsByUser } from "@/app/api/enrollments/service";
import { classesAtom, sortedClassesSelector } from "@/atoms/classesAtom";
import { enrollmentsAtom } from "@/atoms/enrollmentsAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { Database } from "@/database.types";
import { useWindowWidth } from "@react-hook/window-size";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBox, FaEye, FaEyeSlash, FaRotate } from "react-icons/fa6";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ButtonEnrollment from "./components/ButtonEnrollment";
import ButtonOptions from "./components/ButtonOptions";
import { weekDaysOptions, weekDaysOrder } from "./components/ModalClasses";

const classStatusOptions = {
  open: "Aberta",
  hidden: "Oculta",
  ongoing: "Em Andamento",
  archived: "Arquivada",
};

export default function ClassesPage() {
  const user = useRecoilValue(usersAtom);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [showOptions, setShowOptions] = useRecoilState(showMobileOptionsAtom);
  const setEnrollmentIds = useSetRecoilState(enrollmentsAtom);
  const setClasses = useSetRecoilState(classesAtom);
  const sortedClasses = useRecoilValue(sortedClassesSelector);
  const windowWidth = useWindowWidth();

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
      headerName: "Nome",
      field: "name",
      flex: 1,
      cellRenderer: (p: any) => (
        <Link
          className="font-bold flex items-center gap-2"
          href={`/classes/${p.data.id}`}
        >
          {p.data.name}
        </Link>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      sort: "desc",
      valueFormatter: ({ value }) => classStatusOptions[value],
    },
    ...columnDefsBase,
    {
      headerName: "Ações",
      flex: 1,
      cellRenderer: (p: any) => <ButtonOptions id={p.data.id} />,
    },
  ];

  const columnDefsAdminMobile: ColDef<TClasses>[] = [
    {
      headerName: "Status | Nome | Dias de Aula",
      field: "status",
      flex: 1,
      sort: "desc",
      cellRenderer: renderRowAdminMobile,
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

  const columnDefsMobile: ColDef<TClasses>[] = [
    {
      headerName: "Nome",
      field: "name",
      flex: 1,
      cellRenderer: renderRowMobile,
    },
  ];

  function renderRowAdminMobile(props: any) {
    const { api, node } = props;

    function resizeRow() {
      if (node.rowHeight !== 42) node.setRowHeight(42);
      else node.setRowHeight(42 * 3 + 16);
      api.onRowHeightChanged();
      setShowOptions(true);
    }

    function handleStatusIcon(
      status: Database["public"]["Enums"]["classStatus"],
    ) {
      switch (status) {
        case "open":
          return <FaEye className="fill-green-500" />;
        case "hidden":
          return <FaEyeSlash className="fill-orange-500" />;
        case "ongoing":
          return <FaRotate className="fill-blue-500" />;
        case "archived":
          return <FaBox className="fill-gray-500" />;
      }
    }

    return (
      <>
        <div
          className="flex justify-between cursor-pointer"
          onClick={resizeRow}
        >
          <div className="font-bold flex items-center gap-2">
            {handleStatusIcon(props.data.status)}
            {props.data.name}
          </div>
          <div>
            {props.data.weekDays
              .split(",")
              .sort(
                (a: string, b: string) =>
                  weekDaysOrder.indexOf(a) - weekDaysOrder.indexOf(b),
              )
              .map((v: string) => weekDaysOptions[v])
              .join(", ")}
          </div>
        </div>
        {showOptions && (
          <>
            <div className="border-t border-x rounded-t w-full flex gap-2 bg-gray-100 px-2">
              <span className="font-bold">Inscrição:</span>
              <ButtonEnrollment id={props.data.id} />
            </div>
            <div className="border-b border-x rounded-b w-full flex gap-2 bg-gray-100 px-2">
              <span className="font-bold">Ações:</span>
              <div className="flex w-full justify-between">
                <ButtonOptions id={props.data.id} />
                <Link
                  className="text-green-500 hover:text-green-600 font-bold"
                  href={`/classes/${props.data.id}`}
                >
                  Abrir Turma
                </Link>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  function renderRowMobile(props: any) {
    const { api, node } = props;

    function resizeRow() {
      if (node.rowHeight !== 42) node.setRowHeight(42);
      else node.setRowHeight(42 * 2 + 16);
      api.onRowHeightChanged();
      setShowOptions(true);
    }

    return (
      <div className="flex flex-col justify-start">
        <div
          className="flex justify-between cursor-pointer"
          onClick={resizeRow}
        >
          <div className="font-bold flex items-center gap-2">
            {props.data.name}
          </div>
          <div>
            {props.data.weekDays
              .split(",")
              .sort(
                (a: string, b: string) =>
                  weekDaysOrder.indexOf(a) - weekDaysOrder.indexOf(b),
              )
              .map((v: string) => weekDaysOptions[v])
              .join(", ")}
          </div>
        </div>
        {showOptions && (
          <div className="border rounded w-full flex gap-2 bg-gray-100 px-2">
            <span className="font-bold">Inscrição:</span>
            <div className="flex justify-between w-full">
              <ButtonEnrollment id={props.data.id} />
              <Link
                className="text-green-500 hover:text-green-600 font-bold"
                href={`/classes/${props.data.id}`}
              >
                Abrir Turma
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  async function handleSetClasses() {
    const classes = await readClasses();
    if (user?.userRole === "admin") setClasses(classes);
    else setClasses(classes.filter((c) => c.status === "open"));
  }

  function handleColumnDefs() {
    if (user?.userRole === "admin") {
      return windowWidth < 550 ? columnDefsAdminMobile : columnDefsAdmin;
    }
    return windowWidth < 550 ? columnDefsMobile : columnDefs;
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
      columnDefs={handleColumnDefs()}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
