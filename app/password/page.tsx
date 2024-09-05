"use client";

import supabase from "@/utils/db";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import tw from "tailwind-styled-components";

const AuthContainer = tw.div`flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2`;
const LoginForm = tw.form`flex flex-col w-full justify-center gap-2 text-foreground`;
const Label = tw.label`text-md`;
const Input = tw.input`rounded-md px-4 py-2 bg-inherit border mb-6`;
const ButtonPrimary = tw.button`bg-green-500 hover:bg-green-600 rounded px-4 py-2 text-white mb-2 font-bold`;

export default function PasswordRecovery() {
  const password = useRef("");
  const passwordConfirmation = useRef("");
  const email = useSearchParams().get("email");

  function passwordsMatch() {
    if (password.current !== passwordConfirmation.current) {
      toast.error("As senhas não coincidem");
      return false;
    }
    toast.success("Senhas coincidem");
    return true;
  }

  async function handlePasswordRecovery(event: any) {
    event.preventDefault();
    if (!passwordsMatch()) return;

    const { data, error } = await supabase.auth.updateUser({
      email: email!,
      password: password.current,
    });
    console.log("data: ", data);

    if (error) {
      console.error(error);
      toast.error("Erro ao alterar senha");
      return;
    }
    toast.success("Senha alterada com sucesso");
  }

  return (
    <AuthContainer>
      <LoginForm>
        <Label htmlFor="password">Senha</Label>
        <Input
          required
          type="password"
          name="password"
          placeholder="••••••••"
          onChange={(event) => (password.current = event.target.value)}
        />
        <Label htmlFor="password-confirmation">Confirmar Senha</Label>
        <Input
          required
          type="password"
          name="password-confirmation"
          placeholder="••••••••"
          onBlur={passwordsMatch}
          onChange={(event) =>
            (passwordConfirmation.current = event.target.value)
          }
        />
        <ButtonPrimary onClick={handlePasswordRecovery}>
          Alterar senha
        </ButtonPrimary>
      </LoginForm>
    </AuthContainer>
  );
}
