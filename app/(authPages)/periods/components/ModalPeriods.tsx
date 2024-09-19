"use client";

import { createPeriods, updatePeriod } from "@/app/api/periods/service";
import { currentPeriodAtom } from "@/atoms/currentPeriod";
import { modalIdAtom, modalIsOpenAtom } from "@/atoms/modalAtom";
import { periodsAtom } from "@/atoms/periodsAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import DatePicker from "react-datepicker";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";
import { readPeriods } from "../actions";
import { TSemesterEnum } from "@/app/enumTypes";

const Form = tw.form`flex-1 flex flex-col w-full justify-center gap-2 text-foreground`;
const Label = tw.label`text-md`;
const Select = tw.select`rounded-md px-4 py-2 bg-inherit border mb-2`;
const Button = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;
const CloseButton = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;
const FlexRowReverse = tw.div`flex flex-row-reverse gap-4`;

export default function ModalPeriods() {
  const [currentPeriod, setCurrentPeriod] = useRecoilState(currentPeriodAtom);
  const [periods, setPeriods] = useRecoilState(periodsAtom);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const periodId = useRecoilValue(modalIdAtom);

  async function handleCreatePeriod() {
    toast.info("Criando período...");
    const createdPeriods = await createPeriods([currentPeriod]);
    setPeriods([...periods, createdPeriods[0]]);
    setIsModalOpen(false);
    toast.success("Período criado com sucesso!");
  }

  async function handleUpdatePeriod() {
    toast.info("Editando período...");
    await updatePeriod(currentPeriod);
    const updatedPeriods = await readPeriods();
    setPeriods(updatedPeriods);
    setIsModalOpen(false);
    toast.success("Período atualizado com sucesso!");
  }

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Label htmlFor="semester">Semestre</Label>
      <Select
        value={currentPeriod.semester || "first"}
        onChange={(e) => {
          setCurrentPeriod({
            ...currentPeriod,
            semester: e.target.value as TSemesterEnum,
          });
        }}
        required
      >
        <option value="first">Primeiro</option>
        <option value="firstVacation">Primeiro/Férias</option>
        <option value="second">Segundo</option>
        <option value="secondVacation">Segundo/Férias</option>
      </Select>
      <Label htmlFor="year">Ano</Label>
      <DatePicker
        className="rounded-md px-4 py-2 bg-inherit border mb-2"
        selected={new Date(currentPeriod.year, 0, 1) || new Date()}
        onChange={(date) => {
          setCurrentPeriod({ ...currentPeriod, year: date!.getFullYear() });
        }}
        showYearPicker
        dateFormat="yyyy"
      />
      <Label htmlFor="startDate">Data de Início</Label>
      <DatePicker
        className="rounded-md px-4 py-2 bg-inherit border mb-2"
        selected={new Date(currentPeriod.startDate + "EDT") || new Date()}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => {
          setCurrentPeriod({
            ...currentPeriod,
            startDate: date?.toISOString().split("T")[0]!,
          });
        }}
      />
      <Label htmlFor="endDate">Data de Término</Label>
      <DatePicker
        className="rounded-md px-4 py-2 bg-inherit border mb-2"
        selected={new Date(currentPeriod.endDate + "EDT") || new Date()}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => {
          setCurrentPeriod({
            ...currentPeriod,
            endDate: date?.toISOString().split("T")[0]!,
          });
        }}
      />
      <FlexRowReverse>
        {periodId ? (
          <Button onClick={handleUpdatePeriod}>Salvar</Button>
        ) : (
          <Button onClick={handleCreatePeriod}>Criar</Button>
        )}
        <CloseButton
          onClick={() => {
            setShowMobileOptions(false);
            setIsModalOpen(false);
          }}
        >
          Fechar
        </CloseButton>
      </FlexRowReverse>
    </Form>
  );
}
