import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });
  const { email, password, full_name } = await request.json();
  if (!email || !password || !full_name) {
    return NextResponse.json({
      message: "Email, senha e nome são obrigatórios.",
      status: 400,
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      data: {
        full_name,
      },
    },
  });

  if (error) {
    if (error.status === 422) {
      if (error.code === "weak_password")
        return NextResponse.json({ ...error, message: "Senha fraca." });
      else if (error.code === "user_already_exists")
        return NextResponse.json({
          ...error,
          message: "Usuário já cadastrado.",
        });
    }
    if (error.status === 400)
      return NextResponse.json({ ...error, message: "Email inválido." });
    return NextResponse.json({
      ...error,
      message: "Erro ao cadastrar usuário.",
    });
  }

  return NextResponse.json({
    ...data,
    status: 201,
    message: "Usuário cadastrado.",
  });
}
