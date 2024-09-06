import { Database } from "@/database.types";
import { User } from "@supabase/supabase-js";

export type TDanceRole = Database["public"]["Enums"]["danceRole"];
export type TDanceRolePreference =
  Database["public"]["Enums"]["danceRolePreference"];

export type TEnrollmentDataRow =
  Database["public"]["Tables"]["enrollment"]["Row"] & {
    actionButton?: React.ReactNode;
    attendance: string;
    users_view: Database["public"]["Views"]["users_view"]["Row"];
  };

export type TUser = Database["public"]["Tables"]["user"]["Insert"];
export type TUserViewPlusRole = {
  email: string;
  id: string;
  full_name: string;
} & {
  user: TUser;
};
export type TUserWithRole = User & { userRole: string };

export type TPeriodRow = Database["public"]["Tables"]["period"]["Row"];
export type TPeriodUpdate = Database["public"]["Tables"]["period"]["Update"];
export type TPeriodInsert = Database["public"]["Tables"]["period"]["Insert"];

export type TEnrollmentRow = Database["public"]["Tables"]["enrollment"]["Row"];
export type TEnrollmentInsert =
  Database["public"]["Tables"]["enrollment"]["Insert"];
export type TEnrollmentUpdate =
  Database["public"]["Tables"]["enrollment"]["Update"];
export type TApprovedEnrollment =
  Database["public"]["Tables"]["enrollment"]["Insert"] & {
    user_view: Database["public"]["Views"]["users_view"]["Insert"];
  };

export type TAttendanceWithClassDates = TAttendanceInsert & {
  classDates: TClassDatesRow;
};
export type TAttendanceInsert =
  Database["public"]["Tables"]["attendance"]["Insert"];

export type TClassDatesRow = Database["public"]["Tables"]["classDates"]["Row"];
export type TClassDatesInsert =
  Database["public"]["Tables"]["classDates"]["Insert"];
