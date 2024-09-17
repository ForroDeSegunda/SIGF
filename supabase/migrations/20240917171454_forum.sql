create type "public"."voteType" as enum ('upVote', 'downVote');

create table "public"."comments" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "content" text not null,
    "userId" uuid not null,
    "postId" uuid not null,
    "parentCommentId" uuid
);


alter table "public"."comments" enable row level security;

create table "public"."posts" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "title" character varying not null,
    "content" text,
    "userId" uuid not null,
    "threadId" uuid not null
);


alter table "public"."posts" enable row level security;

create table "public"."threads" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "title" character varying not null,
    "content" text,
    "userId" uuid not null
);


alter table "public"."threads" enable row level security;

create table "public"."votes" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "vote" "voteType" not null,
    "userId" uuid not null,
    "postId" uuid,
    "commentId" uuid
);


alter table "public"."votes" enable row level security;

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX topic_pkey ON public.threads USING btree (id);

CREATE UNIQUE INDEX unique_classdateid_userid ON public.attendance USING btree ("classDateId", "userId");

CREATE UNIQUE INDEX votes_pkey ON public.votes USING btree (id);

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."threads" add constraint "topic_pkey" PRIMARY KEY using index "topic_pkey";

alter table "public"."votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."attendance" add constraint "unique_classdateid_userid" UNIQUE using index "unique_classdateid_userid";

alter table "public"."comments" add constraint "comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_parentCommentId_fkey";

alter table "public"."comments" add constraint "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_postId_fkey";

alter table "public"."comments" add constraint "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_userId_fkey";

alter table "public"."posts" add constraint "posts_authorId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_authorId_fkey";

alter table "public"."posts" add constraint "posts_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES threads(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_threadId_fkey";

alter table "public"."threads" add constraint "threads_creatorId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."threads" validate constraint "threads_creatorId_fkey";

alter table "public"."votes" add constraint "votes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_commentId_fkey";

alter table "public"."votes" add constraint "votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_postId_fkey";

alter table "public"."votes" add constraint "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_userId_fkey";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."threads" to "anon";

grant insert on table "public"."threads" to "anon";

grant references on table "public"."threads" to "anon";

grant select on table "public"."threads" to "anon";

grant trigger on table "public"."threads" to "anon";

grant truncate on table "public"."threads" to "anon";

grant update on table "public"."threads" to "anon";

grant delete on table "public"."threads" to "authenticated";

grant insert on table "public"."threads" to "authenticated";

grant references on table "public"."threads" to "authenticated";

grant select on table "public"."threads" to "authenticated";

grant trigger on table "public"."threads" to "authenticated";

grant truncate on table "public"."threads" to "authenticated";

grant update on table "public"."threads" to "authenticated";

grant delete on table "public"."threads" to "service_role";

grant insert on table "public"."threads" to "service_role";

grant references on table "public"."threads" to "service_role";

grant select on table "public"."threads" to "service_role";

grant trigger on table "public"."threads" to "service_role";

grant truncate on table "public"."threads" to "service_role";

grant update on table "public"."threads" to "service_role";

grant delete on table "public"."votes" to "anon";

grant insert on table "public"."votes" to "anon";

grant references on table "public"."votes" to "anon";

grant select on table "public"."votes" to "anon";

grant trigger on table "public"."votes" to "anon";

grant truncate on table "public"."votes" to "anon";

grant update on table "public"."votes" to "anon";

grant delete on table "public"."votes" to "authenticated";

grant insert on table "public"."votes" to "authenticated";

grant references on table "public"."votes" to "authenticated";

grant select on table "public"."votes" to "authenticated";

grant trigger on table "public"."votes" to "authenticated";

grant truncate on table "public"."votes" to "authenticated";

grant update on table "public"."votes" to "authenticated";

grant delete on table "public"."votes" to "service_role";

grant insert on table "public"."votes" to "service_role";

grant references on table "public"."votes" to "service_role";

grant select on table "public"."votes" to "service_role";

grant trigger on table "public"."votes" to "service_role";

grant truncate on table "public"."votes" to "service_role";

grant update on table "public"."votes" to "service_role";



