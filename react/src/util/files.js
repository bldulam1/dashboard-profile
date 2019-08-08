export function isFollowingNamingConvention(file, namingConvention) {
  const { elements, extensions, separator } = namingConvention;
  const { type, name } = file;

  if (!extensions.includes(type)) {
    return { progress: -1, issue: { title: "Invalid File Type" } };
  }

  const splits = name
    .slice(0, name.length - type.length - 1)
    .split(separator);

  if (elements.length !== splits.length) {
    return { progress: -1, issue: { title: "Non matching fields" } };
  }

  let isValid;
  let issue = { title: "" };
  for (let elemIndex = 0; elemIndex < elements.length; elemIndex++) {
    const { key, type, options } = elements[elemIndex];
    const elem = splits[elemIndex];
    // type 0 is fixed length
    // type 1 is string options
    isValid = type
      ? options.includes(elem)
      : options.map(op => 1 * op).includes(elem.length);

    if (!isValid) {
      issue.title = `Invalid ${key}`;
      break;
    }
  }
  if (!isValid) {
    return { progress: -1, ...issue };
  }

  return { progress: 0 };
}