const Task = require("../../schemas/task");
const Path = require("path");

function createScript({
  memoPoolPath,
  ibeoPoolPath,
  sensor,
  outputFolder,
  logFilePath,
  fileName,
  idw4Location,
  version
}) {
  return `Set-Location ${idw4Location}; & ./${version}.exe ${fileName} ${memoPoolPath} ${ibeoPoolPath} ${sensor} ${outputFolder} ${logFilePath}`;
}

function createIDW4ConvTasks(props, files) {
  const requestDate = new Date();
  const {
    memoPoolPath,
    ibeoPoolPath,
    sensor,
    outputFolder,
    logFilePath,
    requestedBy,
    project
  } = props;

  const promises = files.map(({ fileName, path, size }) => {
    const idw4Location =
      "V:/JP01/DataLake/Common_Write/ClarityResources/DataConversion";
    const script = createScript({
      sensor,
      memoPoolPath: Path.resolve(memoPoolPath),
      ibeoPoolPath: Path.resolve(ibeoPoolPath),
      outputFolder: Path.resolve(outputFolder),
      logFilePath: Path.resolve(logFilePath),
      fileName: Path.join(path, fileName),
      idw4Location: Path.resolve(idw4Location),
      version: "data_conversion"
    });
    return new Task({
      operation: "IDW4 Conversion",
      project,
      requestedBy,
      inputFile: fileName,
      inputLocation: path,
      size,
      script,
      requestDate,
      status: {
        text: "Pending",
        value: 0
      }
    }).save();
  });

  return Promise.all(promises);
}

module.exports = {
  createIDW4ConvTasks
};
