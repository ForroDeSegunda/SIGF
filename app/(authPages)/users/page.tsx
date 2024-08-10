"use client";

import { createUser, readUsers, updateUser } from "@/app/api/users/controller";
import { TUser, TUserViewPlusRole } from "@/app/api/users/route";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";

const studentRoleOptions = {
  student: "Aluno",
  teacher: "Professor",
  admin: "Admin",
};

export default function UsersPage() {
  const [users, setUsers] = useState<TUserViewPlusRole[]>([]);

  const columnDefs: ColDef<TUserViewPlusRole>[] = [
    { field: "full_name", headerName: "Nome", flex: 1, filter: true },
    { field: "email", headerName: "Ativo", flex: 1 },
    {
      field: "user.role",
      headerName: "Cargo",
      flex: 1,
      valueFormatter: ({ value }) => studentRoleOptions[value],
    },
    {
      headerName: "Mudar Cargo",
      minWidth: 150,
      cellRenderer: actionCellRenderer,
      flex: 1,
    },
  ];

  async function handleChangeRole(
    userData: TUserViewPlusRole,
    newRole: TUser["role"],
  ) {
    if (userData.user.created_at === "never") {
      const createdUser = await createUser({
        id: userData.id,
        role: newRole,
      });

      const newUsers = users.map((user) => {
        if (user.user && user.id === createdUser.id) {
          user.user = createdUser;
        }
        return user;
      });
      setUsers(newUsers);
      return;
    }

    const updatedUser = await updateUser({
      id: userData.id,
      role: newRole,
    });
    const newUsers = users.map((user) => {
      if (user.user && user.id === updatedUser.id) {
        user.user = updatedUser;
      }
      return user;
    });
    setUsers(newUsers);
  }

  function actionCellRenderer({ data }: { data: TUserViewPlusRole }) {
    function BtnStudent() {
      return (
        <button
          className="text-green-500 hover:text-green-600 font-bold"
          onClick={() => handleChangeRole(data, "student")}
        >
          Aluno
        </button>
      );
    }
    function BtnTeacher() {
      return (
        <button
          className="text-blue-500 hover:text-blue-600 font-bold"
          onClick={() => handleChangeRole(data, "teacher")}
        >
          Professor
        </button>
      );
    }
    function BtnAdmin() {
      return (
        <button
          className="text-orange-500 hover:text-orange-600 font-bold"
          onClick={() => handleChangeRole(data, "admin")}
        >
          Admin
        </button>
      );
    }

    if (data.user.role === "student") {
      return (
        <div className="flex gap-2 w-full">
          <BtnTeacher />
          <BtnAdmin />
        </div>
      );
    } else if (data.user.role === "teacher") {
      return (
        <div className="flex gap-2 w-full">
          <BtnStudent />
          <BtnAdmin />
        </div>
      );
    } else if (data.user.role === "admin") {
      return (
        <div className="flex gap-2 w-full">
          <BtnStudent />
          <BtnTeacher />
        </div>
      );
    }

    return (
      <div className="flex gap-2 w-full">
        <BtnStudent />
        <BtnTeacher />
        <BtnAdmin />
      </div>
    );
  }

  useEffect(() => {
    async function handleReadUsers() {
      const users = await readUsers();

      users.map((user) => {
        if (!user.user) {
          user.user = {
            role: "student",
            created_at: "never",
            id: user.id ?? "",
          };
        }
        return users;
      });

      setUsers(users);
    }
    handleReadUsers();
  }, []);

  return (
    <AgGridReact
      className="w-full p-4"
      rowData={users}
      columnDefs={columnDefs}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
