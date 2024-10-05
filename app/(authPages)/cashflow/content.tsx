"use client";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { cashflowBalanceAtom, transactionsAtom } from "./atom";
import { TTransactionRow } from "./types";
import { FaRegPenToSquare, FaRegTrashCan, FaTrash } from "react-icons/fa6";
import { deleteTransaction } from "./actions";
import { toast } from "sonner";

export function CashFlowContent(p: { transactions: TTransactionRow[] }) {
  const setBalance = useSetRecoilState(cashflowBalanceAtom);
  const [transactions, setTransactions] = useRecoilState(transactionsAtom);

  useMemo(() => setTransactions(p.transactions), [p.transactions]);
  useMemo(
    () => setBalance(transactions.reduce((acc, t) => acc + t.amount, 0)),
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
      cellRenderer: (p: any) => (
        <span
          className="font-bold"
          style={p.value < 0 ? { color: "#f4771b" } : { color: "#9bbe2e" }}
        >
          {p.valueFormatted}
        </span>
      ),
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
            <button onClick={() => console.log("p", p)}>
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
