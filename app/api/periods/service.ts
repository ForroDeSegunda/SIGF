import { Database } from "@/database.types";
import { TPeriod } from "@/utils/db";
import axios from "axios";

export async function deletePeriod(id: string) {
  try {
    const res = await axios.delete(`/api/periods`, { data: { id } });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function readPeriod(periodId: string | string[]) {
  try {
    const res = await fetch(`/api/periods/${periodId}`);
    const periodData: TPeriod = await res.json();
    return periodData;
  } catch (error) {
    throw error;
  }
}

export async function readPeriods() {
  try {
    const res = await fetch("/api/periods");
    const periods: TPeriod[] = await res.json();
    return periods;
  } catch (error) {
    throw error;
  }
}

export async function createPeriod(
  year: Date,
  semester: Database["public"]["Enums"]["semesterEnum"],
  startDate: Date,
  endDate: Date,
) {
  try {
    const body = {
      year: year.getFullYear(),
      semester,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    await fetch("/api/periods", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await fetch("/api/periods");
    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error creating period:", error);
  }
}

export async function editPeriod(
  periodId: string,
  year: Date,
  semester: Database["public"]["Enums"]["semesterEnum"],
  startDate: Date,
  endDate: Date,
) {
  try {
    const body = {
      id: periodId,
      year: year.getFullYear(),
      semester,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    await fetch("/api/periods", {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    const res = await fetch("/api/periods");
    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error creating period:", error);
  }
}
