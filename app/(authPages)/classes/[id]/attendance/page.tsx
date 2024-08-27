"use client";

import { deleteClassDate, readClassDates } from "@/app/api/classDates/service";
import { useModal } from "@/app/components/MainModal";
import { classDatesAtom } from "@/atoms/classDatesAtom";
import { useWindowWidth } from "@react-hook/window-size";
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
  const windowWidth = useWindowWidth();
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
        new Date(value + "EDT").toLocaleDateString("pt-BR"),
    },
    { headerName: "Presenças", flex: 1, cellRenderer: renderActions },
  ];

  const columnDefsMobile: ColDef<IClassDatesRow>[] = [
    {
      headerName: "Dia | Data",
      field: "date",
      flex: 1,
      cellRenderer: renderRowMobile,
    },
  ];

  function renderRowMobile(props: any) {
    const { api, node } = props;
    function resizeRow() {
      if (node.rowHeight !== 42) node.setRowHeight(42);
      else node.setRowHeight(42 * 2 + 16);
      api.onRowHeightChanged();
    }

    return (
      <div className="flex flex-col justify-start">
        <button
          className="flex justify-between cursor-pointer"
          onClick={resizeRow}
        >
          <div className="flex justify-between w-full">
            <span>{props.data.day}</span>
            <span>{new Date(props.data.date).toLocaleDateString("pt-BR")}</span>
          </div>
        </button>

        <div className="border rounded w-full flex gap-2 bg-gray-100 px-2">
          <span className="font-bold">Presenças:</span>
          {renderActions(props)}
        </div>
      </div>
    );
  }

  function renderActions(params: any) {
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
      columnDefs={windowWidth < 450 ? columnDefsMobile : columnDefs}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
