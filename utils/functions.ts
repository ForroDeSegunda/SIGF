export function getWeekDays(
  startDate: Date,
  endDate: Date,
  weekDays: string[],
) {
  const currentDate = new Date(startDate);

  const classDates: Date[] = [];
  while (currentDate <= endDate) {
    if (
      weekDays.includes(
        currentDate
          .toLocaleDateString("en-US", { weekday: "short" })
          .toLowerCase(),
      )
    ) {
      classDates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return classDates;
}

export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const seconds = diffInSeconds;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} ano${years > 1 ? "s" : ""} atrás`;
  if (months > 0) return `${months} ${months > 1 ? "meses" : "mês"} atrás`;
  if (weeks > 0) return `${weeks} semana${weeks > 1 ? "s" : ""} atrás`;
  if (days > 0) return `${days} dia${days > 1 ? "s" : ""} atrás`;
  if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? "s" : ""} atrás`;
  return "agora";
}

export function csvToJson(str: string) {
  const lines = str.split("\n").filter((line) => line.trim() !== "");

  // Extract headers and remove quotes
  const headers = lines[0]
    .split(",")
    .map((header) => header.replace(/"/g, "").toLowerCase().trim());

  // Function to split lines correctly
  const splitCSVLine = (line: string) => {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    return line
      .split(regex)
      .map((field) => field.replace(/(^"|"$)/g, "").trim());
  };

  // Convert each line to an object
  const dataObjects = lines.slice(1).map((line) => {
    const data = splitCSVLine(line);
    return headers.reduce(
      (obj, header, index) => {
        obj[header] = data[index];
        return obj;
      },
      {} as { [key: string]: string },
    );
  });

  return dataObjects;
}

export function replaceKeysInObjects(
  array: Object[],
  keyMap: { [key: string]: string },
) {
  return array.map((obj) => {
    const newObj = {};
    for (const [oldKey, newKey] of Object.entries(keyMap)) {
      if (obj.hasOwnProperty(oldKey)) {
        newObj[newKey] = obj[oldKey];
      }
    }
    // Add any keys that were not in the keyMap
    for (const key of Object.keys(obj)) {
      if (!keyMap[key]) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  });
}

export function replaceSpecialChars(str: string): string {
  const specialCharsMap: { [key: string]: string } = {
    a: "áàãâä",
    A: "ÁÀÃÂÄ",
    e: "éèêë",
    E: "ÉÈÊË",
    i: "íìîï",
    I: "ÍÌÎÏ",
    o: "óòõôö",
    O: "ÓÒÕÔÖ",
    u: "úùûü",
    U: "ÚÙÛÜ",
    c: "ç",
    C: "Ç",
  };

  return str.replace(
    /[áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇ]/g,
    (match) => {
      for (const [simpleChar, specialChars] of Object.entries(
        specialCharsMap,
      )) {
        if (specialChars.includes(match)) {
          return simpleChar;
        }
      }
      return match; // This line should never be reached, as all special characters are mapped
    },
  );
}
