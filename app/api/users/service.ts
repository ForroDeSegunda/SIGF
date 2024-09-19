import { TUser, TUserViewPlusRole } from "@/utils/db";
import axios from "axios";

export async function readUsers(emails?: string[]) {
  const params = { emails };
  try {
    const res = await axios.get(`/api/users`, { params });
    return res.data as TUserViewPlusRole[];
  } catch (error) {
    console.error("Error reading users:", error);
    throw error;
  }
}

export async function createUser(user: TUser[]) {
  try {
    const res = await fetch(`/api/users`, {
      method: "POST",
      body: JSON.stringify(user),
    });
    const newUser: TUser = await res.json();
    return newUser;
  } catch (error) {
    console.error("Error reading users:", error);
    throw error;
  }
}

export async function updateUser(user: TUser) {
  try {
    const res = await fetch(`/api/users`, {
      method: "PATCH",
      body: JSON.stringify(user),
    });
    const newUser: TUser = await res.json();
    return newUser;
  } catch (error) {
    console.error("Error reading users:", error);
    throw error;
  }
}
