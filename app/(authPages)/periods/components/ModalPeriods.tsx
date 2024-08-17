"use client";

import {
  createPeriod,
  editPeriod,
  readPeriod,
} from "@/app/api/periods/service";
import { modalIdAtom, modalIsOpenAtom } from "@/atoms/modalAtom";
import { periodsAtom } from "@/atoms/periodsAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import { Database } from "@/database.types";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";

export default function ModalPeriods() {
  const setPeriods = useSetRecoilState(periodsAtom);
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);
  const periodId = useRecoilValue(modalIdAtom);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [year, setYear] = useState(new Date());
  const [semester, setSemester] =
    useState<Database["public"]["Enums"]["semesterEnum"]>("first");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.info("Salvando período...");

    let periodData;
    if (!periodId) {
      periodData = await createPeriod(year, semester, startDate, endDate);
    } else {
      periodData = await editPeriod(
        periodId,
        year,
        semester,
        startDate,
        endDate,
      );
    }

    setPeriods(periodData);
    setIsModalOpen(false);
    toast.success("Período salvo com sucesso!");
  }

  if (periodId) {
    useEffect(() => {
      async function readCurrentSelectedPeriod() {
        const periodData = await readPeriod(periodId);
        setSemester(periodData.semester);
        setYear(new Date(periodData.year.toString() + "EDT"));
        setStartDate(new Date(periodData.startDate + "EDT"));
        setEndDate(new Date(periodData.endDate + "EDT"));
      }
      readCurrentSelectedPeriod();
    }, []);
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Label htmlFor="semester">Semestre</Label>
      <Select
        value={semester}
        onChange={(e) => {
          setSemester(
            e.target.value as Database["public"]["Enums"]["semesterEnum"],
          );
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
        selected={year}
        onChange={(date) => {
          setYear(date || new Date());
        }}
        showYearPicker
        dateFormat="yyyy"
      />
      <Label htmlFor="startDate">Data de Início</Label>
      <DatePicker
        className="rounded-md px-4 py-2 bg-inherit border mb-2"
        selected={startDate}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => {
          setStartDate(date || new Date());
        }}
      />
      <Label htmlFor="endDate">Data de Término</Label>
      <DatePicker
        className="rounded-md px-4 py-2 bg-inherit border mb-2"
        selected={endDate}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => {
          setEndDate(date || new Date());
        }}
      />
      <FlexRowReverse>
        <Button type="submit">{periodId ? "Salvar" : "Criar"}</Button>
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

const Form = tw.form`flex-1 flex flex-col w-full justify-center gap-2 text-foreground`;
const Label = tw.label`text-md`;
const Select = tw.select`rounded-md px-4 py-2 bg-inherit border mb-2`;
const Button = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;
const CloseButton = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;
const FlexRowReverse = tw.div`flex flex-row-reverse gap-4`;
