"use client";

import {
  createAttendances,
  readAttendances,
} from "@/app/api/attendance/service";
import { readClassDates } from "@/app/api/classDates/service";
import { readClass } from "@/app/api/classes/service";
import {
  readEnrollmentsByClassId,
  updateEnrollment,
} from "@/app/api/enrollments/service";
import { TEnrollmentRow } from "@/app/api/enrollments/types";
import { attendancesAtom } from "@/atoms/attendanceAtom";
import { currentClassAtom } from "@/atoms/currentClassAtom";
import {
  IEnrollmentCounts,
  enrollmentCountAtom,
} from "@/atoms/enrollmentsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { Database } from "@/database.types";
import { useWindowWidth } from "@react-hook/window-size";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";

interface IRow {
  classId: "";
  userId: "";
  status: Database["public"]["Enums"]["enrollmentStatus"];
  attendance: "";
  danceRole: Database["public"]["Enums"]["danceRole"];
  danceRolePreference: Database["public"]["Enums"]["danceRolePreference"];
  createdAt: Date;
  users_view: {
    full_name: "";
    email: "";
  };
  actionButton?: React.ReactNode;
}

const danceRoleOptions = {
  led: "Conduzido(a)",
  leader: "Condutor(a)",
  indifferent: "Indiferente",
};

const enrollmentStatusOptions = {
  approved: "Aprovado",
  pending: "Pendente",
  abandonment: "Abandono",
};

export default function ClassesIdPage() {
  const gridRef = useRef<AgGridReact>(null);
  const user = useRecoilValue(usersAtom);
  const classId = useParams().id as string;
  const [rowData, setRowData] = useState<IRow[]>([]);
  const windowWidth = useWindowWidth();
  const currentClass = useRecoilValue(currentClassAtom);

  const setAttendances = useSetRecoilState(attendancesAtom);
  const [enrollmentsCount, setEnrollmentsCount] =
    useRecoilState(enrollmentCountAtom);

  const columnDefs: ColDef<IRow>[] = [
    {
      field: "users_view.full_name",
      headerName: "Nome",
      flex: 3,
      filter: true,
    },
    {
      field: "createdAt",
      headerName: "Data da inscrição",
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

  const columnDefsAdmin: ColDef<IRow>[] = [
    ...columnDefs,
    {
      field: "actionButton",
      headerName: "Ações",
      flex: 3,
      cellRenderer: actionsRenderer,
    },
  ];

  const columnDefsMobile: ColDef<IRow>[] = [
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

  const columnDefsAdminMobile: ColDef<IRow>[] = [
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

  function actionsRenderer(params: { data: IRow; api: any }) {
    const { userId, status } = params.data;
    let canUpdate = false;
    status === "approved" ? (canUpdate = true) : (canUpdate = false);

    return (
      <div className="flex gap-2">
        {(status === "pending" || status === "abandonment") && (
          <button
            className="text-green-500 hover:text-green-600 font-bold"
            onClick={() => handleUpdateEnrollment("approved", userId)}
          >
            Aprovar
          </button>
        )}
        {(status === "approved" || status === "abandonment") &&
          currentClass?.status !== "ongoing" && (
            <button
              className="text-blue-500 hover:text-blue-600 font-bold"
              onClick={() =>
                handleUpdateEnrollment("pending", userId, canUpdate)
              }
            >
              Pendente
            </button>
          )}
        {(status === "approved" || status === "pending") && (
          <button
            className="text-orange-500 hover:text-orange-600 font-bold"
            onClick={() =>
              handleUpdateEnrollment("abandonment", userId, canUpdate)
            }
          >
            Abandono
          </button>
        )}
      </div>
    );
  }

  function updateRowData(rowData: IRow[], enrollment: TEnrollmentRow): IRow[] {
    return rowData.map(
      (row: IRow): IRow =>
        row.classId === enrollment.classId && row.userId === enrollment.userId
          ? {
              ...row,
              status: enrollment.status,
              danceRolePreference:
                enrollment.danceRolePreference || row.danceRolePreference,
            }
          : row,
    );
  }

  function updateEnrollmentCount(enrollment: TEnrollmentRow): void {
    const countChange = enrollment.status === "approved" ? 1 : -1;
    const role = enrollment.danceRolePreference === "led" ? "led" : "leader";
    setEnrollmentsCount((prevCount: IEnrollmentCounts) => ({
      ...prevCount,
      [role]: prevCount[role] + countChange,
    }));
  }

  function canBeEnrolled(
    enrollment: TEnrollmentRow,
    status: Database["public"]["Enums"]["enrollmentStatus"],
  ): {
    canUpdate: boolean;
    role: Database["public"]["Enums"]["danceRolePreference"] | null;
  } {
    if (!enrollment.danceRolePreference)
      return { canUpdate: false, role: null };

    const preferedRole = enrollment.danceRolePreference;
    const opositeRole = preferedRole === "led" ? "leader" : "led";

    if (status !== "approved") return { canUpdate: true, role: preferedRole };

    if (enrollmentsCount[preferedRole] < enrollmentsCount.half) {
      return { canUpdate: true, role: enrollment.danceRolePreference };
    } else if (
      enrollmentsCount[opositeRole] < enrollmentsCount.half &&
      enrollment.danceRole === "indifferent"
    ) {
      return { canUpdate: true, role: opositeRole };
    }
    return { canUpdate: false, role: null };
  }

  async function handleUpdateEnrollment(
    status: Database["public"]["Enums"]["enrollmentStatus"],
    userId: string,
    alterCount = true,
  ): Promise<void> {
    const classEnrollments = await readEnrollmentsByClassId(classId);
    const userEnrollment = classEnrollments.find(
      (enrollment: TEnrollmentRow) =>
        enrollment.classId === classId && enrollment.userId === userId,
    );
    if (!userEnrollment) return console.error("Enrollment not found");
    delete userEnrollment.users_view;

    const verifiedEnrollment = canBeEnrolled(userEnrollment, status);
    if (!verifiedEnrollment.canUpdate) {
      toast.error(
        `Não é possível aprovar mais ${
          userEnrollment.danceRolePreference === "led"
            ? "conduzidos(as)"
            : "condutores(as)"
        }`,
      );
      return;
    }

    const classData = await readClass(classId);
    if (classData.status === "ongoing" && status === "approved") {
      const today = new Date();
      const classDates = await readClassDates(classId);
      if (!classDates) return console.error("No class dates found");
      const classDatesFromToday = classDates.filter(
        (classDate) => new Date(classDate.date) >= today,
      );
      const classDatesIds = classDatesFromToday.map(
        (classDate) => classDate.id,
      );
      const attToCreate = classDatesIds.map((classDateId) => ({
        classDateId,
        userId,
      }));
      await createAttendances(attToCreate);
    }

    try {
      const updatedEnrollment = await updateEnrollment({
        ...userEnrollment,
        danceRolePreference: verifiedEnrollment.role,
        status,
      });

      const updatedRowData = updateRowData(rowData, updatedEnrollment);

      setRowData(updatedRowData);

      if (alterCount) updateEnrollmentCount(updatedEnrollment);
    } catch (error) {
      console.error("Error updating enrollment:", error);
    }
  }

  async function handleReadEnrollments() {
    const enrollments = await readEnrollmentsByClassId(classId);
    setRowData(enrollments);

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

    const currentClass = await readClass(classId);

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

  useEffect(() => {
    handleReadAttendances();
    handleReadEnrollments();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        overlayNoRowsTemplate="ㅤ"
        className={
          user?.userRole === "admin" ? "w-full px-4 pt-4" : "w-full p-4"
        }
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

      {user?.userRole === "admin" && (
        <button
          className="text-blue-500 font-bold"
          onClick={() => gridRef.current?.api.exportDataAsCsv()}
        >
          Baixar CSV
        </button>
      )}
    </div>
  );
}
