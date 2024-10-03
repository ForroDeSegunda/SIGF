import { timeAgo } from "@/utils/functions";
import tw from "tailwind-styled-components";
import { TUserViewRow } from "../../users/types";
import { TCommentsRow } from "../[postId]/types";
import { TPostsRow } from "../types";
import { ActionButtons } from "./ActionButtons";
import { useEffect, useRef, useState } from "react";

const Container = tw.div<TCommentProps>`flex flex-col gap-4 border-t py-4`;
const Description = tw.p`text-sm`;
const Header = tw.button`flex gap-4 w-fit`;
const HeaderText = tw.div`flex flex-col justify-between text-left`;
const HeaderName = tw.div`text-sm font-bold`;
const HeaderTime = tw.div`text-sm text-gray-500`;
const ProfileImage = tw.img`rounded-full h-10 w-10`;
const Textarea = tw.textarea`w-full h-auto p-3 border rounded border-gray-300 resize-none overflow-hidden`;

type TCommentProps = {
  commentLevel: number;
  users: TUserViewRow[];
  post: TPostsRow;
  comment: TCommentsRow;
  comments: TCommentsRow[];
  setComments: (comments: TCommentsRow[]) => void;
  childComments?: TCommentsRow[];
  setChildComments?: (comments: TCommentsRow[]) => void;
};

export function Comment(p: TCommentProps) {
  const commentUser = p.users.find((user) => user.id === p.comment.userId);
  const [showChildComments, setShowChildComments] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showTextArea, setShowTextArea] = useState(false);
  const [newCommentText, setNewCommentText] = useState(p.comment.content);

  function handleTextareaInput() {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
  useEffect(() => {
    if (showTextArea && textareaRef.current) handleTextareaInput();
  }, [showTextArea]);

  return (
    <>
      <Container {...p} style={{ marginLeft: `${20 * p.commentLevel}px` }}>
        <Header>
          <ProfileImage src={commentUser!.avatar_url!} />
          <HeaderText>
            <HeaderName>{commentUser?.full_name}</HeaderName>
            <HeaderTime>{timeAgo(p.comment.createdAt)}</HeaderTime>
          </HeaderText>
        </Header>
        {showTextArea ? (
          <Textarea
            ref={textareaRef}
            value={newCommentText}
            onInput={handleTextareaInput}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
        ) : (
          <Description>{p.comment.content}</Description>
        )}
        <ActionButtons
          post={p.post}
          comment={p.comment}
          comments={p.comments}
          setComments={p.setComments}
          commentLevel={p.commentLevel}
          commentsAmount={p.childComments?.length}
          showChildComments={showChildComments}
          setShowChildComments={setShowChildComments}
          showTextArea={showTextArea}
          setShowTextArea={setShowTextArea}
          newCommentText={newCommentText}
          setNewCommentText={setNewCommentText}
        />
      </Container>
      {showChildComments &&
        p.childComments?.map((comment) => (
          <Comment
            key={comment.id}
            commentLevel={p.commentLevel + 1}
            users={p.users}
            post={p.post}
            comment={comment}
            comments={p.comments}
            setComments={p.setComments}
            childComments={p.comments.filter(
              (c) => c.parentCommentId === comment.id,
            )}
          />
        ))}
    </>
  );
}
