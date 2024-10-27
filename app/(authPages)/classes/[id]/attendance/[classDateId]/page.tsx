"use client";

import { Database } from "@/database.types";
import { presenceOptions } from "@/utils/humanize";
import { useWindowWidth } from "@react-hook/window-size";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import tw from "tailwind-styled-components";

const Select = tw.select`rounded-md px-4 py-2 bg-inherit border mb-2 w-32 font-bold`;

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
  const windowWidth = useWindowWidth();

  const mobileColumnDefs: ColDef<IClassDatesRow>[] = [
    {
      field: "users_view.full_name",
      headerName: "Nome",
      flex: 3,
      filter: true,
    },
    {
      field: "presence",
      headerName: "Presença",
      flex: 1,
      minWidth: 149,
      valueFormatter: ({ value }) => presenceOptions[value],
      cellRenderer: actionsCellRenderer,
    },
  ];
  const columnDefs: ColDef<IClassDatesRow>[] = [
    {
      field: "users_view.full_name",
      headerName: "Nome",
      flex: 2,
      filter: true,
    },
    { field: "users_view.email", headerName: "Email", flex: 2 },
    {
      field: "presence",
      headerName: "Presença",
      flex: 1,
      minWidth: 149,
      valueFormatter: ({ value }) => presenceOptions[value],
      cellRenderer: actionsCellRenderer,
    },
  ];

  function actionsCellRenderer({ data, value }) {
    let color = "#6B7280";
    switch (value) {
      case "absent":
        color = "#f4771b";
        break;
      case "present":
        color = "#9bbe2e";
        break;
      case "justified":
        color = "#19a6de";
        break;
    }

    return (
      <Select
        style={{ color }}
        name="classState"
        defaultValue={value}
        onChange={(e) =>
          updateAttendance(
            data.id,
            e.target.value as Database["public"]["Enums"]["presenceEnum"],
          )
        }
      >
        <option className="text-gray-500 font-bold" value="notRegistered">
          Não Registrado
        </option>
        <option className="text-orange-500 font-bold" value="absent">
          Ausente
        </option>
        <option className="text-green-500 font-bold" value="present">
          Presente
        </option>
        <option className="text-blue-500 font-bold" value="justified">
          Justificada
        </option>
      </Select>
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

      toast.success("Presença atualizada!");
      return data;
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Erro ao atualizar presença");
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
        columnDefs={windowWidth < 768 ? mobileColumnDefs : columnDefs}
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
