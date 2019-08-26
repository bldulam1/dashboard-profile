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
    w: "with",
    lte: "≤",
    lt: "<",
    gte: "≥",
    gt: ">"
  };

  return { value, display: relationDictionary[value] };
}

export function getRelationOptions(key) {
  const stringTypeKeys = ["fileName", "extension", "path"];
  const numericTypeKeys = [
    "size",
    "date.mapped",
    "date.modified",
    "date.birth"
  ];
  const fixedTypeKeys = ["root", "tags"];
  if (stringTypeKeys.includes(key)) {
    return ["e", "w"].map(item => RelationOption(item));
  } else if (numericTypeKeys.includes(key)) {
    return ["lte", "lt", "e", "gt", "gte"].map(item => RelationOption(item));
  } else if (fixedTypeKeys.includes(key)) {
    return ["e"].map(item => RelationOption(item));
  }
}

export function QueryItemObject(_key, value, relation) {
  const keyOptions = [
    KeyOption("fileName", "File Name"),
    KeyOption("extension", "Extension"),
    KeyOption("size", "Size"),
    KeyOption("path", "Path"),
    KeyOption("root", "Root"),
    KeyOption("date.modified", "Date Modified"),
    KeyOption("date.birth", "Date Created"),
    KeyOption("date.mapped", "Date Mapped")
  ];

  const relationOptions = getRelationOptions(_key);
  return {
    id: uuid(),
    type: "item",
    _key,
    keyOptions,
    value,
    valueOptions: [],
    relation: relationOptions[0].value,
    relationOptions
  };
}
