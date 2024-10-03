import {
  TCalendar,
  deleteCalendar,
  updateCalendar,
} from "@/app/api/calendar/controller";
import { useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";

export default function ButtonCalendar(props: {
  id: string;
  name: string;
  onClickName: () => void;
  calendars: TCalendar[];
  setCalendars: (calendars: TCalendar[]) => void;
  currentCalendar: TCalendar;
  setCurrentCalendar: (cal: TCalendar) => void;
  isPrincipal?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  async function handleSave() {
    const newName = name === "" ? props.name : name;
    const newUrl =
      url === ""
        ? props.calendars.filter((cal) => cal.id === props.id)[0].url
        : url;

    const updatedCalendar = await updateCalendar({
      id: props.id,
      name: newName,
      url: newUrl,
    });

    const filteredCalendars = props.calendars.filter(
      (cal) => cal.id !== props.id,
    );

    props.setCalendars([...filteredCalendars, updatedCalendar]);
    props.setCurrentCalendar(updatedCalendar);
    setIsEditing(false);
  }

  function handleDeleteCalendar() {
    deleteCalendar(props.id);
    const filteredCalendars = props.calendars.filter(
      (cal) => cal.id !== props.id,
    );
    props.setCalendars(filteredCalendars);
  }

  return (
    <div
      className={
        isEditing
          ? "flex flex-col items-center p-4 gap-4 w-full border-b border-dashed"
          : "flex flex-col items-center p-4 gap-4 w-full"
      }
    >
      <div className="flex flex-row w-full gap-4">
        <FaRegPenToSquare
          className="cursor-pointer"
          onClick={() => setIsEditing(!isEditing)}
        />
        <span
          className={
            props.currentCalendar && props.currentCalendar.id === props.id
              ? "cursor-pointer font-bold"
              : "cursor-pointer"
          }
          onClick={props.onClickName}
        >
          {props.name}
        </span>
      </div>
      {isEditing && (
        <div className="w-full">
          {!props.isPrincipal && (
            <>
              <label className="text-md" htmlFor="semester">
                Nome
              </label>
              <input
                className="rounded-md px-4 py-2 w-full border mb-4"
                type="text"
                placeholder="Nome do calendário"
                onChange={(e) => setName(e.target.value)}
                value={name || props.name}
              />
            </>
          )}
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
            value={url}
          />
          <div className="flex justify-end gap-4">
            {!props.isPrincipal && (
              <button
                className="border border-orange-500 rounded px-4 py-2 text-orange-500"
                onClick={handleDeleteCalendar}
              >
                Excluir
              </button>
            )}
            {name === "" && url === "" ? (
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
      )}
    </div>
  );
}
