const Task = require("../../schemas/task");
const Path = require("path");
const mkdirp = require("mkdirp");

function createTimeStamp(date) {
  const _date = new Date(date);
  const year = _date.getFullYear();
  let month = _date.getMonth() + 1;
  let day = _date.getDate();
  let hour = _date.getHours();
  let min = _date.getMinutes();
  let sec = _date.getSeconds();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  hour = hour < 10 ? `0${hour}` : hour;
  min = min < 10 ? `0${min}` : min;
  sec = sec < 10 ? `0${sec}` : sec;

  return "" + year + month + day + "_" + hour + min + sec;
}

function createCVWOperationScript({
  cvwBIN,
  fullFile,
  commandLineArgs,
  outputLocation,
  configJSON
}) {
  return `Set-Location "${cvwBIN}"; ./CVW2Mat.exe "${fullFile}" -o "${outputLocation}" --overwrite ${commandLineArgs} -l ${configJSON};`;
}

function createDirectory(dir) {
  return new Promise((resolve, reject) => {
    mkdirp(outputLocation, err => {
      err ? reject(err) : resolve(dir);
    });
  });
}

async function createCVWOperationTasks(props, files) {
  const requestDate = new Date();
  const operationName = "CVW Conversion";
  const { project, requestedBy, priority, cli, expiryDate } = props;
  console.log(props)
  const cvwBIN = Path.resolve(
    "V:/JP01/DataLake/Common_Write/ClarityResources/CVW2MAT"
  );
  const outputLocation = Path.join(
    "V:/JP01/Datalake/Common_Write/CLARITY_OUPUT/",
    project,
    operationName,
    requestedBy,
    createTimeStamp(requestDate)
  ).replace(/ /g, "_");

  // await createDirectory(outputLocation);

  const promises = files.map(({ fileName, path, size }) => {
    const script = createCVWOperationScript({
      cvwBIN,
      fullFile: Path.join(path, fileName),
      commandLineArgs: cli,
      outputLocation,
      configJSON: Path.resolve("V:/JP01/DataLake/Common_Write/ClarityResources/Subaru77/CVW2MAT/config.json")
    });
    return new Task({
      priority,
      operation: "CVW Conversion",
      project,
      requestedBy,
      inputFile: fileName,
      inputLocation: path,
      outputLocation,
      size,
      script,
      expiryDate,
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
  createCVWOperationTasks,
  createCVWOperationScript
};
