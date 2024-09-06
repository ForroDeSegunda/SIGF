"use client";

import { supabaseClient } from "@/supabase/client";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
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
  const code = useSearchParams().get("code");
  // const email = useSearchParams().get("email");

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

    const url = window.location.origin;
    console.log("url", url);

    const { error } = await supabaseClient.auth.updateUser({
      password: password.current,
    });

    if (error) {
      console.error(error);
      toast.error("Erro ao alterar senha");
      return;
    }
    toast.success("Senha alterada com sucesso");
  }

  async function test() {
    const origin = window.location.origin;
    console.log("origin", origin);
    console.log("code", code);

    const res = await supabaseClient.auth.getSession();
    console.log("res", res);

    if (!code) return;
    console.log("code exists");

    try {
      const res2 = await supabaseClient.auth.exchangeCodeForSession(code);
      console.log("res2", res2);
    } catch (error) {
      console.log("error", error);
    }
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
      <ButtonPrimary onClick={test}>Teste</ButtonPrimary>
    </AuthContainer>
  );
}
