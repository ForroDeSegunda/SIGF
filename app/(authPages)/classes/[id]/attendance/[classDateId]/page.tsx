"use client";

import { Database } from "@/database.types";
import { presenceOptions } from "@/utils/humanize";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface IClassDatesRow {
  id: string;
  userId: string;
  classDateId: string;
  presence: string;
  createdAt: string;
  users_view: {
    id: string;
    email: string;
    full_name: string;
  };
  classDates: {
    id: string;
    date: string;
    classId: string;
    createdAt: string;
  };
}

export default function AttendancePage() {
  const params = useParams();
  const gridRef = useRef<AgGridReact>(null);
  const classDateId = params.classDateId;

  const [rowData, setRowData] = useState<IClassDatesRow[]>([]);
  const columnDefs: ColDef<IClassDatesRow>[] = [
    {
      field: "users_view.full_name",
      headerName: "Nome",
      flex: 1,
      filter: true,
    },
    { field: "users_view.email", headerName: "Email", flex: 1 },
    {
      field: "presence",
      headerName: "Presença",
      flex: 1,
      valueFormatter: ({ value }) => presenceOptions[value],
    },
    { headerName: "Ações", flex: 1, cellRenderer: actionsCellRenderer },
  ];

  function actionsCellRenderer(params: any) {
    const data: IClassDatesRow = params.data;

    function PresentButton() {
      return (
        <button
          className="text-green-500 hover:text-green-600 font-bold"
          onClick={() => updateAttendance(data.id, "present")}
        >
          Presente
        </button>
      );
    }

    function AbsentButton() {
      return (
        <button
          className="text-orange-500 hover:text-orange-600 font-bold"
          onClick={() => updateAttendance(data.id, "absent")}
        >
          Ausente
        </button>
      );
    }

    function JustifiedButton() {
      return (
        <button
          className="text-blue-500 hover:text-blue-600 font-bold"
          onClick={() => updateAttendance(data.id, "justified")}
        >
          Justificada
        </button>
      );
    }

    if (data.presence === "justified") {
      return (
        <div className="flex gap-4">
          <PresentButton />
          <AbsentButton />
        </div>
      );
    } else if (data.presence === "present") {
      return (
        <div className="flex gap-4">
          <AbsentButton />
          <JustifiedButton />
        </div>
      );
    } else if (data.presence === "absent") {
      return (
        <div className="flex gap-4">
          <PresentButton />
          <JustifiedButton />
        </div>
      );
    }

    return (
      <div className="flex gap-4">
        <PresentButton />
        <AbsentButton />
        <JustifiedButton />
      </div>
    );
  }

  async function updateAttendance(
    attendanceId: string,
    presence: Database["public"]["Enums"]["presenceEnum"],
  ) {
    try {
      const res = await fetch(`/api/attendance`, {
        method: "PATCH",
        body: JSON.stringify({ id: attendanceId, presence }),
      });
      const data = await res.json();

      const new_row_data = rowData.map((row) => {
        if (row.id === attendanceId) {
          return { ...row, presence };
        }
        return row;
      });

      setRowData(new_row_data);

      return data;
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  }

  async function fetchAtttenance() {
    try {
      const res = await fetch(`/api/attendance/${classDateId}`);
      const data = await res.json();
      setRowData(data);
      return data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  }

  useEffect(() => {
    fetchAtttenance();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <AgGridReact
        ref={gridRef}
        className="w-full px-4 pt-4"
        rowData={rowData}
        columnDefs={columnDefs}
        overlayNoRowsTemplate="ㅤ"
      />

      <button
        className="text-blue-500"
        onClick={() => gridRef.current?.api.exportDataAsCsv()}
      >
        Exportar CSV
      </button>
    </div>
  );
}
