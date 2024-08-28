"use client";

import { createClass, updateClass } from "@/app/api/classes/service";
import { classesAtom } from "@/atoms/classesAtom";
import { currentClassAtom } from "@/atoms/currentClassAtom";
import { modalIdAtom, modalIsOpenAtom } from "@/atoms/modalAtom";
import { periodsAtom } from "@/atoms/periodsAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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
  const [currentClass, setCurrentClass] = useRecoilState(currentClassAtom);
  const [classes, setClasses] = useRecoilState(classesAtom);
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);
  const classId = useRecoilValue(modalIdAtom);
  const periods = useRecoilValue(periodsAtom);
  const name = currentClass?.name || "";
  const size = currentClass?.size || 30;
  const selectedWeekdays = currentClass?.weekDays.split(",") || [];

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.info("Salvando classe...");

    const status = event.target[2].value;
    const periodId = event.target[3].value;

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
        const newClasses = classes.filter((c) => c.id !== classId);
        setClasses([...newClasses, classData]);
      } catch (error) {
        toast.error("Erro ao atualizar classe");
        return;
      }
    }
    setCurrentClass(null);
    setIsModalOpen(false);
    toast.success("Classe salva com sucesso!");
  }

  function handleWeekDaysCheckboxChange(weekday: string) {
    const updatedWeekdays = selectedWeekdays.includes(weekday)
      ? selectedWeekdays.filter((day) => day !== weekday)
      : [...selectedWeekdays, weekday];
    if (currentClass)
      setCurrentClass({ ...currentClass, weekDays: updatedWeekdays.join(",") });
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Label>Nome</Label>
      <Input
        type="text"
        placeholder="Avançada 1"
        value={name}
        onChange={(e) => {
          if (currentClass)
            setCurrentClass({ ...currentClass, name: e.target.value });
        }}
      />
      <Label>Tamanho da Turma</Label>
      <Input
        type="number"
        value={size}
        step="2"
        min="10"
        onChange={(e) => {
          const value = Number(e.target.value);
          if (currentClass) setCurrentClass({ ...currentClass, size: value });
        }}
        onBlur={(e) => {
          const value = Number(e.target.value);
          if (value < 10 && currentClass)
            setCurrentClass({ ...currentClass, size: 10 });
          else if (value % 2 !== 0 && currentClass)
            setCurrentClass({ ...currentClass, size: 10 });
        }}
      />
      {currentClass &&
      (currentClass.status === "open" || currentClass.status === "hidden") ? (
        <>
          <Label>Criar com status de:</Label>
          <Select name="classState" defaultValue={currentClass?.status}>
            <option value="hidden">Oculta</option>
            <option value="open">Aberta</option>
          </Select>
        </>
      ) : (
        <>
          <Label>Mudar status para:</Label>
          <Select name="classState" defaultValue={currentClass?.status}>
            <option value="ongoing">Em andamento</option>
            <option value="archived">Arquivada</option>
          </Select>
        </>
      )}
      {currentClass &&
        (currentClass.status === "open" ||
          currentClass.status === "hidden") && (
          <>
            <Label>Semestre</Label>
            <Select name="periodId">
              {periods.map((period: any) => (
                <option key={period.id} value={period.id}>
                  {periodsOptions[period.semester]} - {period.year}
                </option>
              ))}
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
          </>
        )}
      <ButtonContainer>
        <CloseButton
          type="button"
          onClick={() => {
            setCurrentClass(null);
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
