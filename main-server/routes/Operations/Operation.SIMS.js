const Task = require("../../schemas/task");
const Path = require("path");
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
function createSimsScript({
  version,
  simsLocation,
  commandLineArgs,
  fileName,
  path,
  outputLocation
}) {
  return `Set-Location ${simsLocation}; & ./${version}.exe -MeasDir ${path} -MeasFile ${fileName} -OutFolder ${outputLocation} ${commandLineArgs}`;
}

function createSimsTasks(props, files) {
  const operationName = "SIMS";
  const requestDate = new Date();
  const {
    commandLineArgs,
    simsLocation,
    version,
    project,
    requestedBy,
    expiryDate
  } = props;
  const outputLocation = Path.join(
    "V:/JP01/Datalake/Common_Write/CLARITY_OUPUT/",
    project,
    operationName,
    requestedBy,
    createTimeStamp(requestDate)
  ).replace(/ /g, "_");

  const promises = files.map(({ fileName, path, size }) => {
    const script = createSimsScript({
      version,
      simsLocation,
      commandLineArgs,
      fileName,
      path,
      outputLocation
    });
    return new Task({
      operation: operationName,
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
  createSimsTasks,
  createSimsScript
};
