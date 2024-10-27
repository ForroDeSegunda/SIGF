import { usersAtom } from "@/atoms/usersAtom";
import { useWindowWidth } from "@react-hook/window-size";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
} from "react-icons/fa6";
import { useRecoilValue } from "recoil";

export default function Sidebar(props: { children: React.ReactNode }) {
  const user = useRecoilValue(usersAtom);
  const windowWidth = useWindowWidth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAdmin = user?.userRole === "admin";
  const isDirector = isAdmin || user?.userRole === "director";

  if (!isDirector) return null;

  return (
    <>
      <button
        className="xl:hidden p-2 border-l rounded-none flex justify-center items-center"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {windowWidth < 768 ? (
          isSidebarOpen ? (
            <FaChevronDown />
          ) : (
            <FaChevronUp />
          )
        ) : isSidebarOpen ? (
          <FaChevronRight />
        ) : (
          <FaChevronLeft />
        )}
      </button>

      {isSidebarOpen ? (
        <aside
          className={`sticky max-h-72 xl:block h-fit border-gray-300 overflow-auto ${
            isSidebarOpen ? "block" : "hidden"
          } ${windowWidth < 768 ? "w-full" : "w-52"} `}
        >
          {props.children}
        </aside>
      ) : (
        <aside
          className={`sticky hidden xl:block h-fit border-gray-300 overflow-auto ${
            isSidebarOpen ? "block" : "hidden"
          } ${windowWidth < 768 ? "w-full" : "w-52"} `}
        >
          {props.children}
        </aside>
      )}
    </>
  );
}
