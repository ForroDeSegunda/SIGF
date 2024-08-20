"use client";

import { readAttendances } from "@/app/api/attendance/service";
import { readClasses } from "@/app/api/classes/controller";
import {
  readEnrollmentsByClassId,
  updateEnrollment,
} from "@/app/api/enrollments/service";
import { TEnrollmentRow } from "@/app/api/enrollments/types";
import { attendancesAtom } from "@/atoms/attendanceAtom";
import {
  IEnrollmentCounts,
  enrollmentCountAtom,
} from "@/atoms/enrollmentsAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { Database } from "@/database.types";
import useUser from "@/hooks/useUser";
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
  const user = useRecoilValue(usersAtom);
  const classId = useParams().id;
  const [rowData, setRowData] = useState<IRow[]>([]);
  const gridRef = useRef<AgGridReact>(null);
  const windowWidth = useWindowWidth();
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
      cellRenderer: actionButtonRenderer,
    },
  ];

  const columnDefsMobile: ColDef<IRow>[] = [
    {
      headerName: "Nome | Data da inscrição",
      field: "createdAt",
      flex: 1,
      filter: true,
      cellRenderer: renderRowMobile,
    },
  ];

  const columnDefsAdminMobile: ColDef<IRow>[] = [
    {
      headerName: "Nome | Data da inscrição",
      field: "createdAt",
      flex: 1,
      filter: true,
      cellRenderer: renderRowAdminMobile,
    },
  ];

  function renderRowMobile(p: any) {
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
  }

  function renderRowAdminMobile(p: any) {
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
          {actionButtonRenderer(p)}
        </div>
      </div>
    );
  }

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

  function actionButtonRenderer(params: { data: IRow; api: any }) {
    const { userId, status } = params.data;

    const renderButton = (
      buttonStatus: Database["public"]["Enums"]["enrollmentStatus"],
      text: string,
      color: string,
      hoverColor: string,
      alterCount = true,
    ) => (
      <button
        key={buttonStatus}
        className={`${color} ${hoverColor} font-bold`}
        onClick={() => handleUpdateEnrollment(buttonStatus, userId, alterCount)}
      >
        {text}
      </button>
    );

    const getButtonsForStatus = (
      currentStatus: Database["public"]["Enums"]["enrollmentStatus"],
    ) => {
      switch (currentStatus) {
        case "approved":
          return [
            renderButton(
              "pending",
              "Resetar",
              "text-blue-500",
              "hover:text-blue-600",
            ),
            renderButton(
              "abandonment",
              "Abandono",
              "text-orange-500",
              "hover:text-orange-600",
            ),
          ];
        case "abandonment":
          return [
            renderButton(
              "approved",
              "Aprovar",
              "text-green-500",
              "hover:text-green-600",
            ),
            renderButton(
              "pending",
              "Resetar",
              "text-blue-500",
              "hover:text-blue-600",
              false,
            ),
          ];
        default:
          return [
            renderButton(
              "approved",
              "Aprovar",
              "text-green-500",
              "hover:text-green-600",
            ),
            renderButton(
              "abandonment",
              "Abandono",
              "text-orange-500",
              "hover:text-orange-600",
              false,
            ),
          ];
      }
    };

    return <div className="flex gap-2">{getButtonsForStatus(status)}</div>;
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
    const userEnrollments = await readEnrollmentsByClassId(classId as string);
    const enrollment = userEnrollments.find(
      (enrollment: TEnrollmentRow) =>
        enrollment.classId === classId && enrollment.userId === userId,
    );

    if (!enrollment) return console.error("Enrollment not found");
    const verifiedEnrollment = canBeEnrolled(enrollment, status);

    if (!verifiedEnrollment.canUpdate) {
      toast.error(
        `Não é possível aprovar mais ${
          enrollment.danceRolePreference === "led"
            ? "conduzidos(as)"
            : "condutores(as)"
        }`,
      );
      return;
    }

    delete enrollment.users_view;

    try {
      const updatedEnrollment = await updateEnrollment({
        ...enrollment,
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
    const enrollments = await readEnrollmentsByClassId(classId as string);
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

    const classes = await readClasses();
    const currentClass = classes.find(
      (currentClass) => currentClass.id === classId,
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
    const { data } = await useUser();
    const userId = data.user?.id;

    const attendances = await readAttendances(userId, classId as string);
    setAttendances(attendances);
  }

  function handleColumnDefs() {
    if (user?.userRole === "admin") {
      return windowWidth < 550 ? columnDefsAdminMobile : columnDefsAdmin;
    }
    return windowWidth < 550 ? columnDefsMobile : columnDefs;
  }

  useEffect(() => {
    handleReadAttendances();
    handleReadEnrollments();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <AgGridReact
        ref={gridRef}
        className={
          user?.userRole === "admin" ? "w-full px-4 pt-4" : "w-full p-4"
        }
        rowData={rowData}
        columnDefs={handleColumnDefs()}
        overlayNoRowsTemplate="ㅤ"
      />

      {user?.userRole === "admin" && (
        <button
          className="text-blue-500"
          onClick={() => gridRef.current?.api.exportDataAsCsv()}
        >
          Baixar CSV
        </button>
      )}
    </div>
  );
}
