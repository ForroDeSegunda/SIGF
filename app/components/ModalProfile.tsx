import { modalIsOpenAtom } from "@/atoms/modalAtom";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { updateUser } from "../api/auth/service";

export function ModalProfile() {
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  async function handleSubmit() {
    await updateUser({
      full_name: fullName,
      email: email,
      password: password,
      avatar_url: avatar,
    });
    location.reload();
    setIsModalOpen(false);
  }

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Label>Nome</Label>
      <Input
        placeholder="João Pedro"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Label>Foto de perfil</Label>
      <Input
        placeholder="Link da imagem"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      />
      <Label>Email</Label>
      <Input
        placeholder="joao.pedro@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Label>Senha</Label>
      <Input
        placeholder="Senha atual"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <ButtonRow>
        <CancelButton onClick={() => setIsModalOpen(false)}>
          Cancelar
        </CancelButton>
        <ConfirmButton onClick={handleSubmit}>Salvar</ConfirmButton>
      </ButtonRow>
    </Form>
  );
}

const Input = tw.input`border rounded-md px-4 py-2 pl-2`;
const Label = tw.label`text-md`;
const Form = tw.form`flex-1 flex flex-col w-full justify-center gap-2 text-foreground`;
const ButtonRow = tw.div`flex gap-4 justify-end pt-4`;
const ConfirmButton = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;
const CancelButton = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;
