import { useModal } from "@/app/components/MainModal";
import { enrollmentsAtom } from "@/atoms/enrollmentsAtom";
import { useRecoilValue } from "recoil";

export default function ButtonEnrollment(props: { id: string }) {
  const openModal = useModal();
  const enrollments = useRecoilValue(enrollmentsAtom);
  const isEnrolled = enrollments.some(
    (enrollment) => enrollment.classId === props.id,
  );

  return (
    <button
      className={
        isEnrolled
          ? "text-green-500 hover:text-green-400 font-bold"
          : "text-blue-500 hover:text-blue-400 font-bold"
      }
      onClick={() => openModal("classEnrollment")}
    >
      {isEnrolled ? "Inscrito" : "Inscrever"}
    </button>
  );
}
