"use client";

import { useState } from "react";
import { TPostsRow } from "./types";
import Link from "next/link";

export function PostsContent(p: { posts: TPostsRow[] }) {
  const [posts, _] = useState(p.posts);

  return (
    <div className="flex flex-col w-full m-4 bg-white border rounded-lg border-gray-300">
      {posts.map((thread: TPostsRow) => (
        <div className="flex flex-col w-full border-b p-4" key={thread.id}>
          <Link className="font-bold" href={`/threads/${thread.threadId}`}>
            t/{thread.threadId}
          </Link>
          <h2 className="text-xl">{thread.title}</h2>
        </div>
      ))}
    </div>
  );
}
