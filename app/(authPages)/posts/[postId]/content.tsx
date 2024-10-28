"use client";

import { timeAgo } from "@/utils/functions";
import { useEffect, useRef, useState } from "react";
import tw from "tailwind-styled-components";
import { TUserViewRow } from "../../users/types";
import { ActionButtons } from "../components/ActionButtons";
import { Comment } from "../components/Comment";
import { TPostsRow } from "../types";
import { TCommentsRow } from "./types";

const Textarea = tw.textarea`w-full h-auto p-3 border rounded border-gray-300 resize-none overflow-hidden`;
const Container = tw.div`flex w-full m-4`;
const Content = tw.div`flex flex-col w-full max-w-screen-lg mx-auto`;
const Post = tw.div`flex flex-col gap-4 pb-4`;
const PostTitle = tw.h1`text-2xl font-bold`;
const Description = tw.pre`text-sm font-sans text-base whitespace-pre-wrap`;
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
  const [showTextArea, setShowTextArea] = useState(false);
  const [newCommentText, setNewCommentText] = useState(p.post.content || "");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [post, setPost] = useState(p.post);
  const postUser = p.users.find((user) => user.id === p.post.userId);
  const [comments, setComments] = useState(() =>
    [...p.comments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  function handleTextareaInput() {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
  useEffect(() => {
    if (showTextArea && textareaRef.current) handleTextareaInput();
  }, [showTextArea]);

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
          <PostTitle>{post.title}</PostTitle>
          {showTextArea ? (
            <Textarea
              ref={textareaRef}
              value={newCommentText}
              onInput={handleTextareaInput}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
          ) : (
            <Description>{post.content}</Description>
          )}
          <ActionButtons
            post={post}
            setPost={setPost}
            comments={comments}
            setComments={setComments}
            commentLevel={0}
            commentsAmount={comments.length}
            showTextArea={showTextArea}
            setShowTextArea={setShowTextArea}
            newCommentText={newCommentText}
            setNewCommentText={setNewCommentText}
          />
        </Post>

        {comments.map((comment) => {
          if (comment.parentCommentId) return null;
          return (
            <Comment
              key={comment.id}
              commentLevel={0}
              post={post}
              setPost={setPost}
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
