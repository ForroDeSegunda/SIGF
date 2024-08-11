"use client";

import { deleteClassDate, readClassDates } from "@/app/api/classDates/service";
import { useModal } from "@/app/components/MainModal";
import { classDatesAtom } from "@/atoms/classDatesAtom";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

export interface IClassDatesRow {
  id: string;
  date: string;
  day: string;
}

export default function AttendancePage() {
  const pathname = usePathname();
  const classId = useParams().id;
  const router = useRouter();
  const openModal = useModal();
  // TODO: Fix this any, using classDatesAtom but types are incorrect
  const [rowData, setRowData] = useRecoilState<IClassDatesRow[]>(
    classDatesAtom as any,
  );

  const columnDefs: ColDef<IClassDatesRow>[] = [
    { field: "day", headerName: "Dia", flex: 1 },
    {
      field: "date",
      headerName: "Data",
      flex: 1,
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleDateString("pt-BR"),
    },
    { headerName: "Presenças", flex: 1, cellRenderer: attendanceCellRenderer },
  ];

  function attendanceCellRenderer(params: any) {
    const classDateData: IClassDatesRow = params.data;
    return (
      <div className="flex gap-4">
        <button
          className="text-green-500 hover:text-green-600 font-bold"
          onClick={() => router.push(`${pathname}/${classDateData.id}`)}
        >
          Registrar
        </button>
        <button
          className="text-orange-500 hover:text-orange-600 font-bold"
          onClick={() =>
            openModal("confirmation", "", () =>
              handleDeleteClassDate(classDateData.id),
            )
          }
        >
          Excluir
        </button>
      </div>
    );
  }

  async function handleDeleteClassDate(classDateId: string) {
    toast.info("Deletando data da aula...");

    try {
      const deletedClassDate = await deleteClassDate(classDateId);
      const newClassDates = rowData.filter(
        (row) => row.id !== deletedClassDate.id,
      );
      setRowData(newClassDates);
      toast.success("Data da aula deletada");
    } catch (error) {
      toast.error("Erro ao deletar data da aula");
    }
  }

  async function handleReadClassDates() {
    try {
      const classDates = await readClassDates(classId as string);
      if (!classDates) return;

      const formattedClassDates = classDates.map((row) => {
        const date = new Date(row.date + "EDT");

        const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
        return { ...row, day };
      });

      setRowData(formattedClassDates);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  }

  useEffect(() => {
    handleReadClassDates();
  }, []);

  return (
    <AgGridReact
      className="w-full p-4"
      rowData={rowData}
      columnDefs={columnDefs}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
