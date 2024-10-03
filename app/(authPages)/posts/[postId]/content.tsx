"use client";

import { timeAgo } from "@/utils/functions";
import { useState } from "react";
import tw from "tailwind-styled-components";
import { TUserViewRow } from "../../users/types";
import { ActionButtons } from "../components/ActionButtons";
import { Comment } from "../components/Comment";
import { TPostsRow } from "../types";
import { TCommentsRow } from "./types";

const Container = tw.div`flex w-full m-4`;
const Content = tw.div`flex flex-col w-full max-w-screen-lg mx-auto`;
const Post = tw.div`flex flex-col gap-4 pb-4`;
const PostTitle = tw.h1`text-2xl font-bold`;
const PostDescription = tw.p`text-sm`;
const Header = tw.button`flex gap-4 w-fit`;
const HeaderText = tw.div`flex flex-col justify-between text-left`;
const HeaderName = tw.div`text-sm font-bold`;
const HeaderTime = tw.div`text-sm text-gray-500`;
const ProfileImage = tw.img`rounded-full h-10 w-10`;

export function PostIdContent(p: {
  post: TPostsRow;
  users: TUserViewRow[];
  comments: TCommentsRow[];
}) {
  const postUser = p.users.find((user) => user.id === p.post.userId);
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
          <Header>
            <ProfileImage src={postUser!.avatar_url!} />
            <HeaderText>
              <HeaderName>{postUser?.full_name}</HeaderName>
              <HeaderTime>{timeAgo(p.post.createdAt)}</HeaderTime>
            </HeaderText>
          </Header>
          <PostTitle>{p.post.title}</PostTitle>
          <PostDescription>{p.post.content}</PostDescription>
          <ActionButtons
            commentLevel={0}
            commentsAmount={comments.length}
            post={p.post}
            comments={comments}
            setComments={setComments}
          />
        </Post>

        {comments.map((comment) => {
          if (comment.parentCommentId) return null;
          return (
            <Comment
              commentLevel={0}
              key={comment.id}
              post={p.post}
              users={p.users}
              comment={comment}
              comments={comments}
              setComments={setComments}
              childComments={comments.filter(
                (c) => c.parentCommentId === comment.id,
              )}
            />
          );
        })}
      </Content>
    </Container>
  );
}
