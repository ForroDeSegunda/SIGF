"use client";

import {
  createEnrollments,
  deleteEnrollment,
  updateEnrollment,
} from "@/app/api/enrollments/service";
import { enrollmentsAtom } from "@/atoms/enrollmentsAtom";
import { modalIdAtom, modalIsOpenAtom } from "@/atoms/modalAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import useUser from "@/hooks/useUser";
import { TDanceRole, TDanceRolePreference, TEnrollmentRow } from "@/utils/db";
import { optionalRoleOptions, rolesOptions } from "@/utils/humanize";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";

const Form = tw.form`flex-1 flex flex-col w-full justify-center gap-2 text-foreground`;
const Label = tw.label`text-md`;
const Select = tw.select`rounded-md px-4 py-2 bg-inherit border mb-6`;
const ButtonContainer = tw.div`flex flex-col gap-4`;
const ButtonRow = tw.div`flex gap-4`;
const UnenrollButton = tw.button`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded`;
const UpdateEnrollmentButton = tw.button`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`;
const EnrollButton = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;
const CloseButton = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;

export default function ModalClassEnrollment() {
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);
  const classId = useRecoilValue(modalIdAtom);
  const [enrollments, setEnrollments] = useRecoilState(enrollmentsAtom);
  const [danceRole, setDanceRole] = useState<TDanceRole>(
    enrollments[0]?.danceRole || "led",
  );
  const [danceRolePreference, setDanceRolePreference] =
    useState<TDanceRolePreference>(
      enrollments[0]?.danceRolePreference || "led",
    );
  const isEnrolled = enrollments.some(
    (enrollment) => enrollment.classId === classId,
  );
  const enrollmentIsPending = enrollments.some(
    (enrollment) =>
      enrollment.classId === classId && enrollment.status === "pending",
  );

  async function handleUnenroll() {
    toast.info("Cancelando inscrição...");
    if (!enrollmentIsPending) {
      toast.error("Inscrição já processada, não é possível atualizar");
      setIsModalOpen(false);
      return;
    }
    const { data, error } = await useUser();
    if (error) return toast.error("Erro ao obter usuário");

    try {
      const deletedEnrollment = await deleteEnrollment({
        classId,
        userId: data.user.id,
      });

      const filteredEnrollments = enrollments.filter(
        (enrollment) => enrollment.classId !== deletedEnrollment.classId,
      );

      setEnrollments(filteredEnrollments);
    } catch (error) {
      toast.error("Erro ao cancelar inscrição");
      return;
    }
    setIsModalOpen(false);
    toast.success("Inscrição cancelada com sucesso!");
  }

  async function handleEnroll() {
    toast.info("Inscrição em andamento...");
    const { data, error } = await useUser();
    if (error) return toast.error("Erro ao obter usuário");

    try {
      const createdEnrollment = await createEnrollments([
        {
          classId,
          userId: data.user.id,
          danceRolePreference,
          danceRole,
        },
      ]);

      setEnrollments([...enrollments, createdEnrollment[0]]);
    } catch (error) {
      toast.error("Erro ao se inscrever");
      return;
    }
    setIsModalOpen(false);
    toast.success("Inscrição realizada com sucesso!");
  }

  async function handleUpdateEnrollment() {
    toast.info("Atualizando inscrição...");
    if (!enrollmentIsPending) {
      toast.error("Inscrição já processada, não é possível atualizar");
      setIsModalOpen(false);
      return;
    }
    const { data, error } = await useUser();
    if (error) return toast.error("Erro ao obter usuário");
    try {
      const updatedEnrollment = await updateEnrollment({
        classId,
        userId: data.user.id,
        danceRolePreference,
        danceRole,
      });
      const updatedEnrollments = enrollments.map(
        (enrollment: TEnrollmentRow) =>
          enrollment.classId === classId && enrollment.userId === data.user.id
            ? updatedEnrollment
            : enrollment,
      );
      setEnrollments(updatedEnrollments);
    } catch (error) {
      toast.error("Erro ao atualizar inscrição");
      return;
    }
    setIsModalOpen(false);
    toast.success("Inscrição atualizada com sucesso!");
  }

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Label>Papel</Label>
      <Select
        value={danceRole}
        onChange={(e) => {
          const value = e.target.value as TDanceRole;
          setDanceRole(value);
          if (value !== "indifferent") setDanceRolePreference(value);
        }}
      >
        {Object.entries(rolesOptions).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </Select>
      {danceRole === "indifferent" ? (
        <>
          <Label>Preferência</Label>
          <Select
            value={danceRolePreference}
            onChange={(e) =>
              setDanceRolePreference(e.target.value as TDanceRolePreference)
            }
          >
            {Object.entries(optionalRoleOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
        </>
      ) : null}

      <ButtonContainer>
        <ButtonRow>
          <CloseButton
            onClick={(e) => {
              e.preventDefault();
              setShowMobileOptions(false);
              setIsModalOpen(false);
            }}
          >
            Fechar
          </CloseButton>
          {isEnrolled ? (
            <UpdateEnrollmentButton onClick={handleUpdateEnrollment}>
              Atualizar
            </UpdateEnrollmentButton>
          ) : (
            <EnrollButton onClick={handleEnroll}>Inscrever</EnrollButton>
          )}
        </ButtonRow>
        {isEnrolled && (
          <UnenrollButton onClick={handleUnenroll}>
            Cancelar Inscrição
          </UnenrollButton>
        )}
      </ButtonContainer>
    </Form>
  );
}
