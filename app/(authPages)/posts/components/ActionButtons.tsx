"use client";
import { useModal } from "@/app/components/MainModal";
import { usersAtom } from "@/atoms/usersAtom";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaRegComment,
  FaRegMessage,
  FaRegPaperPlane,
  FaRegPenToSquare,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaRegTrashCan,
} from "react-icons/fa6";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import tw from "tailwind-styled-components";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../[postId]/actions";
import { TCommentsRow } from "../[postId]/types";
import { deletePost } from "../actions";
import { postsAtom } from "../atom";
import { TPostsRow } from "../types";

const ButtonRow = tw.div`flex gap-6`;
const Button = tw.button`flex gap-2 items-center`;
const ButtonText = tw.span`font-bold`;
const CommentCounter = tw.span`font-bold`;
const Textarea = tw.textarea`w-full h-auto p-3 border rounded border-gray-300 resize-none overflow-hidden`;

export function ActionButtons(p: {
  comments: TCommentsRow[];
  setComments: (comments: TCommentsRow[]) => void;
  showTextArea: boolean;
  setShowTextArea: (show: boolean) => void;
  post: TPostsRow;
  commentLevel: number;
  comment?: TCommentsRow;
  commentsAmount?: number;
  showChildComments?: boolean;
  setShowChildComments?: (show: boolean) => void;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
}) {
  const size = 20;
  const router = useRouter();
  const openModal = useModal();
  const user = useRecoilValue(usersAtom);
  const [showTextArea, setShowTextArea] = useState(false);
  const [newCommentText, setNewCommentText] = useState(p.comment?.content);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const isPostOwner = user!.id === p.post.userId;
  const isCommentOwner = user!.id === p.comment?.userId;
  const isAdmin = user!.userRole === "admin";

  async function handleSendButton() {
    if (p.comment) {
      if (p.showTextArea) handleUpdateComment();
      else if (showTextArea) handleCreateComment();
      else console.log("caso de comentario nao avaliado");
    } else {
      console.log("Aqui vai a logica do post");
    }
  }
  async function handleUpdateComment() {
    try {
      const updatedComment = await updateComment({
        ...p.comment!,
        content: p.newCommentText,
      });
      p.setComments(
        p.comments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment,
        ),
      );
      p.setShowTextArea(false);
      toast.success("Comentário atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar comentário!");
    }
  }
  async function handleCreateComment() {
    try {
      const newComment = await createComment({
        content: newCommentText || "",
        postId: p.post.id,
        userId: user!.id,
        parentCommentId: p.comment?.id || null,
      });
      toast.success("Comentário enviado com sucesso!");

      p.setComments([newComment, ...p.comments]);
      setShowTextArea(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar comentário!");
    }
  }

  async function handleDeleteCommentOrPost() {
    if (p.comment) {
      try {
        const deletedComment = await deleteComment(p.comment);
        p.setComments(
          p.comments.filter((comment) => comment.id !== deletedComment.id),
        );
        toast.success("Comentário deletado com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao deletar comentário!");
      }
    } else {
      try {
        await deletePost(p.post);
        toast.success("Post deletado com sucesso!");
        setPosts(posts.filter((post) => post.id !== p.post.id));
        router.push("/posts");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao deletar post!");
      }
    }
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
        {p.commentsAmount ? (
          <Button
            onClick={() => {
              if (p.setShowChildComments)
                p.setShowChildComments(!p.showChildComments);
            }}
          >
            <FaRegComment size={size} />
            <CommentCounter>{p.commentsAmount}</CommentCounter>
          </Button>
        ) : null}
        {p.commentLevel < 4 && (
          <Button onClick={() => setShowTextArea(!showTextArea)}>
            <FaRegMessage size={size} />
            <ButtonText>Responder</ButtonText>
          </Button>
        )}
        {false && (
          <>
            <Button>
              <FaRegThumbsUp size={size} />
            </Button>
            <Button>
              <FaRegThumbsDown size={size} />
            </Button>
          </>
        )}
        <Button onClick={() => p.setShowTextArea(!p.showTextArea)}>
          <FaRegPenToSquare size={size} />
          <ButtonText className="hidden sm:block">Editar</ButtonText>
        </Button>
        {showTextArea || p.showTextArea ? (
          <Button onClick={handleSendButton}>
            <FaRegPaperPlane size={size} />
            <ButtonText>Enviar</ButtonText>
          </Button>
        ) : (
          <>
            {isAdmin || isPostOwner || isCommentOwner ? (
              <Button
                onClick={() =>
                  openModal(
                    "confirmation",
                    p.post.id || p.comment?.id,
                    handleDeleteCommentOrPost,
                  )
                }
              >
                <FaRegTrashCan size={size} />
                <ButtonText className="hidden sm:block">Excluir</ButtonText>
              </Button>
            ) : null}
          </>
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
