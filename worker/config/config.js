const os = require("os");

function Task(name, cpuCount, childProcesses) {
  return { name, cpuCount, childProcesses };
}

const IDW4Conversion = Task("IDW4 Data Conversion", 4, [
  "data_conversion",
  "DCImageConverter",
  "IDW4 Converter"
]);
const FileSplitting = Task("File Splitting", 4, ["File Splitting"]);
const SIMS = Task("SIMS", 1, ["SIMS"]);
const CVW2MAT = Task("CVW2MAT", 1, ["CVW2MAT"]);




module.exports = {
  IDW4Conversion,
  FileSplitting,
  SIMS,
  CVW2MAT
};
