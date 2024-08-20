alter table "public"."enrollment" alter column "status" drop default;

alter type "public"."enrollmentStatus" rename to "enrollmentStatus__old_version_to_be_dropped";

create type "public"."enrollmentStatus" as enum ('pending', 'approved', 'rejected', 'abandonment');

alter table "public"."enrollment" alter column status type "public"."enrollmentStatus" using status::text::"public"."enrollmentStatus";

alter table "public"."enrollment" alter column "status" set default 'pending'::"enrollmentStatus";

drop type "public"."enrollmentStatus__old_version_to_be_dropped";



