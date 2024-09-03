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

export function csvToJson(str: string) {
  const lines = str.split("\n").filter((line) => line.trim() !== "");

  // Extract headers and remove quotes
  const headers = lines[0]
    .split(",")
    .map((header) => header.replace(/"/g, "").trim());

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
