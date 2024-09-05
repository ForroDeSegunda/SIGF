"use client";

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

  function passwordsMatch() {
    if (password.current !== passwordConfirmation.current) {
      toast.error("As senhas não coincidem");
      return false;
    }
    return true;
  }

  function handlePasswordRecovery(event: any) {
    event.preventDefault();
    if (!passwordsMatch()) return;
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
          value={password.current}
          onChange={(event) => (password.current = event.target.value)}
        />
        <Label htmlFor="password-confirmation">Confirmar Senha</Label>
        <Input
          required
          type="password"
          name="password-confirmation"
          placeholder="••••••••"
          onBlur={() => console.log("onBlur")}
          value={passwordConfirmation.current}
          onChange={(event) =>
            (passwordConfirmation.current = event.target.value)
          }
        />
        <ButtonPrimary>Alterar senha</ButtonPrimary>
      </LoginForm>
    </AuthContainer>
  );
}
