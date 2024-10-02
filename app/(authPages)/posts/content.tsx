"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useRecoilState } from "recoil";
import { postsAtom } from "./atom";
import { TPostsRow } from "./types";
import { useModal } from "@/app/components/MainModal";
import { FaTrash } from "react-icons/fa";
import { deletePosts } from "./actions";
import { timeAgo } from "@/utils/functions";

export function PostsContent(p: { posts: TPostsRow[] }) {
  const openModal = useModal();
  const searchParams = useSearchParams();
  const thread = searchParams.get("thread");
  const [postsFromAtom, setPostsFromAtom] = useRecoilState(postsAtom);

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
    <div className="flex flex-col w-full m-4 bg-white border rounded-lg border-gray-300">
      {posts
        .filter((post: TPostsRow) => (thread ? post.threadId === thread : true))
        .map((post: TPostsRow) => (
          <div
            className="flex w-full border-b p-4 justify-between"
            key={post.id}
          >
            <div className="flex flex-col mr-4">
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
            </div>
            <button
              onClick={() =>
                openModal("confirmation", post.id, () =>
                  handleDeletePost([post]),
                )
              }
            >
              <FaTrash className="fill-orange-400" />
            </button>
          </div>
        ))}
    </div>
  );
}
