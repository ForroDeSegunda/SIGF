"use client";

import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Database } from "@/database.types";
import {
  deleteEnrollment,
  createEnrollment,
  updateEnrollment,
} from "@/app/api/enrollments/service";
import useUser from "@/hooks/useUser";
import { enrollmentsAtom } from "@/atoms/enrollmentsAtom";
import { modalIsOpenAtom, modalIdAtom } from "@/atoms/modalAtom";
import { toast } from "sonner";
import tw from "tailwind-styled-components";
import { TEnrollmentRow } from "@/app/api/enrollments/types";

export type TDanceRole = Database["public"]["Enums"]["danceRole"];
export type TDanceRolePreference =
  Database["public"]["Enums"]["danceRolePreference"];

export default function ModalClassEnrollment() {
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
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

  console.log("enrollments", enrollments);

  const optionalRoleOptions = {
    led: "Conduzido(a)",
    leader: "Condutor(a)",
  };
  const rolesOptions = {
    ...optionalRoleOptions,
    indifferent: "Indiferente",
  };

  async function handleUnenroll() {
    toast.info("Cancelando inscrição...");
    const { data, error } = await useUser();
    if (error) return toast.error("Erro ao obter usuário");

    try {
      const deletedEnrollment = await deleteEnrollment(
        { classId, userId: data.user.id },
        enrollments,
      );
      const filteredEnrollments = enrollments.filter(
        (enrollment) =>
          enrollment.classId === deletedEnrollment.classId &&
          enrollment.userId === deletedEnrollment.userId,
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

    console.log("danceRole", danceRole);

    try {
      const createdEnrollment = await createEnrollment({
        classId,
        userId: data.user.id,
        danceRolePreference,
        danceRole,
      });

      setEnrollments([...enrollments, createdEnrollment]);
    } catch (error) {
      toast.error("Erro ao se inscrever");
      return;
    }
    setIsModalOpen(false);
    toast.success("Inscrição realizada com sucesso!");
  }

  async function handleUpdateEnrollment() {
    toast.info("Atualizando inscrição...");
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

  console.log("danceRole", danceRole);

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

const Form = tw.form`flex-1 flex flex-col w-full justify-center gap-2 text-foreground`;
const Label = tw.label`text-md`;
const Select = tw.select`rounded-md px-4 py-2 bg-inherit border mb-6`;
const ButtonContainer = tw.div`flex flex-col gap-4`;
const ButtonRow = tw.div`flex gap-4`;
const UnenrollButton = tw.button`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded`;
const UpdateEnrollmentButton = tw.button`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`;
const EnrollButton = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;
const CloseButton = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;
