import { readUsersView } from "../../users/actions";
import { readPost } from "../actions";
import { readCommentsByPostId } from "./actions";
import { PostIdContent } from "./content";

export default async function PostIdPage(p: { params: { postId: string } }) {
  const post = await readPost(p.params.postId);
  const comments = await readCommentsByPostId(p.params.postId);
  const users = await readUsersView();

  return <PostIdContent post={post} comments={comments} users={users} />;
}
