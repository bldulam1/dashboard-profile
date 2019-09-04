const Task = require("../../schemas/task");

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
  const requestDate = new Date();
  const outputLocation = "V:/JP01/Datalake/Common_Write/CLARITY_OUPUT/";
  const {
    commandLineArgs,
    simsLocation,
    version,
    project,
    requestedBy,
    expiryDate
  } = props;

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
      operation: "SIMS",
      project,
      requestedBy,
      inputFile: fileName,
      inputLocation: path,
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
