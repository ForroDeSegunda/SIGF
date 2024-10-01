import { modalIsOpenAtom } from "@/atoms/modalAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";
import { createThreads } from "../actions";
import { threadsAtom } from "../atom";
import { TThreadsInsert } from "../types";

const Form = tw.form`flex flex-col flex-1 w-full justify-center gap-2 text-foreground`;
const Label = tw.label`text-md`;
const Input = tw.input`border rounded-md px-4 py-2 pl-2`;
const ButtonContainer = tw.div`flex justify-end gap-4 mt-4`;
const ButtonClose = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;
const ButtonSubmit = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;

export function ModalThreads() {
  const user = useRecoilValue(usersAtom);
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const [threads, setThreads] = useRecoilState(threadsAtom);

  async function handleCreateThread(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newThread: TThreadsInsert = {
      id: e.target[0].value.toLowerCase(),
      userId: user!.id,
    };

    try {
      const createdPosts = await createThreads([newThread]);
      setThreads([...threads, createdPosts[0]]);
    } catch (error) {
      toast.error("Erro ao criar assunto");
      return;
    }
    setIsModalOpen(false);
  }

  return (
    <Form onSubmit={handleCreateThread}>
      <Label htmlFor="title">Nome</Label>
      <Input name="title" placeholder="Eventos" required />
      <ButtonContainer>
        <ButtonClose
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
        >
          Fechar
        </ButtonClose>
        <ButtonSubmit>Criar</ButtonSubmit>
      </ButtonContainer>
    </Form>
  );
}
