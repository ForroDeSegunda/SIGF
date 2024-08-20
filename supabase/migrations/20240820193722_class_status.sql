create type "public"."classStatus" as enum ('hidden', 'open', 'ongoing', 'archived');

alter table "public"."classes" add column "status" "classStatus" not null default 'hidden'::"classStatus";



