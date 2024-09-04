import {
  TApprovedEnrollment,
  TAttendanceInsert,
  TAttendanceWithClassDates,
} from "@/utils/db";
import axios, { AxiosError, isAxiosError } from "axios";

export async function readAttendances(
  userId?: string | string[],
  classId?: string,
) {
  try {
    const res = await axios.get(`/api/attendance`);
    const attendances: TAttendanceWithClassDates[] = res.data;
    if (userId && classId) {
      const filteredAttendances = attendances.filter(
        (attendance) =>
          attendance.userId === userId &&
          attendance.classDates.classId === classId,
      );
      return filteredAttendances;
    } else if (userId) {
      const filteredAttendances = attendances.filter(
        (attendance) => attendance.userId === userId,
      );
      return filteredAttendances;
    }
    return attendances;
  } catch (error) {
    console.error("Error reading attendances:", error);
    throw error;
  }
}

export async function readApprovedEnrollments(classId: string | string[]) {
  try {
    const res = await axios.get(`/api/enrollments/classId/${classId}/approved`);
    const approvedEnrollments: TApprovedEnrollment[] = res.data;
    return approvedEnrollments;
  } catch (error) {
    console.error("Error reading approved enrollments:", error);
    throw error;
  }
}

export async function createAttendances(attendances: TAttendanceInsert[]) {
  try {
    const res = await axios.post(`/api/attendance`, attendances);
    const createdAttendances: TAttendanceInsert[] = res.data;
    return createdAttendances;
  } catch (error: any | AxiosError) {
    if (isAxiosError(error)) {
      if (error.response?.data.message === "Already marked as present") return;
    }
    console.error("Error creating attendances:", error);
    throw error;
  }
}

export async function deleteAttendances(
  userIds: string[],
  classDateIds: string[],
) {
  try {
    const res = await axios.delete(`/api/attendance`, {
      data: { userIds, classDateIds },
    });
    const deletedAttendances = res.data;
    return deletedAttendances;
  } catch (error) {
    console.error("Error deleting attendances:", error);
    throw error;
  }
}
