import { deleteClass } from "@/app/api/classes/service";
import { useModal } from "@/app/components/MainModal";
import { classesAtom } from "@/atoms/classesAtom";
import { currentClassAtom } from "@/atoms/currentClassAtom";
import { TClassRow } from "@/types/classTypes";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "sonner";

export default function ButtonOptions(props: TClassRow) {
  const [classes, setClasses] = useRecoilState(classesAtom);
  const setCurrentClass = useSetRecoilState(currentClassAtom);
  const openModal = useModal();

  async function handleDeleteClass() {
    toast.info("Excluindo classe...");
    try {
      await deleteClass(props.id);
    } catch (error) {
      toast.error("Erro ao excluir classe");
      return;
    }
    setClasses(classes.filter((classItem) => classItem.id !== props.id));
    toast.success("Classe excluída com sucesso!");
  }

  return (
    <div className="flex gap-2">
      <button
        className="text-blue-500 hover:text-blue-600 font-bold"
        onClick={() => {
          setCurrentClass(props);
          openModal("classes", props.id);
        }}
      >
        Editar
      </button>
      <button
        className="text-orange-500 hover:text-orange-600 font-bold"
        onClick={() => openModal("confirmation", props.id, handleDeleteClass)}
      >
        Excluir
      </button>
    </div>
  );
}
