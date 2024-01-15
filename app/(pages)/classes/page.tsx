"use client";

import { sortedClassesSelector } from "@/app/utils/atoms/classesAtom";
import { enrollmentsAtom } from "@/app/utils/atoms/enrollmentsAtom";
import useUser from "@/app/utils/hooks/useUser";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ClassesOptionsButton from "./components/ClassesOptionsButton";
import EnrollButton from "./components/EnrollButton";

export default function ClassesPage() {
  const sortedClasses = useRecoilValue(sortedClassesSelector);
  const setUserEnrollments = useSetRecoilState(enrollmentsAtom);
  const [updateEnrollments, setUpdateEnrollments] = useState(false);

  async function fetchEnrollments() {
    const { data, error } = await useUser();

    if (error) {
      console.error("Error getting user:", error);
      return;
    }

    try {
      const res = await fetch(`/api/enrollments/userId/${data.user.id}`);
      const resData = await res.json();

      const classesEnrolled = await resData.map(
        (enrollment: { classId: string }) => enrollment.classId
      );
      setUserEnrollments(classesEnrolled);
    } catch (error) {
      console.error("Error getting enrollments:", error);
    }
  }

  useEffect(() => {
    fetchEnrollments();
    setUpdateEnrollments(false);
  }, [updateEnrollments]);

  return (
    <div className="w-full">
      <ol className="flex flex-wrap gap-6 p-6">
        {sortedClasses &&
          sortedClasses.map((classItem) => (
            <li
              key={classItem.id}
              className="w-[300px] h-[160px] border border-gray-300 rounded-[10px]"
            >
              <Link
                href={`/classes/${classItem.id}`}
                className="h-[100px] flex flex-row p-4 items-center justify-center"
              >
                {classItem.name}
              </Link>

              <div className="flex flex-row-reverse gap-6 pt-5 px-4 relative border-t items-center">
                <ClassesOptionsButton id={classItem.id} />
                <EnrollButton
                  classId={classItem.id}
                  setUpdateEnrollments={setUpdateEnrollments}
                />
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}