import { modalIsOpenAtom } from "@/atoms/modalAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";
import { updateUser } from "../(authPages)/users/actions";

const Input = tw.input`border rounded-md px-4 py-2 pl-2`;
const Label = tw.label`text-md`;
const Form = tw.form`flex-1 flex flex-col w-full justify-center gap-2 text-foreground`;
const ButtonRow = tw.div`flex gap-4 justify-end pt-4`;
const ConfirmButton = tw.button`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`;
const CancelButton = tw.button`border border-gray-700 rounded px-4 py-2 text-black`;

export function ModalProfile() {
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);

  async function handleSubmit() {
    const { error } = await updateUser({
      email: email,
      password: password,
      data: {
        full_name: fullName,
        avatar_url: avatar,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Perfil atualizado com sucesso");
    location.reload();
    setIsModalOpen(false);
  }

  async function getUser() {
    const { data } = await useUser();
    setFullName(data?.user?.user_metadata.full_name);
    setEmail(data?.user?.email);
    setAvatar(data?.user?.user_metadata.avatar_url);
  }

  useEffect(() => {
    getUser();
  }, []);

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
        <CancelButton
          onClick={() => {
            setShowMobileOptions(false);
            setIsModalOpen(false);
          }}
        >
          Cancelar
        </CancelButton>
        <ConfirmButton onClick={handleSubmit}>Salvar</ConfirmButton>
      </ButtonRow>
    </Form>
  );
}
