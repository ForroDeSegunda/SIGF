import { usersAtom } from "@/atoms/usersAtom";
import { useEffect, useRef, useState } from "react";
import {
  FaRegComment,
  FaRegMessage,
  FaRegPaperPlane,
  FaRegThumbsDown,
  FaRegThumbsUp,
} from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import tw from "tailwind-styled-components";
import { TCommentsRow } from "../[postId]/types";
import { TPostsRow } from "../types";
import { createComment } from "../[postId]/actions";

const ButtonRow = tw.div`flex gap-5 xs:gap-6`;
const Button = tw.button`flex gap-2 items-center`;
const ButtonText = tw.span`font-bold`;
const Textarea = tw.textarea`w-full h-auto p-3 border rounded border-gray-300 resize-none overflow-hidden`;

export function ActionButtons(p: {
  post: TPostsRow;
  comments: TCommentsRow[];
  setComments: (comments: TCommentsRow[]) => void;
  comment?: TCommentsRow;
  commentsAmount?: number;
}) {
  const size = 20;
  const user = useRecoilValue(usersAtom);
  const [showTextArea, setShowTextArea] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  async function handleCreateComment() {
    const newComment = await createComment({
      content: newCommentText,
      postId: p.post.id,
      userId: user!.id,
    });

    p.setComments([newComment, ...p.comments]);
    setShowTextArea(false);
  }

  const handleTextareaInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (showTextArea && textareaRef.current) {
      handleTextareaInput();
    }
  }, [showTextArea]);

  return (
    <>
      <ButtonRow>
        {p.commentsAmount && (
          <Button>
            <FaRegComment size={size} />
            <ButtonText>{p.commentsAmount}</ButtonText>
          </Button>
        )}
        <Button>
          <FaRegThumbsUp size={size} />
        </Button>
        <Button>
          <FaRegThumbsDown size={size} />
        </Button>
        <Button onClick={() => setShowTextArea(!showTextArea)}>
          <FaRegMessage size={size} />
          <ButtonText>Responder</ButtonText>
        </Button>
        {showTextArea && (
          <Button onClick={handleCreateComment}>
            <FaRegPaperPlane size={size} />
            <ButtonText>Enviar</ButtonText>
          </Button>
        )}
      </ButtonRow>
      {showTextArea && (
        <Textarea
          ref={textareaRef}
          onInput={handleTextareaInput}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Escreva um comentário..."
        />
      )}
    </>
  );
}
