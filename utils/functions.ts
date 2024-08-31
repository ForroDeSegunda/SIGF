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
