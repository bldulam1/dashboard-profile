const csv = require("csv-parser");
const fs = require("fs");
const Path = require("path");
const fileList = require("./fileList");

const logFile = "./log.csv";
const labellingLocation =
  "V:/JP01/DataLake/Common_Write/CLARITY_OUPUT/Subaru_77GHz/CVW_Conversion/Brendon_Dulam/Labelling";
fs.unlinkSync(logFile);

var logger = fs.createWriteStream(logFile, {
  flags: "a"
});

const headers = [
  "FileName",
  "Start",
  "End",
  "OSMLatitude",
  "OSMLongitude",
  "KMLLatitude",
  "KMLLongitude",
  "Drop",
  "Tracker ID",
  "Master/Slave",
  "Start Cycle Number",
  "Cycle Count",
  "Ghost Judgement",
  "Confidence",
  "Manual Correction",
  "Drop",
  "Type of Vehicle",
  "Weather"
];
logger.write(headers.join(",") + ",\n");
function parseIntersection(file, start, end) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", data => {
        const retVal = {
          start: data.CycleStart * 1,
          end: data.CycleEnd * 1,
          osmLat: data["OSM Latitude"] * 1,
          osmLon: data["OSM longitude"] * 1,
          kmlLat: data["KML Latitude"] * 1,
          kmlLon: data["KML Longitude"] * 1
        };
        if (retVal.start === start) {
          resolve(retVal);
        }
      })
      .on("end", () => {
        resolve(0);
      });
  });
}

function getBaseFile(fullFile) {
  let baseFile = Path.parse(fullFile).name;
  const splitIndex = baseFile.indexOf("_split_F1");
  const bIndex = baseFile.indexOf("_B");
  const eIndex = baseFile.indexOf("_E", bIndex);
  const sIndex = baseFile.indexOf("_S", eIndex);

  return {
    baseFile: baseFile.slice(0, splitIndex),
    start: baseFile.split("_")[11].replace("B", "") * 1,
    end: baseFile.split("_")[12].replace("E", "") * 1
  };
}

function getIntersectionFile(baseFile) {
  const matchedFiles = fileList.filter(f => f.includes(baseFile));
  return matchedFiles.length ? matchedFiles[0] : null;
}

async function parseLabelling(file) {
  let { baseFile, start, end } = getBaseFile(file);

  const { osmLat, osmLon, kmlLat, kmlLon } = await parseIntersection(
    getIntersectionFile(baseFile),
    start,
    end
  );

  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", data => {
        const newData = [];
        headers.forEach(header => {
          let pushValue;
          let filteredKey = Object.keys(data).filter(kn =>
            new RegExp(header, "gi").test(kn)
          );

          filteredKey = filteredKey.length ? filteredKey[0] : null;

          if (filteredKey) {
            pushValue = data[filteredKey];
            const parsedIntVal = pushValue * 1;
            if (parsedIntVal) {
              pushValue = parsedIntVal;
            } else if (/manual/gi.test(filteredKey)) {
              pushValue = /true/gi.test(pushValue);
            }
          } else if (/filename/gi.test(header)) {
            pushValue = baseFile;
          } else if (/start/gi.test(header)) {
            pushValue = start;
          } else if (/end/gi.test(header)) {
            pushValue = start;
          } else if (/osmlat/gi.test(header)) {
            pushValue = osmLat;
          } else if (/osmlon/gi.test(header)) {
            pushValue = osmLon;
          } else if (/kmllat/gi.test(header)) {
            pushValue = kmlLat;
          } else if (/kmllon/gi.test(header)) {
            pushValue = kmlLon;
          }

          newData.push(pushValue);
        });
        // console.log(newData.join(","));
        logger.write(newData.join(",") + ",\n");
      })
      .on("end", () => {
        resolve("Finished");
      });
  });
}

async function main() {
  const labellingFiles = fs
    .readdirSync(labellingLocation)
    .map(file => Path.resolve(labellingLocation, file));

  const total = labellingFiles.length;

  for (let index = 0; index < total; index++) {
    const file = labellingFiles[index];
    try {
      // console.log(`Finished ${index}/${total}`);
      await parseLabelling(file);
    } catch (error) {
      console.error(`Failed ${index}/${total} ${file}`);
    }
  }
}

main();
