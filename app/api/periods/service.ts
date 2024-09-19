import { TPeriodInsert, TPeriodUpdate } from "@/utils/db";
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
    const res = await axios.get(`/api/periods/${periodId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createPeriods(period: TPeriodInsert[]) {
  try {
    const res = await axios.post("/api/periods", period);
    return res.data;
  } catch (error) {
    console.error("Error creating period:", error);
  }
}

export async function updatePeriod(period: TPeriodUpdate) {
  try {
    const res = await axios.patch("/api/periods", period);
    return res.data;
  } catch (error) {
    console.error("Error creating period:", error);
  }
}
