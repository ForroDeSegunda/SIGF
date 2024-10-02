"use client";

import tw from "tailwind-styled-components";
import { TUserViewRow } from "../../users/types";
import { ActionButtons } from "../components/ActionButtons";
import { Comment } from "../components/Comment";
import { TPostsRow } from "../types";
import { TCommentsRow } from "./types";
import { useState } from "react";

const Container = tw.div`flex w-full m-4`;
const Content = tw.div`flex flex-col max-w-screen-lg mx-auto`;
const Post = tw.div`flex flex-col gap-4 pb-4`;
const PostTitle = tw.h1`text-2xl font-bold`;
const PostDescription = tw.p`text-sm`;

export function PostIdContent(p: {
  post: TPostsRow;
  users: TUserViewRow[];
  comments: TCommentsRow[];
}) {
  const [comments, setComments] = useState(() =>
    [...p.comments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  return (
    <Container>
      <Content>
        <Post>
          <PostTitle>{p.post.title}</PostTitle>
          <PostDescription>{p.post.content}</PostDescription>
          <ActionButtons
            commentsAmount={9134}
            post={p.post}
            comments={comments}
            setComments={setComments}
          />
        </Post>

        {comments.map((comment) => (
          <Comment
            key={comment.id}
            post={p.post}
            users={p.users}
            comment={comment}
            comments={comments}
            setComments={setComments}
          />
        ))}
      </Content>
    </Container>
  );
}
