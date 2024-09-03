import { Database } from "@/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClientComponentClient({ supabaseUrl, supabaseKey });
export default supabase;

export type TDanceRole = Database["public"]["Enums"]["danceRole"];
export type TDanceRolePreference =
  Database["public"]["Enums"]["danceRolePreference"];

export type TEnrollmentDataRow =
  Database["public"]["Tables"]["enrollment"]["Row"] & {
    actionButton?: React.ReactNode;
    attendance: string;
    users_view: Database["public"]["Views"]["users_view"]["Row"];
  };
