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

export function UploadFile({ name, size }) {
  const splits = name.split(".");
  return {
    name,
    size,
    type: splits[splits.length - 1],
    progress: 0,
    comments: []
  };
}

export function sampleNamingConvention({ elements, separator }) {
  const fixedString = len => {
    return "X".repeat(len);
  };
  const randomMember = array => {
    return array[Math.floor(array.length * Math.random())];
  };

  return elements && elements.length
    ? elements
        .map(elem =>
          !elem.type
            ? fixedString(randomMember(elem.options))
            : randomMember(elem.options)
        )
        .join(separator)
    : "";
}

export function Status(display, name, value, disabled) {
  return { display, name, value, disabled };
}

export function getStatusValue(progress) {
  if (progress === 0) return 0;
  else if (progress < 1 && progress > 0) return 1;
  else if (progress === 1) return 2;
  return 3;
}