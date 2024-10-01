import { modalIsOpenAtom } from "@/atoms/modalAtom";
import { usersAtom } from "@/atoms/usersAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";
import { threadsAtom } from "../../threads/atom";
import { TThreadsRow } from "../../threads/types";
import { createPosts } from "../actions";
import { postsAtom } from "../atom";
import { TPostsInsert } from "../types";

const Form = tw.form`flex flex-col flex-1 w-full justify-center gap-2 text-foreground`;
const Label = tw.label`text-md`;
const Select = tw.select`rounded-md px-4 py-2 bg-inherit border mb-2`;
const Input = tw.input`border rounded-md px-4 py-2 pl-2`;
const Textarea = tw.textarea`border rounded-md px-4 py-2 pl-2 h-40`;
const ButtonContainer = tw.div`flex justify-end gap-4 mt-4`;
const ButtonClose = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;
const ButtonSubmit = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;

export function ModalPosts() {
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const threads = useRecoilValue(threadsAtom);
  const user = useRecoilValue(usersAtom);

  async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newPost: TPostsInsert = {
      title: e.target[1].value,
      content: e.target[2].value,
      threadId: e.target[0].value,
      userId: user!.id,
    };

    try {
      const createdPosts = await createPosts([newPost]);
      setPosts([...posts, createdPosts[0]]);
    } catch (error) {
      toast.error("Erro ao criar publicação");
      return;
    }
    setIsModalOpen(false);
  }

  return (
    <Form onSubmit={handleCreatePost}>
      <Label htmlFor="threadId">Assunto</Label>
      <Select>
        {threads.map((thread: TThreadsRow) => (
          <option key={thread.id} value={thread.id}>
            {thread.id.charAt(0).toUpperCase() + thread.id.slice(1)}
          </option>
        ))}
      </Select>
      <Label htmlFor="title">Título*</Label>
      <Input name="title" placeholder="Quantos anos têm o FDS?" required />
      <Label htmlFor="content">Descrição</Label>
      <Textarea placeholder="Escreva uma descrição" />
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
