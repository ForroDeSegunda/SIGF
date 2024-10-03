"use client";
import { useModal } from "@/app/components/MainModal";
import { usersAtom } from "@/atoms/usersAtom";
import { timeAgo } from "@/utils/functions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { useRecoilState, useRecoilValue } from "recoil";
import tw from "tailwind-styled-components";
import { deletePosts } from "./actions";
import { postsAtom } from "./atom";
import { TPostsRow } from "./types";

const PostsList = tw.div`flex flex-col w-full m-4 bg-white border rounded-lg border-gray-300`;
const Post = tw.div`flex w-full border-b p-4 justify-between`;
const PostContent = tw.div`flex flex-col mr-4`;

export function PostsContent(p: { posts: TPostsRow[] }) {
  const [postsFromAtom, setPostsFromAtom] = useRecoilState(postsAtom);
  const user = useRecoilValue(usersAtom);
  const searchParams = useSearchParams();
  const thread = searchParams.get("thread");
  const openModal = useModal();
  const isAdmin = user!.userRole === "admin";
  const posts = useMemo(() => {
    if (postsFromAtom.length === 0) {
      setPostsFromAtom(p.posts);
      return p.posts;
    }
    return postsFromAtom;
  }, [postsFromAtom]);

  async function handleDeletePost(postList: TPostsRow[]) {
    const deletedPosts = await deletePosts(postList);
    setPostsFromAtom(posts.filter((post) => post.id !== deletedPosts[0].id));
  }

  return (
    <PostsList>
      {posts
        .filter((post: TPostsRow) => (thread ? post.threadId === thread : true))
        .map((post: TPostsRow) => (
          <Post key={post.id}>
            <PostContent>
              <div className="flex gap-2">
                <Link
                  className="font-bold"
                  href={`/posts?thread=${post.threadId}`}
                >
                  {post.threadId}
                </Link>
                <div className="text-gray-500">{timeAgo(post.createdAt)}</div>
              </div>
              <Link className="text-xl" href={`/posts/${post.id}`}>
                {post.title}
              </Link>
            </PostContent>
            {(isAdmin || user!.id === post.userId) && (
              <button
                onClick={() =>
                  openModal("confirmation", post.id, () =>
                    handleDeletePost([post]),
                  )
                }
              >
                <FaRegTrashCan size={20} />
              </button>
            )}
          </Post>
        ))}
    </PostsList>
  );
}
