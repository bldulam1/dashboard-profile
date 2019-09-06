import uuid from "uuid/v4";

export function QueryGroupObject(operator, items) {
  return {
    id: uuid(),
    type: "group",
    operator,
    items
  };
}

function KeyOption(dbName, dispName) {
  return { dbName, dispName };
}

function RelationOption(value) {
  const relationDictionary = {
    e: "=",
    ne: "≠",
    w: "with",
    wo: "without",
    lte: "≤",
    lt: "<",
    gte: "≥",
    gt: ">"
  };

  return { value, display: relationDictionary[value] };
}

export function getRelationOptions(key) {
  const stringTypeKeys = ["fileName", "path"];
  const numericTypeKeys = [
    "size",
    "date.mapped",
    "date.modified",
    "date.birth"
  ];
  const fixedTypeKeys = ["root", "extension", "tags"];
  if (stringTypeKeys.includes(key)) {
    return ["e", "ne", "w", "wo"].map(item => RelationOption(item));
  } else if (numericTypeKeys.includes(key)) {
    return ["lte", "lt", "e", "ne", "gt", "gte"].map(item =>
      RelationOption(item)
    );
  } else if (fixedTypeKeys.includes(key)) {
    return ["e", "ne"].map(item => RelationOption(item));
  }
}

export const keyOptions = [
  KeyOption("fileName", "File Name"),
  KeyOption("extension", "Extension"),
  KeyOption("size", "Size"),
  KeyOption("path", "Path"),
  KeyOption("root", "Root"),
  KeyOption("date.modified", "Date Modified"),
  KeyOption("date.birth", "Date Created"),
  KeyOption("date.mapped", "Date Mapped")
];

export const keyOptionsWithValues = ["root", "extension"];

export function QueryItemObject(_key, value, relation) {
  const relationOptions = getRelationOptions(_key);
  return {
    id: uuid(),
    type: "item",
    _key,
    value,
    valueOptions: [],
    relation: relationOptions[0].value,
    relationOptions
  };
}

export function getSubHeadingText(invalidFiles, selected) {
  const invalidLen = invalidFiles.length;
  const selectedLen = selected.length;

  if (!selectedLen) {
    return "";
  } else if (invalidLen && selectedLen) {
    return `${invalidLen} Invalid file${invalidLen > 1 ? "s" : ""}`;
  }
}

export const parseQueryGroup = queryObject => {
  const items = queryObject.items.map(item => {
    if (item.type === "item") {
      let val = {};
      if (item.relation === "e") {
        val = { $eq: item.value };
      } else if (item.relation === "ne") {
        val = { $ne: item.value };
      } else if (item.relation === "lt") {
        val = { $lt: item.value };
      } else if (item.relation === "lte") {
        val = { $lte: item.value };
      } else if (item.relation === "gt") {
        val = { $gt: item.value };
      } else if (item.relation === "gte") {
        val = { $gte: item.value };
      } else if (item.relation === "w") {
        val = { $regex: item.value, $options: "i" };
      } else if (item.relation === "wo") {
        val = { "$regex": `^((?!${item.value}).)*$`, "$options": "im" };
      }
      return { [item._key]: val };
    } else {
      return parseQueryGroup(item);
    }
  });
  return queryObject.operator === "and" ? { $and: items } : { $or: items };
};
