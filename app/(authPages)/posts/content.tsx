"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useRecoilState } from "recoil";
import { postsAtom } from "./atom";
import { TPostsRow } from "./types";

export function PostsContent(p: { posts: TPostsRow[] }) {
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

  return (
    <div className="flex flex-col w-full m-4 bg-white border rounded-lg border-gray-300">
      {posts
        .filter((post: TPostsRow) => (thread ? post.threadId === thread : true))
        .map((post: TPostsRow) => (
          <div className="flex flex-col w-full border-b p-4" key={post.id}>
            <Link className="font-bold" href={`/threads/${post.threadId}`}>
              t/{post.threadId}
            </Link>
            <Link className="text-xl" href={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </div>
        ))}
    </div>
  );
}
