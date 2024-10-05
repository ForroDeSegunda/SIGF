import { modalIsOpenAtom } from "@/atoms/modalAtom";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";
import { createTransaction, updateTransaction } from "../actions";
import { currentTransactionAtom, transactionsAtom } from "../atom";
import { TTransactionType } from "../types";

const ButtonContainer = tw.div`flex justify-end gap-4 mt-4`;
const CloseButton = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;
const SubmitButton = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;
const Form = tw.form`flex-1 flex flex-col w-full justify-center gap-2 text-foreground`;
const Label = tw.label`text-md`;
const Input = tw.input`border rounded-md px-4 py-2 pl-2`;
const Select = tw.select`rounded-md px-4 py-2 bg-inherit border`;

export function ModalCashflow() {
  const curTransaction = useRecoilValue(currentTransactionAtom);
  const [type, setType] = useState<TTransactionType>(
    curTransaction?.type || "income",
  );
  const [amount, setAmount] = useState(
    curTransaction?.amount ? curTransaction?.amount / 100 : 0,
  );
  const [date, setDate] = useState<string>(
    curTransaction?.date.split("T")[0] ||
      new Date().toISOString().split("T")[0],
  );
  const [description, setDescription] = useState<string>(
    curTransaction?.description || "",
  );
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const [transactions, setTransactions] = useRecoilState(transactionsAtom);
  const resetCurrentTransaction = useResetRecoilState(currentTransactionAtom);

  async function handleUpdateTransaction() {
    try {
      const transaction = {
        type,
        amount: amount * 100,
        date,
        description,
        id: curTransaction?.id,
      };

      const updatedTransaction = await updateTransaction(transaction);
      toast.success("Transação atualizada com sucesso!");
      setTransactions(
        transactions.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t,
        ),
      );
      resetCurrentTransaction();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar transação");
    }
  }

  async function handleCreateTransaction() {
    try {
      const createdTransaction = await createTransaction({
        type: type,
        amount: amount * 100,
        date,
        description,
      });
      toast.success("Transação criada com sucesso!");
      setTransactions([...transactions, createdTransaction]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar transação");
    }
  }

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Label>Tipo</Label>
      <Select
        value={type}
        onChange={(e) => setType(e.target.value as TTransactionType)}
      >
        <option value="income">Receita</option>
        <option value="expense">Despesa</option>
      </Select>
      <Label>Valor</Label>
      <CurrencyInput
        className="border rounded-md px-4 py-2 pl-2"
        id="input-example"
        name="input-name"
        placeholder="Please enter a number"
        value={amount}
        decimalsLimit={2}
        decimalScale={2}
        prefix="R$ "
        fixedDecimalLength={2}
        decimalSeparator=","
        groupSeparator=" "
        onValueChange={(_, __, values) => {
          setAmount(values?.float as never);
        }}
      />
      <Label>Data</Label>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Label>Descrição</Label>
      <Input
        type="text"
        placeholder="Gastos com material"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <ButtonContainer>
        <CloseButton
          type="button"
          onClick={() => {
            setIsModalOpen(false);
            resetCurrentTransaction();
          }}
        >
          Fechar
        </CloseButton>
        {curTransaction ? (
          <SubmitButton onClick={handleUpdateTransaction}>Salvar</SubmitButton>
        ) : (
          <SubmitButton onClick={handleCreateTransaction}>Criar</SubmitButton>
        )}
      </ButtonContainer>
    </Form>
  );
}
