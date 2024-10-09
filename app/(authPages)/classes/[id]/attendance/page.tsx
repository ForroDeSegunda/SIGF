"use client";
import {
  readUsersViewByEmail,
  readUsersViewById,
} from "@/app/(authPages)/users/actions";
import { TUserViewRow } from "@/app/(authPages)/users/types";
import { deleteClassDate, readClassDates } from "@/app/api/classDates/service";
import { readClass } from "@/app/api/classes/service";
import { readEnrollmentsByClassId } from "@/app/api/enrollments/service";
import { useModal } from "@/app/components/MainModal";
import { classDatesAtom } from "@/atoms/classDatesAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { danceRoleOptions, presenceOptions } from "@/utils/humanize";
import { useWindowWidth } from "@react-hook/window-size";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { read, utils, writeFile } from "xlsx";
import { readClassDatesByClassId } from "../../actions";
import { readAttendancesByClassDates, updateAttendances } from "../actions";
import { TEnrollmentRow } from "@/utils/db";

export interface IClassDatesRow {
  id: string;
  date: string;
  day: string;
}

export default function AttendancePage() {
  const user = useRecoilValue(usersAtom);
  const pathname = usePathname();
  const classId = useParams().id;
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const openModal = useModal();
  // TODO: Fix this any, using classDatesAtom but types are incorrect
  const [rowData, setRowData] = useRecoilState<IClassDatesRow[]>(
    classDatesAtom as any,
  );

  const columnDefs: ColDef<IClassDatesRow>[] = [
    { field: "day", headerName: "Dia", flex: 1 },
    {
      field: "date",
      headerName: "Data",
      flex: 1,
      valueFormatter: ({ value }) =>
        new Date(value + "EDT").toLocaleDateString("pt-BR"),
    },
    { headerName: "Presenças", flex: 1, cellRenderer: renderActions },
  ];

  const columnDefsMobile: ColDef<IClassDatesRow>[] = [
    {
      headerName: "Dia | Data",
      field: "date",
      flex: 1,
      cellRenderer: renderRowMobile,
    },
  ];

  function renderRowMobile(props: any) {
    const { api, node } = props;
    function resizeRow() {
      if (node.rowHeight !== 42) node.setRowHeight(42);
      else node.setRowHeight(42 * 2 + 16);
      api.onRowHeightChanged();
    }

    return (
      <div className="flex flex-col justify-start">
        <button
          className="flex justify-between cursor-pointer"
          onClick={resizeRow}
        >
          <div className="flex justify-between w-full">
            <span>{props.data.day}</span>
            <span>{new Date(props.data.date).toLocaleDateString("pt-BR")}</span>
          </div>
        </button>

        <div className="border rounded w-full flex gap-2 bg-gray-100 px-2">
          <span className="font-bold">Presenças:</span>
          {renderActions(props)}
        </div>
      </div>
    );
  }

  function renderActions(params: any) {
    const classDateData: IClassDatesRow = params.data;
    return (
      <div className="flex gap-4">
        <button
          className="text-green-500 hover:text-green-600 font-bold"
          onClick={() => router.push(`${pathname}/${classDateData.id}`)}
        >
          Registrar
        </button>
        <button
          className="text-orange-500 hover:text-orange-600 font-bold"
          onClick={() =>
            openModal("confirmation", "", () =>
              handleDeleteClassDate(classDateData.id),
            )
          }
        >
          Excluir
        </button>
      </div>
    );
  }

  async function handleDeleteClassDate(classDateId: string) {
    toast.info("Deletando data da aula...");

    try {
      const deletedClassDate = await deleteClassDate(classDateId);
      const newClassDates = rowData.filter(
        (row) => row.id !== deletedClassDate.id,
      );
      setRowData(newClassDates);
      toast.success("Data da aula deletada");
    } catch (error) {
      toast.error("Erro ao deletar data da aula");
    }
  }

  async function handleReadClassDates() {
    try {
      const classDates = await readClassDates(classId as string);
      if (!classDates) return;

      const formattedClassDates = classDates.map((row) => {
        const date = new Date(row.date + "EDT");

        const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
        return { ...row, day };
      });

      setRowData(formattedClassDates);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  }

  async function handleImportCsv(event: ChangeEvent<HTMLInputElement>) {
    toast.info("Importando inscrições...");
    event.preventDefault();
    if (!event.target.files) return console.error("No file selected");

    const workbook = read(await event.target.files[0].arrayBuffer());
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonWithHeaders: Array<object> = utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
      defval: "Não registrado",
    });
    const json = jsonWithHeaders.slice(1);
    const emails = json.map((row) => String(row[1]).trim());
    const users = await readUsersViewByEmail(emails);
    const classDates = await readClassDatesByClassId(classId as string);
    const attendances = await readAttendancesByClassDates(classDates);

    const userIdToPresences = users.reduce((acc, user: TUserViewRow) => {
      const dehumanizedPresencesOptions = {
        presente: "present",
        falta: "absent",
        justificado: "justified",
        "não registrado": "notRegistered",
      };
      const foundPresences = json.find(
        (row) => String(row[1]).trim() === user.email?.trim(),
      );
      if (Array.isArray(foundPresences)) {
        const presences = foundPresences.slice(2);
        const dehumanizedPresences = presences.map(
          (presence) => dehumanizedPresencesOptions[presence.toLowerCase()],
        );
        acc[user.id!] = dehumanizedPresences;
      } else throw new Error("Array expected");
      return acc;
    }, {});

    const updatedAttendances = attendances.map((attendance) => {
      const presenceArray = userIdToPresences[attendance.userId];
      const classDateIndex = classDates.findIndex(
        (classDate) => classDate.id === attendance.classDateId,
      );

      return {
        ...attendance,
        presence: presenceArray[classDateIndex],
      };
    });

    await updateAttendances(updatedAttendances);
    toast.success("Presenças importadas com sucesso!");
  }

  async function handleExportCsv() {
    toast.info("Exportando inscrições...");
    const today = new Date().toLocaleDateString("pt-BR").replaceAll("/", "-");
    const classInfo = await readClass(classId as string);
    const classDates = await readClassDatesByClassId(classId as string);
    const attendances = await readAttendancesByClassDates(classDates);
    const userIds = [
      ...new Set(attendances.map((attendance) => attendance.userId)),
    ];
    const users = await readUsersViewById(userIds);
    const enrollments = await readEnrollmentsByClassId(classId as string);

    const toExport = users.map((user) => {
      const role = enrollments.find(
        (enrollment: TEnrollmentRow) => enrollment.userId === user.id,
      )?.danceRolePreference;
      const obj = {
        Nome: user.full_name,
        Email: user.email,
        Papel: danceRoleOptions[role!],
      };
      classDates.forEach((classDate) => {
        const att = attendances.find(
          (attendance) =>
            attendance.userId === user.id &&
            attendance.classDateId === classDate.id,
        )?.presence;

        obj[formatDate(classDate.date)] =
          att === "notRegistered" ? "" : presenceOptions[att!];
      });
      return obj;
    });

    function formatDate(data: string) {
      const date = new Date(data + "EDT");
      return date.toLocaleDateString("pt-BR");
    }

    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(toExport);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(
      workbook,
      `presenças_${classInfo.name}_${today}.xlsx`.toLowerCase(),
    );
  }

  useEffect(() => {
    handleReadClassDates();
  }, []);

  return (
    <div className="flex flex-col w-full justify-center">
      <AgGridReact
        className="w-full pt-4 px-4"
        rowData={rowData}
        columnDefs={windowWidth < 450 ? columnDefsMobile : columnDefs}
        overlayNoRowsTemplate="ㅤ"
      />
      {(user?.userRole === "admin" || "teacher") && (
        <div className="flex gap-4 justify-center">
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
              Importar Presenças
            </label>
          </form>
          <button className="text-blue-500 font-bold" onClick={handleExportCsv}>
            Exportar Presenças
          </button>
        </div>
      )}
    </div>
  );
}
