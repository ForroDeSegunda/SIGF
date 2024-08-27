import { Database } from "@/database.types";
import { TClassAndPeriod, TClasses } from "./[id]/route";
import axios from "axios";

export type TCreateClass = Database["public"]["Tables"]["classes"]["Insert"];
export type TUpdateClass = Database["public"]["Tables"]["classes"]["Update"];

export async function readClass(classId: string | string[]) {
  try {
    const res = await axios.get(`/api/classes/${classId}`);
    return res.data as TClassAndPeriod;
  } catch (error) {
    console.error("Error reading class:", error);
    throw error;
  }
}

export async function readClasses() {
  try {
    const res = await fetch("/api/classes");
    const classes: TClasses[] = await res.json();
    return classes;
  } catch (error) {
    console.error("Error reading classes:", error);
    throw error;
  }
}

export async function createClass(classData: TCreateClass) {
  const resCreateClass = await fetch("/api/classes", {
    method: "POST",
    body: JSON.stringify(classData),
  });
  if (!resCreateClass.ok) {
    throw new Error("Error creating class");
  }

  const res = await fetch("/api/classes");
  if (!res.ok) {
    throw new Error("Error fetching classes");
  }

  const data = await res.json();

  return data;
}

export async function updateClass(classData: TUpdateClass & { period?: any }) {
  if (classData.period) delete classData.period;
  try {
    const res = await axios.patch(`/api/classes`, classData);
    return res.data as TClasses;
  } catch (error) {
    throw error;
  }
}

export async function deleteClass(id: string) {
  try {
    const res = await fetch(`/api/classes/${id}`, {
      method: "DELETE",
    });
    return res;
  } catch (error) {
    throw error;
  }
}
