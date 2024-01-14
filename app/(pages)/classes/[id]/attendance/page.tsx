"use client";

import { classDatesAtom } from "@/app/utils/atoms/classDatesAtom";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export interface IClassDatesRow {
  id: string;
  date: string;
  day: string;
}

export default function AttendancePage() {
  const pathname = usePathname();
  const classId = useParams().id;
  const [rowData, setRowData] =
    useRecoilState<IClassDatesRow[]>(classDatesAtom);
  const columnDefs: ColDef<IClassDatesRow>[] = [
    { field: "day", headerName: "Dia", flex: 1 },
    { field: "date", headerName: "Data", flex: 1 },
    { headerName: "Ações", flex: 1, cellRenderer: actionsCellRenderer },
  ];

  function actionsCellRenderer(params: any) {
    const data: IClassDatesRow = params.data;
    return (
      <div className="flex justify-content-center gap-4">
        <Link
          className="text-blue-500 hover:text-blue-400 font-bold"
          href={`${pathname}/${data.id}`}
        >
          Editar
        </Link>
        <button
          className="text-red-500 hover:text-red-400 font-bold"
          onClick={() => deleteClassDate(params.data.id)}
        >
          Deletar
        </button>
      </div>
    );
  }

  async function deleteClassDate(classDateId: string) {
    try {
      const res = await fetch(`/api/classDates/${classDateId}`, {
        method: "DELETE",
      });

      const res_data = await res.json();

      // remove deleted class date from table
      const new_res_data = rowData.filter((row) => row.id !== classDateId);

      setRowData(new_res_data);
    } catch (error) {
      console.error("Error deleting class date:", error);
    }
  }

  async function fetchClassDates() {
    try {
      const res = await fetch(`/api/classDates/${classId}`);
      const res_data = await res.json();

      const new_res_data = res_data.map((row) => {
        const date = new Date(row.date);
        const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
        return { ...row, day };
      });

      setRowData(new_res_data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  }

  useEffect(() => {
    fetchClassDates();
  }, []);

  return (
    <div
      className="ag-theme-quartz m-4"
      style={{ width: "100%", fontFamily: "monospace" }}
    >
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
}
