"use client";

import {
  createAttendances,
  readApprovedEnrollments,
} from "@/app/api/attendance/service";
import { createClassDates } from "@/app/api/classDates/service";
import { readClass } from "@/app/api/classes/service";
import { classDatesAtom } from "@/atoms/classDatesAtom";
import { modalIsOpenAtom } from "@/atoms/modalAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import { TAttendanceInsert } from "@/utils/db";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "sonner";

export default function ModalClassDate() {
  const classId = useParams().id;
  const [classDates, setClassDates] = useRecoilState(classDatesAtom);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);

  async function handleCreateClassDate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const classData = await readClass(classId);

    if (!classData?.weekDays) {
      throw new Error("Class has no week days");
    }

    const classWeekDays = classData.weekDays.split(",");
    const selectedDateWeekDay = selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const isDateInClassWeekDays = classWeekDays.includes(
      selectedDateWeekDay.toLowerCase(),
    );

    if (!isDateInClassWeekDays) {
      throw new Error("Date is not in class week days");
    }

    const approvedEnrollments = await readApprovedEnrollments(classId);

    const newClassDates = await createClassDates(
      classId,
      [selectedDate],
      classDates,
    );
    const attendances = newClassDates.flatMap((classDate) => {
      return approvedEnrollments.map((enrollment) => {
        return { classDateId: classDate.id, userId: enrollment.userId };
      });
    });

    createAttendances(attendances as TAttendanceInsert[]);
    setClassDates(newClassDates);
    setIsModalOpen(false);
  }

  return (
    <form
      className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
      action="/api/periods"
      method="post"
      onSubmit={handleCreateClassDate}
    >
      <label className="text-md" htmlFor="startDate">
        Data da aula
      </label>
      <DatePicker
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date || new Date());
          toast.success("Data da aula selecionada");
        }}
      />
      <div className="flex flex-row-reverse gap-4">
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Criar
        </button>
        <button
          className="border border-gray-700 rounded px-4 py-2 text-black"
          onClick={() => {
            setShowMobileOptions(false);
            setIsModalOpen(false);
          }}
        >
          Fechar
        </button>
      </div>
    </form>
  );
}
