"use client";
import {
  createAttendances,
  deleteAttendances,
  readAttendances,
} from "@/app/api/attendance/service";
import { readClassDates } from "@/app/api/classDates/service";
import {
  createEnrollments,
  readEnrollmentsByClassId,
  updateEnrollment,
} from "@/app/api/enrollments/service";
import { readUsers } from "@/app/api/users/service";
import { attendancesAtom } from "@/atoms/attendanceAtom";
import { currentClassAtom } from "@/atoms/currentClassAtom";
import {
  IEnrollmentCounts,
  enrollmentCountAtom,
} from "@/atoms/enrollmentsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { Database } from "@/database.types";
import {
  TEnrollmentDataRow,
  TEnrollmentInsert,
  TEnrollmentRow,
} from "@/utils/db";
import { replaceSpecialChars } from "@/utils/functions";
import { danceRoleOptions, enrollmentStatusOptions } from "@/utils/humanize";
import { useWindowWidth } from "@react-hook/window-size";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { read, utils } from "xlsx";
import { createUsersForXlsxImport } from "./actions";

export default function ClassesIdPage() {
  const gridRef = useRef<AgGridReact>(null);
  const user = useRecoilValue(usersAtom);
  const classId = useParams().id as string;
  const [enrollments, setEnrollments] = useState<TEnrollmentDataRow[]>([]);
  const windowWidth = useWindowWidth();
  const currentClass = useRecoilValue(currentClassAtom);

  const setAttendances = useSetRecoilState(attendancesAtom);
  const [enrollmentsCount, setEnrollmentsCount] =
    useRecoilState(enrollmentCountAtom);

  const columnDefs: ColDef<TEnrollmentDataRow>[] = [
    {
      field: "users_view.full_name",
      headerName: "Nome",
      flex: 3,
      filter: true,
      valueFormatter: ({ data }: any) =>
        data.users_view?.full_name || data.users_view?.email || "",
    },
    {
      field: "createdAt",
      headerName: "Data da inscrição",
      sort: "asc",
      flex: 3,
      valueFormatter: ({ value }) => new Date(value).toLocaleString("pt-BR"),
    },
    {
      field: "danceRole",
      headerName: "Papel",
      flex: 2,
      valueFormatter: ({ value }) => danceRoleOptions[value],
    },
    {
      field: "danceRolePreference",
      headerName: "Preferência",
      flex: 2,
      valueFormatter: ({ value }) => danceRoleOptions[value],
      cellRenderer: (p: any) => (
        <span
          className={
            p.data.danceRolePreference === "led"
              ? "text-orange-500 font-bold"
              : "text-blue-500 font-bold"
          }
        >
          {danceRoleOptions[p.data.danceRolePreference]}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Inscrição",
      flex: 2,
      valueFormatter: ({ value }) => enrollmentStatusOptions[value],
      cellRenderer: statusRenderer,
    },
  ];

  const columnDefsAdmin: ColDef<TEnrollmentDataRow>[] = [
    ...columnDefs,
    {
      field: "actionButton",
      headerName: "Ações",
      flex: 3,
      cellRenderer: actionsRenderer,
    },
  ];

  const columnDefsMobile: ColDef<TEnrollmentDataRow>[] = [
    {
      headerName: "Nome | Data da inscrição",
      field: "createdAt",
      flex: 1,
      filter: true,
      cellRenderer: (p: any) => {
        const { api, node } = p;

        function resizeRow() {
          if (node.rowHeight !== 42) node.setRowHeight(42);
          else node.setRowHeight(42 * 3 + 16);
          api.onRowHeightChanged();
        }

        return (
          <div className="flex flex-col w-full">
            <button className="flex justify-between w-full" onClick={resizeRow}>
              <span className="font-bold">{p.data.users_view.full_name}</span>
              <span>{new Date(p.data.createdAt).toLocaleString("pt-BR")}</span>
            </button>

            <div className="border-t border-x rounded-t w-full flex gap-2 bg-gray-100 px-2">
              <span className="font-bold">Papel:</span>
              <span>
                {danceRoleOptions[p.data.danceRole]} |{" "}
                {danceRoleOptions[p.data.danceRolePreference]}
              </span>
            </div>
            <div className="border-b border-x rounded-b w-full flex gap-2 bg-gray-100 px-2">
              <span className="font-bold">Inscrição:</span>
              {statusRenderer({ value: p.data.status })}
            </div>
          </div>
        );
      },
    },
  ];

  const columnDefsAdminMobile: ColDef<TEnrollmentDataRow>[] = [
    {
      headerName: "Nome | Data da inscrição",
      field: "createdAt",
      flex: 1,
      filter: true,
      cellRenderer: (p: any) => {
        const { api, node } = p;

        function resizeRow() {
          if (node.rowHeight !== 42) node.setRowHeight(42);
          else node.setRowHeight(42 * 4 + 16);
          api.onRowHeightChanged();
        }

        return (
          <div className="flex flex-col w-full">
            <button className="flex justify-between w-full" onClick={resizeRow}>
              <span className="font-bold">{p.data.users_view.full_name}</span>
              <span>{new Date(p.data.createdAt).toLocaleString("pt-BR")}</span>
            </button>

            <div className="border-t border-x rounded-t w-full flex gap-2 bg-gray-100 px-2">
              <span className="font-bold">Papel:</span>
              <span>
                {danceRoleOptions[p.data.danceRole]} |{" "}
                {danceRoleOptions[p.data.danceRolePreference]}
              </span>
            </div>
            <div className="border-x w-full flex gap-2 bg-gray-100 px-2">
              <span className="font-bold">Inscrição:</span>
              {statusRenderer({ value: p.data.status })}
            </div>
            <div className="border-b border-x rounded-b w-full flex gap-2 bg-gray-100 px-2">
              <span className="font-bold">Ações:</span>
              {actionsRenderer(p)}
            </div>
          </div>
        );
      },
    },
  ];

  function statusRenderer({
    value,
  }: {
    value: Database["public"]["Enums"]["enrollmentStatus"];
  }) {
    switch (value) {
      case "approved":
        return <span className="text-green-500 font-bold">Aprovado</span>;
      case "pending":
        return <span className="text-blue-500 font-bold">Pendente</span>;
      case "abandonment":
        return <span className="text-orange-500 font-bold">Abandono</span>;
    }
  }

  function actionsRenderer(params: { data: TEnrollmentDataRow; api: any }) {
    const { userId, status } = params.data;
    let canUpdate = false;
    status === "approved" ? (canUpdate = true) : (canUpdate = false);

    return (
      <div className="flex gap-2">
        {(status === "pending" || status === "abandonment") && (
          <button
            className="text-green-500 hover:text-green-600 font-bold"
            onClick={() => handleApprove(userId)}
          >
            Aprovar
          </button>
        )}
        {(status === "approved" || status === "abandonment") &&
          currentClass?.status !== "ongoing" && (
            <button
              className="text-blue-500 hover:text-blue-600 font-bold"
              onClick={() => handlePending(userId)}
            >
              Pendente
            </button>
          )}
        {(status === "approved" || status === "pending") && (
          <button
            className="text-orange-500 hover:text-orange-600 font-bold"
            onClick={() => handleAbandonment(userId)}
          >
            Abandono
          </button>
        )}
      </div>
    );
  }

  function updateEnrollments(
    rowData: TEnrollmentDataRow[],
    enrollment: TEnrollmentRow,
  ) {
    const updatedEnrollments = rowData.map(
      (row: TEnrollmentDataRow): TEnrollmentDataRow =>
        row.classId === enrollment.classId && row.userId === enrollment.userId
          ? {
              ...row,
              status: enrollment.status,
              danceRolePreference:
                enrollment.danceRolePreference || row.danceRolePreference,
            }
          : row,
    );
    setEnrollments(updatedEnrollments);
  }

  function handleUpdateEnrollmentCount(enrollment: TEnrollmentRow): void {
    const countChange = enrollment.status === "approved" ? 1 : -1;
    const role = enrollment.danceRolePreference === "led" ? "led" : "leader";
    setEnrollmentsCount((prevCount: IEnrollmentCounts) => ({
      ...prevCount,
      [role]: prevCount[role] + countChange,
    }));
  }

  function canBeEnrolled(enrollment: TEnrollmentRow): {
    canEnroll: boolean;
    role: Database["public"]["Enums"]["danceRolePreference"];
  } {
    const preferedRole = enrollment.danceRolePreference!;
    const opositeRole = preferedRole === "led" ? "leader" : "led";

    if (enrollmentsCount[preferedRole] < enrollmentsCount.half) {
      return { canEnroll: true, role: preferedRole };
    } else if (
      enrollmentsCount[opositeRole] < enrollmentsCount.half &&
      enrollment.danceRole === "indifferent"
    ) {
      return { canEnroll: true, role: opositeRole };
    }
    return { canEnroll: false, role: "led" };
  }

  async function handleAbandonment(userId: string) {
    const classEnrollments = await readEnrollmentsByClassId(classId);
    const userEnrollment = classEnrollments.find(
      (enrollment: TEnrollmentRow) =>
        enrollment.classId === classId && enrollment.userId === userId,
    );
    delete userEnrollment.users_view;

    handleDeleteAttendances(userId);

    const updatedEnrollment = await updateEnrollment({
      ...userEnrollment,
      status: "abandonment",
    });
    updateEnrollments(enrollments, updatedEnrollment);
    if (userEnrollment.status === "approved")
      handleUpdateEnrollmentCount(updatedEnrollment);
  }

  async function handlePending(userId: string) {
    const classEnrollments = await readEnrollmentsByClassId(classId);
    const userEnrollment = classEnrollments.find(
      (enrollment: TEnrollmentRow) =>
        enrollment.classId === classId && enrollment.userId === userId,
    );
    delete userEnrollment.users_view;
    const updatedEnrollment = await updateEnrollment({
      ...userEnrollment,
      status: "pending",
    });
    updateEnrollments(enrollments, updatedEnrollment);
    if (userEnrollment.status === "approved") {
      handleUpdateEnrollmentCount(updatedEnrollment);
    }
  }

  async function handleApprove(userId: string) {
    const classEnrollments = await readEnrollmentsByClassId(classId);
    const userEnrollment = classEnrollments.find(
      (enrollment: TEnrollmentRow) =>
        enrollment.classId === classId && enrollment.userId === userId,
    );
    delete userEnrollment.users_view;

    const { canEnroll, role } = canBeEnrolled(userEnrollment);
    if (!canEnroll)
      return toast.error(
        "Não é possível aprovar mais inscrições para este papel",
      );

    if (currentClass.status === "ongoing") handleCreateNewAttendances(userId);

    const updatedEnrollment = await updateEnrollment({
      ...userEnrollment,
      status: "approved",
      danceRole: role,
    });
    updateEnrollments(enrollments, updatedEnrollment);
    handleUpdateEnrollmentCount(updatedEnrollment);
  }

  async function handleDeleteAttendances(userId: string) {
    const today = new Date();
    const classDates = await readClassDates(classId);
    const classDatesFromToday = classDates!.filter(
      (classDate) => new Date(classDate.date) >= today,
    );
    const classDatesIds = classDatesFromToday.map((classDate) => classDate.id);
    deleteAttendances([userId], classDatesIds);
  }

  async function handleCreateNewAttendances(userId: string) {
    const today = new Date();
    const classDates = await readClassDates(classId);
    const classDatesFromToday = classDates!.filter(
      (classDate) => new Date(classDate.date) >= today,
    );
    const classDatesIds = classDatesFromToday.map((classDate) => classDate.id);
    const newAttendances = classDatesIds.map((classDateId) => ({
      classDateId,
      userId,
    }));
    createAttendances(newAttendances);
  }

  async function handleReadEnrollments() {
    const enrollments = await readEnrollmentsByClassId(classId);
    setEnrollments(enrollments);

    const enrollmentsLedCount = enrollments.filter(
      (enrollment: {
        danceRolePreference: Database["public"]["Enums"]["danceRolePreference"];
        status: Database["public"]["Enums"]["enrollmentStatus"];
      }) =>
        enrollment.danceRolePreference === "led" &&
        enrollment.status === "approved",
    );
    const enrollmentsLeaderCount = enrollments.filter(
      (enrollment: {
        danceRolePreference: Database["public"]["Enums"]["danceRolePreference"];
        status: Database["public"]["Enums"]["enrollmentStatus"];
      }) =>
        enrollment.danceRolePreference === "leader" &&
        enrollment.status === "approved",
    );

    if (!currentClass) return console.error("Class not found");
    setEnrollmentsCount({
      max: currentClass.size,
      half: currentClass.size / 2,
      led: enrollmentsLedCount.length,
      leader: enrollmentsLeaderCount.length,
    });
  }

  async function handleReadAttendances() {
    const attendances = await readAttendances(user?.id, classId);
    setAttendances(attendances);
  }

  function exportToCsv() {
    const params = {
      fileName: replaceSpecialChars(
        currentClass?.name.toLowerCase().replaceAll(" ", "_") || "inscricoes",
      ),
    };
    gridRef.current?.api.exportDataAsCsv(params);
  }

  async function handleImportCsv(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (!event.target.files) return console.error("No file selected");

    toast.info("Importando inscrições...");

    const workbook = read(await event.target.files[0].arrayBuffer());
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json: Array<object> = utils.sheet_to_json(sheet, { raw: false });
    const cleanJson = json.map((obj) => {
      return {
        email: obj["email"],
        full_name: obj["nome"],
        created_at: new Date(obj["data"]).toISOString(),
        role: String(obj["papel"]).toLowerCase().includes("conduzido")
          ? "led"
          : "leader",
      };
    });
    const emails = json.map((obj) => obj["email"]);
    const users = await readUsers(emails);
    const existingUsersEmails = users.map((user) => user.email);
    const missingUsers = cleanJson.filter(
      (user) => !existingUsersEmails.includes(user.email),
    );

    const createdUsers = await createUsersForXlsxImport(missingUsers);
    const allUsers = [...users, ...createdUsers];

    const enrollments: TEnrollmentInsert[] = cleanJson.map((obj) => {
      const user = allUsers.find((user) => user.email === obj.email);
      const danceRole = obj.role as "led" | "leader";
      return {
        userId: user!.id,
        classId,
        danceRole,
        danceRolePreference: danceRole,
        createdAt: obj.created_at,
        status: "approved",
      };
    });

    await createEnrollments(enrollments);
    toast.success("Inscrições importadas com sucesso");
    window.location.reload();
  }

  useEffect(() => {
    handleReadAttendances();
    handleReadEnrollments();
  }, []);

  return (
    <div className="flex flex-col w-full justify-center">
      <AgGridReact
        ref={gridRef}
        rowData={enrollments}
        overlayNoRowsTemplate="ㅤ"
        className="w-full px-4 pt-4"
        columnDefs={
          windowWidth < 550
            ? user?.userRole === "admin"
              ? columnDefsAdminMobile
              : columnDefsMobile
            : user?.userRole === "admin"
              ? columnDefsAdmin
              : columnDefs
        }
      />

      {(user?.userRole === "admin" || "teacher") &&
        (enrollments.length > 0 ? (
          <button className="text-blue-500 font-bold" onClick={exportToCsv}>
            Exportar inscrições XSLX
          </button>
        ) : (
          <form className="flex justify-center">
            <input
              className="hidden"
              type={"file"}
              id="csvFileInput"
              accept={".xlsx"}
              onChange={handleImportCsv}
            />
            <label
              htmlFor="csvFileInput"
              className="text-green-500 font-bold cursor-pointer"
            >
              Importar Inscrições XSLX
            </label>
          </form>
        ))}
    </div>
  );
}
