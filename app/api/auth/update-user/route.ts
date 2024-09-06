import { supabaseClient } from "@/supabase/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const { email, password, full_name, avatar_url } = await request.json();

  const { data, error } = await supabaseClient.auth.updateUser({
    email,
    password,
    data: { full_name, avatar_url },
  });

  if (error) {
    if (error.status === 422)
      return NextResponse.json({
        ...error,
        message: "Não é permitido a mesma senha.",
      });
    return NextResponse.json({
      ...error,
      message: "Erro ao atualizar usuário.",
    });
  }

  return NextResponse.json({
    ...data,
    status: 204,
    message: "Usuário atualizado",
  });
}
