"use client";
import { useModal } from "@/app/components/MainModal";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { deleteTransaction } from "./actions";
import {
  cashflowBalanceAtom,
  currentTransactionAtom,
  transactionsAtom,
} from "./atom";
import { TTransactionRow } from "./types";

export function CashFlowContent(p: { transactions: TTransactionRow[] }) {
  const openModal = useModal();
  const setCashflowBalance = useSetRecoilState(cashflowBalanceAtom);
  const [transactions, setTransactions] = useRecoilState(transactionsAtom);
  const setCurrentTransaction = useSetRecoilState(currentTransactionAtom);

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

  const columnDefs: ColDef<TTransactionRow>[] = [
    {
      field: "amount",
      headerName: "Valor",
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
      sort: "desc",
      headerName: "Data",
      sortable: true,
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleDateString("pt-BR"),
    },
    { field: "description", headerName: "Descrição", flex: 2 },
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
      columnDefs={columnDefs}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
