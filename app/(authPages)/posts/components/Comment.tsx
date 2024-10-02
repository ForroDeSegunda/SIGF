import { timeAgo } from "@/utils/functions";
import tw from "tailwind-styled-components";
import { TUserViewRow } from "../../users/types";
import { TCommentsRow } from "../[postId]/types";
import { TPostsRow } from "../types";
import { ActionButtons } from "./ActionButtons";

const Container = tw.div<TCommentProps>`flex flex-col gap-4 border-t py-4`;
const Description = tw.p`text-sm`;
const Header = tw.button`flex gap-4 w-fit`;
const HeaderText = tw.div`flex flex-col justify-between text-left`;
const HeaderName = tw.div`text-sm font-bold`;
const HeaderTime = tw.div`text-sm text-gray-500`;
const ProfileImage = tw.img`rounded-full h-10 w-10`;

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
  const user = p.users.find((user) => user.id === p.comment.userId);
  return (
    <>
      <Container {...p} style={{ marginLeft: `${20 * p.commentLevel}px` }}>
        <Header>
          <ProfileImage src={user!.avatar_url!} />
          <HeaderText>
            <HeaderName>{user?.full_name}</HeaderName>
            <HeaderTime>{timeAgo(p.comment.createdAt)}</HeaderTime>
          </HeaderText>
        </Header>
        <Description>{p.comment.content}</Description>
        <ActionButtons
          post={p.post}
          comment={p.comment}
          comments={p.comments}
          setComments={p.setComments}
          commentLevel={p.commentLevel}
        />
      </Container>
      {p.childComments?.map((comment) => (
        <Comment
          commentLevel={p.commentLevel + 1}
          key={comment.id}
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
