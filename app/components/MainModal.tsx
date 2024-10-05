"use client";

import {
  modalFunctionAtom,
  modalIdAtom,
  modalIsOpenAtom,
  modalOptionsAtom,
} from "@/atoms/modalAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import Modal from "react-modal";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ModalCalendar from "../(authPages)/calendar/components/ModalCalendar";
import { ModalCashflow } from "../(authPages)/cashflow/components/ModalCashflow";
import ModalClassDate from "../(authPages)/classes/[id]/attendance/components/ModalClassDate";
import ModalClassEnrollment from "../(authPages)/classes/components/ModalClassEnrollment";
import ModalClasses from "../(authPages)/classes/components/ModalClasses";
import ModalPeriods from "../(authPages)/periods/components/ModalPeriods";
import { ModalPosts } from "../(authPages)/posts/components/ModalPosts";
import { ModalThreads } from "../(authPages)/threads/components/ModalThreads";
import { ModalConfirmation } from "./ModalConfirmation";
import { ModalProfile } from "./ModalProfile";

Modal.setAppElement("#__modal");

const modalOptions = {
  confirmation: <ModalConfirmation />,
  classes: <ModalClasses />,
  periods: <ModalPeriods />,
  calendar: <ModalCalendar />,
  classDate: <ModalClassDate />,
  classEnrollment: <ModalClassEnrollment />,
  profile: <ModalProfile />,
  posts: <ModalPosts />,
  threads: <ModalThreads />,
  cashflow: <ModalCashflow />,
};
export type TModalOptions = keyof typeof modalOptions;

export function useModal() {
  const setModalOption = useSetRecoilState(modalOptionsAtom);
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const setModalId = useSetRecoilState(modalIdAtom);
  const setModalFunction = useSetRecoilState(modalFunctionAtom);

  function openModal(
    modalOption: TModalOptions,
    id: string = "",
    modalFunction?: () => void,
  ) {
    setIsModalOpen(true);
    setModalOption(modalOption);
    setModalId(id);
    setModalFunction(() => modalFunction);
  }
  return openModal;
}

export default function MainModal() {
  const [isModalOpen, setIsModalOpen] = useRecoilState(modalIsOpenAtom);
  const modalOption = useRecoilValue(modalOptionsAtom);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => {
        setShowMobileOptions(false);
        setIsModalOpen(false);
      }}
      style={{
        content: {
          width: "fit-content",
          height: "fit-content",
          margin: "auto",
          overflow: "visible",
        },
      }}
    >
      {modalOptions[modalOption]}
    </Modal>
  );
}
