"use client";

import { useModal } from "@/app/components/MainModal";
import { usersAtom } from "@/atoms/usersAtom";
import Link from "next/link";
import { useState } from "react";
import {
  FaCheck,
  FaRegPenToSquare,
  FaRegTrashCan,
  FaXmark,
} from "react-icons/fa6";
import { useRecoilState, useRecoilValue } from "recoil";
import tw from "tailwind-styled-components";
import { readPostsByThreadId, updatePosts } from "../posts/actions";
import { deleteThreads, updateThread } from "./actions";
import { threadsAtom } from "./atom";
import { TThreadsRow } from "./types";

const ActionButtons = tw.div`flex gap-4`;
const Input = tw.input`border rounded-md px-4 py-2 w-full mr-4`;

export function ThreadsContent() {
  const openModal = useModal();
  const [threads, setThreads] = useRecoilState(threadsAtom);
  const [isEditing, setIsEditing] = useState("");
  const [threadName, setThreadName] = useState("");
  const user = useRecoilValue(usersAtom);

  function handleClickEdit(threadId: string) {
    if (isEditing === threadId) {
      setThreadName("");
      setIsEditing("");
    } else {
      setThreadName(threadId.charAt(0).toUpperCase() + threadId.slice(1));
      setIsEditing(threadId);
    }
  }

  async function handleDeleteThread(threadList: TThreadsRow[]) {
    const deletedThreads = await deleteThreads(threadList);
    setThreads(threads.filter((thread) => thread.id !== deletedThreads[0].id));
  }

  async function handleUpdateThread(threadId: string) {
    const posts = await readPostsByThreadId(threadId);
    const newPosts = posts.map((post) => {
      post.threadId = threadName.toLowerCase();
      return post;
    });

    const updatedThreads = await updateThread(
      threadId,
      threadName.toLowerCase(),
    );
    const newThreads = threads.map((thread: TThreadsRow) => {
      if (thread.id === threadId) return updatedThreads[0];
      return thread;
    });

    updatePosts(newPosts);
    setThreads(newThreads);
    setIsEditing("");
  }

  return (
    <div className="flex flex-col w-full m-4 bg-white border rounded-lg border-gray-300">
      {threads.map((thread: TThreadsRow) => (
        <div
          className="flex w-full border-b p-4 justify-between"
          key={thread.id}
        >
          {isEditing === thread.id ? (
            <Input
              value={threadName}
              onChange={(e) => setThreadName(e.target.value)}
            />
          ) : (
            <Link
              className="text-xl font-bold"
              href={`/posts?thread=${thread.id}`}
            >
              {thread.id.charAt(0).toUpperCase() + thread.id.slice(1)}
            </Link>
          )}
          {user!.userRole !== "student" && (
            <ActionButtons>
              {isEditing === thread.id ? (
                <>
                  <button onClick={() => handleUpdateThread(thread.id)}>
                    <FaCheck className="fill-green-400" size={20} />
                  </button>
                  <button onClick={() => handleClickEdit(thread.id)}>
                    <FaXmark className="fill-orange-400" size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleClickEdit(thread.id)}>
                    <FaRegPenToSquare size={20} />
                  </button>
                  <button
                    onClick={() =>
                      openModal("confirmation", thread.id, () =>
                        handleDeleteThread([thread]),
                      )
                    }
                  >
                    <FaRegTrashCan size={20} />
                  </button>
                </>
              )}
            </ActionButtons>
          )}
        </div>
      ))}
    </div>
  );
}
