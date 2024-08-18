import { createCalendar } from "@/app/api/calendar/controller";
import { calendarsAtom } from "@/atoms/calendarAtom";
import { modalIsOpenAtom } from "@/atoms/modalAtom";
import { showMobileOptionsAtom } from "@/atoms/showMobileOptionsAtom";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function ModalCalendar() {
  const setIsModalOpen = useSetRecoilState(modalIsOpenAtom);
  const setShowMobileOptions = useSetRecoilState(showMobileOptionsAtom);
  const [calendars, setCalendars] = useRecoilState(calendarsAtom);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  async function handleSave() {
    const createdCalendar = await createCalendar({ name, url });
    setCalendars([...calendars, createdCalendar]);
    setIsModalOpen(false);
  }

  return (
    <div className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground z-1000">
      <label className="text-md" htmlFor="semester">
        Nome
      </label>
      <input
        className="rounded-md px-4 py-2 w-full border mb-4"
        type="text"
        placeholder="Nome do calendário"
        onChange={(e) => setName(e.target.value)}
      />
      <label className="text-md" htmlFor="semester">
        URL
        <a
          className="text-blue-500 pl-1"
          href="https://support.google.com/calendar/answer/41207?hl=pt-BR"
          target="_blank"
        >
          (?)
        </a>
      </label>
      <input
        className="rounded-md px-4 py-2 w-full border mb-4"
        type="url"
        placeholder="URL do calendário"
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="flex justify-around gap-4">
        <button
          className="border border-gray-700 rounded px-4 py-2 text-black"
          onClick={() => {
            setShowMobileOptions(false);
            setIsModalOpen(false);
          }}
        >
          Cancelar
        </button>
        {!name || !url ? (
          <button
            className="border border-gray-700 rounded px-4 py-2 text-black"
            disabled
          >
            Salvar
          </button>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleSave}
          >
            Salvar
          </button>
        )}
      </div>
    </div>
  );
}
