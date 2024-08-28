"use client";

import profilePicture from "@/assets/profile.png";
import { sidebarMainAtom } from "@/atoms/sidebarsAtom";
import { usersAtom } from "@/atoms/usersAtom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { useRecoilState, useRecoilValue } from "recoil";
import tw from "tailwind-styled-components";
import LogoutButton from "./LogoutButton";
import { useModal } from "./MainModal";
import { NavbarButtons } from "./NavbarButtons";

export default function Navbar() {
  const openModal = useModal();
  const profileRef = useRef<HTMLImageElement>(null);
  const user = useRecoilValue(usersAtom);
  const [sidebarIsOpen, setSidebarIsOpen] = useRecoilState(sidebarMainAtom);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const router = useRouter();
  const splitedPath = usePathname()
    .split("/")
    .filter((path) => path);

  function handleClickOutside(event: MouseEvent) {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setProfileMenuVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Nav>
      <LeftSection>
        <FaBars
          className="cursor-pointer"
          onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
        />
        <LogoLink href="/classes">SIGF</LogoLink>
      </LeftSection>

      <NavbarButtons />

      <ProfileContainer>
        {splitedPath.length > 1 && (
          <button onClick={router.back}>
            <FaChevronLeft className="h-4" />
          </button>
        )}
        <ProfileImage
          src={user?.user_metadata?.avatar_url || profilePicture.src}
          alt="Foto de Perfil"
          ref={profileRef}
          onClick={() => setProfileMenuVisible(!isProfileMenuVisible)}
        />

        {isProfileMenuVisible && (
          <ProfileMenu>
            <ProfileMenuItem>{user?.user_metadata?.full_name}</ProfileMenuItem>
            <ProfileMenuItem>{user?.email}</ProfileMenuItem>
            <ProfileButtonGroup>
              <EditButton onClick={() => openModal("profile", "")}>
                Editar
              </EditButton>
              <LogoutButton />
            </ProfileButtonGroup>
          </ProfileMenu>
        )}
      </ProfileContainer>
    </Nav>
  );
}

const Nav = tw.nav`border-b-[1px] border-gray-300 h-16 w-full flex items-center justify-between`;
const LeftSection = tw.div`flex items-center pl-4 gap-4`;
const LogoLink = tw(Link)`hidden sm:block font-bold`;
const ProfileContainer = tw.div`flex gap-4 pr-4 relative`;
const ProfileImage = tw.img`cursor-pointer rounded-full h-10 w-10`;
const ProfileMenu = tw.ul`absolute right-4 bg-white top-11 border rounded-[10px] p-4 flex flex-col items-center z-50 gap-4`;
const ProfileMenuItem = tw.li``;
const ProfileButtonGroup = tw.li`flex w-full justify-between gap-2`;
const EditButton = tw.button`py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white`;
