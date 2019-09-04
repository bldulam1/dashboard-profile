const { Scene } = require("../../schemas/scene");
const Task = require("../../schemas/task");
const Tag = require("../../schemas/tag");
const Path = require("path");

function fetchFileInfo(fileIDs) {
  // const options = [
  //   "File Name",
  //   "Full Filename",
  //   "Path",
  //   "extension",
  //   "size",
  //   "tags",
  //   "operations"
  // ];

  return Scene.find(
    { _id: { $in: fileIDs } },
    { fileName: 1, path: 1, size: 1, extension: 1 }
  );
}

async function alignFileInfo(files, options) {
  const FILENAME = "File Name",
    FULLFN = "Full Filename",
    PATH = "Path",
    EXT = "extension",
    SIZE = "size",
    TAGS = "tags",
    OPS = "operations";

  let tasks = [],
    tags = [];
  if (options.includes(OPS)) {
    tasks = await Promise.all(
      files.map(({ fileName }) =>
        Task.find(
          { inputFile: fileName },
          { _id: 0, operation: 1, "status.text": 1, requestDate: 1 }
        )
      )
    );
  }

  if (options.includes(TAGS)) {
    tags = await Promise.all(
      files.map(({ fileName }) =>
        Tag.find({ fileName }, { _id: 0, key: 1, value: 1 })
      )
    );
  }
  return files.map(({ _id, fileName, path, size, extension }, index) => {
    let fileInfo = {};
    if (options.includes(FILENAME)) fileInfo[FILENAME] = fileName;
    if (options.includes(PATH)) fileInfo[PATH] = path;
    if (options.includes(FULLFN)) fileInfo[FULLFN] = Path.join(path, fileName);
    if (options.includes(EXT)) fileInfo[EXT] = extension;
    if (options.includes(SIZE)) fileInfo[SIZE] = size;
    if (options.includes(OPS)) fileInfo[OPS] = tasks[index];
    if (options.includes(TAGS)) fileInfo[TAGS] = tags[index];

    return fileInfo;
  });
}

module.exports = {
  fetchFileInfo,
  alignFileInfo
};
