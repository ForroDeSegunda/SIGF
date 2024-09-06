const whiteList = {
  student: {
    pages: {
      classes: { get: true, "[id]": { attendance: { get: false } } },
      calendar: { get: true },
    },
    api: {
      get: true,
      enrollments: {
        post: true,
        delete: true,
      },
    },
  },
};
const flatWhiteList = flattenObject(whiteList);

function flattenObject(obj, parentKey = "", result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

function getReqParams(
  paramsString: string,
  requestMethod: string,
  userRole: string,
): [string[], string] {
  const paramsList = paramsString.split("/");

  if (paramsList[1] === "api")
    return [
      paramsList.slice(2),
      userRole + paramsList.join(".") + "." + requestMethod,
    ];

  return [
    paramsList.slice(1),
    userRole + "." + "pages" + paramsList.join(".") + "." + requestMethod,
  ];
}

function recursiveWhiteListCheck(
  key: string,
  requestMethod: string,
  flatObject: object,
) {
  const splittedKeys = key.split(".");

  if (flatObject[key] === true) {
    return true;
  } else if (
    splittedKeys.length > 1 &&
    splittedKeys[0] !== "" &&
    flatObject[key] === undefined
  ) {
    const newKey = key.split(".").slice(0, -2).join(".") + "." + requestMethod;
    return recursiveWhiteListCheck(newKey, requestMethod, flatObject);
  }

  return false;
}

function replaceUuids(paramsString: string) {
  const uuidRegex = /[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/g;
  return paramsString.replace(uuidRegex, "[id]");
}
