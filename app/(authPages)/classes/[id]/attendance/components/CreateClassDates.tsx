import { TAttendance } from "@/app/api/attendance/route";
import {
  createAttendances,
  readApprovedEnrollments,
} from "@/app/api/attendance/service";
import {
  createClassDates,
  deleteClassDates,
} from "@/app/api/classDates/service";
import { readClass } from "@/app/api/classes/controller";
import { useModal } from "@/app/components/MainModal";
import { classDatesAtom } from "@/atoms/classDatesAtom";
import { getWeekDays } from "@/utils/functions";
import { useParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

export default function GenerateClassDates() {
  const [classDates, setClassDates] = useRecoilState(classDatesAtom);
  const classId = useParams().id;
  const openModal = useModal();

  async function handleDeleteAllClassDates() {
    toast.info("Excluindo aulas...");
    try {
      await deleteClassDates(classId);
      setClassDates([]);
    } catch (error) {
      toast.error("Erro ao excluir aulas");
      return;
    }
    toast.success("Aulas excluídas com sucesso!");
  }

  async function handleCreateAllClassDates() {
    toast.info("Gerando aulas...");
    try {
      const classData = await readClass(classId);

      const weekDays = classData.weekDays.split(",");
      const startDate = new Date(classData.period.startDate + "EDT");
      const endDate = new Date(classData.period.endDate + "EDT");

      const weekDaysDates = getWeekDays(startDate, endDate, weekDays);
      const classDates = await createClassDates(classId, weekDaysDates);
      const approvedEnrollments = await readApprovedEnrollments(classId);

      const attendances = classDates.flatMap((classDate) => {
        return approvedEnrollments.map((enrollment) => {
          return { classDateId: classDate.id, userId: enrollment.userId };
        });
      });

      setClassDates(classDates);
      createAttendances(attendances as TAttendance[]);
    } catch (error) {
      toast.error("Erro ao gerar aulas");
      return;
    }
    toast.success("Aulas geradas com sucesso!");
  }

  return (
    <div className="flex gap-4">
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => openModal("classDate")}
      >
        Criar Aula
      </button>
      {classDates.length === 0 && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleCreateAllClassDates}
        >
          Gerar Todas
        </button>
      )}
      {classDates.length > 0 && (
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          onClick={() =>
            openModal("confirmation", "", handleDeleteAllClassDates)
          }
        >
          Excluir Todas
        </button>
      )}
    </div>
  );
}
