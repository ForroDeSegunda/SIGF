import { FaMessage, FaRegMessage } from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import { threadsAtom } from "../(authPages)/threads/atom";
import { TThreadsRow } from "../(authPages)/threads/types";
import SideBarButton from "./SideBarButton";

export function ForumButton() {
  const threads = useRecoilValue(threadsAtom);

  return (
    <>
      <SideBarButton text="Fórum" icon={<FaMessage />} href="/posts" />
      <div className="flex flex-col ml-4 overflow-y-auto">
        {threads.map((thread: TThreadsRow) => (
          <SideBarButton
            key={thread.id}
            text={thread.id.charAt(0).toUpperCase() + thread.id.slice(1)}
            icon={<FaRegMessage />}
            href={`/posts?thread=${thread.id}`}
          />
        ))}
      </div>
    </>
  );
}
