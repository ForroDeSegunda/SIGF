"use client";

import { TPeriod } from "@/app/api/periods/route";
import { deletePeriod } from "@/app/api/periods/service";
import { useModal } from "@/app/components/MainModal";
import { periodsAtom } from "@/atoms/periodsAtom";
import { periodsOptions } from "@/utils/humanize";
import { useWindowWidth } from "@react-hook/window-size";
import { ColDef, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

export default function PeriodsPage() {
  const [periods, setPeriods] = useRecoilState<TPeriod[]>(periodsAtom);
  const windowWidth = useWindowWidth();
  const openModal = useModal();

  const columnDefs: ColDef<TPeriod>[] = [
    {
      field: "semester",
      headerName: "Semestre",
      flex: 2,
      valueFormatter: ({ value }) => periodsOptions[value],
    },
    { field: "year", headerName: "Ano", flex: 2 },
    {
      field: "startDate",
      headerName: "Início",
      flex: 2,
      valueFormatter: ({ value }) =>
        new Date(value + "EDT").toLocaleDateString("pt-BR"),
    },
    {
      field: "endDate",
      headerName: "Fim",
      flex: 2,
      valueFormatter: ({ value }) =>
        new Date(value + "EDT").toLocaleDateString("pt-BR"),
    },
    {
      headerName: "Ações",
      minWidth: 150,
      flex: 2,
      cellRenderer: actionCellRenderer,
    },
  ];

  const columnDefsMobile: ColDef<TPeriod>[] = [
    {
      field: "semester",
      headerName: "Semestre | Ano | Ações",
      flex: 1,
      cellRenderer: renderRowMobile,
    },
  ];

  function renderRowMobile(props: { data: TPeriod; api: GridApi; node: any }) {
    const { data } = props;
    return (
      <div className="flex flex-col w-full h-full justify-start">
        <div className="flex w-full justify-between">
          <span>{`${periodsOptions[data?.semester]} - ${data?.year}`}</span>
          <span>{actionCellRenderer({ data })}</span>
        </div>
        <div className="w-full flex gap-2">
          <span className="font-bold">Período:</span>
          <span>
            {new Date(data.startDate + "EDT").toLocaleDateString("pt-BR") +
              " - " +
              new Date(data.endDate + "EDT").toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>
    );
  }

  async function handleDeletePeriod(periodId: string) {
    toast.info("Excluindo período...");
    try {
      await deletePeriod(periodId);
    } catch (error: any) {
      if (error.response.status === 409) toast.error("Período em uso!");
      else toast.error("Erro ao excluir período");
      return;
    }
    setPeriods((prevPeriods) => {
      const newPeriods = prevPeriods.filter((period) => period.id !== periodId);
      return newPeriods;
    });
    toast.success("Período excluído com sucesso!");
  }

  function actionCellRenderer({ data }: { data: TPeriod }) {
    return (
      <div className="flex gap-2 w-full">
        <button
          className="text-blue-500 hover:text-blue-600 font-bold"
          onClick={() => openModal("periods", data.id ?? "")}
          data-action="edit"
        >
          Editar
        </button>
        <button
          className="text-orange-500 hover:text-orange-600 font-bold"
          onClick={() => handleDeletePeriod(data.id ?? "")}
          data-action="delete"
        >
          Excluir
        </button>
      </div>
    );
  }

  return (
    <AgGridReact
      className="w-full p-4"
      rowHeight={windowWidth < 768 ? 84 : 42}
      rowData={periods}
      columnDefs={windowWidth < 768 ? columnDefsMobile : columnDefs}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
