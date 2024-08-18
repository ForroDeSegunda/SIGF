import { useModal } from "@/app/components/MainModal";
import { enrollmentsAtom } from "@/atoms/enrollmentsAtom";
import { useRecoilValue } from "recoil";

export default function ButtonEnrollment(props: { id: string }) {
  const classId = props.id;
  const openModal = useModal();
  const enrollments = useRecoilValue(enrollmentsAtom);
  const isEnrolled = enrollments.some(
    (enrollment) => enrollment.classId === props.id,
  );

  return (
    <button
      className={
        isEnrolled
          ? "text-blue-500 hover:text-blue-600 font-bold"
          : "text-green-500 hover:text-green-600 font-bold"
      }
      onClick={() => openModal("classEnrollment", classId)}
    >
      {isEnrolled ? "Atualizar" : "Inscrever"}
    </button>
  );
}
