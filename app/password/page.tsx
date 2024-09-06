"use client";

import { supabaseClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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

    const fragment = window.location.href.split("#")[1];
    if (fragment) {
      const params = new URLSearchParams(fragment);

      await supabaseClient.auth.setSession({
        access_token: params.get("access_token")!,
        refresh_token: params.get("refresh_token")!,
      });
    }

    const { error } = await supabaseClient.auth.updateUser({
      password: password.current,
    });

    if (error) {
      console.error(error);
      toast.error("Erro ao alterar senha");
      return;
    }

    toast.success("Senha alterada com sucesso");
    router.push("/");
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
