const fs = require("fs");
const Path = require("path");
const csv = require("csv-parser");
const location =
  "V:/JP01/DataLake/Common_Write/SBR77_DC_Share/DClabelledIntersectionFiles/Results";

function getKeyValue(data, keyword) {
  let keyName = Object.keys(data).filter(key =>
    new RegExp(keyword, "gi").test(key)
  );

  if (keyName.length) {
    return data[keyName[0]];
  } else {
    return null;
  }
}

async function getIntersectionsData(fullFileName) {
  const summary = {
    frames: [],
    fileName: null,
    ghost: 0,
    notGhost: 0,
    unknown: 0,
    car: 0,
    pedestrian: 0,
    bike_bicycle: 0,
    bus_truck: 0,
    weather: "",
    drop: 0,
    noDrop: 0
  };

  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream(fullFileName)
        .pipe(csv())
        .on("data", data => {
          const ghostValue = getKeyValue(data, "ghost");
          const dropValue = getKeyValue(data, "drop");
          const vehicleValue = getKeyValue(data, "vehicle");

          if (/unknown/gi.test(ghostValue)) {
            summary.unknown++;
          } else if (/not ghost/gi.test(ghostValue)) {
            summary.notGhost++;
          } else if (/ghost/gi.test(ghostValue)) {
            summary.ghost++;
          }

          if (/no drop/gi.test(dropValue)) {
            summary.noDrop++;
          } else {
            summary.noDrop++;
          }

          if (/car/gi.test(vehicleValue)) {
            summary.car++;
          } else if (
            /truck/gi.test(vehicleValue) ||
            /bus/gi.test(vehicleValue)
          ) {
            summary.bus_truck++;
          } else if (/pedestrian/gi.test(vehicleValue)) {
            summary.pedestrian++;
          } else if (
            /bike/gi.test(vehicleValue) ||
            /bicycle/gi.test(vehicleValue)
          ) {
            summary.bike_bicycle++;
          }

          if (!summary.weather.length) {
            summary.weather = getKeyValue(data, "weather");
          }
        })
        .on("end", () => {
          const fileName = Path.parse(fullFileName).base;

          summary.fileName = fileName.slice(0, fileName.indexOf("_split_B"));
          const bIndex = fileName.indexOf("split_B") + "split_B".length;
          const eIndex = fileName.indexOf("_E", bIndex) + "_E".length;
          const sIndex = fileName.indexOf("_S", eIndex);
          const bFrame = fileName.slice(bIndex, eIndex - 2) * 1;
          const eFrame = fileName.slice(eIndex, sIndex) * 1;
          summary.frames = [bFrame, eFrame];

          resolve(summary);
        });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { getIntersectionsData };
