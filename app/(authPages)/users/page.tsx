"use client";
import { createUser, readUsers, updateUser } from "@/app/api/users/service";
import { TUser, TUserViewPlusRole } from "@/utils/db";
import { studentRoleOptions } from "@/utils/humanize";
import { useWindowWidth } from "@react-hook/window-size";
import { ColDef, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";

const Select = tw.select`rounded-md px-4 py-2 bg-inherit border mb-2`;
export default function UsersPage() {
  const [users, setUsers] = useState<TUserViewPlusRole[]>([]);
  const windowWidth = useWindowWidth();

  const columnDefs: ColDef<TUserViewPlusRole>[] = [
    { field: "full_name", headerName: "Nome", flex: 1, filter: true },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "user.role",
      headerName: "Cargo",
      flex: 1,
      valueFormatter: ({ value }) => studentRoleOptions[value],
    },
    {
      field: "user.role",
      headerName: "Mudar Cargo",
      minWidth: 120,
      flex: 1,
      cellRenderer: actionCellRenderer,
    },
  ];

  const columnDefsMobile: ColDef<TUserViewPlusRole>[] = [
    {
      field: "full_name",
      headerName: "Nome",
      flex: 1,
      filter: true,
      cellRenderer: renderRowMobile,
    },
  ];

  function renderRowMobile(props: {
    data: TUserViewPlusRole;
    api: GridApi;
    node: any;
  }) {
    const { data, api, node } = props;
    function resizeRow() {
      if (node.rowHeight !== 42) node.setRowHeight(42);
      else node.setRowHeight(42 * 4 + 16);
      api.onRowHeightChanged();
    }

    return (
      <div className="flex flex-col w-full h-full justify-start">
        <button className="flex w-full" onClick={resizeRow}>
          {data.full_name || data.email}
        </button>
        <div className="border-t border-x rounded-t w-full flex gap-2 bg-gray-100 px-2">
          <span className="font-bold">Email:</span>
          <span>{data.email}</span>
        </div>
        <div className="border-x w-full flex gap-2 bg-gray-100 px-2">
          <span className="font-bold">Cargo:</span>
          <span>{studentRoleOptions[data.user.role as never]}</span>
        </div>
        <div className="border-b border-x rounded-b w-full flex gap-2 bg-gray-100 px-2">
          <span className="font-bold">Mudar Cargo:</span>
          {actionCellRenderer({ data, value: data.user.role })}
        </div>
      </div>
    );
  }

  async function handleChangeRole(
    userData: TUserViewPlusRole,
    newRole: TUser["role"],
  ) {
    if (userData.user.created_at === "never") {
      const createdUser = await createUser([
        {
          id: userData.id,
          role: newRole,
        },
      ]);

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

  function actionCellRenderer({ data, value }) {
    return (
      <Select
        name="classState"
        defaultValue={value}
        onChange={(e) =>
          handleChangeRole(data, e.target.value as TUser["role"])
        }
      >
        <option value="student">Aluno</option>
        <option value="teacher">Professor</option>
        <option value="director">Diretor</option>
        <option value="admin">Admin</option>
      </Select>
    );
  }

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

  useEffect(() => {
    handleReadUsers();
  }, []);

  return (
    <AgGridReact
      className="w-full p-4"
      rowData={users}
      columnDefs={windowWidth < 768 ? columnDefsMobile : columnDefs}
      overlayNoRowsTemplate="ㅤ"
    />
  );
}
