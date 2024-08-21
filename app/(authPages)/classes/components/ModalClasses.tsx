"use client";

import {
  createClass,
  readClass,
  updateClass,
} from "@/app/api/classes/controller";
import { classesAtom } from "@/atoms/classesAtom";
import { modalIsOpenAtom, modalIdAtom } from "@/atoms/modalAtom";
import { periodsAtom } from "@/atoms/periodsAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";

export const weekDaysOptions = {
  sun: "Dom",
  mon: "Seg",
  tue: "Ter",
  wed: "Qua",
  thu: "Qui",
  fri: "Sex",
  sat: "Sáb",
};
export const weekDaysOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const periodsOptions = {
  first: "Primeiro",
  second: "Segundo",
  firstVacation: "Primeiro/Férias",
  secondVacation: "Segundo/Férias",
};

export default function ModalClasses() {
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [size, setSize] = useState(30);
  const [name, setName] = useState("");
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);
  const setClasses = useSetRecoilState(classesAtom);
  const classId = useRecoilValue(modalIdAtom);
  const periods = useRecoilValue(periodsAtom);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.info("Salvando classe...");
    const periodId = event.target[2].value;
    const status = event.target[3].value;

    if (!classId) {
      try {
        const classData = await createClass({
          name,
          periodId,
          weekDays: selectedWeekdays.join(","),
          status,
          size,
        });

        setClasses(classData);
      } catch (error) {
        toast.error("Erro ao criar classe");
        return;
      }
    } else {
      try {
        const classData = await updateClass({
          id: classId,
          name,
          weekDays: selectedWeekdays.join(","),
          status,
          size,
        });
        setClasses(classData);
      } catch (error) {
        toast.error("Erro ao atualizar classe");
        return;
      }
    }
    setName("");
    setSelectedWeekdays([]);
    setIsModalOpen(false);
    toast.success("Classe salva com sucesso!");
  }

  function handleWeekDaysCheckboxChange(weekday: string) {
    const updatedWeekdays = selectedWeekdays.includes(weekday)
      ? selectedWeekdays.filter((day) => day !== weekday)
      : [...selectedWeekdays, weekday];
    setSelectedWeekdays(updatedWeekdays);
  }

  if (classId) {
    useEffect(() => {
      async function updateClassState() {
        const classData = await readClass(classId);
        const currentSelectedWeekdays = classData.weekDays.split(",");
        setSelectedWeekdays(currentSelectedWeekdays);
        classData.size !== undefined ? setSize(classData.size) : setSize(30);
        setName(classData.name);
      }
      updateClassState();
    }, []);
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Label>Nome</Label>
      <Input
        type="text"
        placeholder="Avançada 1"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Label>Tamanho da Turma</Label>
      <Input
        type="number"
        value={size}
        step="2"
        min="10"
        onChange={(e) => {
          const value = Number(e.target.value);
          setSize(value);
        }}
        onBlur={(e) => {
          const value = Number(e.target.value);
          if (value < 10) setSize(10);
          else if (value % 2 !== 0) setSize(value + 1);
        }}
      />
      <Label>Semestre</Label>
      <Select name="periodId">
        {periods.map((period: any) => (
          <option key={period.id} value={period.id}>
            {periodsOptions[period.semester]} - {period.year}
          </option>
        ))}
      </Select>
      <Label>Criar como:</Label>
      <Select name="classState">
        <option value="open">Aberta</option>
        <option value="hidden">Oculta</option>
      </Select>
      <Label>Dias da Semana</Label>
      <FlexContainer>
        {weekDaysOrder.map(
          (weekday, index) =>
            index < 4 && (
              <FlexItem key={weekday}>
                <Input
                  type="checkbox"
                  id={weekday}
                  name="weekdays"
                  value={weekday}
                  checked={selectedWeekdays.includes(weekday)}
                  onChange={() => handleWeekDaysCheckboxChange(weekday)}
                />
                <CheckboxLabel>{weekDaysOptions[weekday]}</CheckboxLabel>
              </FlexItem>
            ),
        )}
      </FlexContainer>
      <FlexContainer>
        {weekDaysOrder.map(
          (weekday, index) =>
            index >= 4 && (
              <FlexItem key={weekday}>
                <Input
                  type="checkbox"
                  id={weekday}
                  name="weekdays"
                  value={weekday}
                  checked={selectedWeekdays.includes(weekday)}
                  onChange={() => handleWeekDaysCheckboxChange(weekday)}
                />
                <CheckboxLabel>{weekDaysOptions[weekday]}</CheckboxLabel>
              </FlexItem>
            ),
        )}
      </FlexContainer>
      <ButtonContainer>
        <CloseButton
          type="button"
          onClick={() => {
            setIsModalOpen(false);
            setShowMobileOptions(false);
          }}
        >
          Fechar
        </CloseButton>
        <SubmitButton type="submit">
          {classId ? "Salvar" : "Criar"}
        </SubmitButton>
      </ButtonContainer>
    </Form>
  );
}

const Form = tw.form`flex-1 flex flex-col w-full justify-center gap-2 text-foreground z-1000`;
const Label = tw.label`text-md`;
const Input = tw.input`border rounded-md px-4 py-2 pl-2`;
const Select = tw.select`rounded-md px-4 py-2 bg-inherit border mb-2`;
const FlexContainer = tw.div`flex gap-2 justify-left`;
const FlexItem = tw.div`flex items-center`;
const CheckboxLabel = tw.label`ml-2`;
const ButtonContainer = tw.div`flex justify-end gap-4 mt-4`;
const CloseButton = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;
const SubmitButton = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;
