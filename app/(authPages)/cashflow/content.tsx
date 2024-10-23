"use client";
import { useModal } from "@/app/components/MainModal";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { deleteTransaction } from "./actions";
import {
  cashflowBalanceAtom,
  currentTransactionAtom,
  transactionsAtom,
} from "./atom";
import { TTransactionRow } from "./types";
import { usersAtom } from "@/atoms/usersAtom";
import { useWindowWidth } from "@react-hook/window-size";

export function CashFlowContent(p: { transactions: TTransactionRow[] }) {
  const openModal = useModal();
  const setCashflowBalance = useSetRecoilState(cashflowBalanceAtom);
  const [transactions, setTransactions] = useRecoilState(transactionsAtom);
  const setCurrentTransaction = useSetRecoilState(currentTransactionAtom);
  const user = useRecoilValue(usersAtom);
  const windowWidth = useWindowWidth();
  const isAdmin = user?.userRole === "admin";
  // const isDirector = isAdmin || user?.userRole === "director";

  useMemo(() => setTransactions(p.transactions), [p.transactions]);
  useMemo(
    () =>
      setCashflowBalance(
        transactions.reduce((acc, t) => {
          return t.type === "income" ? acc + t.amount : acc - t.amount;
        }, 0),
      ),
    [transactions],
  );

  const colDefs: ColDef<TTransactionRow>[] = [
    {
      field: "amount",
      headerName: "Valor",
      flex: 1,
      minWidth: 100,
      sortIndex: 1,
      sortable: true,
      valueFormatter: ({ value }) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        }).format(value / 100),
      cellRenderer: (p: {
        value: number;
        data: TTransactionRow;
        valueFormatted: string;
      }) => {
        return (
          <span
            className="font-bold"
            style={
              p.data.type === "expense"
                ? { color: "#f4771b" }
                : { color: "#9bbe2e" }
            }
          >
            {p.valueFormatted}
          </span>
        );
      },
    },
    {
      field: "date",
      sortIndex: 0,
      minWidth: 100,
      flex: 1,
      sort: "desc",
      headerName: "Data",
      sortable: true,
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleDateString("pt-BR"),
    },
    { field: "description", headerName: "Descrição", flex: 2 },
  ];
  const adminColDefs = [
    ...colDefs,
    {
      headerName: "",
      width: 75,
      cellRenderer: (p: { data: TTransactionRow }) => {
        return (
          <div className="flex gap-2 justify-between items-center pt-2">
            <button
              onClick={() => {
                setCurrentTransaction(p.data);
                openModal("cashflow");
              }}
            >
              <FaRegPenToSquare size={20} />
            </button>
            <button onClick={() => handleDeleteTransaction(p.data)}>
              <FaRegTrashCan size={20} />
            </button>
          </div>
        );
      },
    },
  ];

  const colDefsMobile: ColDef<TTransactionRow>[] = [
    {
      field: "date",
      sortIndex: 0,
      flex: 1,
      sort: "desc",
      headerName: "Valor | Data | Descrição",
      sortable: true,
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleDateString("pt-BR"),
      cellRenderer: (p: any) => {
        const data: TTransactionRow = p.node.data;
        return (
          <>
            <div className="flex justify-between">
              <span
                className="font-bold"
                style={
                  data.type === "expense"
                    ? { color: "#f4771b" }
                    : { color: "#9bbe2e" }
                }
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                }).format(data.amount / 100)}
              </span>
              <span>{new Date(data.date).toLocaleDateString("pt-BR")}</span>
            </div>

            <div className="flex justify-between">
              <span>{data.description}</span>
              {isAdmin && (
                <div className="flex gap-2 justify-between items-center">
                  <button
                    onClick={() => {
                      setCurrentTransaction(data);
                      openModal("cashflow");
                    }}
                  >
                    <FaRegPenToSquare size={20} />
                  </button>
                  <button onClick={() => handleDeleteTransaction(data)}>
                    <FaRegTrashCan size={20} />
                  </button>
                </div>
              )}
            </div>
          </>
        );
      },
    },
  ];

  async function handleDeleteTransaction(transaction: TTransactionRow) {
    try {
      const deletedTransaction = await deleteTransaction(transaction);
      setTransactions(
        transactions.filter((t) => t.id !== deletedTransaction.id),
      );
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar transação");
    }
  }

  return (
    <AgGridReact
      className="w-full p-4"
      rowData={transactions}
      rowHeight={windowWidth < 600 ? 84 : 42}
      columnDefs={
        windowWidth > 600 ? (isAdmin ? adminColDefs : colDefs) : colDefsMobile
      }
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
