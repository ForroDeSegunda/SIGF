import useUser from "@/hooks/useUser";
import axios from "axios";
import { TEnrollmentInsert, TEnrollmentRow, TEnrollmentUpdate } from "./types";

export async function readEnrollments() {
  try {
    const res = await axios.get(`/api/enrollments`);
    return res.data as TEnrollmentRow[];
  } catch (error) {
    console.error("Error getting enrollments:", error);
    throw error;
  }
}

export async function readEnrollmentsByClassId(classId: string) {
  try {
    const res = await axios.get(`/api/enrollments/classId/${classId}`);
    const new_res_data = res.data.map((row: any) => {
      row.createdAt = new Date(row.createdAt);
      return row;
    });
    return new_res_data;
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    throw error;
  }
}

export async function readEnrollmentsByUser() {
  const { data, error } = await useUser();
  if (error) {
    console.error("Error getting user:", error);
    throw error;
  }

  try {
    const res = await axios.get(`/api/enrollments/userId/${data.user.id}`);
    return res.data as TEnrollmentRow[];
  } catch (error) {
    console.error("Error getting enrollments:", error);
    throw error;
  }
}

export async function createEnrollments(enrollments: TEnrollmentInsert[]) {
  try {
    const res = await axios.post(`/api/enrollments`, enrollments);
    return res.data;
  } catch (error) {
    console.error("Error enrolling class:", error);
    throw error;
  }
}

export async function deleteEnrollment(
  enrollment: TEnrollmentInsert,
): Promise<TEnrollmentRow> {
  try {
    await axios.delete(`/api/enrollments`, { data: enrollment });

    return enrollment as TEnrollmentRow;
  } catch (error) {
    console.error("Error unenrolling class:", error);
    throw error;
  }
}

export async function updateEnrollment(
  enrollment: TEnrollmentUpdate,
): Promise<TEnrollmentRow> {
  try {
    const res = await axios.patch(
      `/api/enrollments/classId/${enrollment.classId}`,
      enrollment,
    );

    return res.data[0] as TEnrollmentRow;
  } catch (error) {
    throw error;
  }
}
