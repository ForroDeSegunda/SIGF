import { TClassDatesRow, TClassDatesInsert } from "@/utils/db";
import axios from "axios";

export async function readClassDates(
  classId: string,
): Promise<TClassDatesRow[] | undefined> {
  try {
    const res = await axios.get(`/api/classDates/${classId}`);

    const new_res_data = res.data.map((row: TClassDatesRow) => {
      const date = new Date(row.date + "EDT");

      const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
      return { ...row, day };
    });
    return new_res_data;
  } catch (error) {
    console.error("Error fetching enrollments:", error);
  }
}
export async function createClassDates(
  classId: string | string[],
  dates: Date[],
  currentClassDates: TClassDatesInsert[] = [],
): Promise<TClassDatesInsert[]> {
  const body = dates.map((date) => {
    return {
      date: date.toISOString(),
      classId,
    };
  });

  try {
    const res = await axios.post("/api/classDates", body);
    const createdClassDates: TClassDatesInsert[] = res.data;

    const newCreatedClassDates = createdClassDates.map((row) => {
      const date = new Date(row.date + "EDT");
      const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
      return { ...row, day };
    });

    const newClassDates = [...currentClassDates, ...newCreatedClassDates];

    return newClassDates;
  } catch (error) {
    console.error("Error creating class date:", error);
    throw error;
  }
}

export async function deleteClassDates(classId: string | string[]) {
  const body = { classId };
  try {
    const res = await axios.delete(`/api/classDates`, { data: body });
    const deletedClassDates: TClassDatesInsert[] = res.data;
    return deletedClassDates;
  } catch (error) {
    console.error("Error deleting class date:", error);
    throw error;
  }
}

export async function deleteClassDate(
  classDateId: string,
): Promise<TClassDatesInsert> {
  try {
    const res = await axios.delete(`/api/classDates/${classDateId}`);

    return res.data[0];
  } catch (error) {
    console.error("Error deleting class date:", error);
    throw error;
  }
}
