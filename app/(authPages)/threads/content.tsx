"use client";

import { useRecoilState } from "recoil";
import { threadsAtom } from "./atom";
import { TThreadsRow } from "./types";
import Link from "next/link";

export function ThreadsContent() {
  const [threads, _] = useRecoilState(threadsAtom);

  return (
    <div className="flex flex-col w-full m-4 bg-white border rounded-lg border-gray-300">
      {threads.map((thread: TThreadsRow) => (
        <div className="flex flex-col w-full border-b p-4" key={thread.id}>
          <Link className="text-xl font-bold" href={`/threads/${thread.id}`}>
            t/{thread.id.charAt(0).toUpperCase() + thread.id.slice(1)}
          </Link>
        </div>
      ))}
    </div>
  );
}
