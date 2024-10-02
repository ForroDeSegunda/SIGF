import { timeAgo } from "@/utils/functions";
import tw from "tailwind-styled-components";
import { TUserViewRow } from "../../users/types";
import { TCommentsRow } from "../[postId]/types";
import { TPostsRow } from "../types";
import { ActionButtons } from "./ActionButtons";

const CommentContainer = tw.div`flex flex-col gap-4 border-t py-4`;
const PostDescription = tw.p`text-sm`;

export function Comment(p: {
  users: TUserViewRow[];
  post: TPostsRow;
  comment: TCommentsRow;
  comments: TCommentsRow[];
  setComments: (comments: TCommentsRow[]) => void;
}) {
  const user = p.users.find((user) => user.id === p.comment.userId);
  return (
    <CommentContainer>
      <button className="flex gap-4 w-fit">
        <img
          className="rounded-full"
          src={user!.avatar_url!}
          width={40}
          height={40}
        />
        <div className="flex flex-col justify-between text-left">
          <div className="text-sm font-bold">{user?.full_name}</div>
          <div className="text-sm text-gray-500">
            {timeAgo(p.comment.createdAt)}
          </div>
        </div>
      </button>
      <PostDescription>{p.comment.content}</PostDescription>
      <ActionButtons
        post={p.post}
        comment={p.comment}
        comments={p.comments}
        setComments={p.setComments}
      />
    </CommentContainer>
  );
}
