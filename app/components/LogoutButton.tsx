import { supabaseClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    supabaseClient.auth.signOut();
    router.push("/");
  }

  return (
    <button
      className="py-2 px-4 rounded-md no-underline bg-green-500 hover:bg-green-400 text-white"
      onClick={logout}
    >
      Sair
    </button>
  );
}
